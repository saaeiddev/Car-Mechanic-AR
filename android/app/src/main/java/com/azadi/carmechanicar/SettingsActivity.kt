package com.azadi.carmechanicar

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.widget.CheckBox
import android.widget.LinearLayout
import com.azadi.carmechanicar.storage.AppStorage
import com.azadi.carmechanicar.util.Ui

class SettingsActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.rgb(5, 9, 13)
        val storage = AppStorage(this)
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(Ui.dp(context, 16), Ui.dp(context, 16), Ui.dp(context, 16), Ui.dp(context, 16))
            setBackgroundColor(Color.rgb(5, 9, 13))
        }
        root.addView(Ui.title(this, "تنظیمات", 24f))
        root.addView(Ui.body(this, "مدل تشخیص: ONNX on-device AI", 15f, Color.rgb(41, 213, 255)))
        root.addView(Ui.body(this, "تصاویر دوربین برای تشخیص قطعه به سرور ارسال نمی‌شوند.", 13f, Color.rgb(170, 210, 220)))

        fun checkBox(text: String, checked: Boolean, onChanged: (Boolean) -> Unit): CheckBox = CheckBox(this).apply {
            this.text = text
            isChecked = checked
            setTextColor(Color.WHITE)
            setOnCheckedChangeListener { _, value -> onChanged(value) }
        }

        root.addView(checkBox("نمایش نام انگلیسی قطعات", storage.showEnglish()) { value ->
            storage.setShowEnglish(value)
        })
        root.addView(checkBox("لرزش هنگام شناسایی", storage.haptics()) { value ->
            storage.setHaptics(value)
        })
        root.addView(Ui.body(this, "مدل فعلی قطعه نزدیک مرکز تصویر را طبقه‌بندی می‌کند؛ کادر فیروزه‌ای راهنمای تمرکز است و Bounding Box پیش‌بینی‌شده مدل نیست.", 13f, Color.rgb(255, 190, 120)))
        root.addView(Ui.primaryButton(this, "بازگشت") { finish() }, LinearLayout.LayoutParams(-1, -2).apply {
            topMargin = Ui.dp(this@SettingsActivity, 20)
        })
        setContentView(root)
    }
}
