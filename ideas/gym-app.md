**Sport AI Twin, spor salonu üyeleri için dijital spor ikizi oluşturan; kas bölgesine göre antrenman planı hazırlayan, basit hareketleri kamerayla otomatik tamamlatan, AI koç yorumu üreten ve salon yöneticisine yarışma/kampanya yönetimi sağlayan B2B spor teknolojisi platformudur.**

Bu projede Hugging Face tarafına girmiyoruz. Bunun yerine daha sağlam bir yol izliyoruz:

**Pose estimation + rule-based hareket takibi + kısmi AI koçluk + avatar/twin deneyimi + admin panel + yarışma motoru**

Bu yapı hem 24 saatlik MVP için daha gerçekçi hem de jüriye “çalışan ürün mantığı” gösterir.


## 1. Projenin Temel Konumu

Bu proje yalnızca “kamera ile tekrar sayan fitness uygulaması” değildir. Asıl ürün fikri, spor salonundaki her üye için bir **Sport AI Twin**, yani dijital spor ikizi oluşturmaktır.

Bu dijital spor ikizi; kullanıcının boy, kilo, hedef, seviye, odak kas bölgesi, antrenman geçmişi, devamlılık durumu, form skoru, yarışma katılımı ve gelişim trendlerinden oluşan dinamik bir spor profilidir.

Yani sistemin amacı şudur:

Kullanıcının fiziksel ve davranışsal spor verilerini anlamak<br>
↓<br>
Buna göre kişisel antrenman planı önermek<br>
↓<br>
Bazı hareketleri kamerayla takip etmek<br>
↓<br>
Tamamlanan antrenmanı AI Twin profiline işlemek<br>
↓<br>
Kullanıcıyı motive etmek<br>
↓<br>
Salon yöneticisine sadakat ve kampanya yönetimi sağlamak

Bu yüzden ürünün merkezi “kamera” değil, **AI Twin profili** olmalı.

Kamera, bu profilin veri kaynaklarından sadece biridir.


## 2. Ürünün Ana Kullanıcıları

Projede iki ana kullanıcı tipi var.

### 2.1. Sporcu / Salon Üyesi

Sporcu mobil uygulama veya mobil uyumlu web arayüzü üzerinden sisteme girer.

Sporcunun yapabildiği işlemler:

- Sport AI Twin oluşturma
- boy, kilo, hedef ve seviye bilgisi girme
- geliştirmek istediği kas bölgesini seçme
- günlük antrenman planı alma
- kameradan takip edilen egzersizi başlatma
- tekrar/süre hedefini otomatik tamamlatma
- AI koç yorumunu görme
- aktif yarışmalara katılma
- leaderboard sıralamasını takip etme
- kendi gelişim skorlarını görme

Bu kullanıcı için amaç:

“Ben ne çalışacağımı bileyim, sistem benim gelişimimi takip etsin, motive olayım ve spor salonuna düzenli devam edeyim.”


### 2.2. Spor Salonu Yöneticisi / Admin

Admin web panelinden sistemi yönetir.

Adminin yapabildiği işlemler:

- salon üyelerini görme
- aktif kullanıcıları takip etme
- yarışma/challenge oluşturma
- kampanya tanımlama
- ödül belirleme
- leaderboard görüntüleme
- kullanıcı devamlılık skorlarını izleme
- düşük devamlılık gösteren üyeleri tespit etme
- kampanya performansını görme
- salon içi etkileşim verilerini inceleme

Bu kullanıcı için amaç:

“Üyelerimi daha uzun süre salonda tutayım, motivasyonu artırayım, premium bir deneyim sunayım ve üyelik iptallerini azaltayım.”


## 3. Projenin En Doğru Teknik Felsefesi

Bu projede her şeyi AI’a bırakmayacağız. Çünkü bu, MVP’de hem riskli hem de savunması zor olur.

Doğru yaklaşım şu:

AI gereken yerde AI<br>
Kural gereken yerde rule-based<br>
Görsel etki gereken yerde avatar<br>
Ürün değeri gereken yerde admin panel ve challenge motoru

Yani sistem hibrit olacak.

### 3.1. Neden tamamen AI değil?

Çünkü 24 saatte:

- özel egzersiz tanıma modeli eğitmek zor,
- video classification modeli kurmak riskli,
- canlı kamerada genelleme yapmak zor,
- her hareketi otomatik tanımak gerçekçi değil,
- spor salonu ortamı karmaşık,
- kamera açısı değişince model kararsız olabilir.

Bu yüzden egzersiz sayımı ve tamamlanma mantığında rule-based yaklaşım daha güvenilir.

### 3.2. Neden tamamen rule-based değil?

Çünkü sadece rule-based olursa proje sıradan bir sayaç gibi görünebilir.

AI hissini vermek için:

- kişiselleştirilmiş plan açıklaması,
- antrenman sonrası yorum,
- motivasyon mesajı,
- admin için kampanya önerisi,
- Sport AI Twin gelişim yorumu

gibi alanlarda AI kullanılmalı.


## 4. Projenin Ana Teknik Mimarisi

Sistemi 7 ana katmana ayırabiliriz.

1. Kullanıcı Arayüzü<br>
2. Avatar / Sport AI Twin Görselleştirme Katmanı<br>
3. Backend API Katmanı<br>
4. Veritabanı Katmanı<br>
5. Kamera ve Hareket Takip Katmanı<br>
6. Rule-Based Plan / Challenge / Skor Motoru<br>
7. Kısmi AI Koçluk Katmanı

Şimdi bunları tek tek detaylandıralım.


## 5. Kullanıcı Arayüzü Katmanı

Bu katmanda iki arayüz olacak.

### 5.1. Mobil Kullanıcı Arayüzü

MVP’de tam native mobil uygulama yapmak zorunda değilsiniz.

En mantıklı yol:

## Mobil uyumlu web uygulaması / PWA mantığı

Yani kullanıcı telefondan açınca mobil uygulama gibi görünen bir arayüz tasarlanır. Bu, gerçek mobil uygulama hissi verir ama geliştirme süresini çok azaltır.

Mobil tarafta olacak ekranlar:

### 5.1.1. Onboarding Ekranı

Kullanıcı ilk girişte temel bilgileri girer.

Alanlar:

Ad Soyad<br>
Boy<br>
Kilo<br>
Yaş<br>
Cinsiyet seçimi opsiyonel<br>
Fitness seviyesi<br>
Hedef<br>
Geliştirmek istediği kas bölgesi<br>
Haftalık antrenman sıklığı

Örnek:

Boy: 180 cm<br>
Kilo: 86 kg<br>
Hedef: Kas kazanımı<br>
Seviye: Başlangıç<br>
Odak Bölge: Core + Upper Body

Bu bilgilerden ilk Sport AI Twin profili oluşturulur.


### 5.1.2. Sport AI Twin Ekranı

Bu ekranda kullanıcı kendi dijital spor ikizini görür.

Gösterilecek bilgiler:

