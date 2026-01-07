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
import {Colors, getColor} from '../constants';

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
  const placeholderColor = getColor(Colors.input.placeholder, isDarkMode);
  const selectionColor = getColor(Colors.selection, isDarkMode);

  const cardStyle = useMemo(
    () => [
      styles.card,
      {backgroundColor: getColor(Colors.card, isDarkMode)},
      styles.shadow,
    ],
    [isDarkMode],
  );

  const inputStyle = useMemo(
    () => [
      styles.input,
      {
        backgroundColor: getColor(Colors.input.background, isDarkMode),
        borderColor: getColor(Colors.input.border, isDarkMode),
        color: getColor(Colors.text.primary, isDarkMode),
      },
    ],
    [isDarkMode],
  );

  /* Memoize toggle buttons to prevent recreation */
  const expenseToggleStyle = useMemo(() => {
    const selected = type === 'expense';
    return [
      styles.toggle,
      styles.toggleExpense,
      selected
        ? {backgroundColor: Colors.expense, borderColor: Colors.expense}
        : styles.toggleUnselected,
    ];
  }, [type]);

  const incomeToggleStyle = useMemo(() => {
    const selected = type === 'income';
    return [
      styles.toggle,
      selected
        ? {backgroundColor: Colors.income, borderColor: Colors.income}
        : styles.toggleUnselected,
    ];
  }, [type]);

  const expenseTextStyle = useMemo(() => [
    styles.toggleText,
    {color: type === 'expense' ? Colors.white : getColor(Colors.text.tertiary, isDarkMode)},
  ], [type, isDarkMode]);

  const incomeTextStyle = useMemo(() => [
    styles.toggleText,
    {color: type === 'income' ? Colors.white : getColor(Colors.text.tertiary, isDarkMode)},
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
          textColor={Colors.button.primary.text}
          backgroundColor={Colors.button.primary.background}
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
  shadow: {
    shadowColor: Colors.shadow,
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
    borderColor: Colors.transparent,
    backgroundColor: Colors.transparent,
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
  buttonRow: {
    marginTop: 8,
  },
  addButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(ExpenseForm);
