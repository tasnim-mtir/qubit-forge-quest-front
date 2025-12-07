import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceDataPoint {
  time: string;
  price: number;
}

interface CCPriceChartProps {
  height?: number;
}

// Mock price data for different timeframes
const getPriceData = (timeframe: "24h" | "7d" | "30d" | "all"): PriceDataPoint[] => {
  const now = Date.now();
  const dataPoints: Record<string, number> = {
    "24h": 24,
    "7d": 7 * 24,
    "30d": 30 * 24,
    all: 365 * 24,
  };

  const hours = dataPoints[timeframe];
  const data: PriceDataPoint[] = [];

  // Generate realistic price data with trends and volatility
  let price = 0.85;
  const trend =
    timeframe === "24h"
      ? 0.002
      : timeframe === "7d"
        ? 0.001
        : timeframe === "30d"
          ? 0.0005
          : 0.0001;

  for (let i = 0; i < hours; i++) {
    // Add trend and random volatility
    price += trend + (Math.random() - 0.5) * 0.05;
    price = Math.max(0.6, Math.min(1.5, price)); // Keep price between bounds

    const date = new Date(now - (hours - i) * 60 * 60 * 1000);
    const timeLabel =
      timeframe === "24h"
        ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        : timeframe === "7d"
          ? date.toLocaleDateString("en-US", { weekday: "short" })
          : timeframe === "30d"
            ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
            : date.toLocaleDateString("en-US", { year: "2-digit", month: "short" });

    data.push({
      time: timeLabel,
      price: Math.round(price * 100) / 100,
    });
  }

  return data;
};

export function CCPriceChart({ height = 300 }: CCPriceChartProps) {
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "all">("7d");
  const data = getPriceData(timeframe);

  // Calculate statistics
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = data[data.length - 1].price;
  const previousPrice = data[0].price;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);
  const isPositive = priceChange >= 0;

  // Normalize data for SVG rendering
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = 100;
  const chartHeight = height - chartPadding.top - chartPadding.bottom;
  const price_range = maxPrice - minPrice || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = ((maxPrice - d.price) / price_range) * chartHeight;
    return { x, y, price: d.price };
  });

  // Create SVG path
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${chartPadding.left + p.x} ${chartPadding.top + p.y}`)
    .join(" ");

  const fillPathD =
    pathD +
    ` L ${chartPadding.left + chartWidth} ${chartPadding.top + chartHeight} L ${chartPadding.left} ${chartPadding.top + chartHeight} Z`;

  // Sample data for display (show every nth point to avoid crowding)
  const displayPoints = points.filter(
    (_, i) => i % Math.ceil(points.length / 8) === 0 || i === points.length - 1
  );

  return (
    <div className="bg-gradient-to-b from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm">CC Current Price</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-blue-300">${currentPrice.toFixed(3)}</span>
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  isPositive
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">{priceChangePercent}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Change: ${priceChange.toFixed(3)} ({timeframe})
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            {(["24h", "7d", "30d", "all"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  timeframe === tf
                    ? "bg-blue-600/40 border border-blue-500/50 text-blue-300"
                    : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-400 hover:text-slate-200"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${chartPadding.left + chartWidth + chartPadding.right} ${height}`}
            className="text-slate-600"
          >
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={`grid-${i}`}
                x1={chartPadding.left}
                y1={chartPadding.top + ratio * chartHeight}
                x2={chartPadding.left + chartWidth}
                y2={chartPadding.top + ratio * chartHeight}
                stroke="currentColor"
                strokeDasharray="4"
                opacity="0.2"
              />
            ))}

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const price = maxPrice - ratio * price_range;
              return (
                <text
                  key={`y-label-${i}`}
                  x={chartPadding.left - 10}
                  y={chartPadding.top + ratio * chartHeight + 4}
                  textAnchor="end"
                  className="text-xs fill-slate-500"
                >
                  ${price.toFixed(2)}
                </text>
              );
            })}

            {/* X-axis labels */}
            {displayPoints.map((p, i) => {
              const dataIndex = Math.round((i / (displayPoints.length - 1)) * (data.length - 1));
              return (
                <text
                  key={`x-label-${i}`}
                  x={chartPadding.left + p.x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-xs fill-slate-500"
                >
                  {data[dataIndex].time}
                </text>
              );
            })}

            {/* Fill area under curve */}
            <defs>
              <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path d={fillPathD} fill="url(#priceGradient)" />

            {/* Line chart */}
            <path
              d={pathD}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {displayPoints.map((p, i) => (
              <circle
                key={`point-${i}`}
                cx={chartPadding.left + p.x}
                cy={chartPadding.top + p.y}
                r="3"
                fill="#3b82f6"
                stroke="#1e293b"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* Tooltip on hover (static display) */}
          <div className="absolute top-6 right-6 bg-slate-900/80 border border-blue-500/20 rounded-lg p-3 backdrop-blur-sm pointer-events-none">
            <p className="text-xs text-slate-500">Latest</p>
            <p className="text-sm font-semibold text-blue-300">${currentPrice.toFixed(3)}</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-800/30 rounded p-3">
            <p className="text-xs text-slate-500">High</p>
            <p className="text-sm font-semibold text-emerald-300">
              ${maxPrice.toFixed(3)}
            </p>
          </div>
          <div className="bg-slate-800/30 rounded p-3">
            <p className="text-xs text-slate-500">Low</p>
            <p className="text-sm font-semibold text-red-300">${minPrice.toFixed(3)}</p>
          </div>
          <div className="bg-slate-800/30 rounded p-3">
            <p className="text-xs text-slate-500">Average</p>
            <p className="text-sm font-semibold text-slate-300">
              ${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(3)}
            </p>
          </div>
          <div className="bg-slate-800/30 rounded p-3">
            <p className="text-xs text-slate-500">Volatility</p>
            <p className="text-sm font-semibold text-slate-300">
              {(
                (maxPrice - minPrice) /
                (prices.reduce((a, b) => a + b, 0) / prices.length) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
