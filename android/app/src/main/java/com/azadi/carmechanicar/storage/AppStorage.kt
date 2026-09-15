package com.azadi.carmechanicar.storage

import android.content.Context

class AppStorage(context:Context){
 private val prefs=context.getSharedPreferences("car_mechanic_ar",Context.MODE_PRIVATE)
 fun addFavorite(id:String){val set=prefs.getStringSet("favorites",emptySet())!!.toMutableSet();set.add(id);prefs.edit().putStringSet("favorites",set).apply()}
 fun removeFavorite(id:String){val set=prefs.getStringSet("favorites",emptySet())!!.toMutableSet();set.remove(id);prefs.edit().putStringSet("favorites",set).apply()}
 fun isFavorite(id:String)=prefs.getStringSet("favorites",emptySet())!!.contains(id)
 fun favorites():Set<String> = prefs.getStringSet("favorites",emptySet())?:emptySet()
 fun addHistory(id:String){val current=prefs.getString("history","")?:"";val updated=(listOf(id)+current.split("|").filter{it.isNotBlank()}).take(50);prefs.edit().putString("history",updated.joinToString("|")).apply()}
 fun history():List<String>=(prefs.getString("history","")?:"").split("|").filter{it.isNotBlank()}
 fun setShowEnglish(enabled:Boolean)=prefs.edit().putBoolean("show_english",enabled).apply();fun showEnglish()=prefs.getBoolean("show_english",true)
 fun setHaptics(enabled:Boolean)=prefs.edit().putBoolean("haptics",enabled).apply();fun haptics()=prefs.getBoolean("haptics",true)
}