Avatar<br>
Fitness seviyesi<br>
Form skoru<br>
Devamlılık skoru<br>
Güçlü bölge<br>
Geliştirilmesi gereken bölge<br>
Aktif challenge<br>
Sıralama<br>
Bugünkü AI önerisi

Örnek:

Harun’s Sport AI Twin<br>
<br>
Fitness Level: Beginner+<br>
Consistency Score: 74/100<br>
Form Score: 78/100<br>
Strong Area: Upper Body<br>
Needs Focus: Core Stability<br>
Active Challenge: 30-Day Consistency League<br>
Rank: 8/42


### 5.1.3. Kas Bölgesi Seçim Ekranı

Kullanıcı hangi bölgeyi geliştirmek istediğini seçer.

Seçenekler:

Chest<br>
Back<br>
Arms<br>
Legs<br>
Core<br>
Cardio<br>
Full Body

MVP için Türkçe kullanılabilir:

Göğüs<br>
Sırt<br>
Kol<br>
Bacak<br>
Core<br>
Kardiyo<br>
Tüm Vücut

Kullanıcı örneğin “Core” seçerse sistem core odaklı bir günlük plan üretir.


### 5.1.4. Günlük Plan Ekranı

Sistem kullanıcıya basit bir antrenman planı verir.

Örnek:

Bugünkü Core Planın<br>
<br>
1. Plank<br>
   Hedef: 30 saniye<br>
   Takip: Kamera ile otomatik<br>
<br>
2. Bodyweight Squat<br>
   Hedef: 10 tekrar<br>
   Takip: Kamera ile otomatik<br>
<br>
3. Dead Bug<br>
   Hedef: 12 tekrar<br>
   Takip: Manuel tamamla

Burada önemli olan şu:

MVP’de her hareket kamerayla takip edilmeyecek. Sadece 1-2 hareket otomatik takip edilecek. Diğerleri manuel veya simüle tamamlanabilir.


### 5.1.5. Kamera Egzersiz Ekranı

Kullanıcı kameradan takip edilen hareketi başlatır.

Ekranda şu bilgiler görünür:

Egzersiz adı<br>
Hedef tekrar/süre<br>
Mevcut tekrar/süre<br>
Form durumu<br>
Tamamlanma yüzdesi<br>
Başlat / Durdur butonu

Örnek:

Exercise: Biceps Curl<br>
Target: 10 reps<br>
Current: 7/10<br>
Elbow Angle: 64°<br>
Status: Keep going<br>
Form: Good

Tamamlanınca:

Biceps Curl Completed<br>
Upper Body Score +5<br>
Challenge Points +10


### 5.1.6. AI Koç Yorumu Ekranı

Egzersiz veya plan tamamlandıktan sonra AI koç yorumu gösterilir.

Örnek:

Bugünkü core antrenmanını tamamladın. Plank hedefini geçtin ancak form skorun orta seviyede kaldı. Bir sonraki antrenmanda süreyi artırmadan önce kalça hizanı daha stabil tutmaya odaklanmanı öneriyorum.

Bu yorum gerçek bir LLM’den üretilebilir veya MVP’de hazır prompt/mock cevapla gösterilebilir.


### 5.1.7. Leaderboard Ekranı

Kullanıcı aktif yarışmadaki sıralamasını görür.

Örnek:

30 Gün Devamlılık Ligi<br>
<br>
1. Ayşe - 420 puan<br>
2. Mehmet - 390 puan<br>
3. Harun - 360 puan

MVP’de bu veriler gerçek veritabanından veya mock JSON’dan gelebilir.


### 5.2. Web Admin Panel

Admin panel, projenin B2B gücünü gösterecek en önemli alanlardan biri.

Bu panel spor salonu yöneticisi içindir.

Web panelde olacak ekranlar:

### 5.2.1. Genel Dashboard

Burada salonun genel durumu gösterilir.

Kartlar:

Toplam Üye<br>
Bugün Check-in Yapan Üye<br>
Aktif Challenge Sayısı<br>
Ortalama Devamlılık Skoru<br>
Haftalık Tamamlanan Antrenman<br>
Churn Riski Yüksek Üye Sayısı

Örnek:

Total Members: 124<br>
Active Today: 38<br>
Active Challenges: 3<br>
Average Consistency: 71%<br>
High Churn Risk: 12 members


### 5.2.2. Üye Listesi

Admin tüm üyeleri görür.

Kolonlar:

Üye adı<br>
Fitness seviyesi<br>
Hedef<br>
Son giriş tarihi<br>
Devamlılık skoru<br>
Aktif challenge<br>
Risk durumu

Örnek:

Harun | Muscle Gain | Beginner+ | Last Check-in: Today | Consistency: 74 | Risk: Low


### 5.2.3. Challenge Oluşturma Ekranı

Bu ekran çok önemli. Çünkü senin sürdürülebilirlik, aylık kampanya, ücretsiz kullanım gibi fikirlerini burada göstereceğiz.

Admin yeni challenge oluşturur.

Alanlar:

Challenge adı<br>
Challenge türü<br>
Süre<br>
Başlangıç tarihi<br>
Bitiş tarihi<br>
Katılım tipi<br>
Hedef metrik<br>
Ödül<br>
Minimum katılım şartı<br>
Leaderboard görünürlüğü

Örnek challenge:

Challenge Name: 30 Gün Devamlılık Ligi<br>
Duration: 30 days<br>
Metric: Weekly check-in + completed workout<br>
Reward: 1 ay ücretsiz üyelik<br>
Visibility: All members

Diğer örnekler:

Plank Challenge<br>
Squat Form League<br>
Beginner Consistency League<br>
Upper Body Progress Month<br>
Core Stability Challenge


### 5.2.4. Kampanya Yönetimi Ekranı

Admin sadece yarışma değil, kampanya da oluşturabilir.

Örnek kampanya:

Kampanya Adı: Geri Dönüş Haftası<br>
Hedef Kitle: Son 10 gündür gelmeyen üyeler<br>
Ödül: 1 ücretsiz grup dersi<br>
Amaç: Üyeyi tekrar salona çekmek

Başka kampanya:

Kampanya Adı: 3 Hafta Devam Et, 1 Hafta Kazan<br>
Kural: 3 hafta boyunca haftada 3 gün check-in<br>
Ödül: 1 hafta ücretsiz kullanım

Bu modül jüriye iş modelini çok güçlü gösterir.


### 5.2.5. Leaderboard Yönetimi

Admin yarışma sıralamasını görebilir.

Gösterilecek bilgiler:

Katılımcı adı<br>
Puan<br>
Tamamlanan antrenman<br>
Check-in sayısı<br>
Form skoru<br>
Sıralama değişimi


### 5.2.6. AI Salon Insight Alanı

Bu alan kısmi AI’ın admin tarafındaki kullanımıdır.

Örnek:

AI Insight:<br>
<br>
Son 7 günde yeni başlayan üyelerin check-in oranı %23 düştü.<br>
Bu grup için “Beginner Motivation Challenge” başlatılması önerilir.<br>
Önerilen ödül: 1 ücretsiz PT deneme seansı.

MVP’de bu yorum gerçek LLM ile veya hazır mock ile üretilebilir.


