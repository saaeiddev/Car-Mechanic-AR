package com.azadi.carmechanicar
import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.widget.*
import com.azadi.carmechanicar.data.PartRepository
import com.azadi.carmechanicar.util.Ui
class QuizActivity:Activity(){private var i=0;private var score=0;private val parts=PartRepository.parts.shuffled().take(8);private lateinit var root:LinearLayout;override fun onCreate(b:Bundle?){super.onCreate(b);root=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(Ui.dp(context,16),Ui.dp(context,16),Ui.dp(context,16),Ui.dp(context,16));setBackgroundColor(Color.rgb(5,9,13))};render();setContentView(root)};private fun render(){root.removeAllViews();if(i>=parts.size){root.addView(Ui.title(this,"نتیجه: $score از ${parts.size}",26f));root.addView(Ui.primaryButton(this,"پایان"){finish()});return};val target=parts[i];root.addView(Ui.title(this,"این قطعه چیست؟",24f));root.addView(Ui.body(this,target.shortDescription,16f,Color.LTGRAY));(listOf(target)+PartRepository.parts.filter{it.id!=target.id}.shuffled().take(3)).shuffled().forEach{o->root.addView(Ui.primaryButton(this,o.nameFa){if(o.id==target.id)score++;i++;render()},LinearLayout.LayoutParams(-1,-2).apply{topMargin=Ui.dp(this@QuizActivity,8)})}}}
