import { assignVars, globalStyle } from '@vanilla-extract/css';
import { darkThemeValues, lightThemeValues, vars } from './theme.css';

// 기본값: 라이트 테마
globalStyle(':root', {
  vars: assignVars(vars, lightThemeValues),
});

// Tailwind/next-themes가 html에 .dark를 붙이는 패턴과 호환
globalStyle('.dark', {
  vars: assignVars(vars, darkThemeValues),
});






