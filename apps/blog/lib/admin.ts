'use server';

import { cookies } from 'next/headers';

// Admin 쿠키 이름
const ADMIN_COOKIE_NAME = 'pwnz_admin_auth';
// 비밀번호
const ADMIN_PASSWORD = 'ADMN0615';
// 쿠키 유효 기간 (1시간)
const COOKIE_MAX_AGE = 60 * 60;

/**
 * 서버에서 admin 인증 상태 확인
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  return adminCookie?.value === 'authenticated';
}

/**
 * Admin 비밀번호 검증 및 쿠키 설정 (Server Action)
 */
export async function verifyAdminPassword(password: string): Promise<{ success: boolean; error?: string }> {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: '비밀번호가 올바르지 않습니다.' };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return { success: true };
}

/**
 * Admin 로그아웃 (쿠키 삭제)
 */
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
