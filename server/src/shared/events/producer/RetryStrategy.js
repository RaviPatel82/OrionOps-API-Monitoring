const RETRYABLE_PATTERNS = [
    "channel closed",
    "connection closed",
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "buffer full",
    "heartbeat timeout",
    "not available",
    "server connection closed",
];

/**
 * Determines if an error is retryable based on its message or code.
 * @param {*} err
 * @returns {boolean}
 */
export function isRetryable(err) {
    if (!err) {
        return false;
    }
    const msg = (err.message || "").toLowerCase();
    const code = (err.code || "").toUpperCase();

    if (code === "ENOTFOUND") return false;

    return RETRYABLE_PATTERNS.some(
        (p) => msg.includes(p.toLowerCase()) || code.includes(p.toUpperCase()),
    );
}

export class RetryStrategy {
    constructor(opts = {}) {
        this.maxRetries = opts.maxRetries ?? 3;
        this.baseDelayMs = opts.baseDelayMs ?? 200;
        this.maxDelayMs = opts.maxDelayMs ?? 5000;
        this.jitterFactor = opts.jitterFactor ?? 0.3;
    }

    /**
     * Determines if a retry should be attempted based on the current attempt number.
     * @param {number} attempt
     * @returns {boolean}
     */
    shouldRetry(attempt) {
        return attempt < this.maxRetries;
    }

    /**
     * Calculates the delay before the next retry attempt.
     * @param {number} attempt
     * @returns {number}
     */
    delay(attempt) {
        const exponential = this.baseDelayMs * Math.pow(2, attempt);
        const capped = Math.min(exponential, this.maxDelayMs);

        const jitterRange = capped * this.jitterFactor;
        const jitter = (Math.random() - 0.5) * 2 * jitterRange;

        return Math.max(0, Math.round(capped + jitter));
    }

    /**
     * Waits for the calculated delay before the next retry attempt.
     * @param {number} attempt - The current attempt count.
     * @returns {Promise<void>} - Resolves after the delay for the next retry attempt.
     */
    wait(attempt) {
        const ms = this.delay(attempt);
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
