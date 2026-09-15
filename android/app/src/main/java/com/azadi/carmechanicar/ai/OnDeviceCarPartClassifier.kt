package com.azadi.carmechanicar.ai

import ai.onnxruntime.OnnxTensor
import ai.onnxruntime.OrtEnvironment
import ai.onnxruntime.OrtSession
import android.content.Context
import android.graphics.Bitmap
import android.media.Image
import com.azadi.carmechanicar.model.DetectedCarPart
import java.nio.FloatBuffer
import kotlin.math.exp

/** Real on-device AI classifier backed by an ONNX model bundled in assets. */
class OnDeviceCarPartClassifier(context: Context) : CarPartDetectionService, AutoCloseable {
    private val environment: OrtEnvironment = OrtEnvironment.getEnvironment()
    private val session: OrtSession
    private val labels: List<String>

    init {
        val modelBytes = context.assets.open(MODEL_FILE).use { it.readBytes() }
        session = environment.createSession(modelBytes, OrtSession.SessionOptions().apply {
            setOptimizationLevel(OrtSession.SessionOptions.OptLevel.ALL_OPT)
        })
        labels = context.assets.open(LABELS_FILE).bufferedReader().useLines { lines ->
            lines.map { it.trim() }.filter { it.isNotEmpty() }.toList()
        }
        require(labels.isNotEmpty()) { "No classifier labels found" }
    }

    override fun detect(image: Image): List<DetectedCarPart> {
        val bitmap = ImagePreprocessor.centerCropToBitmap(image, INPUT_SIZE)
        return classify(bitmap)?.let { result ->
            if (result.confidence < MIN_CONFIDENCE) emptyList()
            else listOf(DetectedCarPart(result.partId, 0.18f, 0.22f, 0.82f, 0.78f, result.confidence))
        } ?: emptyList()
    }

    fun classify(bitmap: Bitmap): PartClassification? {
        val input = ImagePreprocessor.toNormalizedCHW(bitmap, INPUT_SIZE)
        val inputName = session.inputNames.firstOrNull() ?: return null
        OnnxTensor.createTensor(environment, FloatBuffer.wrap(input), longArrayOf(1, 3, INPUT_SIZE.toLong(), INPUT_SIZE.toLong())).use { tensor ->
            session.run(mapOf(inputName to tensor)).use { results ->
                val scores = flattenScores(results[0].value) ?: return null
                if (scores.isEmpty()) return null
                val probabilities = if (looksLikeProbabilities(scores)) scores else softmax(scores)
                var bestIndex = 0
                var bestScore = probabilities[0]
                for (i in 1 until probabilities.size) if (probabilities[i] > bestScore) { bestIndex = i; bestScore = probabilities[i] }
                val label = labels.getOrNull(bestIndex) ?: return null
                val partId = MODEL_TO_APP_ID[label] ?: return null
                return PartClassification(label, partId, bestScore.coerceIn(0f, 1f))
            }
        }
    }

    private fun flattenScores(value: Any?): FloatArray? = when (value) {
        is Array<*> -> when (val first = value.firstOrNull()) {
            is FloatArray -> first
            is Array<*> -> first.firstOrNull() as? FloatArray
            else -> null
        }
        is FloatArray -> value
        else -> null
    }

    private fun looksLikeProbabilities(scores: FloatArray): Boolean {
        if (scores.any { it < 0f || it > 1.0001f }) return false
        return scores.sum() in 0.97f..1.03f
    }

    private fun softmax(logits: FloatArray): FloatArray {
        val max = logits.maxOrNull() ?: 0f
        val exps = FloatArray(logits.size)
        var sum = 0.0
        for (i in logits.indices) { val e = exp((logits[i] - max).toDouble()); exps[i] = e.toFloat(); sum += e }
        if (sum <= 0.0) return exps
        for (i in exps.indices) exps[i] = (exps[i] / sum).toFloat()
        return exps
    }

    override fun close() { session.close() }

    data class PartClassification(val modelLabel: String, val partId: String, val confidence: Float)

    companion object {
        const val MODEL_FILE = "car_parts_classifier.onnx"
        const val LABELS_FILE = "car_part_labels.txt"
        const val INPUT_SIZE = 224
        const val MIN_CONFIDENCE = 0.55f
        val MODEL_TO_APP_ID = mapOf(
            "cylinder_head" to "cylinder_head", "alternator" to "alternator", "clutch_plate" to "clutch_plate",
            "cylinder_block" to "engine", "piston" to "piston", "crankshaft" to "crankshaft",
            "camshaft" to "camshaft", "spark_plug" to "spark_plug", "radiator" to "radiator",
            "shock_absorbers" to "shock_absorber", "gear_box" to "transmission", "disc" to "brake_disc",
            "brake_pad" to "brake_pad", "battery_terminal" to "battery_terminal", "fuse_box" to "fuse_box",
            "carburetor" to "carburetor", "fuel_tank" to "fuel_tank", "brake_oil_reservoir" to "brake_fluid_reservoir"
        )
    }
}
