package com.azadi.carmechanicar.util

import android.app.Activity
import android.content.Context
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.widget.*

object Ui{
 fun dp(context:Context,value:Int)=(value*context.resources.displayMetrics.density).toInt()
 fun rounded(context:Context,fill:Int,stroke:Int,strokeDp:Int=1,radiusDp:Int=18)=GradientDrawable().apply{shape=GradientDrawable.RECTANGLE;cornerRadius=dp(context,radiusDp).toFloat();setColor(fill);setStroke(dp(context,strokeDp),stroke)}
 fun title(context:Context,text:String,size:Float=22f)=TextView(context).apply{this.text=text;setTextColor(Color.WHITE);textSize=size;gravity=Gravity.RIGHT;setTypeface(typeface,Typeface.BOLD)}
 fun body(context:Context,text:String,size:Float=15f,color:Int=Color.WHITE)=TextView(context).apply{this.text=text;setTextColor(color);textSize=size;gravity=Gravity.RIGHT}
 fun primaryButton(context:Context,text:String,onClick:(()->Unit)?=null)=Button(context).apply{this.text=text;setTextColor(Color.WHITE);background=rounded(context,Color.argb(100,20,60,75),Color.rgb(41,213,255),1,14);onClick?.let{setOnClickListener{it()}}}
 fun toast(activity:Activity,text:String)=Toast.makeText(activity,text,Toast.LENGTH_SHORT).show()
}
