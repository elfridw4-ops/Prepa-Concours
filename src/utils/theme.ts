export type Theme = 'dark' | 'light' | 'hc';

const THEME_STORAGE_KEY = 'app_theme';

export const getSavedTheme = (): Theme => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  return saved || 'dark';
};

export const saveTheme = (theme: Theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove('theme-light', 'theme-hc');
  if (theme === 'light') {
    root.classList.add('theme-light');
  } else if (theme === 'hc') {
    root.classList.add('theme-hc');
  }
};
