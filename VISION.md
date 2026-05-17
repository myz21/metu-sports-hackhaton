# Vision Stratejisi

Bu dokuman, SkateSync AI icin guncel video inceleme mimarisini aciklar.

Amacimiz hareketi otomatik olarak siniflandirmak degil. Planlanan hareket listesi zaten koreografi timeline'indan geliyor. Vision katmani, sporcunun kaydedilen performansini bu planlanan timeline ile karsilastirip MVP seviyesinde antrenman skoru ve geri bildirim uretmek icin kullaniliyor.

Bu branch'te `voice` ve `vision` birlikte dusunulur:

- `voice` hareket planini ve sesli cue'lari uretir
- `vision` ayni `planned_elements` yapisini kullanarak videoyu degerlendirir

## Guncel yaklasim

Varsayilan backend artik `OpenAI VLM + local RAG + deterministic scoring`.

Kullaniciya iki analiz secenegi sunulur:

- `low`: daha ucuz ve daha hizli gunluk review modu
- `high`: daha pahali ama daha zengin demo / coach review modu

Ana kod [src/vision](</d:/metu-sports-hackhaton/__worktree_ai_core/src/vision>) altinda:

- [cli.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/vision/cli.py>): komut satiri giris noktasi
- [vlm_review.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/vision/vlm_review.py>): OpenAI vision ile planned-vs-actual inceleme
- [frame_extractor.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/vision/frame_extractor.py>): planlanan zaman araligindan ornek frame cikarir
- [rag.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/vision/rag.py>): local skating corpus icinden baglam ceker
- [llm_feedback.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/vision/llm_feedback.py>): opsiyonel aciklama katmani

Local skating corpus su dosyada tutulur: [figure_skating_knowledge.json](</d:/metu-sports-hackhaton/__worktree_ai_core/src/vision/knowledge/figure_skating_knowledge.json>).

## Sistem ne yapiyor

Girdi:

- `video_path`
- `planned_elements`

Her planned element su alanlari icerir:

- `name`
- `type`
- `start_time`
- `end_time`
- `music_peak_time`

Her planned element icin sistem:

1. Sadece planlanan zaman araligini, kucuk bir padding ile okur.
2. Tum videoyu gondermek yerine birkac temsilci frame secer.
3. Local knowledge base'den kisa skating baglami ceker.
4. Ornek frame'leri ve planlanan zaman bilgisini OpenAI vision modeline yollar.
5. Modelden sadece algisal tahminler ister:
   - gorunen baslangic zamani
   - gorunen bitis zamani
   - gorunen peak zamani
   - stabilite degerlendirmesi
   - confidence
   - kisa coaching cue
6. Son etiketleri ve skorlari kod tarafinda hesaplar.

Cikti su bilgileri icerir:

- element bazli `execution_match_score`
- deterministic timing comparison
- deterministic `timing_assessment`
- deterministic `duration_assessment`
- deterministic `music_alignment_assessment`
- sporcuya gosterilecek opsiyonel LLM aciklamasi

## Sistem ne yapmiyor

- Skating hareketlerini sifirdan siniflandirmiyor.
- Resmi hakem kurallari kullanmiyor.
- Kocu veya resmi puanlamayi degistirmeyi hedeflemiyor.
- Videoyu JSON'a cevirmeyi gerektirmiyor.

Planned JSON, videonun donusturulmus hali degil; sadece referans plan.

## Inceleme akisi

Urun akisinda:

1. Muzik yuklenir.
2. SkateSync AI bir koreografi timeline'i uretir veya kaydeder.
3. Sporcu antrenman videosunu ceker.
4. Sporcu planlanan timeline'i secer.
5. Vision, kaydedilen performansi bu planla karsilastirir.
6. Sistem sunlari dondurur:
   - genel uyum skoru
   - element bazli skorlar
   - timing offset'leri
   - coaching yonlendirmesi

Bu sistem, planned-vs-actual training review sistemi olarak tasarlandi.

## Skorlama stratejisi

VLM algi icin kullaniliyor, final skor icin degil.

Model, goruntu uzerinde ne oldugunu tahmin eder. Kod ise skoru hesaplar.

