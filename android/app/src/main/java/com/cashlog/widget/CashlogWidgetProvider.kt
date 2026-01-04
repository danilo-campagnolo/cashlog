package com.cashlog.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.cashlog.R
import com.cashlog.MainActivity

class CashlogWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(
      context: Context,
      appWidgetManager: AppWidgetManager,
      appWidgetIds: IntArray
  ) {
    for (appWidgetId in appWidgetIds) {
      updateWidget(context, appWidgetManager, appWidgetId)
    }
  }

  private fun updateWidget(
      context: Context,
      appWidgetManager: AppWidgetManager,
      appWidgetId: Int
  ) {
    val views = RemoteViews(context.packageName, R.layout.cashlog_widget)

    /* Expense button intent */
    val expenseIntent = Intent(context, MainActivity::class.java).apply {
      action = Intent.ACTION_VIEW
      data = Uri.parse("cashlog://add?type=expense")
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
    val expensePendingIntent = PendingIntent.getActivity(
        context,
        appWidgetId * 2,
        expenseIntent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    views.setOnClickPendingIntent(R.id.widget_add_expense_button, expensePendingIntent)

    /* Income button intent */
    val incomeIntent = Intent(context, MainActivity::class.java).apply {
      action = Intent.ACTION_VIEW
      data = Uri.parse("cashlog://add?type=income")
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
    val incomePendingIntent = PendingIntent.getActivity(
        context,
        appWidgetId * 2 + 1,
        incomeIntent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    views.setOnClickPendingIntent(R.id.widget_add_income_button, incomePendingIntent)

    appWidgetManager.updateAppWidget(appWidgetId, views)
  }
}