## 6. Avatar ve Sport AI Twin Görselleştirme Katmanı

Bu projenin görsel etkisini artıracak en önemli şey avatar.

Ancak MVP’de gerçek kişiye benzeyen avatar yapmak zorunda değilsiniz.

Doğru yaklaşım:

**Boy, kilo, hedef ve seviye bilgisine göre temsilî 3D avatar seçmek.**

### 6.1. Avatar Nasıl Çalışacak?

Kullanıcı onboarding sırasında bilgilerini girer.

Boy<br>
Kilo<br>
Hedef<br>
Seviye<br>
Odak bölge

Sistem bu bilgilere göre bir avatar tipi seçer.

Örnek avatar tipleri:

lean<br>
average<br>
athletic<br>
strong<br>
overweight

Örnek kural:

BMI düşükse → lean<br>
BMI normal ve seviye başlangıçsa → average<br>
Hedef kas kazanımıysa → athletic<br>
Seviye ileri ise → strong<br>
BMI yüksekse → overweight

Bu avatar kullanıcının gerçek vücudu değildir. Temsilî bir dijital spor ikizidir.

Sunumda bunu şöyle söylemelisiniz:

“MVP’de avatar, kullanıcının birebir fiziksel kopyası değil; boy, kilo, hedef ve gelişim skorlarına göre oluşturulan temsilî Sport AI Twin görselleştirmesidir.”


### 6.2. Avatar Nerede Kullanılacak?

Avatar hem mobil kullanıcı tarafında hem web admin tarafında aynı olacaktır.

Bunu sağlamak için avatar bilgisi backend’de tutulacak.

Örnek veri:

{<br>
  "user_id": "u_001",<br>
  "avatar_type": "athletic",<br>
  "avatar_model_url": "/models/avatars/athletic.glb",<br>
  "height": 180,<br>
  "weight": 86,<br>
  "goal": "muscle_gain"<br>
}

Mobil de web de aynı avatar_model_url değerini okuyacak.

Yani iki ayrı avatar üretmeyeceğiz.

Tek avatar profili olacak.


### 6.3. Avatar Üzerinde Hangi Veriler Gösterilecek?

Avatar sadece süs olmayacak.

Avatarın yanında veya üzerinde Sport AI Twin skorları gösterilecek.

Örnek:

Upper Body: 72/100<br>
Core: 48/100<br>
Legs: 58/100<br>
Cardio: 66/100<br>
Form Score: 78/100<br>
Consistency: 74/100

Bu değerler antrenman tamamlandıkça değişecek.

Örneğin kullanıcı plank tamamladıysa:

Core: 48 → 53<br>
Consistency: 74 → 78<br>
Challenge Points: +10

Bu sayede avatar “yaşayan” bir dijital profil gibi görünür.


## 7. Backend API Katmanı

Backend sistemin merkezidir.

Backend’in görevleri:

Kullanıcı bilgilerini saklamak<br>
Avatar bilgisini saklamak<br>
Günlük plan üretmek<br>
Egzersiz durumunu güncellemek<br>
Challenge puanlarını hesaplamak<br>
Leaderboard üretmek<br>
AI koç yorumuna veri hazırlamak<br>
Admin panel verilerini sağlamak

### 7.1. Backend İçin Önerilen Teknoloji

24 saatlik MVP için en mantıklı seçeneklerden biri:

Frontend: Next.js / React<br>
Backend API: Next.js API Routes veya FastAPI<br>
CV Servisi: Python + OpenCV + MediaPipe<br>
Database: Supabase / Firebase / SQLite

Benim pratik önerim:

Web + mobil responsive: Next.js<br>
CV tracking: Python FastAPI ayrı servis<br>
Database: Supabase veya JSON/SQLite

Zaman çok kısıtlıysa:

Frontend: React<br>
Backend: basit JSON state / localStorage / Firebase<br>
CV: ayrı Python script

MVP’de “kusursuz production mimarisi” değil, çalışan demo önemlidir.


## 8. Veritabanı Tasarımı

MVP için basit ama mantıklı bir veri modeli kurulmalı.

### 8.1. Users Tablosu

Kullanıcı temel bilgileri.

{<br>
  "id": "u_001",<br>
  "name": "Harun",<br>
  "height": 180,<br>
  "weight": 86,<br>
  "age": 22,<br>
  "goal": "muscle_gain",<br>
  "level": "beginner",<br>
  "focus_area": "core",<br>
  "created_at": "2026-05-16"<br>
}


### 8.2. Avatar Tablosu

Kullanıcının avatar bilgisi.

{<br>
  "user_id": "u_001",<br>
  "avatar_type": "athletic_average",<br>
  "avatar_model_url": "/models/athletic_average.glb",<br>
  "body_profile_label": "Beginner Athletic",<br>
  "last_updated": "2026-05-16"<br>
}


### 8.3. Twin Scores Tablosu

Sport AI Twin skorları.

{<br>
  "user_id": "u_001",<br>
  "upper_body": 72,<br>
  "core": 48,<br>
  "legs": 58,<br>
  "cardio": 66,<br>
  "form_score": 78,<br>
  "consistency_score": 74,<br>
  "motivation_score": 81,<br>
  "churn_risk": "low"<br>
}


### 8.4. Exercises Tablosu

Sistemde tanımlı hareketler.

{<br>
  "id": "ex_001",<br>
  "name": "Biceps Curl",<br>
  "target_area": "arms",<br>
  "tracking_type": "camera",<br>
  "difficulty": "easy",<br>
  "target_metric": "reps"<br>
}

Örnek egzersizler:

Biceps Curl<br>
Squat<br>
Plank<br>
Push-up<br>
Dead Bug<br>
Shoulder Mobility<br>
Lunge

MVP’de kamera ile takip edilecekler:

Biceps Curl<br>
Plank<br>
Squat opsiyonel


### 8.5. Workout Plans Tablosu

Kullanıcıya üretilen günlük plan.

{<br>
  "plan_id": "plan_001",<br>
  "user_id": "u_001",<br>
  "focus_area": "core",<br>
  "goal": "muscle_gain",<br>
  "date": "2026-05-16",<br>
  "status": "active",<br>
  "completion_rate": 0<br>
}


### 8.6. Plan Items Tablosu

Plan içindeki hareketler.

{<br>
  "plan_item_id": "item_001",<br>
  "plan_id": "plan_001",<br>
  "exercise_name": "Plank",<br>
  "target_type": "seconds",<br>
  "target_value": 30,<br>
  "current_value": 0,<br>
  "tracking_type": "camera",<br>
  "status": "not_started"<br>
}


### 8.7. Workout Sessions Tablosu

Gerçekleşen antrenman oturumları.

{<br>
  "session_id": "s_001",<br>
  "user_id": "u_001",<br>
  "exercise_name": "Plank",<br>
  "target": 30,<br>
  "actual": 34,<br>
  "form_score": 78,<br>
  "completed": true,<br>
  "started_at": "2026-05-16 14:20",<br>
  "ended_at": "2026-05-16 14:22"<br>
}


