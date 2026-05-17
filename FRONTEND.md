# 🎨 SkateSync AI Frontend Mimari ve Kullanıcı Deneyimi (UX/UI)

Bu doküman, arka plandaki `VOICE_LAST.md` (Hibrit Sesli Koçluk) ve `VISION.md` (VLM tabanlı Video Analizi) stratejilerini baz alarak, frontend katmanında kullanıcının (sporcu veya koç) SkateSync AI ile nasıl etkileşime gireceğini detaylandırır.

SAYFA BASİT OLACAK Kİ TEKNİK OLMAYAN KULLANICI ANLASIN


## 1. Temel İşlevler ve Arayüz Bileşenleri

### A. Hareket Kataloğu ve AI'nin Bildiği Hareketler
`knowledge/` klasöründeki bilgi tabanı frontend tarafında görünür bir özellik olarak kullanılmalıdır. Kullanıcı sistemin hangi hareketleri tanıdığını açıkça görmelidir. Bu bölüm teknik değil, güven verici ve anlaşılır olmalıdır.

- **Hareket Kataloğu Kartları:** Arayüzde AI'nin tanıdığı temel hareket aileleri kartlar halinde gösterilir.
  - `Atlayışlar:` Axel, Salchow, Loop, Toe Loop, Flip, Lutz
  - `Dönüşler:` Sit Spin, Camel Spin, Upright Spin, Scratch Spin, Layback Spin, Biellmann
  - `Step / Turn:` Three Turns, Bracket, Rocker and Counter, Mohawk, Twizzle
  - `Geçiş ve Vurgu Hareketleri:` Spiral, Ina Bauer, Spread Eagle, Lunge, Cantilever, Choreographic Sequence, Final Pose
- **Basit Açıklama Metni:** Her hareket için 1 cümlelik sade açıklama gösterilir. Amaç teknik eğitim vermek değil, kullanıcının "AI bu hareketi biliyor" hissini almasıdır.
- **Kategori Filtreleme:** Kullanıcı isterse sadece `Jump`, `Spin`, `Transition`, `Turns` gibi kategorileri görebilir.
- **Koçluk İpucu Önizlemesi:** Bilgi tabanındaki `coaching_cues`, `timing_cues`, `stability_cues` gibi alanlar doğrudan ham veri gibi değil; küçük, doğal dilde ipucu kartları olarak sunulmalıdır.
- **Kullanım Amacı Açıklaması:** Bu bölümde kısa bir metin yer almalı:
  "SkateSync AI bu hareket sözlüğünü kullanarak plan üretir, videoyu inceler ve geri bildirim verir."

### B. Müzik Yükleme ve Sesli Koçluk (Voice Coaching)
Bu bölüm, sistemin otonom olarak müzik analizini yapıp sporcuya dinamik bir koreografi planı hazırladığı aşamadır.

- **Müzik Yükleme Arayüzü:** Kullanıcı, kullanacağı antrenman müziğini sisteme yükler.
- **Otonom Koreografi Çizelgesi (Timeline):** Arka plan (Gemini Flash + Librosa), müzik enerjisine göre 10-15 hareketlik bir plan oluşturduğunda, frontend bu planı interaktif bir zaman çizelgesinde (Timeline) gösterir. Hangi saniyede (örn: `166.255s`) hangi hareketin tetikleneceği pinler halinde işaretlenir.
  Bu timeline içindeki hareket isimleri doğrudan `knowledge` klasöründeki katalogla tutarlı olmalıdır. Örneğin kullanıcı planda `Sit Spin`, `Toe Loop`, `Ina Bauer` veya `Final Pose` gibi hareketleri görmelidir.
- **Miksajlı Ses Çalar (Audio Player):** Sistem, sesli yönlendirmelerin (cue) "Snap to Beat" algoritmasıyla müziğe tam oturtulmuş halini miksleyerek (`output_test.mp3`) kullanıcıya dinletir. 

### C. Video İnceleme ve Skorlama (Vision Review)
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
  - **Hareket Bazlı Yorum:** Review ekranında analiz edilen eleman, katalogdaki adıyla gösterilmelidir. Örneğin:
    - `Camel Spin - Stabilite iyi, merkez az miktarda geziyor`
    - `Toe Loop - Kalkış ritmi doğru, iniş akışı kısa kaldı`
    - `Final Pose - Müzik kapanışıyla senkron`

## 2. Kullanıcı Akışı (User Flow)

Sistemin başından sonuna kullanım senaryosu şu şekilde gerçekleşir:

1. **Hazırlık:** Sporcu, web arayüzüne antrenman müziğini yükler.
2. **Hareket Bilgisi Görme:** Sporcu isterse sistemin bildiği hareketleri katalog ekranında görür ve hangi hareket mantığıyla plan üretildiğini anlar.
3. **Planlama:** Sistem müziğin ruhunu anlar, hareket planını ve bu hareketlerin kulağa söyleneceği sesli yönergeleri içeren mikslenmiş bir MP3 dosyası sunar.
4. **Aksiyon:** Sporcu kulaklığını takar, web arayüzündeki MP3'ü başlatır ve sistemden gelen yönergelere göre hareketleri gerçekleştirir. Bu esnada videoya kaydedilir.
5. **Analiz İsteme:** Sporcu videoyu sisteme yükler, analiz profili seçer (`Low` veya `High`).
6. **Rapor İnceleme:** Sistem, sporcunun ne kadar senkronize olduğunu planla karşılaştırarak yüzdelik skorlar ve teknik ipuçlarıyla dolu antrenman özetini ekrana yansıtır.

## 3. Frontend Geliştirme Notları (Teknik Beklentiler)

- **Kullanım Kolaylığı (Sadelik):** Hedef kitle sporcular ve antrenörler olduğu için, frontend **teknik olmayan kullanıcılar için olabildiğince basit**, anlaşılır ve karmaşadan uzak (minimalist) olmalıdır. Gereksiz teknik ayarlar arka planda halledilmeli, kullanıcıya sadece "Yükle ve Başla" rahatlığı sunulmalıdır.
- **Bileşen Kütüphaneleri:** Modern ve akıcı bir arayüz için `Tailwind CSS` ve `Framer Motion` (mikro-animasyonlar) kullanılmalıdır. Uygulama bir "Spor Uygulaması" ruhu taşımalı (koyu mod, yüksek kontrastlı renkler, dinamik his).
- **Zaman Çizelgesi Entegrasyonu:** Müzik ve video oynatıcılar (Player), saniye bazlı JSON marker'ları ile senkronize çalışacak şekilde geliştirilmelidir. Videonun tam "peak" (zirve) noktasında UI tarafında vurgulu bir efekt verilebilir.
- **Durum Yönetimi:** Analiz (Vision) katmanının işlenmesi uzun sürebileceğinden, analiz boyunca kullanıcıya süreci anlatan güzel loading ekranları (iskelet yükleyiciler veya ilerleme çubukları) gösterilmelidir.
- **Knowledge Entegrasyonu:** `knowledge/figure_skating_knowledge.json` ve `knowledge/skating-movement-catalog.md` frontend için sadece arka plan verisi değildir; kullanıcıya görünür katalog, örnek hareket kartları, timeline isimleri ve review etiketleri bu ortak sözlükten beslenmelidir.
- **İsim Tutarlılığı:** Frontend'de kullanılan hareket adları ile AI planlama / vision review katmanında kullanılan hareket adları birebir aynı tutulmalıdır. Böylece kullanıcı `Sit Spin` gördüğünde hem planda hem de analiz sonucunda aynı terimi görür.
