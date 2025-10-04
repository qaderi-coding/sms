// ==============================|| THEME CONFIG ||============================== //

interface Config {
  fontFamily: string;
  borderRadius: number;
  outlinedFilled: boolean;
  navType: 'light' | 'dark';
  presetColor: string;
  locale: string;
  rtlLayout: boolean;
  container: boolean;
}

const config: Config = {
  fontFamily: `'Public Sans', sans-serif`,
  borderRadius: 12,
  outlinedFilled: true,
  navType: 'light', // light, dark
  presetColor: 'default', // default, theme1, theme2, theme3, theme4, theme5, theme6
  locale: 'en', // 'en' - English, 'fr' - French, 'ro' - Romanian, 'zh' - Chinese
  rtlLayout: false,
  container: false
};

export default config;
export const drawerWidth: number = 260;
export const DRAWER_WIDTH: number = 260;
export const MINI_DRAWER_WIDTH: number = 60;
export const twitterColor: string = '#1DA1F2';
export const facebookColor: string = '#3b5998';
export const linkedInColor: string = '#0e76a8';

// ==============================|| GRID SPACING ||============================== //
export const gridSpacing: number = 3;

// ==============================|| APP DEFAULT PATH ||============================== //
export const APP_DEFAULT_PATH: string = '/dashboard/default';