### 8.8. Challenges Tablosu

Admin tarafından oluşturulan yarışmalar.

{<br>
  "challenge_id": "ch_001",<br>
  "name": "30 Gün Devamlılık Ligi",<br>
  "type": "consistency",<br>
  "start_date": "2026-05-16",<br>
  "end_date": "2026-06-16",<br>
  "metric": "completed_workouts",<br>
  "reward": "1 ay ücretsiz üyelik",<br>
  "status": "active"<br>
}


### 8.9. Challenge Participants Tablosu

Katılımcı ve puan bilgisi.

{<br>
  "challenge_id": "ch_001",<br>
  "user_id": "u_001",<br>
  "points": 120,<br>
  "rank": 6,<br>
  "completed_workouts": 8,<br>
  "last_updated": "2026-05-16"<br>
}


## 9. Plan Üretme Motoru

Plan üretme motoru MVP’de tamamen AI olmak zorunda değil.

En mantıklı yöntem:

## Template-based plan generator + AI açıklama

Yani sistem önce kurallara göre güvenli bir plan seçer. Sonra AI bu planı kişiselleştirilmiş bir dille açıklar.

### 9.1. Input Bilgileri

Plan üretmek için kullanılacak bilgiler:

Kullanıcının hedefi<br>
Fitness seviyesi<br>
Odak kas bölgesi<br>
Son antrenman durumu<br>
Form skoru<br>
Devamlılık skoru<br>
Aktif challenge

MVP’de minimum input:

goal<br>
level<br>
focus_area


### 9.2. Basit Plan Kuralları

Örnek:

Eğer focus_area = arms ve level = beginner:<br>
- Biceps Curl: 3 x 10<br>
- Shoulder Mobility: 2 x 12<br>
- Plank: 30 sn<br>
<br>
Eğer focus_area = core ve level = beginner:<br>
- Plank: 3 x 30 sn<br>
- Dead Bug: 2 x 12<br>
- Bodyweight Squat: 2 x 10<br>
<br>
Eğer focus_area = legs ve level = beginner:<br>
- Squat: 3 x 10<br>
- Lunge: 2 x 8<br>
- Plank: 30 sn

Bu planlar güvenli ve basit olmalı.

MVP’de ağır, sakatlık riski yüksek, teknik olarak karmaşık hareketler kullanılmamalı.


### 9.3. AI Açıklama

Rule-based plan üretildikten sonra AI şu açıklamayı yapabilir:

Bugünkü planın core stabiliteni artırmak için hazırlandı. Plank hareketi merkez bölge dayanıklılığını ölçerken, squat hareketi bacak ve core koordinasyonunu destekleyecek. Başlangıç seviyesinde olduğun için hareketler vücut ağırlığı odaklı seçildi.

Burada AI’ın görevi karar vermek değil, planı açıklamak ve kişiselleştirmek.

Bu çok önemli.

Çünkü jüride şunu savunabilirsiniz:

“Egzersiz güvenliği için temel plan seçimlerini rule-based yapıyoruz. AI ise bu planı kullanıcıya anlaşılır, motive edici ve kişisel bir dille açıklıyor.”


## 10. Kamera ve Hareket Takip Katmanı

Bu katman MVP’de en basit ama en gösterilebilir teknik parça olacak.

Kullanılacak yapı:

OpenCV<br>
MediaPipe Pose<br>
Angle calculation<br>
Rule-based state machine

Burada Hugging Face yok.

Özel model eğitimi yok.

Ağır video classification yok.


### 10.1. OpenCV Ne İçin Kullanılacak?

OpenCV şu işler için kullanılacak:

Webcam görüntüsünü almak<br>
Video frame’lerini okumak<br>
Görüntüyü işlemek<br>
Ekrana çizim yapmak<br>
Kullanıcıya canlı feedback göstermek

MVP’de görüntü işleme ekranında şunlar gösterilebilir:

Kamera görüntüsü<br>
İskelet çizgileri<br>
Açı değeri<br>
Tekrar sayısı<br>
Form durumu<br>
Tamamlandı bildirimi


### 10.2. MediaPipe Pose Ne İçin Kullanılacak?

MediaPipe Pose vücuttaki landmark noktalarını çıkaracak.

İlgili noktalar:

Omuz<br>
Dirsek<br>
Bilek<br>
Kalça<br>
Diz<br>
Ayak bileği

Bu noktalar üzerinden açı hesaplanacak.


### 10.3. Açı Hesaplama

Üç nokta ile açı hesaplanır.

Örneğin biceps curl için:

Omuz - Dirsek - Bilek

Bu üç nokta ile dirsek açısı bulunur.

Mantık:

Dirsek açısı büyükse kol açık<br>
Dirsek açısı küçükse kol bükülü<br>
Açık → bükülü → açık olursa tekrar tamamlandı


## 11. Rule-Based Hareket Takibi

MVP’de 2 hareketi sağlam yapmak yeterli.

### 11.1. Biceps Curl Takibi

Takip edilen landmarklar:

Shoulder<br>
Elbow<br>
Wrist

Kural:

Elbow angle > 150° → DOWN<br>
Elbow angle < 60° → UP<br>
DOWN → UP → DOWN = 1 rep

Ek güvenlik kuralları:

Tekrar saymak için hareket minimum belirli süre içinde gerçekleşmeli<br>
Açı çok hızlı değişirse noise kabul edilebilir<br>
Kullanıcı kamerada görünmüyorsa takip durmalı<br>
Landmark confidence düşükse uyarı verilmeli

Ekran çıktısı:

Biceps Curl<br>
Reps: 7 / 10<br>
Elbow Angle: 64°<br>
Status: Keep going

Tamamlanınca:

Exercise Completed<br>
Upper Body +5<br>
Challenge Points +10


### 11.2. Plank Takibi

Takip edilen landmarklar:

Shoulder<br>
Hip<br>
Ankle

Kural:

Omuz-kalça-ayak bileği hizası korunuyorsa timer çalışır<br>
Kalça çok düşerse veya çok yükselirse form uyarısı verilir<br>
Hedef süreye ulaşınca completed olur

Basit form kontrolü:

Hip çok aşağıdaysa → “Kalçanı biraz yukarı al”<br>
Hip çok yukarıdaysa → “Vücudunu düz hizaya getir”

Ekran çıktısı:

Plank<br>
Timer: 24 / 30 sec<br>
Form: Good

Tamamlanınca:

Plank Completed<br>
Core +5<br>
Challenge Points +10


### 11.3. Squat Takibi

Squat MVP’de opsiyonel olabilir.

Takip edilen landmarklar:

Hip<br>
Knee<br>
Ankle<br>
Shoulder

Kural:

Knee angle < 100° → down position<br>
Knee angle > 160° → standing position<br>
Down → standing = 1 rep

Form uyarıları:

Sırt çok öne eğiliyor<br>
Yeterince aşağı inmedin<br>
Diz-kalça hizası bozuldu

Ama squat, biceps curl ve plank’e göre daha hassastır. Kamera açısına daha çok bağlıdır. Bu yüzden MVP’de zorunlu değil, demo/simülasyon olabilir.


