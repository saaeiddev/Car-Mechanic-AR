package com.azadi.carmechanicar.data

import com.azadi.carmechanicar.model.CarPart

object PartRepository {
    private fun p(id:String,fa:String,en:String,category:String,shortDescription:String,function:String,location:String,fullDescription:String=shortDescription,commonSymptoms:List<String> = emptyList(),maintenanceTips:List<String> = emptyList(),safetyWarning:String?=null,relatedParts:List<String> = emptyList())=CarPart(id,fa,en,category,shortDescription,fullDescription,function,location,commonSymptoms,maintenanceTips,safetyWarning,relatedParts)
    val parts=listOf(
        p("engine","موتور","Engine","موتور","موتور قلب تپنده خودرو است.","تبدیل انرژی به نیروی مکانیکی برای حرکت خودرو.","محفظه موتور",commonSymptoms=listOf("کاهش قدرت","صدای غیرعادی"),maintenanceTips=listOf("تعویض روغن دوره‌ای"),safetyWarning="پیش از بررسی خودرو را خاموش کنید.",relatedParts=listOf("spark_plug","radiator","oil_filter")),
        p("battery","باتری","Battery","برق","باتری انرژی الکتریکی خودرو را تأمین می‌کند.","ذخیره و تأمین برق برای استارت و تجهیزات.","محفظه موتور یا صندوق عقب",commonSymptoms=listOf("استارت ضعیف"),maintenanceTips=listOf("بررسی ولتاژ و قطب‌ها"),safetyWarning="از اتصال کوتاه قطب‌ها جلوگیری کنید.",relatedParts=listOf("battery_terminal","alternator","starter")),
        p("spark_plug","شمع","Spark Plug","موتور","شمع جرقه لازم برای احتراق موتور بنزینی را ایجاد می‌کند.","ایجاد جرقه در سیلندر.","روی سرسیلندر",commonSymptoms=listOf("ریپ زدن","بد روشن شدن"),relatedParts=listOf("engine","cylinder_head")),
        p("radiator","رادیاتور","Radiator","خنک‌کاری","رادیاتور گرمای مایع خنک‌کننده را دفع می‌کند.","جلوگیری از داغ شدن موتور.","جلوی خودرو",commonSymptoms=listOf("بالا رفتن دما","نشتی"),safetyWarning="در حالت داغ درپوش سیستم خنک‌کننده را باز نکنید.",relatedParts=listOf("coolant_reservoir","engine")),
        p("air_filter","فیلتر هوا","Air Filter","هوارسانی","فیلتر هوا آلودگی‌های هوای ورودی را جذب می‌کند.","پاک‌سازی هوای ورودی موتور.","جعبه فیلتر هوا",maintenanceTips=listOf("تعویض دوره‌ای")),
        p("oil_filter","فیلتر روغن","Oil Filter","موتور","فیلتر روغن آلاینده‌های روغن را جدا می‌کند.","پاک‌سازی روغن موتور.","روی بدنه موتور"),
        p("alternator","دینام","Alternator","برق","دینام برق تولید می‌کند و باتری را شارژ می‌کند.","تولید برق در زمان روشن بودن موتور.","کنار موتور",commonSymptoms=listOf("چراغ باتری","ضعف برق"),relatedParts=listOf("battery","starter")),
        p("starter","استارت","Starter Motor","برق","استارت موتور را برای شروع روشن شدن می‌چرخاند.","چرخاندن اولیه میل‌لنگ.","بین موتور و گیربکس",commonSymptoms=listOf("صدای کلیک","استارت نخوردن")),
        p("brake_disc","دیسک ترمز","Brake Disc","ترمز","دیسک سطح اصطکاک ترمزگیری است.","ایجاد سطح تماس برای لنت.","داخل مجموعه چرخ",safetyWarning="سیستم ترمز ایمنی حیاتی است.",relatedParts=listOf("brake_pad","brake_caliper")),
        p("brake_caliper","کالیپر ترمز","Brake Caliper","ترمز","کالیپر لنت‌ها را روی دیسک فشار می‌دهد.","تبدیل فشار هیدرولیک به نیروی فشاری.","روی دیسک ترمز"),
        p("brake_pad","لنت ترمز","Brake Pad","ترمز","لنت با دیسک اصطکاک ایجاد می‌کند.","کاهش سرعت با اصطکاک.","داخل کالیپر",commonSymptoms=listOf("صدای سوت","کاهش ترمز")),
        p("fuse_box","جعبه فیوز","Fuse Box","برق","جعبه فیوز از مدارهای برقی محافظت می‌کند.","قطع مدار در اضافه‌جریان.","محفظه موتور یا کابین"),
        p("coolant_reservoir","مخزن مایع خنک‌کننده","Coolant Reservoir","خنک‌کاری","مخزن انبساط مایع خنک‌کننده است.","نگهداری مایع خنک‌کننده.","کنار موتور",safetyWarning="روی موتور داغ باز نکنید."),
        p("engine_oil_cap","درپوش روغن موتور","Engine Oil Cap","موتور","محل افزودن روغن موتور است.","آب‌بندی دهانه روغن.","بالای موتور"),
        p("air_intake","ورودی هوا","Air Intake","هوارسانی","هوای لازم برای احتراق را هدایت می‌کند.","هدایت هوای ورودی.","مسیر ورودی هوا"),
        p("throttle_body","دریچه گاز","Throttle Body","هوارسانی","مقدار هوای ورودی را تنظیم می‌کند.","کنترل جریان هوا.","پس از مسیر ورودی"),
        p("timing_belt","تسمه یا زنجیر تایم","Timing Belt / Chain","موتور","حرکت میل‌لنگ و میل‌سوپاپ را هماهنگ می‌کند.","تنظیم زمان‌بندی سوپاپ‌ها.","زیر کاور تایم"),
        p("cylinder_head","سرسیلندر","Cylinder Head","موتور","سرسیلندر بخش بالایی محفظه احتراق است.","نگهداری سوپاپ‌ها و محفظه احتراق.","بالای بلوک موتور"),
        p("piston","پیستون","Piston","موتور","پیستون انرژی احتراق را به حرکت رفت و برگشتی تبدیل می‌کند.","انتقال نیروی احتراق.","داخل سیلندر"),
        p("crankshaft","میل‌لنگ","Crankshaft","موتور","حرکت رفت و برگشتی را به چرخشی تبدیل می‌کند.","تولید حرکت دورانی.","پایین موتور"),
        p("camshaft","میل‌سوپاپ","Camshaft","موتور","زمان‌بندی سوپاپ‌ها را کنترل می‌کند.","کنترل باز و بسته شدن سوپاپ‌ها.","سرسیلندر"),
        p("transmission","گیربکس","Transmission","انتقال قدرت","نسبت دور و گشتاور را تنظیم می‌کند.","انتقال توان موتور به چرخ‌ها.","متصل به موتور"),
        p("suspension","سیستم تعلیق","Suspension","تعلیق","راحتی و پایداری خودرو را حفظ می‌کند.","جذب ناهمواری‌های جاده.","میان شاسی و چرخ‌ها"),
        p("shock_absorber","کمک‌فنر","Shock Absorber","تعلیق","نوسان فنر را کنترل می‌کند.","میرایی نوسان تعلیق.","نزدیک هر چرخ"),
        p("wheel_hub","توپی چرخ","Wheel Hub","چرخ","محل اتصال و یاتاقان چرخ است.","پشتیبانی از چرخ.","مرکز چرخ"),
        p("fuel_injector","انژکتور","Fuel Injector","سوخت‌رسانی","سوخت را دقیق پاشش می‌کند.","پاشش سوخت.","روی ریل سوخت"),
        p("fuel_pump","پمپ بنزین","Fuel Pump","سوخت‌رسانی","سوخت را به موتور می‌رساند.","ایجاد فشار سوخت.","معمولاً داخل باک"),
        p("exhaust_system","سیستم اگزوز","Exhaust System","اگزوز","گازهای خروجی را هدایت می‌کند.","خروج گاز و کاهش صدا.","از موتور تا انتهای خودرو",safetyWarning="اگزوز می‌تواند بسیار داغ باشد."),
        p("catalytic_converter","کاتالیزور","Catalytic Converter","اگزوز","آلایندگی خروجی را کاهش می‌دهد.","تبدیل آلاینده‌ها.","در مسیر اگزوز"),
        p("clutch_plate","صفحه کلاچ","Clutch Plate","انتقال قدرت","انتقال تدریجی نیروی موتور به گیربکس را ممکن می‌کند.","انتقال کنترل‌شده گشتاور.","بین موتور و گیربکس",relatedParts=listOf("transmission")),
        p("battery_terminal","سر باتری","Battery Terminal","برق","اتصال باتری به سیم‌کشی خودرو است.","انتقال جریان باتری.","روی قطب‌های باتری",safetyWarning="از اتصال کوتاه جلوگیری کنید.",relatedParts=listOf("battery")),
        p("carburetor","کاربراتور","Carburetor","سوخت‌رسانی","در موتورهای قدیمی مخلوط هوا و سوخت را آماده می‌کند.","تنظیم نسبت هوا و سوخت.","مسیر ورودی هوا"),
        p("fuel_tank","باک سوخت","Fuel Tank","سوخت‌رسانی","سوخت خودرو را ذخیره می‌کند.","ذخیره سوخت.","زیر بخش عقب خودرو",safetyWarning="از شعله و جرقه دور نگه دارید."),
        p("brake_fluid_reservoir","مخزن روغن ترمز","Brake Fluid Reservoir","ترمز","سیال هیدرولیک ترمز را نگهداری می‌کند.","تأمین روغن ترمز.","محفظه موتور",safetyWarning="سرویس ترمز را به فرد متخصص بسپارید."),
        p("ecu","واحد کنترل موتور","ECU","الکترونیک","ECU مغز کنترلی موتور است.","پردازش حسگرها و کنترل موتور.","محفظه موتور یا کابین")
    )
    fun byId(id:String)=parts.firstOrNull{it.id==id}
    fun search(query:String):List<CarPart>{val q=query.trim().lowercase();if(q.isEmpty())return parts;return parts.filter{it.nameFa.contains(query)||it.nameEn.lowercase().contains(q)||it.category.contains(query)}}
}
