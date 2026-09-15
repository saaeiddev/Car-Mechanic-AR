package com.azadi.carmechanicar.ui

import android.content.Context
import android.graphics.*
import android.view.MotionEvent
import android.view.View
import com.azadi.carmechanicar.data.PartRepository
import com.azadi.carmechanicar.model.DetectedCarPart
import kotlin.math.abs

class AROverlayView(context: Context) : View(context) {
    var detections: List<DetectedCarPart> = emptyList(); set(value){ field=value; invalidate() }
    var selectedId: String? = null; set(value){ field=value; invalidate() }
    var onPartTap: ((String)->Unit)? = null
    private val cyan = Color.rgb(41,213,255)
    private val boxPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { style=Paint.Style.STROKE; strokeWidth=3f; color=cyan }
    private val fillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { style=Paint.Style.FILL; color=Color.argb(28,41,213,255) }
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color=Color.WHITE; textSize=34f; typeface=Typeface.create(Typeface.DEFAULT,Typeface.BOLD) }
    private val bgPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply { color=Color.argb(185,4,22,30) }

    override fun onDraw(c: Canvas) {
        super.onDraw(c)
        detections.forEach { d ->
            val r=RectF(d.left*width,d.top*height,d.right*width,d.bottom*height)
            boxPaint.strokeWidth=if(d.partId==selectedId) 6f else 2.5f
            fillPaint.color=Color.argb(if(d.partId==selectedId)55 else 18,41,213,255)
            c.drawRoundRect(r,22f,22f,fillPaint); c.drawRoundRect(r,22f,22f,boxPaint)
            val p=PartRepository.byId(d.partId) ?: return@forEach
            val tw=textPaint.measureText(p.nameFa)+56
            val label=RectF(r.centerX()-tw/2,r.top-58,r.centerX()+tw/2,r.top-8)
            c.drawRoundRect(label,22f,22f,bgPaint); c.drawRoundRect(label,22f,22f,boxPaint)
            c.drawText(p.nameFa,label.left+28,label.bottom-14,textPaint)
            c.drawLine(label.centerX(),label.bottom,r.centerX(),r.top,boxPaint)
        }
    }

    override fun onTouchEvent(e: MotionEvent): Boolean {
        if(e.action==MotionEvent.ACTION_UP){
            val nx=e.x/width; val ny=e.y/height
            detections.minByOrNull{ abs((it.left+it.right)/2-nx)+abs((it.top+it.bottom)/2-ny) }?.let { d ->
                if(nx in d.left..d.right && ny in d.top..d.bottom){ selectedId=d.partId; onPartTap?.invoke(d.partId); return true }
            }
        }
        return true
    }
}
