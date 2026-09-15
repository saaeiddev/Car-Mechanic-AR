plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }

android {
    namespace = "com.azadi.carmechanicar"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.azadi.carmechanicar"
        minSdk = 28
        targetSdk = 35
        versionCode = 2
        versionName = "1.1.0-real-ai"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures { viewBinding = false }

    packaging {
        resources.excludes += setOf("META-INF/INDEX.LIST", "META-INF/DEPENDENCIES")
    }
}

dependencies {
    implementation("com.microsoft.onnxruntime:onnxruntime-android:1.20.0")
}
