import Cookies from 'js-cookie';
import { User, Role } from '@/types';

const COOKIE_OPTS = { expires: 1, sameSite: 'strict' as const };

export function saveAuth(token: string, user: User) {
  Cookies.set('alpha_token', token, COOKIE_OPTS);
  Cookies.set('alpha_user', JSON.stringify(user), COOKIE_OPTS);
}

export function clearAuth() {
  Cookies.remove('alpha_token');
  Cookies.remove('alpha_user');
}

export function getToken(): string | null {
  return Cookies.get('alpha_token') || null;
}

export function getCurrentUser(): User | null {
  try {
    const raw = Cookies.get('alpha_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function hasRole(role: Role): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

export const getDashboardPath = (role: Role): string => {
  switch (role) {
    case 'ADMIN':    return '/admin';
    case 'INVESTOR': return '/investor';
    case 'MENTOR':   return '/mentor';
    case 'FOUNDER':  return '/founder';
    default:         return '/dashboard';
  }
};
