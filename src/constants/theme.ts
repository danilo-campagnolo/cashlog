/* Centralized theme configuration for Cashlog */

export const CURRENCY = {
  symbol: '€',
  code: 'EUR',
  position: 'after' as 'before' | 'after', /* 'before' for $100, 'after' for 100€ */
};

/* Format amount with currency symbol */
export const formatCurrency = (amount: number): string => {
  const formatted = Math.abs(amount).toFixed(2);
  if (CURRENCY.position === 'before') {
    return `${CURRENCY.symbol}${formatted}`;
  }
  return `${formatted}${CURRENCY.symbol}`;
};

/* Format amount with sign and currency */
export const formatSignedCurrency = (amount: number, isExpense: boolean): string => {
  const sign = isExpense ? '-' : '+';
  return `${sign}${formatCurrency(amount)}`;
};

/* Color palette - centralized colors */
export const Colors = {
  /* Primary brand colors */
  primary: {
    light: '#0F172A',
    dark: '#F8FAFC',
  },

  /* Semantic colors for income/expense */
  income: '#22C55E',
  incomeLight: 'rgba(34, 197, 94, 0.1)',
  expense: '#EF4444',
  expenseLight: 'rgba(239, 68, 68, 0.1)',

  /* Background colors */
  background: {
    light: '#F1F5F9',
    dark: '#0F172A',
  },

  /* Card colors */
  card: {
    light: '#FFFFFF',
    dark: '#1E293B',
  },

  /* Card alternate (for items) */
  cardAlt: {
    light: '#FFFFFF',
    dark: '#0B1220',
  },

  /* Text colors */
  text: {
    primary: {
      light: '#0F172A',
      dark: '#F8FAFC',
    },
    secondary: {
      light: '#334155',
      dark: '#CBD5E1',
    },
    tertiary: {
      light: '#64748B',
      dark: '#94A3B8',
    },
  },

  /* Input colors */
  input: {
    background: {
      light: '#F8FAFC',
      dark: '#0F172A',
    },
    border: {
      light: '#E2E8F0',
      dark: '#334155',
    },
    placeholder: {
      light: '#94A3B8',
      dark: '#64748B',
    },
  },

  /* Button colors */
  button: {
    primary: {
      background: '#0F172A',
      text: '#FFFFFF',
    },
    danger: {
      background: '#EF4444',
      text: '#FFFFFF',
    },
  },

  /* Selection color */
  selection: {
    light: '#0F172A',
    dark: '#F97316',
  },

  /* Shadow */
  shadow: '#000000',

  /* Common */
  white: '#FFFFFF',
  transparent: 'transparent',
};

/* Helper to get theme-aware color */
export const getColor = (
  colorObj: {light: string; dark: string},
  isDarkMode: boolean,
): string => {
  return isDarkMode ? colorObj.dark : colorObj.light;
};
