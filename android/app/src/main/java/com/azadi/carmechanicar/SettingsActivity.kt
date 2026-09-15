package com.azadi.carmechanicar
import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.widget.*
import com.azadi.carmechanicar.storage.AppStorage
import com.azadi.carmechanicar.util.Ui
class SettingsActivity:Activity(){override fun onCreate(b:Bundle?){super.onCreate(b);val s=AppStorage(this);val root=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(Ui.dp(context,16),Ui.dp(context,16),Ui.dp(context,16),Ui.dp(context,16));setBackgroundColor(Color.rgb(5,9,13))};root.addView(Ui.title(this,"تنظیمات",24f));root.addView(Ui.body(this,"مدل تشخیص: ONNX on-device AI",15f,Color.rgb(41,213,255)));fun cb(t:String,c:Boolean,f:(Boolean)->Unit)=CheckBox(this).apply{text=t;isChecked=c;setTextColor(Color.WHITE);setOnCheckedChangeListener{_,v->f(v)}};root.addView(cb("نمایش نام انگلیسی قطعات",s.showEnglish()){s.setShowEnglish(it)});root.addView(cb("لرزش هنگام شناسایی",s.haptics()){s.setHaptics(it)});root.addView(Ui.body(this,"پردازش دوربین روی دستگاه انجام می‌شود. مدل فعلی classifier است؛ کادر فیروزه‌ای راهنمای تمرکز است، نه Bounding Box مدل.",13f,Color.rgb(255,190,120)));root.addView(Ui.primaryButton(this,"بازگشت"){finish()});setContentView(root)}}
