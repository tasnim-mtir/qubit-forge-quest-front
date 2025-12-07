/**
 * Data Formatting Utilities
 * Provides consistent formatting for display values across the application
 */

/**
 * Format currency/compute credits
 * @param amount - The amount to format
 * @param currency - Currency code (e.g., "CC", "QX")
 * @returns Formatted string like "1,500.50 CC"
 */
export function formatCurrency(amount: number, currency: string = "CC"): string {
  if (!amount && amount !== 0) return "—";
  return `${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

/**
 * Format large numbers with thousand separators
 * @param num - The number to format
 * @returns Formatted string like "1,234,567"
 */
export function formatNumber(num: number): string {
  if (!num && num !== 0) return "—";
  return num.toLocaleString("en-US");
}

/**
 * Format percentage
 * @param value - The value between 0 and 1
 * @returns Formatted string like "92.5%"
 */
export function formatPercentage(value: number): string {
  if (!value && value !== 0) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format date to readable string
 * @param date - The date to format
 * @returns Formatted string like "Dec 6, 2024 10:30 AM"
 */
export function formatDate(date: Date | string): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

/**
 * Format duration in seconds to human-readable format
 * @param seconds - Duration in seconds
 * @returns Formatted string like "2 hours, 30 minutes"
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Format time relative to now
 * @param date - The date to format
 * @returns Formatted string like "2 hours ago"
 */
export function formatRelativeTime(date: Date | string): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return formatDate(d);
  } catch {
    return "—";
  }
}

/**
 * Format task status with color
 * @param status - The status string
 * @returns Object with display text and color class
 */
export function formatStatus(
  status: string
): {
  display: string;
  color: string;
} {
  const statusMap: Record<
    string,
    { display: string; color: string }
  > = {
    queued: { display: "Queued", color: "yellow" },
    running: { display: "Running", color: "blue" },
    completed: { display: "Completed", color: "green" },
    failed: { display: "Failed", color: "red" },
    paused: { display: "Paused", color: "slate" },
    pending: { display: "Pending", color: "amber" },
  };

  return statusMap[status?.toLowerCase()] || {
    display: status || "Unknown",
    color: "slate",
  };
}

/**
 * Format task type for display
 * @param type - The task type
 * @returns Formatted display string
 */
export function formatTaskType(type: string): string {
  const typeMap: Record<string, string> = {
    DataAnalysis: "Data Analysis",
    Training: "ML Training",
    Processing: "Data Processing",
    Simulation: "Simulation",
    Other: "Other Task",
  };

  return typeMap[type] || type || "Unknown";
}

/**
 * Format priority level
 * @param priority - The priority level
 * @returns Formatted display string with color
 */
export function formatPriority(
  priority: string
): {
  display: string;
  color: string;
} {
  const priorityMap: Record<
    string,
    { display: string; color: string }
  > = {
    Low: { display: "Low", color: "green" },
    Medium: { display: "Medium", color: "yellow" },
    High: { display: "High", color: "red" },
    Critical: { display: "Critical", color: "red" },
  };

  return (
    priorityMap[priority] || {
      display: priority || "Normal",
      color: "slate",
    }
  );
}

/**
 * Format health status
 * @param status - Health status string
 * @returns Formatted display with color
 */
export function formatHealthStatus(
  status: string
): {
  display: string;
  color: string;
} {
  const statusMap: Record<
    string,
    { display: string; color: string }
  > = {
    healthy: { display: "Healthy", color: "green" },
    warning: { display: "Warning", color: "yellow" },
    critical: { display: "Critical", color: "red" },
    offline: { display: "Offline", color: "slate" },
  };

  return statusMap[status?.toLowerCase()] || {
    display: status || "Unknown",
    color: "slate",
  };
}

/**
 * Format success rate as percentage
 * @param rate - Success rate between 0 and 1
 * @returns Formatted string with rating
 */
export function formatSuccessRate(rate: number): string {
  if (!rate && rate !== 0) return "—";
  const percentage = rate * 100;
  if (percentage >= 95) return `${percentage.toFixed(1)}% ⭐`;
  if (percentage >= 90) return `${percentage.toFixed(1)}% ✓`;
  if (percentage >= 75) return `${percentage.toFixed(1)}% ◐`;
  return `${percentage.toFixed(1)}% ◑`;
}

/**
 * Format large numbers with compact notation (1.5M, 1.2B)
 * @param num - The number to format
 * @returns Formatted compact string
 */
export function formatCompact(num: number): string {
  if (!num && num !== 0) return "—";

  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;

  return num.toString();
}

/**
 * Truncate text with ellipsis
 * @param text - The text to truncate
 * @param length - Maximum length
 * @returns Truncated string
 */
export function truncateText(text: string, length: number = 50): string {
  if (!text) return "—";
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}

/**
 * Format email address safely
 * @param email - Email address
 * @param length - Max length before truncating
 * @returns Formatted email
 */
export function formatEmail(email: string, length: number = 20): string {
  if (!email) return "—";
  if (email.length <= length) return email;

  const [localPart, domain] = email.split("@");
  const truncatedLocal = localPart.substring(0, length - domain.length - 3);
  return `${truncatedLocal}...@${domain}`;
}

/**
 * Format hash/ID for display
 * @param hash - The hash or ID
 * @param length - Number of characters to show (default 8)
 * @returns Shortened hash like "6507a1...j0"
 */
export function formatHash(hash: string, length: number = 8): string {
  if (!hash) return "—";
  if (hash.length <= length) return hash;

  const start = hash.substring(0, Math.ceil(length / 2));
  const end = hash.substring(hash.length - Math.floor(length / 2));
  return `${start}...${end}`;
}

/**
 * Format large numbers with readable formatting
 * @param num - The number to format
 * @returns Formatted string
 */
export function formatLargeNumber(num: number): string {
  if (!num && num !== 0) return "—";
  return Math.abs(num) > 999 ? formatCompact(num) : formatNumber(num);
}

/**
 * Convert seconds to HH:MM:SS format
 * @param seconds - Seconds to convert
 * @returns Formatted time string like "01:02:03"
 */
export function secondsToHMS(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [hours, minutes, secs]
    .map((val) => String(val).padStart(2, "0"))
    .join(":");
}

/**
 * Format ROI (Return on Investment)
 * @param roi - ROI as decimal or percentage
 * @returns Formatted ROI string
 */
export function formatROI(roi: number): string {
  if (!roi && roi !== 0) return "—";

  const isPercentage = roi <= 100;
  const value = isPercentage ? roi : roi * 100;

  if (value > 0) return `+${value.toFixed(2)}% 📈`;
  if (value < 0) return `${value.toFixed(2)}% 📉`;
  return `${value.toFixed(2)}% ➡️`;
}
