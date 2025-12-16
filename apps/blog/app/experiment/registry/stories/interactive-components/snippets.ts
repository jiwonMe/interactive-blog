import { escapeForSingleQuotedAttr } from "@repo/interactive-components";

export type TemplateDefaults = Record<string, any>;

function compactJson(value: unknown) {
  return JSON.stringify(value);
}

export function mdxTagSnippet(tagName: string, attrs: Record<string, string>) {
  const body = Object.entries(attrs)
    .map(([k, v]) => `${k}=${v}`)
    .join("\n  ");

  return `<${tagName}\n  ${body}\n/>`;
}

export function makeVisxLineChartSnippet(defaults: TemplateDefaults) {
  const ticks = Number(defaults.ticks ?? 40);
  const data = Array.from({ length: ticks }, (_, i) => {
    const tick = i + 1;
    const interval = Math.sin(tick / 6) * 3 + (tick % 7 === 0 ? 8 : 0);
    const timeout = interval + tick * 0.15;
    const corrected = interval * 0.4;
    return { tick, interval, timeout, corrected };
  });

  const series = [
    { key: "interval", label: "setInterval", color: "#6b5ce7", yKey: "interval" },
    { key: "timeout", label: "setTimeout", color: "#10b981", yKey: "timeout" },
    { key: "corrected", label: "corrected", color: "#f59e0b", yKey: "corrected" },
  ];

  return mdxTagSnippet("LineChart", {
    xKey: "\"tick\"",
    xLabel: "\"tick #\"",
    yLabel: "\"drift (ms)\"",
    interactive: "{true}",
    dataJson: `'${escapeForSingleQuotedAttr(compactJson(data))}'`,
    seriesJson: `'${escapeForSingleQuotedAttr(compactJson(series))}'`,
  });
}

export function makeRechartsLineChartSnippet(defaults: TemplateDefaults) {
  const ticks = Number(defaults.ticks ?? 60);
  const data = Array.from({ length: ticks }, (_, i) => {
    const tick = i + 1;
    const y = Math.sin(tick / 7) * 8 + 12;
    return { tick, y };
  });

  const series = [{ key: "y", name: "value", color: "#6b5ce7", yKey: "y", type: "monotone" }];

  return mdxTagSnippet("RechartsLineChart", {
    xKey: "\"tick\"",
    xLabel: "\"tick #\"",
    yLabel: "\"value\"",
    dataJson: `'${escapeForSingleQuotedAttr(compactJson(data))}'`,
    seriesJson: `'${escapeForSingleQuotedAttr(compactJson(series))}'`,
  });
}

export function makeRechartsHistogramSnippet(defaults: TemplateDefaults) {
  const points = Number(defaults.points ?? 400);
  const bins = Number(defaults.bins ?? 20);
  const values = Array.from({ length: points }, (_, i) => {
    const a = Math.sin(i / 9) * 0.8;
    const b = Math.cos(i / 23) * 0.4;
    return a + b + (i % 17 === 0 ? 1.2 : 0);
  });

  return mdxTagSnippet("RechartsHistogram", {
    bins: `{${bins}}`,
    xLabel: "\"bin\"",
    yLabel: "\"count\"",
    valuesJson: `'${escapeForSingleQuotedAttr(compactJson(values))}'`,
  });
}



