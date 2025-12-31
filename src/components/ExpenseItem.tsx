import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';

type ExpenseItemProps = {
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  onDelete: () => void;
};

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  description,
  amount,
  date,
  type,
  onDelete,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const isExpense = type === 'expense';
  const formattedAmount = `${isExpense ? '-' : '+'}$${Math.abs(amount).toFixed(
    2,
  )}`;

  return (
    <View
      style={[
        styles.expenseItem,
        isDarkMode ? styles.cardDark : styles.cardLight,
        styles.shadow,
      ]}>
      <View style={styles.textBlock}>
        <Text
          style={[styles.title, {color: isDarkMode ? '#F3F4F6' : '#0F172A'}]}>
          {description}
        </Text>
        <Text style={{color: isDarkMode ? '#CBD5E1' : '#334155'}}>{date}</Text>
      </View>
      <View style={styles.buttons}>
        <Text
          style={[styles.amount, {color: isExpense ? '#EF4444' : '#22C55E'}]}>
          {formattedAmount}
        </Text>
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 6},
    elevation: 4,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
  },
  cardDark: {
    backgroundColor: '#0B1220',
  },
  cardLight: {
    backgroundColor: '#FFFFFF',
  },
  textBlock: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 12,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f00',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExpenseItem;
