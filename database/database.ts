import SQLite from 'react-native-sqlite-storage';
import type {Expense} from '../src/types/expense';

SQLite.enablePromise(true);

const DATABASE_NAME = 'test.db';

/* Singleton database connection */
let dbInstance: SQLite.SQLiteDatabase | null = null;
let expensesTableInitialized = false;
let descriptionsTableInitialized = false;

export const getDBConnection = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabase({
    name: DATABASE_NAME,
    location: 'default',
  });

  return dbInstance;
};

export const createExpensesTable = async (db: SQLite.SQLiteDatabase) => {
  if (expensesTableInitialized) {
    return;
  }

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
  expensesTableInitialized = true;
};

export const createDescriptionsTable = async (db: SQLite.SQLiteDatabase) => {
  if (descriptionsTableInitialized) {
    return;
  }

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS Descriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT UNIQUE NOT NULL,
      count INTEGER NOT NULL DEFAULT 1
    )
  `);

  /* Seed from existing Expenses on first creation */
  const countResult = await db.executeSql(
    'SELECT COUNT(*) as cnt FROM Descriptions',
  );
  const existingCount = countResult[0].rows.item(0).cnt as number;
  if (existingCount === 0) {
    await db.executeSql(`
      INSERT OR IGNORE INTO Descriptions (description, count)
      SELECT description, COUNT(*) FROM Expenses GROUP BY description
    `);
  }

  descriptionsTableInitialized = true;
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
  const query =
    'INSERT INTO Expenses (description, amount, date, type) VALUES (?, ?, ?, ?)';
  await db.executeSql(query, [description, amount, date, type]);
};

export const getExpenses = async (
  db: SQLite.SQLiteDatabase,
): Promise<Expense[]> => {
  /* Order by id DESC in SQL to avoid reversing in JS */
  const query = 'SELECT * FROM Expenses ORDER BY id DESC';
  const results = await db.executeSql(query);
  const expenses: Expense[] = [];

  if (results.length > 0) {
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      const row = rows.item(i);
      expenses.push({
        id: row.id,
        description: row.description,
        amount: Number(row.amount),
        date: row.date,
        type: (row.type as 'income' | 'expense') ?? 'expense',
      });
    }
  }

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
  const query =
    'UPDATE Expenses SET description = ?, amount = ?, date = ?, type = ? WHERE id = ?';
  await db.executeSql(query, [description, amount, date, type, id]);
};

export const deleteExpense = async (db: SQLite.SQLiteDatabase, id: number) => {
  const query = 'DELETE FROM Expenses WHERE id = ?';
  await db.executeSql(query, [id]);
};

export const deleteAllExpenses = async (db: SQLite.SQLiteDatabase) => {
  await db.executeSql('DELETE FROM Expenses');
};

/* Upsert: insert with count=1 if new, otherwise increment */
export const incrementDescription = async (
  db: SQLite.SQLiteDatabase,
  description: string,
) => {
  await db.executeSql(
    'INSERT OR IGNORE INTO Descriptions (description, count) VALUES (?, 0)',
    [description],
  );
  await db.executeSql(
    'UPDATE Descriptions SET count = count + 1 WHERE description = ?',
    [description],
  );
};

export const getTopDescriptions = async (
  db: SQLite.SQLiteDatabase,
  limit: number = 10,
): Promise<string[]> => {
  const results = await db.executeSql(
    'SELECT description FROM Descriptions ORDER BY count DESC LIMIT ?',
    [limit],
  );
  const descriptions: string[] = [];
  if (results.length > 0) {
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      descriptions.push(rows.item(i).description as string);
    }
  }
  return descriptions;
};

/* No-op: connection is kept open as singleton */
export const closeDB = async (_db: SQLite.SQLiteDatabase) => {
  /* Do nothing - we keep the connection open for the app lifetime */
};
