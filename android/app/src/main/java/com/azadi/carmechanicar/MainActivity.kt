package com.azadi.carmechanicar

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.Gravity
import android.view.TextureView
import android.widget.*
import com.azadi.carmechanicar.ai.OnDeviceCarPartClassifier
import com.azadi.carmechanicar.ai.UnavailableCarPartDetector
import com.azadi.carmechanicar.camera.CameraController
import com.azadi.carmechanicar.data.PartRepository
import com.azadi.carmechanicar.storage.AppStorage
import com.azadi.carmechanicar.ui.AROverlayView
import com.azadi.carmechanicar.util.Ui

class MainActivity : Activity() {
    private lateinit var texture: TextureView
    private lateinit var overlay: AROverlayView
    private var controller: CameraController? = null
    private lateinit var root: FrameLayout
    private lateinit var sheet: LinearLayout
    private val storage by lazy { AppStorage(this) }
    private var selectedPartId: String? = null
    private lateinit var scanStatus: TextView
    private var realAiReady = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.rgb(5, 9, 13)

        root = FrameLayout(this)
        texture = TextureView(this)
        overlay = AROverlayView(this)
        root.addView(texture, FrameLayout.LayoutParams(-1, -1))
        root.addView(overlay, FrameLayout.LayoutParams(-1, -1))
        root.addView(buildTopUi())
        root.addView(buildQuickMenu())
        sheet = buildSheet()
        root.addView(sheet)
        root.addView(buildBottomBar())
        setContentView(root)

        overlay.onPartTap = { id -> showPart(id) }
        if (checkSelfPermission(Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            startCamera()
        } else {
            requestPermissions(arrayOf(Manifest.permission.CAMERA), 42)
        }
    }

