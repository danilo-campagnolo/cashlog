import SQLite from 'react-native-sqlite-storage';
import type {Expense} from '../src/types/expense';

SQLite.enablePromise(true);

const database_name = 'test.db';
// const database_version = '1.0';
// const database_displayname = 'SQLite Test Database';
// const database_size = 200000;

export const getDBConnection = async () => {
  return SQLite.openDatabase({
    name: database_name,
    location: 'default',
  });
};

export const createExpensesTable = async (db: SQLite.SQLiteDatabase) => {
  const query = `
  CREATE TABLE IF NOT EXISTS Expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      amount REAL,
      date TEXT,
      type TEXT DEFAULT 'expense'
  );`;
  await db.executeSql(query);
  await ensureTypeColumn(db);
};

const ensureTypeColumn = async (db: SQLite.SQLiteDatabase) => {
  const results = await db.executeSql('PRAGMA table_info(Expenses)');
  const columns = results?.[0]?.rows ?? null;
  let hasType = false;
  if (columns) {
    for (let i = 0; i < columns.length; i++) {
      const column = columns.item(i);
      if (column?.name === 'type') {
        hasType = true;
        break;
      }
    }
  }
  if (!hasType) {
    await db.executeSql(
      "ALTER TABLE Expenses ADD COLUMN type TEXT DEFAULT 'expense'",
    );
  }
};

export const addExpense = async (
  db: SQLite.SQLiteDatabase,
  description: string,
  amount: number,
  date: string,
  type: 'income' | 'expense',
) => {
  await ensureTypeColumn(db);
  const query =
    'INSERT INTO Expenses (description, amount, date, type) VALUES (?, ?, ?, ?)';
  await db.executeSql(query, [description, amount, date, type]);
};

export const getExpenses = async (
  db: SQLite.SQLiteDatabase,
): Promise<Expense[]> => {
  const query = 'SELECT * FROM Expenses';
  const results = await db.executeSql(query);
  let expenses: Expense[] = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows.item(i);
      expenses.push({
        ...row,
        amount: Number(row.amount),
        type: (row.type as 'income' | 'expense') ?? 'expense',
      });
    }
  });
  return expenses;
};

export const updateExpense = async (
  db: SQLite.SQLiteDatabase,
  id: number,
  description: string,
  amount: number,
  date: string,
  type: 'income' | 'expense',
) => {
  await ensureTypeColumn(db);
  const query =
    'UPDATE Expenses SET description = ?, amount = ?, date = ?, type = ? WHERE id = ?';
  await db.executeSql(query, [description, amount, date, type, id]);
};

export const deleteExpense = async (db: SQLite.SQLiteDatabase, id: number) => {
  const query = 'DELETE FROM Expenses WHERE id = ?';
  await db.executeSql(query, [id]);
};

export const closeDB = async (db: SQLite.SQLiteDatabase) => {
  await db.close();
};
