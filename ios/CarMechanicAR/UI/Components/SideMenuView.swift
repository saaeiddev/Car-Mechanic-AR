import SwiftUI

struct SideMenuView: View {
    @Environment(AppState.self) private var appState
    let items: [(String,String,MainTab)] = [
        ("تشخیص AR","viewfinder",.scanner),("آموزش‌ها","book",.learning),("مدل‌های سه‌بعدی","cube",.models),("آزمون","checkmark.circle",.quiz),("تاریخچه","clock",.history),("علاقه‌مندی‌ها","heart",.favorites),("تنظیمات","gearshape",.settings)
    ]
    var body: some View {
        VStack(alignment:.trailing,spacing:10) {
            Text("مکانیک AR").font(.title2.bold()).padding(.bottom,12)
            ForEach(items,id:\.0){ item in Button { appState.selectedTab=item.2; withAnimation{appState.showMenu=false} } label:{ HStack{ Text(item.0); Spacer(); Image(systemName:item.1).foregroundStyle(Theme.cyan) }.padding(12).background(appState.selectedTab == item.2 ? Theme.cyan.opacity(0.12):.clear,in:RoundedRectangle(cornerRadius:14)) }.foregroundStyle(.white) }
            Spacer()
            Text("این برنامه جایگزین تشخیص تعمیرکار حرفه‌ای نیست.").font(.caption2).foregroundStyle(.secondary)
        }.padding(20).frame(width:300,maxHeight:.infinity).background(.ultraThinMaterial).overlay(alignment:.leading){Rectangle().fill(Color.white.opacity(0.08)).frame(width:1)}
    }
}
