// utils/getUserIdFromToken.ts
import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId?: string;
    id?: string;
    sub?: string;
    [key: string]: any;
}

/**
 * Extracts the userId from a JWT token
 * @param token JWT token string
 * @returns userId if found, otherwise null
 */
export function getUserIdFromToken(token: string | null | undefined): string | null {
    if (!token) return null;

    try {
        const decoded = jwt.decode(token) as TokenPayload | null;
        return decoded?.userId || decoded?.id || decoded?.sub || null;
    } catch (err) {
        console.error('Invalid token:', err);
        return null;
    }
}

export function getCookieFromName(name: string) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1] || null;
}

export function getToken(){
    return getCookieFromName('token')
}