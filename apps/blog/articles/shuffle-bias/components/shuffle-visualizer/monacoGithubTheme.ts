import type * as Monaco from 'monaco-editor';

type MonacoLike = typeof Monaco;

const GITHUB_LIGHT_THEME_NAME = 'github-light';
const GITHUB_DARK_THEME_NAME = 'github-dark';

export type GithubMonacoThemeName =
  | typeof GITHUB_LIGHT_THEME_NAME
  | typeof GITHUB_DARK_THEME_NAME;

const githubLight = {
  fg: '#24292f',
  bg: '#ffffff',
  bgCanvas: '#f6f8fa',
  border: '#d0d7de',
  subtleBorder: '#d8dee4',
  mutedFg: '#57606a',
  gutterFg: '#8c959f',
  selection: '#cce8ff',
  selectionInactive: '#cce8ff80',
  cursor: '#24292f',
  lineHighlight: '#f6f8fa',
  bracket: '#0969da',
  error: '#cf222e',
  warning: '#9a6700',
  info: '#0969da',
  hint: '#57606a',
  find: '#fff8c5',
};

const githubDark = {
  fg: '#c9d1d9',
  bg: '#0d1117',
  bgCanvas: '#161b22',
  border: '#30363d',
  subtleBorder: '#21262d',
  mutedFg: '#8b949e',
  gutterFg: '#6e7681',
  selection: '#1f6feb66',
  selectionInactive: '#1f6feb33',
  cursor: '#c9d1d9',
  lineHighlight: '#161b22',
  bracket: '#58a6ff',
  error: '#f85149',
  warning: '#d29922',
  info: '#58a6ff',
  hint: '#8b949e',
  find: '#3d2c00',
};

