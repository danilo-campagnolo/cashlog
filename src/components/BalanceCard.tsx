import React from 'react';
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

  return (
    <View
      style={[
        styles.card,
        isDarkMode ? styles.cardDark : styles.cardLight,
        styles.shadow,
      ]}>
      <View style={styles.balanceContainer}>
        <Text
          style={[styles.label, {color: isDarkMode ? '#94A3B8' : '#64748B'}]}>
          Total Balance
        </Text>
        <Text
          style={[
            styles.balanceText,
            {color: isDarkMode ? '#F8FAFC' : '#0F172A'},
          ]}>
          ${totalBalance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.column}>
          <View style={styles.iconIncome}>
            <Text style={styles.arrow}>↓</Text>
          </View>
          <View>
            <Text
              style={[
                styles.subLabel,
                {color: isDarkMode ? '#94A3B8' : '#64748B'},
              ]}>
              Income
            </Text>
            <Text style={[styles.amount, {color: '#22C55E'}]}>
              ${totalIncome.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.iconExpense}>
            <Text style={styles.arrow}>↑</Text>
          </View>
          <View>
            <Text
              style={[
                styles.subLabel,
                {color: isDarkMode ? '#94A3B8' : '#64748B'},
              ]}>
              Expense
            </Text>
            <Text style={[styles.amount, {color: '#EF4444'}]}>
              ${totalExpense.toFixed(2)}
            </Text>
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
    justifyContent: 'center', // Center content in column
  },
  subLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
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

export default BalanceCard;