Guncel skor bilesenleri:

- `start_score`
- `duration_score`
- `stability_score`
- `music_alignment_score`
- `confidence_score`

Agirliklar element tipine gore degisir. Ornegin spin'lerde stabilite, bazi diger element tiplerine gore daha yuksek agirlik alir.

Bu ayirim onemli:

- VLM: "frame'lerde ne gorunuyor gibi"
- Rule engine: "skor nasil hesaplanacak"
- Opsiyonel LLM pass: "sporcuya bu sonuc nasil anlatilacak"

## Neden deterministic etiketler eklendi

Onceki VLM ciktilari bazen sayisal offset ile celisen timing yorumlari uretebiliyordu. Ornegin pozitif bir start offset, sporcunun gec basladigini gosterir; fakat serbest dogal dil yorumu yine de "early" diyebiliyordu.

Bu artik kod tarafinda duzeltildi.

VLM artik su son etiketleri belirlemiyor:

- `early / on_time / late`
- `short / on_target / long`
- `strong / moderate / weak` music alignment

Bu etiketler artik [vlm_review.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/vision/vlm_review.py>) icinde offset'lerden turetiliyor.

## Token ve maliyet stratejisi

Cok elementli uzun videolar, her elemente fazla frame veya fazla baglam gonderilirse pahali olabilir.

Token kullanimini somut olarak birkac yolla dusurduk.

### 1. Tum video yerine pencere bazli inceleme

2 dakikalik videonun tamami modele gonderilmiyor.

Sadece planlanan element pencereleri inceleniyor. En buyuk maliyet dusurme etkisi burada.

### 2. Quality profilleri artik kullanici secimiyle calisiyor

VLM backend artik iki net quality profili sunuyor:

- `low`
  - daha ucuz
  - daha hizli
  - gunluk antrenman review icin uygun
- `high`
  - daha pahali
  - daha fazla gorsel baglam kullanir
  - demo, coach review ve daha kritik seanslar icin uygun

### 3. Element basina kontrollu frame butcesi

`low` profil icinde adaptif frame butcesi kullaniliyor:

- cok kisa pencere: 2 frame
- tipik element penceresi: 3 frame
- daha uzun pencere: 4 frame

`high` profil ise daha fazla frame kullanabilir; bu nedenle daha pahali ama genelde daha guvenilir review verir.

### 4. Image detail kalite profiline gore degisiyor

OpenAI Responses API image detail seviyelerini destekliyor.

- `low` profil: `detail: "low"`
- `high` profil: `detail: "high"`

### 5. Daha kucuk frame payload'i

JPEG encode etmeden once ornek frame'ler kalite profiline gore resize ve compress edilebiliyor.

### 6. Compact RAG context

Local skating RAG baglami `low` profil icinde kisaltiliyor.

### 7. Ikinci LLM pass sadece gerekirse

`--include-llm-feedback` kullanilmazsa sistem ek OpenAI aciklama cagrisi yapmaz.

## Guncel CLI kullanimi

Temel VLM review:

```bash
python -m src.vision "video.mp4" "plan.json" --quality low
```

Daha yuksek ayrinti:

```bash
python -m src.vision "video.mp4" "plan.json" --quality high
```

Sonucu dosyaya yazmak:

```bash
python -m src.vision "video.mp4" "plan.json" --output review_result.json
```

Opsiyonel LLM aciklamasi:

```bash
python -m src.vision "video.mp4" "plan.json" --quality high --include-llm-feedback --language Turkish
```

## Bilinen sinirlar

- Sistem, planned timeline kalitesine bagimlidir.
- Sporcu approximate bir plan JSON'u eliyle uretirse skorlar yon gosterebilir ama tam dogru olmaz.
- Frame tabanli VLM review hala MVP seviyesinde bir heuristic; tam hareket rekonstruksiyonu degil.
- Music alignment, resmi hakem mantigindan degil; planned timing ve gorunen peak anlarindan cikariliyor.
- Birden fazla kisi olan sahneler, kotu framing veya ciddi motion blur confidence'i dusurebilir.
- `high` profil bile resmi judging dogrulugu iddia etmez.