## 12. Egzersiz Tamamlanma Mantığı

Her plan item için hedef vardır.

Örnek:

Biceps Curl → 10 tekrar<br>
Plank → 30 saniye<br>
Squat → 10 tekrar

Sistem takip eder:

current_value < target_value → devam ediyor<br>
current_value >= target_value → completed

Completed olunca:

Plan item status = completed<br>
Workout session kaydı oluşur<br>
Twin score güncellenir<br>
Challenge points artar<br>
Leaderboard güncellenir<br>
AI koç yorumu oluşturulur

Bu akış MVP’nin ana omurgasıdır.


## 13. Sport AI Twin Skor Güncelleme Motoru

Her tamamlanan antrenman kullanıcının twin skorlarını etkiler.

### 13.1. Skor Alanları

MVP’de şu skorlar yeterli:

Upper Body Score<br>
Core Score<br>
Leg Score<br>
Cardio Score<br>
Form Score<br>
Consistency Score<br>
Motivation Score

### 13.2. Skor Güncelleme Örneği

Biceps curl tamamlandıysa:

Upper Body +5<br>
Consistency +2<br>
Challenge Points +10

Plank tamamlandıysa:

Core +5<br>
Form Score +1<br>
Consistency +2<br>
Challenge Points +10

Squat tamamlandıysa:

Legs +5<br>
Core +2<br>
Consistency +2<br>
Challenge Points +10

### 13.3. Örnek Güncelleme

Antrenman öncesi:

Core: 48<br>
Consistency: 74<br>
Challenge Points: 110

Plank tamamlandıktan sonra:

Core: 53<br>
Consistency: 76<br>
Challenge Points: 120

Bu görsel olarak kullanıcıya gösterilir.


## 14. Kısmi AI Koçluk Katmanı

Burada AI, sistemin kişiselleştirme yüzüdür.

Ama AI kararların tamamını vermeyecek.

AI’ın görevi:

Planı açıklamak<br>
Antrenman sonrası geri bildirim üretmek<br>
Motivasyon mesajı yazmak<br>
Admin için kampanya önerisi üretmek<br>
Sport AI Twin gelişimini yorumlamak

### 14.1. AI Kullanılacak Yerler

### 14.1.1. Plan Açıklaması

Input:

{<br>
  "name": "Harun",<br>
  "goal": "muscle_gain",<br>
  "level": "beginner",<br>
  "focus_area": "core",<br>
  "plan": ["Plank", "Dead Bug", "Bodyweight Squat"]<br>
}

AI çıktısı:

Bugünkü planın core stabiliteni geliştirmek için hazırlandı. Başlangıç seviyesinde olduğun için hareketler vücut ağırlığı odaklı seçildi. Plank ile merkez bölge dayanıklılığın ölçülecek, squat ile bacak-core koordinasyonun desteklenecek.


### 14.1.2. Antrenman Sonrası Yorum

Input:

{<br>
  "completed_exercises": [<br>
    {<br>
      "name": "Plank",<br>
      "target": 30,<br>
      "actual": 34,<br>
      "form_score": 78<br>
    }<br>
  ],<br>
  "core_score_before": 48,<br>
  "core_score_after": 53,<br>
  "challenge_rank": 6<br>
}

AI çıktısı:

Bugünkü core hedefini başarıyla tamamladın. Plank süren hedefin üzerine çıktı ancak form skorun hâlâ geliştirilebilir seviyede. Bir sonraki antrenmanda süreyi artırmadan önce kalça hizanı daha stabil tutmaya odaklanmanı öneriyorum.


### 14.1.3. Motivasyon Mesajı

Örnek:

Bu hafta 3. antrenmanını tamamladın. Devamlılık skorun yükseliyor ve aktif challenge sıralamasında iki sıra ilerledin. Aynı tempoyu korursan haftalık hedefini tamamlayacaksın.


### 14.1.4. Admin AI Insight

Input:

{<br>
  "total_members": 124,<br>
  "active_today": 38,<br>
  "low_consistency_users": 12,<br>
  "active_challenges": 3<br>
}

AI çıktısı:

Son 7 günde düşük devamlılık gösteren 12 üye tespit edildi. Bu üyeler için kısa süreli “Geri Dönüş Challenge” kampanyası başlatılması önerilir. Ödül olarak ücretsiz grup dersi veya 1 haftalık kullanım avantajı sunulabilir.


### 14.2. AI Teknik Olarak Nasıl Bağlanacak?

MVP’de iki seçenek var:

## Seçenek 1: Gerçek LLM API

Backend, kullanıcı verisini prompt’a koyar ve AI cevabı alır.

Avantaj:

Gerçek AI çıktısı<br>
Daha doğal yorum<br>
Sunumda güçlü görünür

Risk:

API bağlantı problemi<br>
Gecikme<br>
Yanlış/uzun cevap

## Seçenek 2: Mock AI Response

Önceden hazırlanmış birkaç cevap veriye göre gösterilir.

Avantaj:

Çok güvenli<br>
Demo patlamaz<br>
24 saat için daha rahat

Risk:

Gerçek AI hissi biraz azalır

Benim önerim:

Gerçek AI servisi bağlanabiliyorsa bağlayın ama mutlaka fallback mock response olsun.

Yani AI çalışmazsa sistem yine hazır yorum gösterebilsin.


## 15. Challenge ve Gamification Motoru

Bu proje için oyunlaştırma çok önemli. Çünkü seni klasik fitness uygulamalarından ayırıyor.

### 15.1. Challenge Türleri

MVP’de 3 challenge türü yeterli:

Devamlılık Challenge<br>
Süre Challenge<br>
Tamamlanan Antrenman Challenge

Örnekler:

30 Gün Devamlılık Ligi<br>
Plank Challenge<br>
Haftalık Core Challenge<br>
Beginner Consistency League


### 15.2. Challenge Oluşturma Akışı

Admin panelden yeni challenge oluşturur.

Alanlar:

Challenge adı<br>
Süre<br>
Hedef metrik<br>
Ödül<br>
Katılımcı grubu<br>
Başlangıç tarihi<br>
Bitiş tarihi

Örnek:

Challenge: 30 Gün Devamlılık Ligi<br>
Metric: completed_workouts<br>
Reward: 1 ay ücretsiz üyelik<br>
Duration: 30 days<br>
Participants: all members


### 15.3. Puanlama Mantığı

Basit puan sistemi:

Her tamamlanan egzersiz: +10 puan<br>
Her check-in: +5 puan<br>
Form skoru 80 üstüyse: +3 bonus<br>
Plan tamamen biterse: +15 bonus

Örnek:

Plank tamamlandı: +10<br>
Form iyi: +3<br>
Günlük plan %100 tamamlandı: +15<br>
Toplam: +28 puan


### 15.4. Leaderboard Mantığı

Leaderboard challenge puanlarına göre sıralanır.

Rank<br>
User<br>
Points<br>
Completed Workouts<br>
Consistency

Örnek:

1. Ayşe - 420<br>
2. Mehmet - 390<br>
3. Harun - 360


