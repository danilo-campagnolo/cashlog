import React, {useState, useEffect, memo, useCallback, useMemo} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Text,
} from 'react-native';
import CustomButton from './CustomButton';

interface ExpenseFormProps {
  onAddExpense: (
    description: string,
    amount: string,
    type: 'income' | 'expense',
  ) => void;
  initialType?: 'income' | 'expense';
  editExpense?: {
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
  };
}

const TOGGLE_OPTIONS = ['expense', 'income'] as const;

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onAddExpense,
  initialType = 'expense',
  editExpense,
}) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    if (editExpense) {
      setDescription(editExpense.description);
      setAmount(editExpense.amount.toString());
      setType(editExpense.type ?? 'expense');
    }
  }, [editExpense]);

  useEffect(() => {
    if (!editExpense) {
      setType(initialType);
    }
  }, [initialType, editExpense]);

  const handleAddExpense = useCallback(() => {
    if (description.trim() && amount.trim()) {
      onAddExpense(description.trim(), amount.trim(), type);
      setDescription('');
      setAmount('');
      setType(initialType);
    }
  }, [description, amount, type, onAddExpense, initialType]);

  const handleSetExpense = useCallback(() => setType('expense'), []);
  const handleSetIncome = useCallback(() => setType('income'), []);

  /* Memoize styles */
  const placeholderColor = isDarkMode ? '#64748B' : '#94A3B8';
  const selectionColor = isDarkMode ? '#F97316' : '#0F172A';

  const cardStyle = useMemo(
    () => [
      styles.card,
      isDarkMode ? styles.cardDark : styles.cardLight,
      styles.shadow,
    ],
    [isDarkMode],
  );

  const inputStyle = useMemo(
    () => [styles.input, isDarkMode ? styles.inputDark : styles.inputLight],
    [isDarkMode],
  );

  const buttonBackgroundColor = isDarkMode ? '#0F172A' : '#0F172A';

  /* Memoize toggle buttons to prevent recreation */
  const expenseToggleStyle = useMemo(() => {
    const selected = type === 'expense';
    return [
      styles.toggle,
      styles.toggleExpense,
      selected
        ? {backgroundColor: '#EF4444', borderColor: '#EF4444'}
        : styles.toggleUnselected,
    ];
  }, [type]);

  const incomeToggleStyle = useMemo(() => {
    const selected = type === 'income';
    return [
      styles.toggle,
      selected
        ? {backgroundColor: '#22C55E', borderColor: '#22C55E'}
        : styles.toggleUnselected,
    ];
  }, [type]);

  const expenseTextStyle = useMemo(() => [
    styles.toggleText,
    {color: type === 'expense' ? '#fff' : isDarkMode ? '#CBD5E1' : '#64748B'},
  ], [type, isDarkMode]);

  const incomeTextStyle = useMemo(() => [
    styles.toggleText,
    {color: type === 'income' ? '#fff' : isDarkMode ? '#CBD5E1' : '#64748B'},
  ], [type, isDarkMode]);

  return (
    <View style={cardStyle}>
      <View style={styles.toggleRow}>
        <TouchableOpacity style={expenseToggleStyle} onPress={handleSetExpense}>
          <Text style={expenseTextStyle}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity style={incomeToggleStyle} onPress={handleSetIncome}>
          <Text style={incomeTextStyle}>Income</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={inputStyle}
          value={description}
          placeholder="What is this for?"
          placeholderTextColor={placeholderColor}
          selectionColor={selectionColor}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={inputStyle}
          value={amount}
          placeholder="0.00"
          placeholderTextColor={placeholderColor}
          selectionColor={selectionColor}
          keyboardType="numeric"
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.buttonRow}>
        <CustomButton
          title="Add Transaction"
          onPress={handleAddExpense}
          textColor="#FFF"
          backgroundColor={buttonBackgroundColor}
          style={styles.addButton}
        />
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
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggle: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleExpense: {
    marginRight: 12,
  },
  toggleUnselected: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontWeight: '700',
    fontSize: 15,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 56,
    borderWidth: 1,
    paddingHorizontal: 16,
    borderRadius: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  inputDark: {
    borderColor: '#334155',
    color: '#F8FAFC',
    backgroundColor: '#0F172A',
  },
  inputLight: {
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
  },
  buttonRow: {
    marginTop: 8,
  },
  addButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
  },
});

export default memo(ExpenseForm);