export function defineGithubMonacoThemes(monaco: MonacoLike) {
  monaco.editor.defineTheme(GITHUB_LIGHT_THEME_NAME, {
    base: 'vs',
    inherit: true,
    rules: [
      // GitHub Light (approx. github.vscode-theme)
      { token: 'comment', foreground: '6e7781' },
      { token: 'string', foreground: '0a3069' },
      { token: 'string.escape', foreground: '0a3069' },
      { token: 'number', foreground: '0550ae' },
      { token: 'keyword', foreground: 'cf222e' },
      { token: 'operator', foreground: '0550ae' },
      { token: 'delimiter', foreground: githubLight.fg.replace('#', '') },
      { token: 'type.identifier', foreground: '8250df' },
      { token: 'identifier', foreground: githubLight.fg.replace('#', '') },
      { token: 'tag', foreground: '116329' },
      { token: 'attribute.name', foreground: '0550ae' },
      { token: 'attribute.value', foreground: '0a3069' },
      { token: 'regexp', foreground: '0a3069' },
      { token: 'regexp.escape', foreground: '0a3069' },
    ],
    colors: {
      // Core
      'editor.background': githubLight.bg,
      'editor.foreground': githubLight.fg,
      'editorCursor.foreground': githubLight.cursor,
      'editorLineNumber.foreground': githubLight.gutterFg,
      'editorLineNumber.activeForeground': githubLight.fg,
      // Selection / highlights
      'editor.selectionBackground': githubLight.selection,
      'editor.inactiveSelectionBackground': githubLight.selectionInactive,
      'editor.selectionHighlightBackground': '#cce8ff66',
      'editor.wordHighlightBackground': '#0969da1a',
      'editor.wordHighlightStrongBackground': '#0969da33',
      'editor.lineHighlightBackground': githubLight.lineHighlight,
      'editor.findMatchBackground': githubLight.find,
      'editor.findMatchHighlightBackground': '#fff8c580',
      'editor.findRangeHighlightBackground': '#fff8c533',
      // Whitespace / guides
      'editorWhitespace.foreground': '#d0d7de',
      'editorIndentGuide.background1': githubLight.subtleBorder,
      'editorIndentGuide.activeBackground1': githubLight.border,
      // Brackets
      'editorBracketMatch.background': '#0969da1a',
      'editorBracketMatch.border': githubLight.bracket,
      // Diagnostics
      'editorError.foreground': githubLight.error,
      'editorWarning.foreground': githubLight.warning,
      'editorInfo.foreground': githubLight.info,
      'editorHint.foreground': githubLight.hint,
      // Suggest / hover
      'editorHoverWidget.background': githubLight.bg,
      'editorHoverWidget.border': githubLight.border,
      'editorSuggestWidget.background': githubLight.bg,
      'editorSuggestWidget.border': githubLight.border,
      'editorSuggestWidget.foreground': githubLight.fg,
      'editorSuggestWidget.selectedBackground': githubLight.bgCanvas,
      // Widgets
      'editorWidget.background': githubLight.bg,
      'editorWidget.border': githubLight.border,
      'editorWidget.foreground': githubLight.fg,
      // Scrollbar / minimap
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#8c959f33',
      'scrollbarSlider.hoverBackground': '#8c959f55',
      'scrollbarSlider.activeBackground': '#8c959f66',
      'minimap.background': githubLight.bg,
      // Overview ruler
      'editorOverviewRuler.border': githubLight.border,
    },
  });

  monaco.editor.defineTheme(GITHUB_DARK_THEME_NAME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      // GitHub Dark (approx. github.vscode-theme)
      { token: 'comment', foreground: '8b949e' },
      { token: 'string', foreground: 'a5d6ff' },
      { token: 'string.escape', foreground: 'a5d6ff' },
      { token: 'number', foreground: '79c0ff' },
      { token: 'keyword', foreground: 'ff7b72' },
      { token: 'operator', foreground: '79c0ff' },
      { token: 'delimiter', foreground: githubDark.fg.replace('#', '') },
      { token: 'type.identifier', foreground: 'd2a8ff' },
      { token: 'identifier', foreground: githubDark.fg.replace('#', '') },
      { token: 'tag', foreground: '7ee787' },
      { token: 'attribute.name', foreground: '79c0ff' },
      { token: 'attribute.value', foreground: 'a5d6ff' },
      { token: 'regexp', foreground: 'a5d6ff' },
      { token: 'regexp.escape', foreground: 'a5d6ff' },
    ],
    colors: {
      // Core
      'editor.background': githubDark.bg,
      'editor.foreground': githubDark.fg,
      'editorCursor.foreground': githubDark.cursor,
      'editorLineNumber.foreground': githubDark.gutterFg,
      'editorLineNumber.activeForeground': githubDark.fg,
      // Selection / highlights
      'editor.selectionBackground': githubDark.selection,
      'editor.inactiveSelectionBackground': githubDark.selectionInactive,
      'editor.selectionHighlightBackground': '#1f6feb33',
      'editor.wordHighlightBackground': '#58a6ff1a',
      'editor.wordHighlightStrongBackground': '#58a6ff33',
      'editor.lineHighlightBackground': githubDark.lineHighlight,
      'editor.findMatchBackground': githubDark.find,
      'editor.findMatchHighlightBackground': '#3d2c0080',
      'editor.findRangeHighlightBackground': '#3d2c0033',
      // Whitespace / guides
      'editorWhitespace.foreground': '#30363d',
      'editorIndentGuide.background1': githubDark.border,
      'editorIndentGuide.activeBackground1': '#484f58',
      // Brackets
      'editorBracketMatch.background': '#58a6ff1a',
      'editorBracketMatch.border': githubDark.bracket,
      // Diagnostics
      'editorError.foreground': githubDark.error,
      'editorWarning.foreground': githubDark.warning,
      'editorInfo.foreground': githubDark.info,
      'editorHint.foreground': githubDark.hint,
      // Suggest / hover
      'editorHoverWidget.background': githubDark.bgCanvas,
      'editorHoverWidget.border': githubDark.border,
      'editorSuggestWidget.background': githubDark.bgCanvas,
      'editorSuggestWidget.border': githubDark.border,
      'editorSuggestWidget.foreground': githubDark.fg,
      'editorSuggestWidget.selectedBackground': '#21262d',
      // Widgets
      'editorWidget.background': githubDark.bgCanvas,
      'editorWidget.border': githubDark.border,
      'editorWidget.foreground': githubDark.fg,
      // Scrollbar / minimap
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#6e768133',
      'scrollbarSlider.hoverBackground': '#6e768155',
      'scrollbarSlider.activeBackground': '#6e768166',
      'minimap.background': githubDark.bg,
      // Overview ruler
      'editorOverviewRuler.border': githubDark.border,
    },
  });
}

export function getGithubMonacoThemeName(colorScheme: 'light' | 'dark'): GithubMonacoThemeName {
  return colorScheme === 'dark' ? GITHUB_DARK_THEME_NAME : GITHUB_LIGHT_THEME_NAME;
}