## 16. Kampanya ve Retention Modülü

Bu modül projenin ticari gücünü artırır.

Spor salonu neden bu sistemi alsın?

Çünkü sadece egzersiz takibi yapmıyor; üyelerin salona bağlılığını artırıyor.

### 16.1. Kampanya Örnekleri

30 Gün Devamlılık Ligi<br>
1 Ay Ücretsiz Kullanım Ödülü<br>
Geri Dönüş Haftası<br>
Yeni Başlayanlar 14 Gün Challenge<br>
Core Stability Month<br>
Plank King/Queen Challenge

### 16.2. Churn Risk Mantığı

MVP’de churn tahmini gerçek ML modeliyle yapılmayacak. Rule-based olacak.

Örnek kurallar:

Son 10 gündür check-in yoksa → risk high<br>
Son 7 günde plan tamamlanmadıysa → risk medium<br>
Challenge katılımı varsa → risk lower<br>
Consistency score > 70 ise → risk low

Admin panelde:

High Risk Members: 12<br>
Suggested Campaign: 7-Day Return Challenge

Bu, jüride çok iyi durur çünkü iş değerine bağlanır.


## 17. Mobil ve Web Uygulama Ayrımı

Projede mobil ve webin rolleri net ayrılmalı.

### 17.1. Mobil / Kullanıcı Tarafı

Mobil uygulama kullanıcının kişisel deneyim alanı olacak.

İçerikler:

Sport AI Twin avatarı<br>
Günlük plan<br>
Kas bölgesi seçimi<br>
Kamera egzersiz başlatma<br>
AI koç yorumu<br>
Challenge sıralaması<br>
Gelişim skorları

### 17.2. Web / Admin Tarafı

Web panel salon yöneticisinin kontrol alanı olacak.

İçerikler:

Üye listesi<br>
Challenge oluşturma<br>
Kampanya oluşturma<br>
Leaderboard<br>
Salon analitiği<br>
Riskli üyeler<br>
AI insight<br>
Ödül yönetimi

Bu ayrım sunumda çok net söylenmeli:

“Mobil taraf sporcu için, web panel spor salonu yöneticisi için tasarlandı.”


## 18. MVP Demo Akışı

Jüriye gösterilecek en güçlü demo akışı şöyle olmalı:

## Adım 1: Kullanıcı Sport AI Twin oluşturur

Kullanıcı mobil arayüzden bilgilerini girer.

Boy: 180<br>
Kilo: 86<br>
Hedef: Kas kazanımı<br>
Seviye: Başlangıç<br>
Odak Bölge: Core

Sistem avatar oluşturur.

Sport AI Twin created<br>
Avatar Type: Athletic Average<br>
Initial Core Score: 48<br>
Consistency Score: 0


## Adım 2: Kullanıcı kas bölgesi seçer

Kullanıcı “Core” seçer.

Sistem plan üretir:

Today’s Core Plan<br>
<br>
1. Plank - 30 sec - Camera tracked<br>
2. Bodyweight Squat - 10 reps - Camera/manual<br>
3. Dead Bug - 12 reps - Manual


## Adım 3: Kamera egzersizi başlatılır

Kullanıcı plank veya biceps curl başlatır.

Kamera ekranı:

Plank<br>
Timer: 24 / 30 sec<br>
Form: Good

Tamamlanınca:

Plank Completed<br>
Core +5<br>
Challenge Points +10


## Adım 4: Sport AI Twin güncellenir

Core: 48 → 53<br>
Consistency: 74 → 76<br>
Challenge Points: 110 → 120


## Adım 5: AI Koç yorumu gelir

Bugünkü core hedefini başarıyla tamamladın. Plank hedefini geçtin ancak form skorun hâlâ geliştirilebilir seviyede. Bir sonraki antrenmanda süreyi artırmadan önce kalça hizanı daha stabil tutmanı öneriyorum.


## Adım 6: Admin panelde leaderboard güncellenir

Admin panelde kullanıcı sıralaması yükselir.

Harun rank: 8 → 6


## Adım 7: Admin yeni challenge oluşturur

Admin:

Challenge Name: 30 Gün Devamlılık Ligi<br>
Reward: 1 ay ücretsiz üyelik<br>
Metric: completed workouts + check-ins

Bu, ürünün sürdürülebilirlik tarafını gösterir.


## 19. Teknik Riskler ve Çözümler

### 19.1. Kamera Açısı Problemi

Problem:

Kamera açısı değişirse açı hesapları bozulabilir.

Çözüm:

MVP’de kamera açısını sabitleyin.<br>
Kullanıcıya “kameraya yandan dur” gibi yönlendirme verin.


### 19.2. Landmark Kaybı

Problem:

Kullanıcının kolu/kafası/kası görünmezse MediaPipe noktaları kaybedebilir.

Çözüm:

Landmark confidence düşükse takip durur.<br>
Ekranda “kameraya daha net geç” uyarısı verilir.


### 19.3. Yanlış Tekrar Sayımı

Problem:

Kullanıcı egzersiz dışı bir hareket yaparsa tekrar sayılabilir.

Çözüm:

Egzersiz kullanıcı tarafından manuel başlatılır.<br>
Sadece seçili hareketin state machine’i çalışır.<br>
Minimum hareket süresi ve açı eşiği kontrol edilir.


### 19.4. AI Yanlış Öneri Üretebilir

Problem:

LLM fazla iddialı veya tıbbi öneri gibi cevap verebilir.

Çözüm:

Prompt sınırlandırılır.<br>
Sadece genel fitness motivasyonu ve plan açıklaması üretir.<br>
Sağlık/tıbbi iddia vermez.


### 19.5. MVP Çok Genişleyebilir

Problem:

Mobil, web, kamera, avatar, AI, admin, challenge derken proje dağılabilir.

Çözüm:

Bir ana demo akışı belirlenir.<br>
Her modül bu akışı destekleyecek kadar yapılır.<br>
Ek özellikler mock/demo olarak gösterilir.


## 20. KVKK ve Veri Gizliliği Yaklaşımı

Bu projede KVKK çok önemli.

Çünkü kullanıcıdan:

Boy<br>
Kilo<br>
Hedef<br>
Antrenman verisi<br>
Kamera görüntüsü<br>
Fiziksel performans verisi

gibi bilgiler alınacak.

MVP’de şu güvenli yaklaşım anlatılmalı:

Ham video saklanmaz.<br>
Kamera görüntüsü anlık işlenir.<br>
Yüz tanıma kullanılmaz.<br>
Kullanıcı QR/check-in ile eşleşir.<br>
Sadece tekrar, süre, skor ve plan verileri saklanır.<br>
Avatar temsilîdir, biyometrik kopya değildir.<br>
Kullanıcı açık rıza ile sisteme dahil olur.

Sunum cümlesi:

“MVP’de yüz tanıma veya ham video kaydı kullanmıyoruz. Kamera görüntüsü yalnızca anlık hareket takibi için işleniyor. Veritabanında sadece antrenman metrikleri, skorlar ve kullanıcı tercihleri tutuluyor.”