    private fun startCamera() {
        val detector = try {
            OnDeviceCarPartClassifier(this).also {
                realAiReady = true
                scanStatus.text = "AI واقعی فعال • قطعه را داخل کادر مرکزی نگه دارید"
            }
        } catch (e: Exception) {
            realAiReady = false
            scanStatus.text = "مدل AI در این Build موجود نیست"
            Toast.makeText(this, "مدل تشخیص واقعی در APK موجود نیست.", Toast.LENGTH_LONG).show()
            UnavailableCarPartDetector()
        }

        controller = CameraController(this, texture, detector) { detections ->
            overlay.detections = detections
            if (realAiReady) {
                scanStatus.text = if (detections.isEmpty()) {
                    "قطعه را نزدیک‌تر و داخل کادر مرکزی نگه دارید"
                } else {
                    val detection = detections.first()
                    val partName = PartRepository.byId(detection.partId)?.nameFa ?: detection.partId
                    val confidence = (detection.confidence * 100).toInt()
                    "شناسایی واقعی: $partName • $confidence٪"
                }
            }
        }
        controller?.start()
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 42 && grantResults.firstOrNull() == PackageManager.PERMISSION_GRANTED) {
            startCamera()
        } else {
            Toast.makeText(this, "برای شناسایی قطعات خودرو، دسترسی دوربین لازم است.", Toast.LENGTH_LONG).show()
        }
    }

    override fun onDestroy() {
        controller?.stop()
        super.onDestroy()
    }

    private fun buildTopUi(): FrameLayout {
        val frame = FrameLayout(this)
        frame.layoutParams = FrameLayout.LayoutParams(-1, Ui.dp(this, 190), Gravity.TOP)

        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(Ui.dp(context, 16), Ui.dp(context, 34), Ui.dp(context, 16), 0)
        }
        row.addView(Ui.primaryButton(this, "☰") { openMenuDialog() }, LinearLayout.LayoutParams(Ui.dp(this, 54), Ui.dp(this, 46)))

        val center = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
        }
        center.addView(TextView(this).apply {
            text = "مکانیک با واقعیت افزوده"
            setTextColor(Color.WHITE)
            textSize = 20f
            gravity = Gravity.CENTER
            setTypeface(typeface, Typeface.BOLD)
        })
        center.addView(TextView(this).apply {
            text = "آموزش • شناسایی • AI واقعی"
            setTextColor(Color.rgb(200, 220, 228))
            textSize = 13f
            gravity = Gravity.CENTER
        })
        row.addView(center, LinearLayout.LayoutParams(0, -2, 1f))
        row.addView(Ui.primaryButton(this, "AI On-device"), LinearLayout.LayoutParams(-2, Ui.dp(this, 46)))
        frame.addView(row)

        scanStatus = TextView(this).apply {
            text = "در حال آماده‌سازی مدل AI…"
            setTextColor(Color.WHITE)
            textSize = 14f
            gravity = Gravity.CENTER
            background = Ui.rounded(context, Color.argb(200, 5, 28, 38), Color.rgb(41, 213, 255), 1, 18)
            setPadding(Ui.dp(context, 18), Ui.dp(context, 12), Ui.dp(context, 18), Ui.dp(context, 12))
        }
        frame.addView(scanStatus, FrameLayout.LayoutParams(Ui.dp(this, 330), -2, Gravity.CENTER_HORIZONTAL or Gravity.BOTTOM))
        return frame
    }

    private fun buildQuickMenu(): HorizontalScrollView {
        val scroll = HorizontalScrollView(this).apply {
            isHorizontalScrollBarEnabled = false
            setPadding(Ui.dp(context, 10), 0, Ui.dp(context, 10), 0)
        }
        val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        fun add(text: String, click: () -> Unit) {
            row.addView(Ui.primaryButton(this, text, click), LinearLayout.LayoutParams(-2, -2).apply {
                rightMargin = Ui.dp(this@MainActivity, 8)
            })
        }
        add("آموزش‌ها") { openList("learning") }
        add("آزمون") { startActivity(Intent(this, QuizActivity::class.java)) }
        add("تاریخچه") { openList("history") }
        add("علاقه‌مندی‌ها") { openList("favorites") }
        add("گالری AI") { startActivity(Intent(this, GalleryAnalysisActivity::class.java)) }
        add("تنظیمات") { startActivity(Intent(this, SettingsActivity::class.java)) }
        scroll.addView(row)
        scroll.layoutParams = FrameLayout.LayoutParams(-1, -2, Gravity.TOP).apply {
            topMargin = Ui.dp(this@MainActivity, 200)
        }
        return scroll
    }

    private fun buildSheet(): LinearLayout {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(Ui.dp(context, 18), Ui.dp(context, 14), Ui.dp(context, 18), Ui.dp(context, 16))
            background = Ui.rounded(context, Color.argb(225, 4, 19, 27), Color.rgb(41, 213, 255), 1, 22)
            visibility = LinearLayout.GONE
            layoutParams = FrameLayout.LayoutParams(-1, Ui.dp(context, 260), Gravity.BOTTOM).apply {
                setMargins(Ui.dp(context, 12), 0, Ui.dp(context, 12), Ui.dp(context, 94))
            }
        }
    }

    private fun buildBottomBar(): LinearLayout {
        return LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(Ui.dp(context, 16), Ui.dp(context, 10), Ui.dp(context, 16), Ui.dp(context, 18))
            background = Ui.rounded(context, Color.argb(190, 5, 16, 22), Color.rgb(41, 213, 255), 1, 24)
            addView(TextView(context).apply {
                text = "Focus"
                setTextColor(Color.WHITE)
            }, LinearLayout.LayoutParams(0, -2, 1f))
            addView(TextView(context).apply {
                text = "تشخیص AI واقعی"
                setTextColor(Color.rgb(41, 213, 255))
                gravity = Gravity.CENTER
                setTypeface(typeface, Typeface.BOLD)
            }, LinearLayout.LayoutParams(0, -2, 1f))
            addView(TextView(context).apply {
                text = "On-device"
                setTextColor(Color.WHITE)
                gravity = Gravity.RIGHT
            }, LinearLayout.LayoutParams(0, -2, 1f))
            layoutParams = FrameLayout.LayoutParams(-1, -2, Gravity.BOTTOM).apply {
                setMargins(Ui.dp(context, 12), 0, Ui.dp(context, 12), Ui.dp(context, 12))
            }
        }
    }

    private fun showPart(id: String) {
        val part = PartRepository.byId(id) ?: return
        selectedPartId = id
        overlay.selectedId = id
        storage.addHistory(id)

        if (storage.haptics()) {
            (getSystemService(VIBRATOR_SERVICE) as? Vibrator)?.vibrate(VibrationEffect.createOneShot(28, 70))
        }

        sheet.removeAllViews()
        sheet.visibility = LinearLayout.VISIBLE
        sheet.addView(Ui.title(this, part.nameFa, 24f))
        if (storage.showEnglish()) {
            sheet.addView(Ui.body(this, part.nameEn, 13f, Color.rgb(160, 210, 220)))
        }
        sheet.addView(Ui.body(this, part.shortDescription, 14f))
        sheet.addView(Ui.body(this, "وظیفه: ${part.function}", 13f, Color.rgb(210, 230, 236)))

        val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        row.addView(Ui.primaryButton(this, "اطلاعات بیشتر") {
            startActivity(Intent(this, PartDetailActivity::class.java).putExtra("partId", id))
        }, LinearLayout.LayoutParams(0, Ui.dp(this, 48), 1f))
        row.addView(Ui.primaryButton(this, "سه‌بعدی") {
            startActivity(Intent(this, ModelViewerActivity::class.java).putExtra("partId", id))
        }, LinearLayout.LayoutParams(0, Ui.dp(this, 48), 1f))
        sheet.addView(row)

        sheet.addView(Ui.primaryButton(this, if (storage.isFavorite(id)) "حذف از علاقه‌مندی‌ها" else "افزودن به علاقه‌مندی‌ها") {
            if (storage.isFavorite(id)) storage.removeFavorite(id) else storage.addFavorite(id)
            showPart(id)
        })
    }

    private fun openList(mode: String) {
        startActivity(Intent(this, PartListActivity::class.java).putExtra("mode", mode))
    }

    private fun openMenuDialog() {
        val items = arrayOf("تشخیص AI", "آموزش‌ها", "مدل سه‌بعدی", "آزمون", "تاریخچه", "علاقه‌مندی‌ها", "گالری AI", "تنظیمات", "درباره برنامه")
        android.app.AlertDialog.Builder(this)
            .setTitle("منو")
            .setItems(items) { _, which ->
                when (which) {
                    1 -> openList("learning")
                    2 -> startActivity(Intent(this, ModelViewerActivity::class.java).putExtra("partId", selectedPartId ?: "engine"))
                    3 -> startActivity(Intent(this, QuizActivity::class.java))
                    4 -> openList("history")
                    5 -> openList("favorites")
                    6 -> startActivity(Intent(this, GalleryAnalysisActivity::class.java))
                    7 -> startActivity(Intent(this, SettingsActivity::class.java))
                    8 -> startActivity(Intent(this, AboutActivity::class.java))
                }
            }
            .setNegativeButton("بستن", null)
            .show()
    }
}
