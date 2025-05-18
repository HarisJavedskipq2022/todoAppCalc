import {useMemo} from 'react';
import {useColorScheme} from 'react-native';
import useAppStore from '../store/useAppStore';

export type Colors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  buttonText: string;
  disabled: string;
  placeholderText: string;
};

export type Spacing = {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
};

export type FontSizes = {
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
};

export type BorderRadius = {
  s: number;
  m: number;
  l: number;
  xl: number;
};

export type Theme = {
  colors: Colors;
  spacing: Spacing;
  fontSize: FontSizes;
  borderRadius: BorderRadius;
  isDark: boolean;
};

const lightColors: Colors = {
  primary: '#4361EE',
  background: '#F9F9F9',
  card: '#FFFFFF',
  text: '#1A1A1A',
  border: '#E0E0E0',
  notification: '#FF3B30',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#007AFF',
  buttonText: '#FFFFFF',
  disabled: '#CCCCCC',
  placeholderText: '#8E8E93',
};

const darkColors: Colors = {
  primary: '#4361EE',
  background: '#121212',
  card: '#1E1E1E',
  text: '#F9F9F9',
  border: '#2C2C2C',
  notification: '#FF453A',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FFD60A',
  info: '#0A84FF',
  buttonText: '#FFFFFF',
  disabled: '#3A3A3C',
  placeholderText: '#8E8E93',
};

const spacing: Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

const fontSize: FontSizes = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 24,
};

const borderRadius: BorderRadius = {
  s: 4,
  m: 8,
  l: 16,
  xl: 24,
};

export const useTheme = (): Theme => {
  const systemColorScheme = useColorScheme();
  const {preferences} = useAppStore(state => state.profile);

  // Use app preference first, then system preference
  const isDark = preferences.darkMode || systemColorScheme === 'dark';

  return useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      spacing,
      fontSize,
      borderRadius,
      isDark,
    }),
    [isDark],
  );
};
