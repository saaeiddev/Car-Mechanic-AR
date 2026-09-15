package com.azadi.carmechanicar

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.ViewGroup
import android.widget.*
import com.azadi.carmechanicar.data.PartRepository
import com.azadi.carmechanicar.model.CarPart
import com.azadi.carmechanicar.storage.AppStorage
import com.azadi.carmechanicar.util.Ui

class PartListActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.rgb(5, 9, 13)
        val mode = intent.getStringExtra("mode") ?: "learning"
        val storage = AppStorage(this)

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(Ui.dp(context, 16), Ui.dp(context, 16), Ui.dp(context, 16), Ui.dp(context, 16))
            setBackgroundColor(Color.rgb(5, 9, 13))
        }
        val title = when (mode) {
            "favorites" -> "علاقه‌مندی‌ها"
            "history" -> "تاریخچه شناسایی"
            else -> "آموزش‌ها و قطعات"
        }
        root.addView(Ui.title(this, title, 24f))

        val search = EditText(this).apply {
            hint = "جستجوی قطعه"
            setTextColor(Color.WHITE)
            setHintTextColor(Color.rgb(140, 170, 180))
            background = Ui.rounded(context, Color.argb(200, 12, 26, 34), Color.rgb(41, 213, 255), 1, 14)
            setPadding(Ui.dp(context, 14), Ui.dp(context, 10), Ui.dp(context, 14), Ui.dp(context, 10))
        }
        root.addView(search, LinearLayout.LayoutParams(-1, -2).apply {
            bottomMargin = Ui.dp(this@PartListActivity, 14)
        })

        val scroll = ScrollView(this)
        val listRoot = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        scroll.addView(listRoot)
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        root.addView(Ui.primaryButton(this, "بازگشت") { finish() }, ViewGroup.LayoutParams(-1, -2))

        fun source(): List<CarPart> = when (mode) {
            "favorites" -> PartRepository.parts.filter { storage.favorites().contains(it.id) }
            "history" -> storage.history().mapNotNull { id -> PartRepository.byId(id) }.distinctBy { it.id }
            else -> PartRepository.parts
        }

        fun render(items: List<CarPart>) {
            listRoot.removeAllViews()
            if (items.isEmpty()) listRoot.addView(Ui.body(this, "موردی وجود ندارد."))
            items.forEach { part ->
                val card = LinearLayout(this).apply {
                    orientation = LinearLayout.VERTICAL
                    setPadding(Ui.dp(context, 14), Ui.dp(context, 14), Ui.dp(context, 14), Ui.dp(context, 14))
                    background = Ui.rounded(context, Color.argb(210, 7, 20, 29), Color.rgb(41, 213, 255), 1, 16)
                    addView(Ui.title(context, part.nameFa, 18f))
                    addView(Ui.body(context, "${part.nameEn} • ${part.category}", 13f, Color.rgb(160, 210, 220)))
                    addView(Ui.body(context, part.shortDescription, 14f))
                    setOnClickListener {
                        startActivity(Intent(this@PartListActivity, PartDetailActivity::class.java).putExtra("partId", part.id))
                    }
                }
                listRoot.addView(card, LinearLayout.LayoutParams(-1, -2).apply {
                    bottomMargin = Ui.dp(this@PartListActivity, 10)
                })
            }
        }

        render(source())
        search.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                val q = s?.toString().orEmpty()
                render(source().filter {
                    it.nameFa.contains(q) || it.nameEn.contains(q, true) || it.category.contains(q)
                })
            }
        })
        setContentView(root)
    }
}
