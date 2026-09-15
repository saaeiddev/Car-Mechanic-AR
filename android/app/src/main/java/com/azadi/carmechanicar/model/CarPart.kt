package com.azadi.carmechanicar.model

data class CarPart(
    val id: String,
    val nameFa: String,
    val nameEn: String,
    val category: String,
    val shortDescription: String,
    val fullDescription: String,
    val function: String,
    val location: String,
    val commonSymptoms: List<String> = emptyList(),
    val maintenanceTips: List<String> = emptyList(),
    val safetyWarning: String? = null,
    val relatedParts: List<String> = emptyList()
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
