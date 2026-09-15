plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }

android {
    namespace = "com.azadi.carmechanicar"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.azadi.carmechanicar"
        minSdk = 28
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildFeatures { viewBinding = false }
    kotlinOptions { jvmTarget = "17" }
}
