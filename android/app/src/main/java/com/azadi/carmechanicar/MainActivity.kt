package com.azadi.carmechanicar

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.view.Gravity
import android.view.TextureView
import android.widget.*
import com.azadi.carmechanicar.ai.DemoCarPartDetector
import com.azadi.carmechanicar.camera.CameraController
import com.azadi.carmechanicar.data.PartRepository
import com.azadi.carmechanicar.ui.AROverlayView

class MainActivity : Activity() {
    private lateinit var texture: TextureView
    private lateinit var overlay: AROverlayView
    private var controller: CameraController?=null
    private lateinit var root: FrameLayout
    private lateinit var sheet: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor=Color.TRANSPARENT; window.navigationBarColor=Color.rgb(5,9,13)
        root=FrameLayout(this); texture=TextureView(this); overlay=AROverlayView(this)
        root.addView(texture,FrameLayout.LayoutParams(-1,-1)); root.addView(overlay,FrameLayout.LayoutParams(-1,-1))
        root.addView(buildTopUi()); sheet=buildSheet(); root.addView(sheet); setContentView(root)
        overlay.onPartTap={ id -> showPart(id) }
        if(checkSelfPermission(Manifest.permission.CAMERA)==PackageManager.PERMISSION_GRANTED) startCamera() else requestPermissions(arrayOf(Manifest.permission.CAMERA),42)
    }

    private fun startCamera(){ controller=CameraController(this,texture,DemoCarPartDetector()){ overlay.detections=it }; controller?.start() }
    override fun onRequestPermissionsResult(r:Int,p:Array<out String>,g:IntArray){super.onRequestPermissionsResult(r,p,g);if(r==42&&g.firstOrNull()==PackageManager.PERMISSION_GRANTED)startCamera() else Toast.makeText(this,"برای شناسایی قطعات خودرو، دسترسی دوربین لازم است.",Toast.LENGTH_LONG).show()}
    override fun onDestroy(){controller?.stop();super.onDestroy()}

    private fun buildTopUi(): FrameLayout {
        val frame=FrameLayout(this); val lp=FrameLayout.LayoutParams(-1,dp(170)); lp.gravity=Gravity.TOP; frame.layoutParams=lp
        val title=TextView(this).apply{text="مکانیک با واقعیت افزوده\nآموزش • شناسایی • تجربه واقعی";setTextColor(Color.WHITE);textSize=18f;gravity=Gravity.CENTER;setTypeface(typeface,Typeface.BOLD);setPadding(20,40,20,10)}
        frame.addView(title,FrameLayout.LayoutParams(-1,dp(100)))
        val card=TextView(this).apply{text="⌗  دوربین را روی قطعه بگیرید\nتا اطلاعات آن نمایش داده شود";setTextColor(Color.WHITE);textSize=15f;gravity=Gravity.CENTER;background=rounded(Color.argb(185,5,28,38),Color.rgb(41,213,255),2f)}
        frame.addView(card,FrameLayout.LayoutParams(dp(310),dp(70),Gravity.CENTER_HORIZONTAL or Gravity.BOTTOM)); return frame
    }

    private fun buildSheet(): LinearLayout {
        val l=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(dp(18),dp(14),dp(18),dp(16));background=rounded(Color.argb(225,4,19,27),Color.rgb(41,213,255),2f);visibility=LinearLayout.GONE}
        val lp=FrameLayout.LayoutParams(-1,dp(220),Gravity.BOTTOM); lp.setMargins(dp(12),0,dp(12),dp(88)); l.layoutParams=lp
        return l
    }

    private fun showPart(id:String){ val p=PartRepository.byId(id)?:return; overlay.selectedId=id; sheet.removeAllViews(); sheet.visibility=LinearLayout.VISIBLE
        fun tv(text:String,size:Float,bold:Boolean=false)=TextView(this).apply{this.text=text;setTextColor(Color.WHITE);textSize=size;gravity=Gravity.RIGHT;if(bold)setTypeface(typeface,Typeface.BOLD);setPadding(4,4,4,4)}
        sheet.addView(tv("${p.nameFa}   ${p.nameEn}",24f,true)); sheet.addView(tv(p.shortDescription,15f));
        val row=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL;gravity=Gravity.CENTER}; listOf("اطلاعات بیشتر","مشاهده سه‌بعدی","ویدئوی آموزشی").forEach{ label -> row.addView(Button(this).apply{text=label;setTextColor(Color.WHITE);background=rounded(Color.argb(90,20,70,85),Color.rgb(41,213,255),1.5f)},LinearLayout.LayoutParams(0,dp(52),1f)) }; sheet.addView(row)
    }

    private fun rounded(fill:Int,stroke:Int,w:Float)=android.graphics.drawable.GradientDrawable().apply{shape=android.graphics.drawable.GradientDrawable.RECTANGLE;cornerRadius=dp(18).toFloat();setColor(fill);setStroke(dp(w.toInt().coerceAtLeast(1)),stroke)}
    private fun dp(v:Int)=(v*resources.displayMetrics.density).toInt()
}
