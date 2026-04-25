import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Verify JWT token with proper error handling
 * @param token - JWT token string
 * @param secret - Secret key for verification
 * @returns Object with success status and decoded data or error
 */
const verifyToken = (token: string, secret: string) => {
    try {
        if (!token || !secret) {
            return {
                success: false,
                message: "Missing token or secret",
                error: null,
            };
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;
        return {
            success: true,
            data: decoded,
            message: "Token verified successfully",
            error: null,
        };
    } catch (err: unknown) {
        const error = err as Error;
        return {
            success: false,
            message: error.message || "Token verification failed",
            error: error.name || "Unknown error",
            data: null,
        };
    }
};

/**
 * Decode JWT token without verification (useful for reading expiry)
 * @param token - JWT token string
 * @returns Decoded token data
 */
const decodedToken = (token: string) => {
    try {
        if (!token) return null;
        return jwt.decode(token) as JwtPayload | null;
    } catch {
        return null;
    }
};

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns Boolean indicating if token is expired
 */
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodedToken(token);
        if (!decoded || !decoded.exp) {
            return true;
        }
        return Math.floor(Date.now() / 1000) >= decoded.exp;
    } catch {
        return true;
    }
};

/**
 * Get remaining token expiry time
 * @param token - JWT token string
 * @returns Remaining time in seconds, or null if invalid
 */
const getRemainingTokenTime = (token: string): number | null => {
    try {
        const decoded = decodedToken(token);
        if (!decoded || !decoded.exp) {
            return null;
        }
        const remaining = decoded.exp - Math.floor(Date.now() / 1000);
        return remaining > 0 ? remaining : 0;
    } catch {
        return null;
    }
};

export const jwtUtils = {
    verifyToken,
    decodedToken,
    isTokenExpired,
    getRemainingTokenTime,
};