Bu çok önemli.


## 21. Jüriye Projeyi Nasıl Anlatmalısın?

Kısa anlatım:

“Sport AI Twin, spor salonları için geliştirilmiş B2B bir dijital spor ikizi platformudur. Kullanıcı boy, kilo, hedef ve seviye bilgileriyle kendi Sport AI Twin’ini oluşturur. Sistem kullanıcının geliştirmek istediği kas bölgesine göre günlük antrenman planı üretir. Bazı temel hareketler kamera üzerinden otomatik takip edilir ve tamamlandığında kullanıcının twin skoru güncellenir. Mobil uygulama sporcuya kişisel koçluk deneyimi sunarken, web admin paneli spor salonuna challenge, kampanya, leaderboard ve retention yönetimi sağlar.”

Teknik anlatım:

“MVP’de hareket takibi için MediaPipe Pose ve OpenCV kullanıyoruz. Egzersiz tamamlanma kararlarını açıklanabilir olması için rule-based state machine ile veriyoruz. AI katmanını ise plan açıklaması, antrenman sonrası koç yorumu, motivasyon mesajı ve admin insight üretimi için kullanıyoruz.”

İş modeli anlatımı:

“Sistemi bireysel kullanıcılara değil, spor salonlarına B2B modelle sunuyoruz. Salonlar bu platformla üyelerine premium ve kişiselleştirilmiş bir deneyim sunarken, challenge ve kampanya modülleriyle üyelik devamlılığını artırabiliyor.”


## 22. Projenin Ana Modülleri

Toparlarsak proje modülleri şunlar:

1. Sport AI Twin Onboarding<br>
2. Temsilî 3D Avatar<br>
3. Kas Bölgesi Seçimi<br>
4. Günlük Plan Üretici<br>
5. Kamera Tabanlı Hareket Takibi<br>
6. Rule-Based Rep/Timer Engine<br>
7. Twin Score Update Engine<br>
8. AI Coach Feedback<br>
9. Challenge Engine<br>
10. Leaderboard<br>
11. Admin Dashboard<br>
12. Campaign/Retention Module<br>
13. AI Admin Insight


## 23. Kullanılacak Teknolojiler

## Frontend

React veya Next.js<br>
Tailwind CSS<br>
Responsive tasarım<br>
Mobil uyumlu kullanıcı paneli<br>
Web admin dashboard

## 3D Avatar

Three.js veya React Three Fiber<br>
Hazır GLB/GLTF avatar modelleri<br>
Avatar tipi seçimi<br>
Skor kartlarıyla görselleştirme

## Kamera / CV

Python<br>
OpenCV<br>
MediaPipe Pose<br>
Açı hesaplama<br>
State machine

## Backend

FastAPI veya Next.js API<br>
Kullanıcı yönetimi<br>
Plan üretimi<br>
Skor güncelleme<br>
Challenge yönetimi<br>
Leaderboard API<br>
AI prompt endpoint

## Database

Supabase / Firebase / SQLite / JSON<br>
Users<br>
Avatars<br>
Twin Scores<br>
Workout Plans<br>
Workout Sessions<br>
Challenges<br>
Leaderboard

## AI Katmanı

LLM API veya mock AI response<br>
Plan açıklaması<br>
Koç yorumu<br>
Motivasyon mesajı<br>
Admin insight

## MVP Güvenli Fallback

AI çalışmazsa hazır yorum göster<br>
Kamera çalışmazsa demo video kullan<br>
Veritabanı yetişmezse JSON/localStorage kullan<br>
Avatar 3D yetişmezse 2D/3D mock görsel kullan


## 24. MVP’de Kesin Olacaklar

Aşağıdaki liste, 24 saatlik hackathon MVP’sinde gerçekten gösterilmesi gereken çekirdek kapsamdır.

### 24.1. Kullanıcı Onboarding

MVP’de olacak:

Kullanıcı adı<br>
Boy<br>
Kilo<br>
Hedef<br>
Seviye<br>
Odak kas bölgesi

Amaç:

Sport AI Twin profilini başlatmak.


### 24.2. Temsilî Sport AI Twin Avatarı

MVP’de olacak:

Boy-kilo-hedef bilgisine göre avatar tipi seçimi<br>
Aynı avatarın kullanıcı panelinde gösterilmesi<br>
Avatar yanında skor kartları

Gerçek kişiye benzeyen avatar olmayacak.


### 24.3. Kas Bölgesi Seçimi

MVP’de olacak kas bölgeleri:

Arms<br>
Core<br>
Legs<br>
Full Body

Gelişmiş kas haritası şart değil.


### 24.4. Basit Günlük Plan Üretimi

MVP’de olacak:

Kullanıcının seçtiği kas bölgesine göre template-based plan üretimi<br>
Her planda 2-3 hareket<br>
Hareketlerde hedef tekrar/süre<br>
Tracking türü: camera veya manual

Örnek:

Core Plan:<br>
Plank - 30 sec - camera<br>
Squat - 10 reps - camera/manual<br>
Dead Bug - 12 reps - manual


### 24.5. Kamera ile En Az 1 Hareket Takibi

MVP’de mutlaka en az bir hareket kamerayla takip edilmeli.

En güvenli tercih:

Biceps Curl rep counter<br>
veya<br>
Plank timer

İdeal MVP:

Biceps Curl + Plank


### 24.6. Rule-Based Tamamlama Motoru

MVP’de olacak:

Hedef tekrar/süre<br>
Mevcut tekrar/süre<br>
Tamamlandı kontrolü<br>
Plan item status update

Örnek:

10/10 tekrar → completed<br>
30/30 saniye → completed


### 24.7. Twin Score Güncelleme

MVP’de olacak:

Egzersiz tamamlanınca ilgili skor artacak<br>
Challenge puanı artacak<br>
Progress ekranda görünecek

Örnek:

Core 48 → 53<br>
Consistency 74 → 76<br>
Challenge Points +10


### 24.8. AI Koç Yorumu

MVP’de olacak:

Plan sonrası veya egzersiz sonrası kişisel yorum

Bu gerçek LLM ile olabilir veya mock cevapla gösterilebilir.

Örnek:

Bugünkü core hedefini tamamladın. Plank performansın hedefin üzerinde ancak form skorunu geliştirmek için kalça hizanı daha stabil tutmanı öneriyorum.


### 24.9. Admin Panel

MVP’de olacak:

Genel dashboard<br>
Üye listesi<br>
Challenge oluşturma ekranı<br>
Leaderboard ekranı<br>
Basit kampanya/ödül tanımlama


### 24.10. Challenge Oluşturma

MVP’de olacak:

Challenge adı<br>
Süre<br>
Metrik<br>
Ödül<br>
Aktif/pasif durumu

Örnek:

30 Gün Devamlılık Ligi<br>
Ödül: 1 ay ücretsiz üyelik<br>
Metrik: completed workout + check-in


### 24.11. Leaderboard

MVP’de olacak:

Kullanıcı puanları<br>
Sıralama<br>
Egzersiz tamamlanınca puanın artması

