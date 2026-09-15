package com.azadi.carmechanicar
import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.widget.*
import com.azadi.carmechanicar.data.PartRepository
import com.azadi.carmechanicar.util.Ui
class ModelViewerActivity:Activity(){override fun onCreate(b:Bundle?){super.onCreate(b);val id=intent.getStringExtra("partId")?:"engine";val p=PartRepository.byId(id);val root=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(Ui.dp(context,16),Ui.dp(context,16),Ui.dp(context,16),Ui.dp(context,20));setBackgroundColor(Color.rgb(5,9,13))};root.addView(Ui.title(this,"مشاهده سه‌بعدی",24f));root.addView(Ui.body(this,"${p?.nameFa?:id} • زیرساخت مدل سه‌بعدی آماده است",15f,Color.LTGRAY));root.addView(TextView(this).apply{text="مدل GLB/Sceneform نهایی در این Build باندل نشده است.";setTextColor(Color.WHITE);textSize=18f;gravity=Gravity.CENTER;minHeight=Ui.dp(context,320);background=Ui.rounded(context,Color.argb(220,9,22,33),Color.rgb(41,213,255),1,22)});root.addView(Ui.primaryButton(this,"بازگشت"){finish()});setContentView(root)}}
