package com.cashlog.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.cashlog.R

class CashlogWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(
      context: Context,
      appWidgetManager: AppWidgetManager,
      appWidgetIds: IntArray
  ) {
    for (appWidgetId in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.cashlog_widget)
      val intent =
          Intent(context, AddExpenseWidgetActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
          }

      val pendingIntent =
          PendingIntent.getActivity(
              context,
              appWidgetId,
              intent,
              PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)

      views.setOnClickPendingIntent(R.id.widget_add_button, pendingIntent)
      appWidgetManager.updateAppWidget(appWidgetId, views)
    }
  }
}
