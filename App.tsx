import React, {useEffect, useState, useMemo, useCallback, memo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  StatusBar,
  useColorScheme,
  View,
  TouchableOpacity,
  AppState,
  AppStateStatus,
  Linking,
} from 'react-native';
import {
  getDBConnection,
  createExpensesTable,
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
  closeDB,
} from './database/database';
import ExpenseForm from './src/components/ExpenseForm';
import ExpenseItem from './src/components/ExpenseItem';
import BalanceCard from './src/components/BalanceCard';
import {Colors, getColor} from './src/constants';
import type {Expense} from './src/types/expense';

/* Memoized header component to prevent unnecessary re-renders */
const ListHeader = memo(
  ({
    isDarkMode,
    totalBalance,
    totalIncome,
    totalExpense,
    onAddExpense,
    onClearAll,
    defaultType,
    focusTrigger,
    hasTransactions,
  }: {
    isDarkMode: boolean;
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
    onAddExpense: (
      description: string,
      amount: string,
      type: 'income' | 'expense',
    ) => void;
    onClearAll: () => void;
    defaultType: 'income' | 'expense';
    focusTrigger: number;
    hasTransactions: boolean;
  }) => (
    <>
      <View style={styles.header}>
        <Text
          testID="app-title"
          style={[
            styles.title,
            {color: getColor(Colors.text.primary, isDarkMode)},
          ]}>
          Cashlog
        </Text>
      </View>

      <BalanceCard
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />

      <ExpenseForm
        onAddExpense={onAddExpense}
        initialType={defaultType}
        focusTrigger={focusTrigger}
      />

      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {color: getColor(Colors.text.secondary, isDarkMode)},
          ]}>
          Recent Transactions
        </Text>
        {hasTransactions && (
          <TouchableOpacity onPress={onClearAll}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  ),
);

function App(): React.JSX.Element {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [defaultType, setDefaultType] = useState<'income' | 'expense'>(
    'expense',
  );
  const [focusTrigger, setFocusTrigger] = useState(0);

  const isDarkMode = useColorScheme() === 'dark';

  /* Memoize background style to prevent object recreation */
  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: getColor(Colors.background, isDarkMode),
      flex: 1,
    }),
    [isDarkMode],
  );

  /* Memoize content container style */
  const contentContainerStyle = useMemo(() => ({paddingBottom: 40}), []);

  const loadData = useCallback(async () => {
    const db = await getDBConnection();
    await createExpensesTable(db);
    const allExpenses = await getExpenses(db);
    setExpenses(allExpenses);
    await closeDB(db);
  }, []);

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
  }, [loadData]);

  useEffect(() => {
    /* Parse type parameter from deep link URL (e.g. cashlog://add?type=income) */
    const parseTypeFromUrl = (
      url?: string | null,
    ): 'income' | 'expense' | null => {
      if (!url) {
        return null;
      }

      /* Extract query string manually since URL() and URLSearchParams don't work in Hermes */
      const queryIndex = url.indexOf('?');
      if (queryIndex === -1) {
        return null;
      }

      const queryString = url.substring(queryIndex + 1);
      const pairs = queryString.split('&');

      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key === 'type' && (value === 'income' || value === 'expense')) {
          return value;
        }
      }

      return null;
    };

    const handleDeepLink = (event: {url: string}) => {
      const type = parseTypeFromUrl(event.url);
      if (type) {
        setDefaultType(type);
        setFocusTrigger(Date.now());
      }
    };

    Linking.getInitialURL().then(url => {
      const type = parseTypeFromUrl(url);
      if (type) {
        setDefaultType(type);
        setFocusTrigger(Date.now());
      }
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  /* Memoize handlers to prevent child re-renders */
  const handleAddOrUpdateExpense = useCallback(
    async (description: string, amount: string, type: 'income' | 'expense') => {
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
      setExpenses(allExpenses);
      await closeDB(db);
    },
    [editId],
  );

  const handleDeleteExpense = useCallback(async (id: number) => {
    const db = await getDBConnection();
    await deleteExpense(db, id);
    const allExpenses = await getExpenses(db);
    setExpenses(allExpenses);
    await closeDB(db);
  }, []);

  const handleClearAll = useCallback(async () => {
    const db = await getDBConnection();
    await deleteAllExpenses(db);
    setExpenses([]);
    await closeDB(db);
  }, []);

  /* Memoize computed values */
  const {totalIncome, totalExpense, totalBalance} = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (let i = 0; i < expenses.length; i++) {
      if (expenses[i].type === 'income') {
        income += expenses[i].amount;
      } else {
        expense += expenses[i].amount;
      }
    }
    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: income - expense,
    };
  }, [expenses]);

  /* Memoize renderItem to prevent recreation on each render */
  const renderItem = useCallback(
    ({item}: {item: Expense}) => (
      <ExpenseItem
        id={item.id}
        description={item.description}
        amount={item.amount}
        date={item.date}
        type={item.type}
        onDelete={handleDeleteExpense}
      />
    ),
    [handleDeleteExpense],
  );

  /* Memoize keyExtractor */
  const keyExtractor = useCallback((item: Expense) => item.id.toString(), []);

  /* Memoize header component */
  const listHeaderComponent = useMemo(
    () => (
      <ListHeader
        isDarkMode={isDarkMode}
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        onAddExpense={handleAddOrUpdateExpense}
        onClearAll={handleClearAll}
        defaultType={defaultType}
        focusTrigger={focusTrigger}
        hasTransactions={expenses.length > 0}
      />
    ),
    [
      isDarkMode,
      totalBalance,
      totalIncome,
      totalExpense,
      handleAddOrUpdateExpense,
      handleClearAll,
      defaultType,
      focusTrigger,
      expenses.length,
    ],
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.screen}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <FlatList
          testID="transaction-list"
          data={expenses}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeaderComponent}
          contentContainerStyle={contentContainerStyle}
          showsVerticalScrollIndicator={false}
          /* Performance optimizations */
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={10}
          updateCellsBatchingPeriod={50}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.expense,
  },
});

export default App;
