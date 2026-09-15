package com.azadi.carmechanicar.ai

import android.media.Image
import com.azadi.carmechanicar.model.DetectedCarPart

interface CarPartDetectionService {
    fun detect(image: Image): List<DetectedCarPart>
}
