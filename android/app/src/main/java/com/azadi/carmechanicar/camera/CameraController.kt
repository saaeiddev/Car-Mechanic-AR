package com.azadi.carmechanicar.camera

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Context
import android.graphics.SurfaceTexture
import android.hardware.camera2.*
import android.media.ImageReader
import android.os.Handler
import android.os.HandlerThread
import android.os.Looper
import android.util.Size
import android.view.Surface
import android.view.TextureView
import com.azadi.carmechanicar.ai.CarPartDetectionService
import com.azadi.carmechanicar.model.DetectedCarPart

class CameraController(private val activity: Activity, private val textureView: TextureView, private val detector: CarPartDetectionService, private val onDetections:(List<DetectedCarPart>)->Unit) {
    private val thread=HandlerThread("CameraThread").apply{start()}; private val handler=Handler(thread.looper); private val mainHandler=Handler(Looper.getMainLooper())
    private var device:CameraDevice?=null; private var session:CameraCaptureSession?=null; private var reader:ImageReader?=null
    @Volatile private var lastInference=0L; @Volatile private var busy=false
    private val recentDetections=ArrayDeque<DetectedCarPart>(); private var lastPublished:DetectedCarPart?=null; private var lastPublishedAt=0L

    @SuppressLint("MissingPermission") fun start(){ if(!textureView.isAvailable){ textureView.surfaceTextureListener=object:TextureView.SurfaceTextureListener{ override fun onSurfaceTextureAvailable(s:SurfaceTexture,w:Int,h:Int){open()}; override fun onSurfaceTextureSizeChanged(s:SurfaceTexture,w:Int,h:Int){}; override fun onSurfaceTextureDestroyed(s:SurfaceTexture)=true; override fun onSurfaceTextureUpdated(s:SurfaceTexture){} }; return }; open() }
    @SuppressLint("MissingPermission") private fun open(){ val manager=activity.getSystemService(Context.CAMERA_SERVICE) as CameraManager; val id=manager.cameraIdList.firstOrNull{manager.getCameraCharacteristics(it).get(CameraCharacteristics.LENS_FACING)==CameraCharacteristics.LENS_FACING_BACK}?:return; manager.openCamera(id,object:CameraDevice.StateCallback(){override fun onOpened(c:CameraDevice){device=c;createSession()};override fun onDisconnected(c:CameraDevice){c.close()};override fun onError(c:CameraDevice,e:Int){c.close()}},handler) }
    private fun createSession(){ val size=Size(1280,720); reader=ImageReader.newInstance(size.width,size.height,android.graphics.ImageFormat.YUV_420_888,2); reader?.setOnImageAvailableListener({r-> val image=r.acquireLatestImage()?:return@setOnImageAvailableListener; val now=System.currentTimeMillis(); if(!busy&&now-lastInference>170){busy=true;lastInference=now;try{val stable=stabilize(detector.detect(image),now);mainHandler.post{onDetections(stable)}}finally{image.close();busy=false}}else image.close()},handler); val st=textureView.surfaceTexture?:return;st.setDefaultBufferSize(size.width,size.height);val preview=Surface(st);val analysis=reader!!.surface;device?.createCaptureSession(listOf(preview,analysis),object:CameraCaptureSession.StateCallback(){override fun onConfigured(s:CameraCaptureSession){session=s;val req=device!!.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW).apply{addTarget(preview);addTarget(analysis);set(CaptureRequest.CONTROL_AF_MODE,CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_PICTURE)}.build();s.setRepeatingRequest(req,null,handler)};override fun onConfigureFailed(s:CameraCaptureSession){}},handler) }
    private fun stabilize(result:List<DetectedCarPart>,now:Long):List<DetectedCarPart>{val candidate=result.firstOrNull();if(candidate!=null){recentDetections.addLast(candidate);while(recentDetections.size>5)recentDetections.removeFirst();val winner=recentDetections.groupBy{it.partId}.maxByOrNull{it.value.size};if(winner!=null&&winner.value.size>=2){val best=winner.value.maxByOrNull{it.confidence}?:candidate;lastPublished=best.copy(confidence=winner.value.map{it.confidence}.average().toFloat());lastPublishedAt=now;return listOf(lastPublished!!)};if(lastPublished!=null&&now-lastPublishedAt<900)return listOf(lastPublished!!);return emptyList()};if(lastPublished!=null&&now-lastPublishedAt<900)return listOf(lastPublished!!);recentDetections.clear();lastPublished=null;return emptyList()}
    fun stop(){session?.close();device?.close();reader?.close();(detector as? AutoCloseable)?.close();thread.quitSafely()}
}
