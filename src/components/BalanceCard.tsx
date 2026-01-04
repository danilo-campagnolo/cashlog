import React, {memo, useMemo} from 'react';
import {View, Text, StyleSheet, useColorScheme} from 'react-native';

interface BalanceCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  totalIncome,
  totalExpense,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  /* Memoize formatted values */
  const formattedBalance = useMemo(() => `$${totalBalance.toFixed(2)}`, [totalBalance]);
  const formattedIncome = useMemo(() => `$${totalIncome.toFixed(2)}`, [totalIncome]);
  const formattedExpense = useMemo(() => `$${totalExpense.toFixed(2)}`, [totalExpense]);

  /* Memoize styles */
  const cardStyle = useMemo(
    () => [
      styles.card,
      isDarkMode ? styles.cardDark : styles.cardLight,
      styles.shadow,
    ],
    [isDarkMode],
  );

  const labelStyle = useMemo(
    () => [styles.label, {color: isDarkMode ? '#94A3B8' : '#64748B'}],
    [isDarkMode],
  );

  const balanceTextStyle = useMemo(
    () => [styles.balanceText, {color: isDarkMode ? '#F8FAFC' : '#0F172A'}],
    [isDarkMode],
  );

  const subLabelStyle = useMemo(
    () => [styles.subLabel, {color: isDarkMode ? '#94A3B8' : '#64748B'}],
    [isDarkMode],
  );

  return (
    <View style={cardStyle}>
      <View style={styles.balanceContainer}>
        <Text style={labelStyle}>Total Balance</Text>
        <Text style={balanceTextStyle}>{formattedBalance}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <View style={styles.iconIncome}>
            <Text style={styles.arrow}>↓</Text>
          </View>
          <View>
            <Text style={subLabelStyle}>Income</Text>
            <Text style={styles.incomeAmount}>{formattedIncome}</Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.iconExpense}>
            <Text style={styles.arrow}>↑</Text>
          </View>
          <View>
            <Text style={subLabelStyle}>Expense</Text>
            <Text style={styles.expenseAmount}>{formattedExpense}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  cardDark: {
    backgroundColor: '#1E293B',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 10,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceText: {
    fontSize: 36,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#EF4444',
  },
  iconIncome: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconExpense: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  arrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default memo(BalanceCard);
