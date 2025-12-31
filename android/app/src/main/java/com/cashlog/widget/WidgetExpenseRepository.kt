package com.cashlog.widget

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

private const val DATABASE_NAME = "test.db"
private const val TABLE_NAME = "Expenses"

class WidgetExpenseRepository(context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, 1) {

  override fun onCreate(db: SQLiteDatabase) {
    createTable(db)
  }

  override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
    createTable(db)
  }

  fun addExpense(description: String, amount: Double): Boolean {
    return try {
      val db = writableDatabase
      createTable(db)
      ensureTypeColumn(db)
      val values = ContentValues().apply {
        put("description", description)
        put("amount", amount)
        put("date", isoTimestamp())
        put("type", "expense")
      }
      db.insert(TABLE_NAME, null, values) != -1L
    } catch (e: Exception) {
      false
    }
  }

  private fun createTable(db: SQLiteDatabase) {
    db.execSQL(
        """
        CREATE TABLE IF NOT EXISTS $TABLE_NAME (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            amount REAL,
            date TEXT,
            type TEXT DEFAULT 'expense'
        )
        """
            .trimIndent())
  }

  private fun ensureTypeColumn(db: SQLiteDatabase) {
    try {
      val cursor = db.rawQuery("PRAGMA table_info($TABLE_NAME)", null)
      var hasType = false
      cursor.use {
        if (it != null) {
          while (it.moveToNext()) {
            val nameIndex = it.getColumnIndex("name")
            if (nameIndex >= 0 && it.getString(nameIndex) == "type") {
              hasType = true
              break
            }
          }
        }
      }
      if (!hasType) {
        db.execSQL("ALTER TABLE $TABLE_NAME ADD COLUMN type TEXT DEFAULT 'expense'")
      }
    } catch (e: Exception) {
      // best-effort migration; ignore
    }
  }

  private fun isoTimestamp(): String {
    val formatter =
        SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
          timeZone = TimeZone.getTimeZone("UTC")
        }
    return formatter.format(Date())
  }
}
