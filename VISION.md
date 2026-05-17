# SkateSync AI Vision Strategy

Bu doküman, SkateSync AI için güncel video inceleme mimarisini açıklar.

## Güncel Hedef

Amacımız hareketi otomatik olarak sınıflandırmak değil. Planlanan hareket listesi zaten koreografi timeline'ından geliyor. Vision katmanı, sporcunun kaydedilen performansını bu planlanan timeline ile karşılaştırıp MVP seviyesinde antrenman skoru ve geri bildirim üretmek için kullanılıyor.

Bu branch'te `voice` ve `vision` birlikte düşünülür:
- `voice` hareket planını ve sesli cue'ları üretir.
- `vision` aynı `planned_elements` yapısını kullanarak videoyu değerlendirir.

---

## Güncel Yaklaşım

Varsayılan backend artık `OpenAI VLM + local RAG + deterministic scoring`.

Kullanıcıya iki analiz seçeneği sunulur:
- `low`: Daha ucuz ve daha hızlı günlük review modu.
- `high`: Daha pahalı ama daha zengin demo / coach review modu.

Ana kod `src/vision` altında konumlanmıştır:
- `src/vision/cli.py`: Komut satırı giriş noktası.
- `src/vision/vlm_review.py`: OpenAI Vision ile planned-vs-actual inceleme.
- `src/vision/frame_extractor.py`: Planlanan zaman aralığından örnek frame çıkarır.
- `src/vision/rag.py`: Local skating corpus içinden bağlam çeker.
- `src/vision/llm_feedback.py`: Opsiyonel açıklama katmanı.

Local skating corpus şu dosyada tutulur: `src/vision/knowledge/figure_skating_knowledge.json`.

---

## Sistem Ne Yapıyor

**Girdi:**
- `video_path`
- `planned_elements`

Her planned element şu alanları içerir:
- `name`
- `type`
- `start_time`
- `end_time`
- `music_peak_time`
Her planned element için sistem:
1. Sadece planlanan zaman aralığını, küçük bir padding ile okur.
2. Tüm videoyu göndermek yerine birkaç temsilci frame seçer.
3. Local knowledge base'den kısa skating bağlamı çeker.
4. Örnek frame'leri ve planlanan zaman bilgisini OpenAI Vision modeline yollar.
5. Modelden sadece algısal tahminler ister:
   - Görünen başlangıç zamanı
   - Görünen bitiş zamanı
   - Görünen peak zamanı
   - Stabilite değerlendirmesi
   - Confidence (güven seviyesi)
   - Kısa coaching cue
6. Son etiketleri ve skorları kod tarafında hesaplar.

**Çıktı:**
- Element bazlı `execution_match_score`
- Deterministic timing comparison
- Deterministic `timing_assessment`
- Deterministic `duration_assessment`
- Deterministic `music_alignment_assessment`
- Sporcuya gösterilecek opsiyonel LLM açıklaması

---

## Sistem Ne Yapmıyor

- Skating hareketlerini sıfırdan sınıflandırmıyor.
- Resmi hakem kuralları kullanmıyor.
- Koçu veya resmi puanlamayı değiştirmeyi hedeflemiyor.
- Videoyu JSON'a çevirmeyi gerektirmiyor.

---

## Skorlama Stratejisi

VLM algı için kullanılıyor, final skor için değil. Model, görüntü üzerinde ne olduğunu tahmin eder; kod ise skoru hesaplar.

Güncel skor bileşenleri:
- `start_score`
- `duration_score`
- `stability_score`
- `music_alignment_score`
- `confidence_score`

Ağırlıklar element tipine göre değişir. Örneğin spin'lerde stabilite, bazı diğer element tiplerine göre daha yüksek ağırlık alır.

---

## Neden Deterministic Etiketler Eklendi

Önceki VLM çıktıları bazen sayısal offset ile çelişen timing yorumları üretebiliyordu. Örneğin pozitif bir start offset, sporcunun geç başladığını gösterir; fakat serbest doğal dil yorumu yine de "early" diyebiliyordu.

Bu artık kod tarafında düzeltildi. VLM artık şu son etiketleri belirlemiyor (bu etiketler artık `vlm_review.py` içinde offset'lerden türetiliyor):
- `early / on_time / late`
- `short / on_target / long`
- `strong / moderate / weak` music alignment
---

## Token ve Maliyet Stratejisi

Çok elementli uzun videolar, her elemente fazla frame veya fazla bağlam gönderilirse pahalı olabilir. Token kullanımını somut olarak birkaç yolla düşürdük:

1. **Pencere Bazlı İnceleme:** 2 dakikalık videonun tamamı modele gönderilmiyor. Sadece planlanan element pencereleri inceleniyor.
2. **Kullanıcı Kalite Seçimi:** VLM backend artık iki net kalite profili sunuyor: `low` (daha hızlı/ucuz) ve `high` (daha fazla görsel bağlam ve detay).
3. **Frame Bütçesi:** `low` profilde adaptif frame bütçesi (2-4 frame) kullanılırken, `high` profilde zengin frame örneklemesi yapılır.
4. **Detail Parametresi:** OpenAI vision detay seviyesi `low` için `"low"`, `high` için `"high"` olarak ayarlanır.
5. **Frame Payload Boyutu:** Örnek frame'ler kalite profiline göre resize ve compress edilir.
6. **Kompakt RAG:** RAG bağlamı `low` profil içinde kısaltılır.
7. **Opsiyonel İkinci LLM Geçişi:** `--include-llm-feedback` kullanılmadıkça ek bir LLM açıklaması çağrısı yapılmaz.

---

### Kalite Profilleri ve Frame Bütçesi

VLM backend artık iki net kalite profili sunuyor:
* `low` (Günlük antrenman review, düşük detay/kısa frame bütçesi)
* `high` (Demo ve antrenör seviyesi review, geniş frame kullanımı)

## Güncel CLI Kullanımı

### Günlük ve Daha Ucuz Review:
```bash
python -m src.vision "video.mp4" "plan.json" --quality low
```

### Daha Yüksek Ayrıntı:
```bash
python -m src.vision "video.mp4" "plan.json" --quality high
```

### Sonucu Dosyaya Yazmak:
```bash
python -m src.vision "video.mp4" "plan.json" --output review_result.json
```

### Opsiyonel LLM Açıklaması:
```bash
python -m src.vision "video.mp4" "plan.json" --quality high --include-llm-feedback --language Turkish
```

- OpenAI response icinden request-level usage loglamak
- frontend icinde cost control ayarlari acmak
- hizli bir first-pass ve sadece gerekirse pahali second-pass retry stratejisi eklemek
- review run'larini ve planlari tarihsel karsilastirma icin birlikte saklamak
- music analysis pipeline'indan beat marker bilgisini opsiyonel olarak eklemek
## Frontend İçin Okunacak Ana Alanlar

Vision review JSON içinde frontend'in ilk aşamada odaklanması gereken alanlar:
- `overall.overall_match_score`
- `overall.average_start_score`
- `overall.average_duration_score`
- `overall.average_stability_score`
- `overall.average_music_alignment_score`
- `elements[]`
  - `name`
  - `scores.execution_match_score`
  - `timing_comparison`
  - `local_feedback`

- Frontend içinde cost control ayarları açmak
- Hızlı bir first-pass ve sadece gerekirse pahalı second-pass retry stratejisi eklemek
- Review run'larını ve planları tarihsel karşılaştırma için birlikte saklamak
- Music analysis pipeline'ından beat marker bilgisini opsiyonel olarak eklemek
- `high` profil doğruluğunu daha da zenginleştirmek
