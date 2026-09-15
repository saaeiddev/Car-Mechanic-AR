package com.azadi.carmechanicar.ai

import android.media.Image
import com.azadi.carmechanicar.model.DetectedCarPart

class DemoCarPartDetector : CarPartDetectionService {
    override fun detect(image: Image): List<DetectedCarPart> = listOf(
        DetectedCarPart("engine", .30f,.32f,.70f,.62f,.95f),
        DetectedCarPart("battery", .72f,.40f,.91f,.56f,.92f),
        DetectedCarPart("air_filter", .07f,.42f,.25f,.57f,.89f),
        DetectedCarPart("radiator", .34f,.68f,.76f,.86f,.87f),
        DetectedCarPart("spark_plug", .61f,.43f,.72f,.51f,.84f),
        DetectedCarPart("brake_disc", .06f,.65f,.22f,.85f,.81f)
    )
}
