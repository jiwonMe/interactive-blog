'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { sendGAEvent } from '../../lib/analytics';
import {
  buildFeedbackMailto,
  type FeedbackValue,
  readStoredComment,
  readStoredFeedback,
  writeStoredComment,
  writeStoredFeedback,
} from './article-feedback-utils';

type ArticleFeedbackProps = {
  articleSlug: string;
  articleTitle: string;
  emailTo?: string;
};

export function ArticleFeedback({ articleSlug, articleTitle, emailTo = 'park@jiwon.me' }: ArticleFeedbackProps) {
  const [value, setValue] = React.useState<FeedbackValue | null>(null);
  const [comment, setComment] = React.useState('');
  const maxLen = 500;

  React.useEffect(() => {
    setValue(readStoredFeedback(articleSlug));
    setComment(readStoredComment(articleSlug));
  }, [articleSlug]);

  const submit = React.useCallback(
    (next: FeedbackValue) => {
      setValue(next);
      writeStoredFeedback(articleSlug, next);

      // GA4 이벤트 전송 (커스텀 이벤트)
      sendGAEvent('article_feedback', {
        category: 'engagement',
        article_slug: articleSlug,
        article_title: articleTitle,
        feedback: next,
        value: next === 'up' ? 1 : 0,
      });
    },
    [articleSlug, articleTitle]
  );

  const sendMail = React.useCallback(() => {
    const trimmed = comment.trim().slice(0, maxLen);
    writeStoredComment(articleSlug, trimmed);
    setComment(trimmed);

    sendGAEvent('article_feedback_mail', {
      category: 'sharing',
      article_slug: articleSlug,
      article_title: articleTitle,
      feedback: value ?? 'none',
      comment_length: trimmed.length,
      value: trimmed.length > 0 ? 1 : 0,
    });

    const mailto = buildFeedbackMailto({
      emailTo,
      title: articleTitle,
      slug: articleSlug,
      value,
      comment: trimmed,
    });
    window.location.href = mailto;
  }, [articleSlug, articleTitle, comment, emailTo, maxLen, value]);

  return (
    <section
      className={cn(
        /* layout */
        'mt-14 rounded-2xl border p-6',
        /* background */
        'bg-zinc-50 dark:bg-zinc-900/40',
        /* border */
        'border-zinc-200 dark:border-zinc-800'
      )}
      aria-label="피드백"
    >
      <div
        className={cn(
          /* layout */
          'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'
        )}
      >
        <div className={cn(/* layout */ 'min-w-0')}>
          <div
            className={cn(
              /* typography */
              'text-sm font-semibold',
              /* color */
              'text-zinc-900 dark:text-zinc-100'
            )}
          >
            이 글이 도움이 되었나요?
          </div>
          <div
            className={cn(
              /* typography */
              'mt-1 text-sm',
              /* color */
              'text-zinc-600 dark:text-zinc-400'
            )}
          >
            다음 콘텐츠에 대한 피드백을 남겨주세요.
          </div>
        </div>

        <div
          className={cn(
            /* layout */
            'flex items-center gap-2'
          )}
        >
          <button
            type="button"
            onClick={() => submit('up')}
            className={cn(
              /* layout */
              'inline-flex items-center justify-center rounded-lg px-3 py-2',
              /* border */
              'border border-zinc-200 dark:border-zinc-800',
              /* typography */
              'text-sm font-medium',
              /* background */
              value === 'up'
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-white dark:bg-zinc-950',
              /* color */
              value === 'up'
                ? 'text-white'
                : 'text-zinc-700 dark:text-zinc-200',
              /* interaction */
              value === 'up' ? 'hover:opacity-95' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900',
              /* focus */
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60'
            )}
            aria-pressed={value === 'up'}
          >
            👍 도움 됨
          </button>

          <button
            type="button"
            onClick={() => submit('down')}
            className={cn(
              /* layout */
              'inline-flex items-center justify-center rounded-lg px-3 py-2',
              /* border */
              'border border-zinc-200 dark:border-zinc-800',
              /* typography */
              'text-sm font-medium',
              /* background */
              value === 'down'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-white dark:bg-zinc-950',
              /* color */
              value === 'down'
                ? 'text-white dark:text-zinc-900'
                : 'text-zinc-700 dark:text-zinc-200',
              /* interaction */
              value === 'down' ? 'hover:opacity-95' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900',
              /* focus */
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60'
            )}
            aria-pressed={value === 'down'}
          >
            👎 아쉬움
          </button>
        </div>
      </div>

      {value ? (
        <div className={cn(/* layout */ 'mt-5')}>
          <div className={cn(/* layout */ 'flex items-center justify-between gap-3')}>
            <label
              htmlFor={`feedback-comment-${articleSlug}`}
              className={cn(
                /* typography */
                'text-sm font-medium',
                /* color */
                'text-zinc-900 dark:text-zinc-100'
              )}
            >
              코멘트(선택)
            </label>
            <span
              className={cn(
                /* typography */
                'text-xs',
                /* color */
                'text-zinc-500 dark:text-zinc-500'
              )}
            >
              {Math.min(comment.length, maxLen)}/{maxLen}
            </span>
          </div>

          <textarea
            id={`feedback-comment-${articleSlug}`}
            value={comment}
            onChange={(e) => {
              const next = e.target.value.slice(0, maxLen);
              setComment(next);
              writeStoredComment(articleSlug, next);
            }}
            rows={3}
            placeholder="예) 이 부분이 특히 유용했어요 / 여기 설명이 조금 헷갈렸어요"
            className={cn(
              /* layout */
              'mt-2 w-full rounded-lg px-3 py-2',
              /* border */
              'border border-zinc-200 dark:border-zinc-800',
              /* typography */
              'text-sm leading-relaxed',
              /* color */
              'text-zinc-900 placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600',
              /* background */
              'bg-white dark:bg-zinc-950',
              /* focus */
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60'
            )}
          />

          <div
            className={cn(
              /* layout */
              'mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'
            )}
          >
            <div
              className={cn(
                /* typography */
                'text-sm',
                /* color */
                'text-zinc-600 dark:text-zinc-400'
              )}
            >
              피드백 감사합니다. {value === 'up' ? '계속 좋은 글을 써볼게요.' : '더 개선해볼게요.'}
            </div>

            <button
              type="button"
              onClick={sendMail}
              className={cn(
                /* layout */
                'inline-flex items-center justify-center rounded-lg px-3 py-2',
                /* typography */
                'text-sm font-medium',
                /* border */
                'border border-zinc-200 dark:border-zinc-800',
                /* color */
                'text-zinc-700 dark:text-zinc-200',
                /* background */
                'bg-white dark:bg-zinc-950',
                /* interaction */
                'hover:bg-zinc-100 dark:hover:bg-zinc-900',
                /* focus */
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60'
              )}
            >
              메일로 그대로 전송
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

