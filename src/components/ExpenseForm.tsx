import React, {useState, useEffect} from 'react';
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
  editExpense?: {
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
  };
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onAddExpense,
  editExpense,
}) => {
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  useEffect(() => {
    if (editExpense) {
      setDescription(editExpense.description);
      setAmount(editExpense.amount.toString());
      setType(editExpense.type ?? 'expense');
    }
  }, [editExpense]);

  const handleAddExpense = () => {
    if (description.trim() && amount.trim()) {
      onAddExpense(description.trim(), amount.trim(), type);
      setDescription('');
      setAmount('');
      setType('expense');
    }
  };

  const isDarkMode = useColorScheme() === 'dark';
  const placeholderColor = isDarkMode ? '#64748B' : '#94A3B8';

  return (
    <View
      style={[
        styles.card,
        isDarkMode ? styles.cardDark : styles.cardLight,
        styles.shadow,
      ]}>
      <View style={styles.toggleRow}>
        {['expense', 'income'].map(option => {
          const selected = type === option;
          const isExpense = option === 'expense';
          const activeColor = isExpense ? '#EF4444' : '#22C55E';

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.toggle,
                {marginRight: isExpense ? 12 : 0},
                selected
                  ? {backgroundColor: activeColor, borderColor: activeColor}
                  : styles.toggleUnselected,
              ]}
              onPress={() => setType(option as 'income' | 'expense')}>
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: selected
                      ? '#fff'
                      : isDarkMode
                      ? '#CBD5E1'
                      : '#64748B',
                  },
                ]}>
                {isExpense ? 'Expense' : 'Income'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            isDarkMode ? styles.inputDark : styles.inputLight,
          ]}
          value={description}
          placeholder="What is this for?"
          placeholderTextColor={placeholderColor}
          selectionColor={isDarkMode ? '#F97316' : '#0F172A'}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            isDarkMode ? styles.inputDark : styles.inputLight,
          ]}
          value={amount}
          placeholder="0.00"
          placeholderTextColor={placeholderColor}
          selectionColor={isDarkMode ? '#F97316' : '#0F172A'}
          keyboardType="numeric"
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.buttonRow}>
        <CustomButton
          title="Add Transaction"
          onPress={handleAddExpense}
          textColor="#FFF"
          backgroundColor={isDarkMode ? '#0F172A' : '#0F172A'}
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

export default ExpenseForm;
