import { jwtUtils } from "./jwtUtils";

/**
 * Check if a token is expiring soon (within X seconds)
 * @param token - JWT token string
 * @param thresholdSeconds - Time threshold in seconds (default: 5 minutes = 300 seconds)
 * @returns Boolean indicating if token is expiring soon
 */
export const isTokenExpiringSoon = (
    token: string,
    thresholdSeconds: number = 300
): boolean => {
    try {
        const remainingTime = jwtUtils.getRemainingTokenTime(token);
        if (remainingTime === null) {
            return true;
        }
        return remainingTime <= thresholdSeconds;
    } catch {
        return true;
    }
};

/**
 * Get token expiry timestamp
 * @param token - JWT token string
 * @returns Expiry timestamp in milliseconds or null
 */
export const getTokenExpiryTime = (token: string): number | null => {
    try {
        const decoded = jwtUtils.decodedToken(token);
        if (!decoded || !decoded.exp) {
            return null;
        }
        return decoded.exp * 1000; // Convert to milliseconds
    } catch {
        return null;
    }
};

/**
 * Get time remaining until token expiry
 * @param token - JWT token string
 * @returns Remaining time in milliseconds or null
 */
export const getTimeUntilTokenExpiry = (token: string): number | null => {
    try {
        const expiryTime = getTokenExpiryTime(token);
        if (!expiryTime) {
            return null;
        }
        const remaining = expiryTime - Date.now();
        return remaining > 0 ? remaining : 0;
    } catch {
        return null;
    }
};

/**
 * Format remaining time for display
 * @param token - JWT token string
 * @returns Formatted string like "5 minutes", "30 seconds", etc.
 */
export const formatTokenTimeRemaining = (token: string): string => {
    try {
        const remaining = getTimeUntilTokenExpiry(token);
        if (remaining === null || remaining === 0) {
            return "Expired";
        }

        const seconds = Math.floor(remaining / 1000);
        if (seconds < 60) {
            return `${seconds} seconds`;
        }

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} minutes`;
        }

        const hours = Math.floor(minutes / 60);
        return `${hours} hours`;
    } catch {
        return "Unknown";
    }
};

/**
 * Check if token is within a specific time window
 * @param token - JWT token string
 * @param fromSeconds - Start of window from now
 * @param toSeconds - End of window from now
 * @returns Boolean indicating if token expiry falls within window
 */
export const isTokenExpiryInWindow = (
    token: string,
    fromSeconds: number = 0,
    toSeconds: number = 300
): boolean => {
    try {
        const remaining = jwtUtils.getRemainingTokenTime(token);
        if (remaining === null) {
            return false;
        }
        return remaining >= fromSeconds && remaining <= toSeconds;
    } catch {
        return false;
    }
};
