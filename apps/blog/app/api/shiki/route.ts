import { NextResponse } from "next/server";
import { codeToHtml } from "shiki";

export const runtime = "nodejs";

type ShikiHighlightRequest = {
  code: string;
  language: string;
};

type ShikiHighlightResponse =
  | { ok: true; html: string }
  | { ok: false; error: string };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" } satisfies ShikiHighlightResponse,
      { status: 400 }
    );
  }

  const { code, language } = (body ?? {}) as Partial<ShikiHighlightRequest>;

  if (!isNonEmptyString(code)) {
    return NextResponse.json(
      { ok: false, error: "`code` is required" } satisfies ShikiHighlightResponse,
      { status: 400 }
    );
  }

  if (!isNonEmptyString(language)) {
    return NextResponse.json(
      { ok: false, error: "`language` is required" } satisfies ShikiHighlightResponse,
      { status: 400 }
    );
  }

  try {
    const html = await codeToHtml(code, {
      lang: language,
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    });

    return NextResponse.json({ ok: true, html } satisfies ShikiHighlightResponse);
  } catch {
    // 언어 미지원/테마 로딩 이슈 등: text로 폴백
    try {
      const html = await codeToHtml(code, {
        lang: "text",
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      });
      return NextResponse.json({ ok: true, html } satisfies ShikiHighlightResponse);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Failed to highlight code" } satisfies ShikiHighlightResponse,
        { status: 500 }
      );
    }
  }
}







