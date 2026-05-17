# 🎨 SkateSync AI Frontend Mimari ve Kullanıcı Deneyimi (UX/UI)

Bu doküman, arka plandaki `VOICE_LAST.md` (Hibrit Sesli Koçluk) ve `VISION.md` (VLM tabanlı Video Analizi) stratejilerini baz alarak, frontend katmanında kullanıcının (sporcu veya koç) SkateSync AI ile nasıl etkileşime gireceğini detaylandırır.

SAYFA BASİT OLACAK Kİ TEKNİK OLMAYAN KULLANICI ANLASIN


## 1. Temel İşlevler ve Arayüz Bileşenleri

### A. Müzik Yükleme ve Sesli Koçluk (Voice Coaching)
Bu bölüm, sistemin otonom olarak müzik analizini yapıp sporcuya dinamik bir koreografi planı hazırladığı aşamadır.

- **Müzik Yükleme Arayüzü:** Kullanıcı, kullanacağı antrenman müziğini sisteme yükler.
- **Otonom Koreografi Çizelgesi (Timeline):** Arka plan (Gemini Flash + Librosa), müzik enerjisine göre 10-15 hareketlik bir plan oluşturduğunda, frontend bu planı interaktif bir zaman çizelgesinde (Timeline) gösterir. Hangi saniyede (örn: `166.255s`) hangi hareketin tetikleneceği pinler halinde işaretlenir.
- **Miksajlı Ses Çalar (Audio Player):** Sistem, sesli yönlendirmelerin (cue) "Snap to Beat" algoritmasıyla müziğe tam oturtulmuş halini miksleyerek (`output_test.mp3`) kullanıcıya dinletir. 

### B. Video İnceleme ve Skorlama (Vision Review)
Sporcu antrenmanı tamamladıktan sonra performansını yükleyerek AI değerlendirmesini bu modülde yapar.

- **Video ve Plan Eşleştirme:** Kullanıcı çektiği videoyu sisteme yükler ve daha önce hazırlanan "Planlı Koreografi (Planned Timeline)" ile eşleştirir.
- **Analiz Kalite Seçimi (Maliyet & Hız Kontrolü):** 
  VLM inceleme sistemine uygun olarak kullanıcı arayüzde iki farklı profil seçeneği görür:
  - `Hızlı İnceleme (Low Quality):` Günlük rutin antrenmanlar için ucuz, az frame harcayan hızlı mod.
  - `Detaylı İnceleme (High Quality):` Koç seviyesinde, yüksek çözünürlüklü ve fazla frame tarayan pahalı/kritik seans modu.
  - *(Opsiyonel)* "AI Detaylı Koçluk Yorumu İstiyorum" şeklinde bir Toggle (Switch) butonu ile ekstra LLM maliyeti kontrol edilebilir.
- **Sonuç ve Skor Ekranı:**
  - **Skor Kartları:** Element bazında hesaplanan `execution_match_score`, `start_score`, `stability_score` ve `music_alignment_score` UI üzerinde dairesel barlar (Progress rings) veya Radar grafikleriyle gösterilir.
  - **Zamanlama Rozetleri:** Arka planda deterministik olarak hesaplanan zamanlama hataları "Erken", "Tam Zamanında", "Geç" gibi renkli rozetlerle (Badge) belirtilir.
  - **Sohbet Tarzı Geri Bildirim:** Opsiyonel LLM açıklamaları, doğrudan bir koçun ağzından yazılmış gibi kartlar içinde doğal dille sunulur.

## 2. Kullanıcı Akışı (User Flow)

Sistemin başından sonuna kullanım senaryosu şu şekilde gerçekleşir:

1. **Hazırlık:** Sporcu, web arayüzüne antrenman müziğini yükler.
2. **Planlama:** Sistem müziğin ruhunu anlar, hareket planını ve bu hareketlerin kulağa söyleneceği sesli yönergeleri içeren mikslenmiş bir MP3 dosyası sunar.
3. **Aksiyon:** Sporcu kulaklığını takar, web arayüzündeki MP3'ü başlatır ve sistemden gelen yönergelere göre hareketleri gerçekleştirir. Bu esnada videoya kaydedilir.
4. **Analiz İsteme:** Sporcu videoyu sisteme yükler, analiz profili seçer (`Low` veya `High`).
5. **Rapor İnceleme:** Sistem, sporcunun ne kadar senkronize olduğunu planla karşılaştırarak yüzdelik skorlar ve teknik ipuçlarıyla dolu antrenman özetini ekrana yansıtır.

## 3. Frontend Geliştirme Notları (Teknik Beklentiler)

- **Kullanım Kolaylığı (Sadelik):** Hedef kitle sporcular ve antrenörler olduğu için, frontend **teknik olmayan kullanıcılar için olabildiğince basit**, anlaşılır ve karmaşadan uzak (minimalist) olmalıdır. Gereksiz teknik ayarlar arka planda halledilmeli, kullanıcıya sadece "Yükle ve Başla" rahatlığı sunulmalıdır.
- **Bileşen Kütüphaneleri:** Modern ve akıcı bir arayüz için `Tailwind CSS` ve `Framer Motion` (mikro-animasyonlar) kullanılmalıdır. Uygulama bir "Spor Uygulaması" ruhu taşımalı (koyu mod, yüksek kontrastlı renkler, dinamik his).
- **Zaman Çizelgesi Entegrasyonu:** Müzik ve video oynatıcılar (Player), saniye bazlı JSON marker'ları ile senkronize çalışacak şekilde geliştirilmelidir. Videonun tam "peak" (zirve) noktasında UI tarafında vurgulu bir efekt verilebilir.
- **Durum Yönetimi:** Analiz (Vision) katmanının işlenmesi uzun sürebileceğinden, analiz boyunca kullanıcıya süreci anlatan güzel loading ekranları (iskelet yükleyiciler veya ilerleme çubukları) gösterilmelidir.
