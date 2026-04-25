/**
 * Additional Helper Utilities for Auth System
 * Location: src/lib/authHelpers.ts
 * 
 * These are convenience functions for common patterns
 */

import { UserRole, roleHierarchy } from './rbac';

interface CookieRequest {
    cookies: {
        get: (name: string) => { value: string } | undefined;
    };
}

interface CookieResponse {
    cookies: {
        delete: (name: string) => void;
    };
}

export const cookieHelpers = {
    getAllAuthCookies: (request: CookieRequest) => ({
        accessToken: request.cookies.get('accessToken')?.value,
        refreshToken: request.cookies.get('refreshToken')?.value,
        userId: request.cookies.get('userId')?.value,
    }),

    hasAuthCookies: (request: CookieRequest): boolean =>
        !!request.cookies.get('accessToken')?.value,

    clearAuthCookies: (response: CookieResponse) => {
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        response.cookies.delete('userId');
        return response;
    },
};

export const urlHelpers = {
    buildLoginUrl: (redirectPath: string, baseUrl: string = '/login'): string => {
        const url = new URL(baseUrl, 'http://localhost');
        if (redirectPath) {
            url.searchParams.set('redirect', redirectPath);
        }
        return url.pathname + url.search;
    },

    extractRedirectUrl: (searchParams: URLSearchParams, defaultPath: string = '/'): string => {
        const redirect = searchParams.get('redirect');
        if (redirect?.startsWith('/') && !redirect.includes('//')) {
            return redirect;
        }
        return defaultPath;
    },

    isSafeRedirectUrl: (url: string): boolean => {
        if (!url) return false;
        if (!url.startsWith('/')) return false;
        if (url.includes('//')) return false;
        if (url.includes('://')) return false;
        return true;
    },

    isAuthUrl: (url: string): boolean => {
        const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
        return authRoutes.some(route => url === route || url.startsWith(route + '?'));
    },
};

export const roleHelpers = {
    getRoleLevel: (role: UserRole | null): number =>
        role ? roleHierarchy[role] : 0,

    getRolesBelowLevel: (level: number): UserRole[] =>
        (Object.entries(roleHierarchy) as [UserRole, number][])
            .filter(([, roleLevel]) => roleLevel < level)
            .map(([role]) => role),

    getRolesAtOrAboveLevel: (level: number): UserRole[] =>
        (Object.entries(roleHierarchy) as [UserRole, number][])
            .filter(([, roleLevel]) => roleLevel >= level)
            .map(([role]) => role),

    compareRoleHierarchy: (role1: UserRole, role2: UserRole): 'higher' | 'lower' | 'equal' => {
        const level1 = roleHierarchy[role1];
        const level2 = roleHierarchy[role2];
        if (level1 > level2) return 'higher';
        if (level1 < level2) return 'lower';
        return 'equal';
    },
};

export const dateHelpers = {
    secondsToMs: (seconds: number): number => seconds * 1000,
    msToSeconds: (ms: number): number => Math.floor(ms / 1000),
    getCurrentTimestamp: (): number => Math.floor(Date.now() / 1000),
    isTimestampPast: (timestamp: number): boolean =>
        timestamp < dateHelpers.getCurrentTimestamp(),
    getTimeUntilTimestamp: (timestamp: number): number => {
        const remaining = timestamp - dateHelpers.getCurrentTimestamp();
        return remaining > 0 ? remaining : 0;
    },
    formatSeconds: (seconds: number): string => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        return `${Math.floor(seconds / 3600)}h`;
    },
    isTimeInWindow: (
        timestamp: number,
        windowStart: number,
        windowEnd: number
    ): boolean => {
        const now = dateHelpers.getCurrentTimestamp();
        return now >= timestamp - windowStart && now <= timestamp + windowEnd;
    },
};

interface AuthError {
    success: false;
    error: string;
    status: number;
}

interface PermissionError {
    success: false;
    error: string;
    status: 403;
}

interface JWTError extends Error {
    name: string;
}

export const errorHelpers = {
    createAuthError: (message: string, status: number = 401): AuthError => ({
        success: false,
        error: message,
        status,
    }),

    createPermissionError: (reason: string = 'Insufficient permissions'): PermissionError => ({
        success: false,
        error: reason,
        status: 403,
    }),

    parseJwtError: (error: JWTError): string => {
        if (error.name === 'TokenExpiredError') {
            return 'Token has expired';
        }
        if (error.name === 'JsonWebTokenError') {
            return 'Invalid token';
        }
        if (error.name === 'NotBeforeError') {
            return 'Token is not yet valid';
        }
        return error.message || 'Unknown token error';
    },
};

interface SessionData {
    sessionId: string;
    userId: string;
    role: UserRole;
    createdAt: string;
    lastActivity: string;
}

export const sessionHelpers = {
    generateSessionId: (): string =>
        `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,

    createSessionData: (userId: string, role: UserRole): SessionData => ({
        sessionId: sessionHelpers.generateSessionId(),
        userId,
        role,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
    }),

    updateLastActivity: (sessionData: SessionData): SessionData => ({
        ...sessionData,
        lastActivity: new Date().toISOString(),
    }),

    isSessionStale: (sessionData: SessionData, staleMinutes: number = 30): boolean => {
        const lastActivity = new Date(sessionData.lastActivity).getTime();
        const now = Date.now();
        const diffMinutes = (now - lastActivity) / (1000 * 60);
        return diffMinutes > staleMinutes;
    },
};

interface PasswordValidation {
    valid: boolean;
    errors: string[];
}

export const validationHelpers = {
    isValidEmail: (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    isValidPassword: (password: string): PasswordValidation => {
        const errors: string[] = [];
        if (password.length < 8) errors.push('Password must be at least 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
        if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
        if (!/[0-9]/.test(password)) errors.push('Password must contain number');
        if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character (!@#$%^&*)');
        return { valid: errors.length === 0, errors };
    },

    sanitizeInput: (input: string): string =>
        input.trim().replace(/[<>]/g, '').substring(0, 255),

    isValidRole: (role: unknown): role is UserRole =>
        ['SUPER_ADMIN', 'ADMIN', 'RIDER', 'CUSTOMER'].includes(role as string),
};

export const loggingHelpers = {
    logAuthEvent: (
        eventType: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'TOKEN_REFRESH' | 'PASSWORD_RESET',
        userId: string,
        role: UserRole | null,
        metadata: Record<string, unknown> = {}
    ) => {
        const timestamp = new Date().toISOString();
        console.log(JSON.stringify({ timestamp, eventType, userId, role, ...metadata }));
    },

    logSecurityEvent: (
        eventType: 'UNAUTHORIZED_ACCESS' | 'INVALID_TOKEN' | 'PERMISSION_DENIED' | 'SUSPICIOUS_LOGIN',
        userId: string | null,
        reason: string,
        metadata: Record<string, unknown> = {}
    ) => {
        const timestamp = new Date().toISOString();
        console.warn(JSON.stringify({
            timestamp,
            eventType,
            userId,
            reason,
            severity: 'WARNING',
            ...metadata,
        }));
    },

    logError: (
        component: string,
        error: Error,
        context: Record<string, unknown> = {}
    ) => {
        const timestamp = new Date().toISOString();
        console.error(JSON.stringify({
            timestamp,
            component,
            error: error.message,
            stack: error.stack,
            ...context,
        }));
    },
};

export const authHelpers = {
    cookies: cookieHelpers,
    url: urlHelpers,
    role: roleHelpers,
    date: dateHelpers,
    error: errorHelpers,
    session: sessionHelpers,
    validation: validationHelpers,
    logging: loggingHelpers,
};

export default authHelpers;
