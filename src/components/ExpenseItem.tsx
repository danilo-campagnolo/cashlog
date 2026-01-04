import React, {memo, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';

type ExpenseItemProps = {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  onDelete: (id: number) => void;
};

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  id,
  description,
  amount,
  date,
  type,
  onDelete,
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const isExpense = type === 'expense';

  /* Memoize formatted values */
  const formattedAmount = useMemo(
    () => `${isExpense ? '-' : '+'}$${Math.abs(amount).toFixed(2)}`,
    [isExpense, amount],
  );

  const formattedDate = useMemo(
    () => new Date(date).toLocaleDateString(),
    [date],
  );

  /* Memoize delete handler to avoid creating new function on each render */
  const handleDelete = useCallback(() => {
    onDelete(id);
  }, [onDelete, id]);

  /* Memoize styles that depend on theme */
  const cardStyle = useMemo(
    () => [
      styles.expenseItem,
      isDarkMode ? styles.cardDark : styles.cardLight,
      styles.shadow,
    ],
    [isDarkMode],
  );

  const titleStyle = useMemo(
    () => [styles.title, {color: isDarkMode ? '#F3F4F6' : '#0F172A'}],
    [isDarkMode],
  );

  const dateStyle = useMemo(
    () => ({color: isDarkMode ? '#CBD5E1' : '#334155'}),
    [isDarkMode],
  );

  const amountStyle = useMemo(
    () => [styles.amount, {color: isExpense ? '#EF4444' : '#22C55E'}],
    [isExpense],
  );

  return (
    <View style={cardStyle}>
      <View style={styles.textBlock}>
        <Text style={titleStyle}>{description}</Text>
        <Text style={dateStyle}>{formattedDate}</Text>
      </View>
      <View style={styles.buttons}>
        <Text style={amountStyle}>{formattedAmount}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
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

/* Use React.memo to prevent re-renders when props haven't changed */
export default memo(ExpenseItem);
