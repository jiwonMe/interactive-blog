export type FeedbackValue = 'up' | 'down';

function storageKey(slug: string) {
  return `pwnz:article_feedback:${slug}`;
}

function commentStorageKey(slug: string) {
  return `pwnz:article_feedback_comment:${slug}`;
}

export function readStoredFeedback(slug: string): FeedbackValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(storageKey(slug));
    return value === 'up' || value === 'down' ? value : null;
  } catch {
    return null;
  }
}

export function writeStoredFeedback(slug: string, value: FeedbackValue) {
  try {
    window.localStorage.setItem(storageKey(slug), value);
  } catch {
    // ignore
  }
}

export function readStoredComment(slug: string) {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(commentStorageKey(slug)) ?? '';
  } catch {
    return '';
  }
}

export function writeStoredComment(slug: string, comment: string) {
  try {
    window.localStorage.setItem(commentStorageKey(slug), comment);
  } catch {
    // ignore
  }
}

export function formatFeedbackLabel(value: FeedbackValue | null) {
  if (value === 'up') return '도움 됨';
  if (value === 'down') return '아쉬움';
  return '미선택';
}

export function buildFeedbackMailto(args: {
  emailTo: string;
  title: string;
  slug: string;
  value: FeedbackValue | null;
  comment: string;
}) {
  const subject = encodeURIComponent(`[Blog Feedback] ${args.title}`);
  const pageUrl = `https://pwnz.kr/posts/${args.slug}`;
  const normalizedComment = args.comment.trim();
  const body = encodeURIComponent(
    `안녕하세요!\n\n아래 글에 대한 피드백을 남깁니다.\n\n- 제목: ${args.title}\n- URL: ${pageUrl}\n- 슬러그: ${args.slug}\n- 평가: ${formatFeedbackLabel(args.value)}\n\n- 코멘트:\n${normalizedComment || '(없음)'}\n`
  );
  return `mailto:${args.emailTo}?subject=${subject}&body=${body}`;
}

