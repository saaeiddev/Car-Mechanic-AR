package com.azadi.carmechanicar.storage

import android.content.Context

class AppStorage(context: Context) {
    private val prefs = context.getSharedPreferences("car_mechanic_ar", Context.MODE_PRIVATE)

    fun addFavorite(id: String) {
        val set = prefs.getStringSet(KEY_FAVORITES, emptySet())!!.toMutableSet()
        set.add(id)
        prefs.edit().putStringSet(KEY_FAVORITES, set).apply()
    }

    fun removeFavorite(id: String) {
        val set = prefs.getStringSet(KEY_FAVORITES, emptySet())!!.toMutableSet()
        set.remove(id)
        prefs.edit().putStringSet(KEY_FAVORITES, set).apply()
    }

    fun isFavorite(id: String): Boolean = prefs.getStringSet(KEY_FAVORITES, emptySet())!!.contains(id)
    fun favorites(): Set<String> = prefs.getStringSet(KEY_FAVORITES, emptySet()) ?: emptySet()

    fun addHistory(id: String) {
        val current = prefs.getString(KEY_HISTORY, "") ?: ""
        val updated = (listOf(id) + current.split("|").filter { it.isNotBlank() }).take(50)
        prefs.edit().putString(KEY_HISTORY, updated.joinToString("|")).apply()
    }

    fun history(): List<String> = (prefs.getString(KEY_HISTORY, "") ?: "")
        .split("|")
        .filter { it.isNotBlank() }

    fun setShowEnglish(enabled: Boolean) = prefs.edit().putBoolean(KEY_SHOW_ENGLISH, enabled).apply()
    fun showEnglish(): Boolean = prefs.getBoolean(KEY_SHOW_ENGLISH, true)
    fun setHaptics(enabled: Boolean) = prefs.edit().putBoolean(KEY_HAPTICS, enabled).apply()
    fun haptics(): Boolean = prefs.getBoolean(KEY_HAPTICS, true)

    companion object {
        private const val KEY_FAVORITES = "favorites"
        private const val KEY_HISTORY = "history"
        private const val KEY_SHOW_ENGLISH = "show_english"
        private const val KEY_HAPTICS = "haptics"
    }
}
