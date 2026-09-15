import SwiftUI

struct SettingsView: View {
    @Environment(PreferencesStore.self) private var prefs
    var body: some View {
        @Bindable var prefs = prefs
        NavigationStack {
            Form {
                Section("تشخیص") { Picker("حالت مدل", selection:$prefs.detectionMode) { Text("Demo").tag(DetectionMode.demo); Text("Production Core ML").tag(DetectionMode.production) }; Picker("کیفیت AR",selection:$prefs.arQuality){Text("بالا").tag("بالا");Text("متعادل").tag("متعادل")} }
                Section("رابط کاربری") { Toggle("صدا",isOn:$prefs.soundEnabled); Toggle("لرزش",isOn:$prefs.hapticsEnabled); Toggle("نمایش نام انگلیسی قطعات",isOn:$prefs.showEnglishNames) }
                Section("حریم خصوصی") { Text("پردازش دوربین به‌صورت محلی انجام می‌شود. هیچ فریمی به‌طور پیش‌فرض آپلود نمی‌شود.") }
            }.navigationTitle("تنظیمات")
        }
    }
}
