package com.cashlog.widget

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.cashlog.R

class AddExpenseWidgetActivity : AppCompatActivity() {

  private val repository by lazy { WidgetExpenseRepository(this) }
  private lateinit var descriptionInput: EditText
  private lateinit var amountInput: EditText

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_widget_quick_add)

    descriptionInput = findViewById(R.id.quick_add_description)
    amountInput = findViewById(R.id.quick_add_amount)

    findViewById<Button>(R.id.quick_add_save).setOnClickListener { saveExpense() }
    findViewById<Button>(R.id.quick_add_cancel).setOnClickListener { finish() }
  }

  private fun saveExpense() {
    val description = descriptionInput.text.toString().trim()
    val amountText = amountInput.text.toString().trim()

    if (description.isEmpty() || amountText.isEmpty()) {
      Toast.makeText(this, R.string.widget_input_error, Toast.LENGTH_SHORT).show()
      return
    }

    val amount = amountText.toDoubleOrNull()
    if (amount == null) {
      Toast.makeText(this, R.string.widget_amount_error, Toast.LENGTH_SHORT).show()
      return
    }

    Thread {
          val success = repository.addExpense(description, amount)
          runOnUiThread {
            if (success) {
              Toast.makeText(this, R.string.widget_saved_toast, Toast.LENGTH_SHORT).show()
              finish()
            } else {
              Toast.makeText(this, R.string.widget_error_toast, Toast.LENGTH_SHORT).show()
            }
          }
        }
        .start()
  }
}
