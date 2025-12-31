import React, {useEffect, useState, useMemo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  StatusBar,
  useColorScheme,
  View,
  AppState,
  AppStateStatus,
} from 'react-native';
import {
  getDBConnection,
  createExpensesTable,
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  closeDB,
} from './database/database';
import ExpenseForm from './src/components/ExpenseForm';
import ExpenseItem from './src/components/ExpenseItem';
import BalanceCard from './src/components/BalanceCard';
import type {Expense} from './src/types/expense';

function App(): React.JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const loadData = async () => {
    const db = await getDBConnection();
    await createExpensesTable(db);
    const allExpenses = await getExpenses(db);
    // Sort by id descending (newest first)
    setExpenses(allExpenses.reverse());
    await closeDB(db);
  };

  useEffect(() => {
    loadData();

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        loadData();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAddOrUpdateExpense = async (
    description: string,
    amount: string,
    type: 'income' | 'expense',
  ) => {
    const db = await getDBConnection();
    const parsedAmount = parseFloat(amount);
    if (editId !== null) {
      await updateExpense(
        db,
        editId,
        description,
        parsedAmount,
        new Date().toISOString(),
        type,
      );
      setEditId(null);
    } else {
      await addExpense(
        db,
        description,
        parsedAmount,
        new Date().toISOString(),
        type,
      );
    }
    const allExpenses = await getExpenses(db);
    setExpenses(allExpenses.reverse());
    await closeDB(db);
  };

  const handleDeleteExpense = async (id: number) => {
    const db = await getDBConnection();
    await deleteExpense(db, id);
    const allExpenses = await getExpenses(db);
    setExpenses(allExpenses.reverse());
    await closeDB(db);
  };

  const {totalIncome, totalExpense, totalBalance} = useMemo(() => {
    let income = 0;
    let expense = 0;
    expenses.forEach(item => {
      if (item.type === 'income') {
        income += item.amount;
      } else {
        expense += item.amount;
      }
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: income - expense,
    };
  }, [expenses]);

  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#0F172A' : '#F1F5F9',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.screen}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <FlatList
          contentContainerStyle={{paddingBottom: 40}}
          data={expenses}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text
                  style={[
                    styles.title,
                    {color: isDarkMode ? '#E5E7EB' : '#0F172A'},
                  ]}>
                  Cashlog
                </Text>
              </View>

              <BalanceCard
                totalBalance={totalBalance}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
              />

              <ExpenseForm onAddExpense={handleAddOrUpdateExpense} />

              <Text
                style={[
                  styles.sectionTitle,
                  {color: isDarkMode ? '#CBD5E1' : '#334155'},
                ]}>
                Recent Transactions
              </Text>
            </>
          }
          renderItem={({item}) => (
            <ExpenseItem
              description={item.description}
              amount={item.amount}
              date={new Date(item.date).toLocaleDateString()}
              type={item.type}
              onDelete={() => handleDeleteExpense(item.id)}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
});

export default App;
