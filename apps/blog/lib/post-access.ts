'use server';

import { cookies } from 'next/headers';
import { getPostBySlug } from './posts';

const POST_AUTH_COOKIE_PREFIX = 'pwnz_post_auth__';
const COOKIE_MAX_AGE = 60 * 60;

const getPostPasswordFromFile = (slug: string): string | null => {
  const post = getPostBySlug(slug);
  return post?.password ?? null;
};

const getPostAuthCookieName = (slug: string) => `${POST_AUTH_COOKIE_PREFIX}${slug}`;

export async function isPostPasswordAuthenticated(slug: string): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieName = getPostAuthCookieName(slug);
  const cookie = cookieStore.get(cookieName);
  return cookie?.value === 'authenticated';
}

export async function isPostPasswordEnabled(slug: string): Promise<boolean> {
  return getPostPasswordFromFile(slug) !== null;
}

export async function verifyPostPassword(
  slug: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const expected = getPostPasswordFromFile(slug);

  if (expected === null) {
    return { success: false, error: '이 포스트는 비밀번호 보호가 설정되지 않았습니다.' };
  }

  if (password !== expected) {
    return { success: false, error: '비밀번호가 올바르지 않습니다.' };
  }

  const cookieStore = await cookies();
  const cookieName = getPostAuthCookieName(slug);

  cookieStore.set(cookieName, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return { success: true };
}

