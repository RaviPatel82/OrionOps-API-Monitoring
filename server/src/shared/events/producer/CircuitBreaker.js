export const CircuitState = Object.freeze({
    CLOSED: "CLOSED",
    OPEN: "OPEN",
    HALF_OPEN: "HALF_OPEN",
});

export class CircuitBreaker {
    constructor(opts = {}) {
        this.failureThreshold = opts.failureThreshold ?? 5;
        this.cooldownMs = opts.cooldownMs ?? 30_000;
        this.halfOpenMaxAttempts = opts.halfOpenMaxAttempts ?? 3;
        this.logger = opts.logger ?? console;

        this._state = CircuitState.CLOSED;
        this._failures = 0;
        this._lastFailureTime = 0;
        this._halfOpenAttempts = 0;
        this._halfOpenSuccesses = 0;
    }

    // Helper method to check if the circuit is currently open

    /**
     * Checks if the cooldown period has elapsed.
     * @returns {boolean}
     */
    _cooldownElapsed() {
        return Date.now() - this._lastFailureTime >= this.cooldownMs;
    }

    /**
     * Transitions the circuit breaker to a new state and resets relevant counters.
     * @param {CircuitState} newState - The new state to transition to.
     * @private
     */
    _transitionTo(newState) {
        const oldState = this._state;
        this._state = newState;
        if (newState === CircuitState.HALF_OPEN) {
            this._halfOpenAttempts = 0;
            this._halfOpenSuccesses = 0;
            this.logger.info(`[CircuitBreaker] ${oldState} ===> HALF_OPEN`);
        }
    }

    /**
     * Transitions the circuit breaker to the OPEN state and records the failure time.
     * @private
     */
    _openCircuit() {
        this._lastFailureTime = Date.now();
        this._transitionTo(CircuitState.OPEN);
        this.logger.error("[CircuitBreaker] OPEN", {
            failures: this._failures,
            cooldownMs: this.cooldownMs,
        });
    }

    /**
     * Resets the circuit breaker to the CLOSED state and clears all counters.
     * @private
     */
    _reset() {
        this._state = CircuitState.CLOSED;
        this._failures = 0;
        this._lastFailureTime = 0;
        this._halfOpenAttempts = 0;
        this._halfOpenSuccesses = 0;
    }

    /**
     * Returns the current state of the circuit breaker. If the circuit is OPEN and the cooldown period has elapsed, it transitions to HALF_OPEN before returning the state.
     * @returns {CircuitState}
     */
    get state() {
        if (this._state === CircuitState.OPEN && this._cooldownElapsed()) {
            this._transitionTo(CircuitState.HALF_OPEN);
        }
        return this._state;
    }

    /**
     * Determines if a request is allowed based on the current state of the circuit breaker.
     * @returns {boolean} True if the request is allowed, false otherwise.
     */
    allowRequest() {
        const currentState = this.state;

        // Log the current state and relevant counters for debugging purposes
        this.logger.debug("[CircuitBreaker] allowRequest check", {
            state: currentState,
            halfOpenAttempts: this._halfOpenAttempts,
            halfOpenMaxAttempts: this.halfOpenMaxAttempts,
            halfOpenSuccesses: this._halfOpenSuccesses,
            failures: this._failures,
        });

        if (currentState === CircuitState.CLOSED) return true;
        if (currentState === CircuitState.HALF_OPEN) {
            if (this._halfOpenAttempts < this.halfOpenMaxAttempts) {
                this._halfOpenAttempts++;
                this.logger.info(
                    `[CircuitBreaker] allowing HALF_OPEN attempt ${this._halfOpenAttempts}/${this.halfOpenMaxAttempts}`,
                );
                return true;
            }
            this.logger.warn(
                `[CircuitBreaker] HALF_OPEN attempts exhausted (${this._halfOpenAttempts}/${this.halfOpenMaxAttempts})`,
            );
            return false;
        }
        this.logger.info(
            `[CircuitBreaker] rejecting request, state: ${currentState}`,
        );
        return false;
    }

    /**
     * Records a successful request.
     * If the circuit breaker is in the HALF_OPEN state, it counts the success and transitions to CLOSED if the required number of successful attempts is reached. If the circuit breaker is in the CLOSED state and there were previous failures, it resets the failure count.
     * @returns {void}
     */
    onSuccess() {
        //Log the success event and current state for debugging purposes
        this.logger.info("[CircuitBreaker] success recorded", {
            state: this._state,
            halfOpenSuccesses: this._halfOpenSuccesses,
            halfOpenMaxAttempts: this.halfOpenMaxAttempts,
            failures: this._failures,
        });

        // If we're in HALF_OPEN, count successes and potentially transition back to CLOSED
        if (this._state === CircuitState.HALF_OPEN) {
            this._halfOpenSuccesses++;
            this.logger.info(
                `[CircuitBreaker] HALF_OPEN success ${this._halfOpenSuccesses}/${this.halfOpenMaxAttempts}`,
            );
            if (this._halfOpenSuccesses >= this.halfOpenMaxAttempts) {
                this._reset();
                this.logger.info(
                    "[CircuitBreaker] reset to CLOSED after successful half-open probes",
                );
            }
            return;
        }

        // If we're in CLOSED and there were previous failures, reset the failure count
        if (this._failures > 0) {
            this._failures = 0;
            this.logger.info(
                "[CircuitBreaker] failure counter reset after success",
            );
        }
    }

    /**
     * Records a failed request. If the circuit breaker is in the HALF_OPEN state, it immediately transitions back to OPEN. If the circuit breaker is in the CLOSED state, it increments the failure count and opens the circuit if the failure threshold is reached.
     * @returns {void}
     */
    onFailure() {
        // Log the failure event and current state for debugging purposes
        this.logger.error("[CircuitBreaker] failure recorded", {
            state: this._state,
            failures: this._failures,
            failureThreshold: this.failureThreshold,
        });

        // If we're in HALF_OPEN, any failure should immediately transition back to OPEN
        if (this._state === CircuitState.HALF_OPEN) {
            this.logger.warn(
                "[CircuitBreaker] half-open failed, reopening circuit",
            );
            this._openCircuit();
            return;
        }
        // If we're in CLOSED, increment failure count and potentially open the circuit
        this._failures++;
        this._lastFailureTime = Date.now();
        this.logger.info(
            `[CircuitBreaker] failure count: ${this._failures}/${this.failureThreshold}`,
        );
        // If we've reached the failure threshold, open the circuit
        if (this._failures >= this.failureThreshold) {
            this._openCircuit();
        }
    }

    /**
     * Returns a snapshot of the current state of the circuit breaker.
     * @returns {{state: string, failures: number, lastFailureTime: number, halfOpenAttempts: number, halfOpenSuccesses: number, cooldownMs: number, failureThreshold: number}} The snapshot of the circuit breaker state.
     * @private
     */
    snapshot() {
        return {
            state: this.state,
            failures: this._failures,
            lastFailureTime: this._lastFailureTime,
            halfOpenAttempts: this._halfOpenAttempts,
            halfOpenSuccesses: this._halfOpenSuccesses,
            cooldownMs: this.cooldownMs,
            failureThreshold: this.failureThreshold,
        };
    }
}