Gerçek zamanlı olmasa da olur. Sayfa yenilenince güncellenmesi yeterli.


### 24.12. Admin AI Insight

MVP’de olacak:

Basit AI/mocked öneri kartı

Örnek:

Son 7 günde düşük devamlılık gösteren üyeler için “Geri Dönüş Challenge” başlatılması önerilir.


### 24.13. Mobil ve Web Ayrımı

MVP’de olacak:

Mobil uyumlu kullanıcı ekranı<br>
Web admin panel<br>
Aynı kullanıcı/avatar verisinin iki tarafta görünmesi

Tam native mobil uygulama şart değil.


### 24.14. Demo Akışı

MVP’de kesin gösterilecek akış:

1. Kullanıcı Sport AI Twin oluşturur.<br>
2. Kas bölgesi seçer.<br>
3. Sistem plan üretir.<br>
4. Kullanıcı kamerayla bir hareket tamamlar.<br>
5. Twin skoru güncellenir.<br>
6. AI koç yorumu gelir.<br>
7. Admin panelde leaderboard/challenge tarafı görünür.


## 25. MVP’de Olmayıp Projede Sunulacaklar

Bunlar 24 saatlik MVP’de yapılmayacak ama proje vizyonunda anlatılacak özelliklerdir.

### 25.1. Gerçek Kişiye Benzeyen 3D Vücut Modeli

MVP’de olmayacak.

Vizyon:

İleri aşamada kullanıcının ek ölçüleri veya isteğe bağlı vücut taramasıyla daha kişiselleştirilmiş avatar üretilecek.

MVP’de sadece temsilî avatar olacak.


### 25.2. Tam Otomatik Ağırlık Algılama

MVP’de olmayacak.

Vizyon:

İleri aşamada dambıl/plaka üzerindeki ağırlıklar OCR veya ekipman tanıma ile otomatik okunabilir.

MVP’de ağırlık manuel girilebilir veya hiç kullanılmayabilir.


### 25.3. Tüm Egzersizleri Otomatik Tanıma

MVP’de olmayacak.

Vizyon:

İleri aşamada sistem kullanıcının hangi hareketi yaptığını otomatik sınıflandırabilir.

MVP’de kullanıcı egzersizi kendisi seçecek, sistem sadece seçili hareketi takip edecek.


### 25.4. Çoklu Kişi Takibi

MVP’de olmayacak.

Vizyon:

Spor salonunda aynı anda birden fazla kişiyi izlemek için person tracking ve station-based kamera eşleştirme kullanılabilir.

MVP’de tek kullanıcı ve tek kamera senaryosu olacak.


### 25.5. Çoklu Kamera Salon Entegrasyonu

MVP’de olmayacak.

Vizyon:

Her makine veya istasyon için ayrı kamera kurulumu ya da mevcut güvenlik kameralarıyla entegrasyon yapılabilir.

MVP’de laptop/webcam üzerinden demo yapılacak.


### 25.6. Yüz Tanıma ile Kullanıcı Tanıma

MVP’de olmayacak.

Vizyon:

Gerekirse ileri aşamada KVKK uyumlu alternatif kimlik doğrulama yöntemleri araştırılabilir.

Ama önerilen yöntem:

QR check-in<br>
Mobil check-in<br>
NFC kart<br>
Salon üyelik ID’si

Yüz tanıma özellikle KVKK nedeniyle sunumda dikkatli ele alınmalı.


### 25.7. Gerçek Churn Prediction ML Modeli

MVP’de olmayacak.

Vizyon:

İleri aşamada geçmiş check-in, antrenman tamamlama, challenge katılımı ve üyelik yenileme verileriyle churn prediction modeli geliştirilebilir.

MVP’de churn riski rule-based olacak.


### 25.8. Gelişmiş Sakatlık Riski Analizi

MVP’de olmayacak.

Vizyon:

İleri aşamada form skorları, hareket geçmişi ve yorgunluk trendleriyle sakatlık riskini azaltmaya yönelik uyarılar geliştirilebilir.

MVP’de sadece basit form uyarıları olacak.


### 25.9. Profesyonel PT Paneli

MVP’de olmayacak.

Vizyon:

Personal trainer’lar üyelerinin gelişimini görebilir, planları düzenleyebilir ve AI önerilerini onaylayabilir.

MVP’de sadece admin panel olacak.


### 25.10. Native Mobil Uygulama

MVP’de olmayacak veya sınırlı olacak.

Vizyon:

iOS ve Android için native uygulama geliştirilebilir.

MVP’de responsive web/PWA yeterli.


### 25.11. IoT Sensör Entegrasyonu

MVP’de olmayacak.

Vizyon:

Ağırlık makineleri, akıllı dambıllar, nabız sensörleri veya wearable cihazlarla entegrasyon yapılabilir.

MVP tamamen kamera + manuel veri + skor sistemiyle çalışacak.


### 25.12. Gerçek Zamanlı Salon İçi Büyük Ekran

MVP’de olmayacak.

Vizyon:

Salon içindeki büyük ekranlarda aktif challenge leaderboard’u ve başarı rozetleri gösterilebilir.

Bu, ticari sunumda güzel bir gelecek fazı olarak anlatılabilir.


### 25.13. Gelişmiş Beslenme Önerisi

MVP’de olmayacak.

Vizyon:

Kullanıcının hedefi ve antrenman yoğunluğuna göre temel beslenme önerileri sunulabilir.

Ancak sağlık/tıbbi iddia olmaması gerekir.


### 25.14. Tam Kişiselleştirilmiş AI Antrenman Programı

MVP’de olmayacak.

Vizyon:

İleri aşamada sistem geçmiş performans, form skoru, yorgunluk, hedef ve devamlılık verilerine göre haftalık/aylık programı otomatik optimize edebilir.

MVP’de planlar template-based olacak, AI sadece açıklama ve yorum üretecek.


### 25.15. Gelişmiş VLM Kullanımı

MVP’de olmayacak.

Vizyon:

İleri aşamada görsel dil modelleriyle hareket formu daha detaylı yorumlanabilir, ancak gerçek zamanlı ana takip için rule-based + pose estimation yaklaşımı korunabilir.

MVP’de VLM şart değil.


## 26. Son Proje Cümlesi

Sunumda ana proje cümlesi şu olabilir:

**Sport AI Twin, spor salonu üyeleri için temsilî dijital spor ikizi oluşturan; kas bölgesine göre antrenman planı hazırlayan, temel hareketleri kamerayla otomatik tamamlatan, AI koç yorumu sunan ve spor salonlarına challenge/kampanya yönetimiyle üyelik devamlılığını artırma imkânı veren B2B spor teknolojisi platformudur.**

Teknik cümle:

**MVP’de MediaPipe Pose ve OpenCV ile vücut landmark’ları çıkarılır; tekrar ve süre takibi rule-based state machine ile yapılır; AI katmanı ise plan açıklaması, antrenman sonrası koçluk yorumu ve admin retention önerileri için kullanılır.**

Bu haliyle proje hem gerçekçi hem de etkileyici görünür.
