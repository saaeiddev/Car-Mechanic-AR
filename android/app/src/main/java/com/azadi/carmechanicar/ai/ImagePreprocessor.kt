package com.azadi.carmechanicar.ai

import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.Matrix
import android.media.Image
import kotlin.math.min

object ImagePreprocessor {
    private val mean = floatArrayOf(0.485f, 0.456f, 0.406f)
    private val std = floatArrayOf(0.229f, 0.224f, 0.225f)

    fun centerCropToBitmap(image: Image, outputSize: Int): Bitmap {
        val width = image.width; val height = image.height
        val cropSize = (min(width, height) * 0.82f).toInt().coerceAtLeast(2)
        val left = ((width - cropSize) / 2).coerceAtLeast(0); val top = ((height - cropSize) / 2).coerceAtLeast(0)
        val yPlane = image.planes[0]; val uPlane = image.planes[1]; val vPlane = image.planes[2]
        val yBuffer = yPlane.buffer; val uBuffer = uPlane.buffer; val vBuffer = vPlane.buffer
        val pixels = IntArray(outputSize * outputSize)
        for (oy in 0 until outputSize) {
            val sy = (top + ((oy + 0.5f) * cropSize / outputSize).toInt()).coerceIn(0, height - 1)
            for (ox in 0 until outputSize) {
                val sx = (left + ((ox + 0.5f) * cropSize / outputSize).toInt()).coerceIn(0, width - 1)
                val yIndex = sy * yPlane.rowStride + sx * yPlane.pixelStride
                val uvX = sx / 2; val uvY = sy / 2
                val uIndex = uvY * uPlane.rowStride + uvX * uPlane.pixelStride
                val vIndex = uvY * vPlane.rowStride + uvX * vPlane.pixelStride
                val y = yBuffer.get(yIndex).toInt() and 0xFF; val u = uBuffer.get(uIndex).toInt() and 0xFF; val v = vBuffer.get(vIndex).toInt() and 0xFF
                pixels[oy * outputSize + ox] = yuvToRgb(y, u, v)
            }
        }
        val sensorBitmap = Bitmap.createBitmap(pixels, outputSize, outputSize, Bitmap.Config.ARGB_8888)
        val matrix = Matrix().apply { postRotate(90f) }
        val rotated = Bitmap.createBitmap(sensorBitmap, 0, 0, sensorBitmap.width, sensorBitmap.height, matrix, true)
        if (rotated !== sensorBitmap) sensorBitmap.recycle()
        return rotated
    }

    fun toNormalizedCHW(bitmap: Bitmap, size: Int): FloatArray {
        val square = centerCropBitmap(bitmap)
        val resized = if (square.width == size && square.height == size) square else Bitmap.createScaledBitmap(square, size, size, true)
        val pixels = IntArray(size * size); resized.getPixels(pixels, 0, size, 0, 0, size, size)
        val output = FloatArray(3 * size * size); val plane = size * size
        for (i in pixels.indices) {
            val color = pixels[i]; val r = Color.red(color) / 255f; val g = Color.green(color) / 255f; val b = Color.blue(color) / 255f
            output[i] = (r - mean[0]) / std[0]; output[plane + i] = (g - mean[1]) / std[1]; output[2 * plane + i] = (b - mean[2]) / std[2]
        }
        if (square !== bitmap && !square.isRecycled) square.recycle(); if (resized !== square && !resized.isRecycled) resized.recycle()
        return output
    }

    private fun centerCropBitmap(bitmap: Bitmap): Bitmap {
        if (bitmap.width == bitmap.height) return bitmap
        val size = min(bitmap.width, bitmap.height); val x = (bitmap.width - size) / 2; val y = (bitmap.height - size) / 2
        return Bitmap.createBitmap(bitmap, x, y, size, size)
    }

    private fun yuvToRgb(y: Int, u: Int, v: Int): Int {
        var c = y - 16; val d = u - 128; val e = v - 128; if (c < 0) c = 0
        val r = ((298*c + 409*e + 128) shr 8).coerceIn(0,255); val g = ((298*c - 100*d - 208*e + 128) shr 8).coerceIn(0,255); val b = ((298*c + 516*d + 128) shr 8).coerceIn(0,255)
        return Color.rgb(r,g,b)
    }
}
