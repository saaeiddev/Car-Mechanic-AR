package com.azadi.carmechanicar.ai

import android.media.Image
import com.azadi.carmechanicar.model.DetectedCarPart

class UnavailableCarPartDetector : CarPartDetectionService {
    override fun detect(image: Image): List<DetectedCarPart> = emptyList()
}
