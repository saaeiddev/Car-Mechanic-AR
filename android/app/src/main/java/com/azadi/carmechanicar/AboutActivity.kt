package com.azadi.carmechanicar
import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.widget.LinearLayout
import com.azadi.carmechanicar.util.Ui
class AboutActivity:Activity(){override fun onCreate(b:Bundle?){super.onCreate(b);val root=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(Ui.dp(context,16),Ui.dp(context,16),Ui.dp(context,16),Ui.dp(context,24));setBackgroundColor(Color.rgb(5,9,13))};root.addView(Ui.title(this,"درباره برنامه",24f));root.addView(Ui.body(this,"مکانیک AR از یک مدل واقعی on-device برای شناسایی قطعات مکانیکی پشتیبانی‌شده استفاده می‌کند."));root.addView(Ui.body(this,"این برنامه آموزشی است و جایگزین تعمیرکار حرفه‌ای نیست.",14f,Color.rgb(255,150,110)));root.addView(Ui.primaryButton(this,"بازگشت"){finish()});setContentView(root)}}
