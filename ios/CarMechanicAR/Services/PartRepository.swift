import Foundation
import Observation

@Observable
final class PartRepository: CarPartRepositoryProtocol {
    static let shared = PartRepository()
    let all: [CarPart]

    private init() {
        all = Self.makeParts()
    }

    func part(id: String) -> CarPart? { all.first { $0.id == id } }

    func search(_ query: String) -> [CarPart] {
        guard !query.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return all }
        let q = query.lowercased()
        return all.filter { $0.nameFa.contains(q) || $0.nameEn.lowercased().contains(q) || $0.category.contains(q) }
    }

    private static func p(_ id: String, _ fa: String, _ en: String, _ category: String, _ short: String, _ function: String, _ location: String, symptoms: [String] = [], tips: [String] = [], safety: String? = nil, related: [String] = []) -> CarPart {
        CarPart(id: id, nameFa: fa, nameEn: en, category: category, shortDescription: short, fullDescription: short + " این بخش یکی از اجزای مهم خودرو است و شناخت عملکرد آن به درک بهتر سامانه‌های مکانیکی و برقی خودرو کمک می‌کند.", function: function, location: location, commonSymptoms: symptoms, maintenanceTips: tips, difficultyLevel: "متوسط", safetyWarning: safety, imageName: id, model3DName: id + ".usdz", videoURL: nil, relatedParts: related)
    }

    private static func makeParts() -> [CarPart] {
        let hot = "پیش از بررسی، خودرو را خاموش کنید و از تماس با قطعات داغ یا متحرک خودداری کنید."
        return [
            p("engine","موتور","Engine","موتور","موتور قلب تپنده خودرو است و با تبدیل انرژی به نیروی مکانیکی باعث حرکت خودرو می‌شود.","تبدیل انرژی سوخت یا برق به نیروی مکانیکی مورد نیاز برای حرکت خودرو.","معمولاً در محفظه موتور در بخش جلوی خودرو قرار دارد.", symptoms:["کاهش توان","صدای غیرعادی","افزایش مصرف"], tips:["تعویض روغن طبق برنامه","بررسی سطح مایعات"], safety:hot, related:["spark_plug","oil_filter","radiator"]),
            p("battery","باتری","Battery","برق","باتری انرژی الکتریکی مورد نیاز برای استارت و تجهیزات خودرو را تأمین می‌کند.","ذخیره و تأمین انرژی الکتریکی ۱۲ ولت خودرو.","در محفظه موتور یا در برخی خودروها صندوق عقب.", symptoms:["استارت ضعیف","خاموشی تجهیزات"], tips:["بررسی قطب‌ها","کنترل ولتاژ"], safety:"از اتصال کوتاه قطب‌های باتری جلوگیری کنید.", related:["alternator","starter"]),
            p("spark_plug","شمع","Spark Plug","موتور","شمع در موتور بنزینی جرقه لازم برای احتراق مخلوط هوا و سوخت را ایجاد می‌کند.","ایجاد جرقه در محفظه احتراق.","روی سرسیلندر، متصل به هر سیلندر.", symptoms:["بد کار کردن موتور","ریپ زدن","مصرف بالا"], tips:["بازدید طبق سرویس دوره‌ای"], safety:hot, related:["engine","cylinder_head"]),
            p("radiator","رادیاتور","Radiator","خنک‌کاری","رادیاتور گرمای مایع خنک‌کننده را به هوای محیط منتقل می‌کند.","دفع گرمای موتور.","جلوی خودرو، پشت جلوپنجره.", symptoms:["بالا رفتن دما","نشتی مایع"], tips:["کنترل ضدیخ","تمیز نگه داشتن پره‌ها"], safety:"در حالت داغ درپوش سیستم خنک‌کننده را باز نکنید.", related:["coolant_reservoir","engine"]),
            p("air_filter","فیلتر هوا","Air Filter","هوارسانی","فیلتر هوا ذرات و گردوغبار را پیش از ورود هوا به موتور می‌گیرد.","پاک‌سازی هوای ورودی موتور.","داخل محفظه فیلتر در مسیر ورودی هوا.", symptoms:["کاهش شتاب","افزایش مصرف"], tips:["بازدید و تعویض دوره‌ای"], related:["air_intake","throttle_body"]),
            p("oil_filter","فیلتر روغن","Oil Filter","موتور","فیلتر روغن ذرات آلاینده را از روغن موتور جدا می‌کند.","پاک‌سازی روغن در مدار روان‌کاری.","روی بدنه موتور یا نزدیک کارتل.", symptoms:["افت فشار روغن"], tips:["همراه روغن موتور تعویض شود"], safety:hot, related:["engine","engine_oil_cap"]),
            p("alternator","دینام","Alternator","برق","دینام هنگام روشن بودن موتور برق تولید می‌کند و باتری را شارژ می‌کند.","تولید برق و شارژ باتری.","کنار موتور و متصل به تسمه لوازم جانبی.", symptoms:["چراغ باتری","ضعف برق"], tips:["بررسی تسمه و اتصالات"], safety:hot, related:["battery","engine"]),
            p("starter","استارت","Starter Motor","برق","استارت موتور را برای شروع احتراق می‌چرخاند.","چرخاندن اولیه میل‌لنگ هنگام استارت.","نزدیک محل اتصال موتور و گیربکس.", symptoms:["صدای کلیک","استارت نخوردن"], tips:["بررسی باتری و اتصالات"], related:["battery","engine"]),
            p("brake_disc","دیسک ترمز","Brake Disc","ترمز","دیسک با اصطکاک لنت سرعت چرخ را کاهش می‌دهد.","ایجاد سطح اصطکاک برای ترمزگیری.","داخل مجموعه چرخ.", symptoms:["لرزش هنگام ترمز","خط افتادن"], safety:"کار روی سیستم ترمز باید توسط فرد متخصص انجام شود.", related:["brake_caliper","brake_pad"]),
            p("brake_caliper","کالیپر ترمز","Brake Caliper","ترمز","کالیپر لنت‌ها را روی دیسک فشار می‌دهد.","تبدیل فشار هیدرولیک به نیروی فشاری روی لنت.","روی دیسک ترمز.", safety:"سیستم ترمز قطعه ایمنی حیاتی است.", related:["brake_disc","brake_pad"]),
            p("brake_pad","لنت ترمز","Brake Pad","ترمز","لنت با تماس با دیسک اصطکاک لازم برای کاهش سرعت را ایجاد می‌کند.","ایجاد اصطکاک کنترل‌شده.","داخل کالیپر ترمز.", safety:"تعویض لنت باید صحیح و جفتی انجام شود.", related:["brake_disc","brake_caliper"]),
            p("fuse_box","جعبه فیوز","Fuse Box","برق","جعبه فیوز از مدارهای الکتریکی خودرو محافظت می‌کند.","قطع مدار در اضافه‌جریان.","در محفظه موتور یا داخل کابین.", related:["battery","ecu"]),
            p("coolant_reservoir","مخزن مایع خنک‌کننده","Coolant Reservoir","خنک‌کاری","مخزن انبساط تغییر حجم مایع خنک‌کننده را مدیریت می‌کند.","ذخیره و جبران حجم مایع خنک‌کننده.","کنار موتور و رادیاتور.", safety:"در حالت داغ باز نکنید.", related:["radiator","engine"]),
            p("engine_oil_cap","درپوش روغن موتور","Engine Oil Cap","موتور","محل افزودن روغن موتور را می‌بندد.","آب‌بندی دهانه روغن موتور.","بالای موتور.", safety:hot, related:["oil_filter","engine"]),
            p("air_intake","ورودی هوا","Air Intake","هوارسانی","هوای لازم برای احتراق را به موتور می‌رساند.","هدایت و تنظیم مسیر هوای ورودی.","از جلوی خودرو تا دریچه گاز.", related:["air_filter","throttle_body"]),
            p("throttle_body","دریچه گاز","Throttle Body","هوارسانی","دریچه گاز مقدار هوای ورودی موتور را تنظیم می‌کند.","کنترل جریان هوای ورودی.","بین مسیر هوا و منیفولد ورودی.", related:["air_intake","engine"]),
            p("timing","تسمه یا زنجیر تایم","Timing Belt / Chain","موتور","تایمینگ حرکت میل‌لنگ و میل‌سوپاپ را هماهنگ می‌کند.","هماهنگ‌سازی زمان باز و بسته شدن سوپاپ‌ها.","در بخش جلو یا کنار موتور زیر پوشش تایم.", safety:hot, related:["camshaft","crankshaft"]),
            p("cylinder_head","سرسیلندر","Cylinder Head","موتور","سرسیلندر بخش بالایی سیلندرها و محل سوپاپ‌ها است.","تشکیل بخش بالایی محفظه احتراق.","بالای بلوک موتور.", safety:hot, related:["engine","camshaft"]),
            p("piston","پیستون","Piston","موتور","پیستون فشار احتراق را به حرکت رفت و برگشتی تبدیل می‌کند.","انتقال نیروی احتراق به شاتون.","داخل سیلندر موتور.", safety:hot, related:["crankshaft","engine"]),
            p("crankshaft","میل‌لنگ","Crankshaft","موتور","میل‌لنگ حرکت رفت و برگشتی پیستون‌ها را به چرخش تبدیل می‌کند.","تولید حرکت دورانی موتور.","پایین بلوک موتور.", safety:hot, related:["piston","camshaft"]),
            p("camshaft","میل‌سوپاپ","Camshaft","موتور","میل‌سوپاپ زمان‌بندی باز و بسته شدن سوپاپ‌ها را کنترل می‌کند.","کنترل زمان‌بندی سوپاپ‌ها.","داخل سرسیلندر یا بلوک موتور.", safety:hot, related:["timing","cylinder_head"]),
            p("transmission","گیربکس","Transmission","گیربکس","گیربکس نسبت دور و گشتاور بین موتور و چرخ‌ها را تغییر می‌دهد.","مدیریت انتقال توان.","متصل به موتور در مسیر انتقال قدرت.", related:["engine"]),
            p("suspension","سیستم تعلیق","Suspension","تعلیق","تعلیق تماس چرخ با سطح و راحتی سواری را حفظ می‌کند.","جذب ناهمواری و کنترل حرکت بدنه.","میان شاسی و چرخ‌ها.", related:["shock_absorber","wheel_hub"]),
            p("shock_absorber","کمک‌فنر","Shock Absorber","تعلیق","کمک‌فنر نوسان فنر و بدنه را کنترل می‌کند.","میرایی نوسانات تعلیق.","کنار هر چرخ.", related:["suspension","wheel_hub"]),
            p("wheel_hub","توپی چرخ","Wheel Hub","تعلیق","توپی چرخ محل اتصال چرخ و یاتاقان است.","پشتیبانی از چرخ و انتقال دوران.","مرکز مجموعه چرخ.", related:["suspension","brake_disc"]),
            p("fuel_injector","انژکتور","Fuel Injector","سوخت‌رسانی","انژکتور سوخت را به‌صورت کنترل‌شده پاشش می‌کند.","اندازه‌گیری و پاشش سوخت.","روی ریل سوخت نزدیک ورودی سیلندر.", related:["fuel_pump","engine"]),
            p("fuel_pump","پمپ بنزین","Fuel Pump","سوخت‌رسانی","پمپ بنزین سوخت را از باک به موتور می‌رساند.","ایجاد فشار و جریان سوخت.","معمولاً داخل باک.", related:["fuel_injector"]),
            p("exhaust","سیستم اگزوز","Exhaust System","اگزوز","اگزوز گازهای حاصل از احتراق را هدایت و صدا را کاهش می‌دهد.","تخلیه گازهای احتراق.","از موتور تا انتهای خودرو.", safety:"اگزوز می‌تواند بسیار داغ باشد.", related:["catalytic_converter"]),
            p("catalytic_converter","کاتالیزور","Catalytic Converter","اگزوز","کاتالیزور آلاینده‌های گاز خروجی را به ترکیبات کم‌ضررتر تبدیل می‌کند.","کاهش آلایندگی خروجی.","در مسیر اگزوز نزدیک موتور.", safety:"کاتالیزور بسیار داغ می‌شود.", related:["exhaust"]),
            p("ecu","واحد کنترل موتور","ECU","برق","ECU رایانه کنترل موتور است و داده حسگرها را پردازش می‌کند.","کنترل پاشش سوخت، جرقه و بسیاری از عملکردهای موتور.","محفظه موتور یا داخل کابین، بسته به خودرو.", related:["engine","fuel_injector"])
        ]
    }
}
