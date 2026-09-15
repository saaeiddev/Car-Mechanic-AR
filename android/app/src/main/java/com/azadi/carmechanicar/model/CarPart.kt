package com.azadi.carmechanicar.model

data class CarPart(
    val id: String,
    val nameFa: String,
    val nameEn: String,
    val category: String,
    val shortDescription: String,
    val function: String,
    val location: String,
    val safetyWarning: String? = null
)

data class DetectedCarPart(
    val partId: String,
    val left: Float,
    val top: Float,
    val right: Float,
    val bottom: Float,
    val confidence: Float,
    val timestamp: Long = System.currentTimeMillis()
)
