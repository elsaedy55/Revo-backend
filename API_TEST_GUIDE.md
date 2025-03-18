# دليل اختبار واجهة برمجة التطبيقات (API)

## معلومات عامة
- **عنوان الخادم المحلي**: `http://localhost:4000`
- **رأس المصادقة**: `Authorization: Bearer {token}`

## المصادقة (Authentication)

### 1. تسجيل مستخدم جديد
- **الطريقة**: `POST`
- **المسار**: `/api/auth/register`
- **الرؤوس**: 
  - `Content-Type: application/json`
- **نموذج البيانات**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "اسم المستخدم"
}
```
- **مثال للاستجابة الناجحة**:
```json
{
  "success": true,
  "message": "تم تسجيل المستخدم بنجاح",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "اسم المستخدم"
  }
}
```

### 2. تسجيل الدخول
- **الطريقة**: `POST`
- **المسار**: `/api/auth/login`
- **الرؤوس**: 
  - `Content-Type: application/json`
- **نموذج البيانات**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **مثال للاستجابة الناجحة**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "اسم المستخدم"
  }
}
```

### 3. تسجيل الدخول باستخدام Google
- **الطريقة**: `GET`
- **المسار**: `/api/auth/google`
- **ملاحظة**: سيقوم بتحويل المستخدم إلى صفحة تسجيل الدخول بـ Google

### 4. إعادة تعيين كلمة المرور
- **الطريقة**: `POST`
- **المسار**: `/api/auth/forgot-password`
- **الرؤوس**: 
  - `Content-Type: application/json`
- **نموذج البيانات**:
```json
{
  "email": "user@example.com"
}
```

### 5. تأكيد إعادة تعيين كلمة المرور
- **الطريقة**: `POST`
- **المسار**: `/api/auth/reset-password`
- **الرؤوس**: 
  - `Content-Type: application/json`
- **نموذج البيانات**:
```json
{
  "token": "reset_token",
  "newPassword": "new_password123"
}
```

## السجلات الطبية (Medical Records)

### 1. إنشاء سجل طبي جديد
- **الطريقة**: `POST`
- **المسار**: `/api/medical-history`
- **الرؤوس**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **نموذج البيانات**:
```json
{
  "phone_number": "0123456789",
  "date_of_birth": "1990-01-01",
  "address": "عنوان المريض",
  "has_diseases": true,
  "diseases": ["السكري", "ضغط الدم"],
  "disease_start_dates": ["2020-01-01", "2021-02-01"],
  "takes_medications": true,
  "medications": ["انسولين", "دواء الضغط"],
  "medication_start_dates": ["2020-01-01", "2021-02-01"],
  "had_surgeries": true,
  "surgeries": ["استئصال الزائدة الدودية"],
  "surgery_dates": ["2019-05-15"]
}
```
- **مثال للاستجابة الناجحة**:
```json
{
  "success": true,
  "message": "تم إنشاء السجل الطبي بنجاح",
  "data": {
    "id": "uuid",
    "phone_number": "0123456789",
    ...
  }
}
```

### 2. جلب سجل طبي معين
- **الطريقة**: `GET`
- **المسار**: `/api/medical-history/:id`
- **الرؤوس**: 
  - `Authorization: Bearer {token}`
- **مثال للاستجابة الناجحة**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "phone_number": "0123456789",
    ...
  }
}
```

### 3. تحديث سجل طبي
- **الطريقة**: `PUT`
- **المسار**: `/api/medical-history/:id`
- **الرؤوس**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer {token}`
- **نموذج البيانات**: (نفس نموذج إنشاء السجل الطبي)
- **مثال للاستجابة الناجحة**:
```json
{
  "success": true,
  "message": "تم تحديث السجل الطبي بنجاح",
  "data": {
    "id": "uuid",
    "phone_number": "0123456789",
    ...
  }
}
```

### 4. حذف سجل طبي
- **الطريقة**: `DELETE`
- **المسار**: `/api/medical-history/:id`
- **الرؤوس**: 
  - `Authorization: Bearer {token}`
- **مثال للاستجابة الناجحة**:
```json
{
  "success": true,
  "message": "تم حذف السجل الطبي بنجاح"
}
```

## كيفية اختبار API باستخدام Postman

1. **إعداد البيئة في Postman**:
   - قم بإنشاء بيئة جديدة (Environment) باسم "Medical Records API"
   - أضف المتغيرات التالية:
     - `baseUrl`: `http://localhost:4000`
     - `token`: (سيتم ملؤها تلقائياً بعد تسجيل الدخول)

2. **خطوات الاختبار**:
   1. قم بتشغيل الخادم المحلي
   2. اختبر تسجيل مستخدم جديد باستخدام نقطة النهاية `register`
   3. قم بتسجيل الدخول واحصل على التوكن
   4. انسخ التوكن من الاستجابة وضعه في متغير البيئة `token`
   5. اختبر إنشاء سجل طبي جديد
   6. استخدم معرف السجل الطبي الذي تم إنشاؤه لاختبار باقي العمليات

3. **نصائح للاختبار**:
   - تأكد من إضافة رأس `Authorization` مع القيمة `Bearer {{token}}` لجميع نقاط النهاية التي تتطلب مصادقة
   - استخدم متغير البيئة `{{baseUrl}}` في جميع الطلبات
   - تحقق من رسائل الخطأ في حالة إدخال بيانات غير صحيحة
   - اختبر التحقق من صحة البيانات عن طريق إرسال بيانات غير مكتملة أو غير صالحة

4. **أمثلة على الأخطاء المتوقعة**:
   - `401 Unauthorized`: عندما يكون التوكن غير صالح أو منتهي الصلاحية
   - `400 Bad Request`: عند إرسال بيانات غير صالحة
   - `404 Not Found`: عند محاولة الوصول إلى سجل طبي غير موجود
   - `422 Unprocessable Entity`: عند فشل التحقق من صحة البيانات المدخلة