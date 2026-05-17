# OpenAI Tabanli Sesli Kocluk Mimarisi

Bu dokuman, SkateSync AI icindeki sesli kocluk hattinin guncel halini aciklar.

Bu surumde hedef:

- tek saglayici olarak OpenAI kullanmak
- hareket listesini `planned_elements` semasina oturtmak
- hareket sozlugunu LLM'e baglam olarak vermek
- gercek zamanli ama kisa ve gercekci kulaklik cue'lari uretmek

## Sistem nasil calisir

1. Sporcu muzigi yukler.
2. Sistem muzigi analiz eder:
   - tempo
   - beat noktalar
   - enerji profili
3. Eger elde hazir bir plan varsa, `planned_elements` dogrudan kullanilir.
4. Eger plan yoksa `ProgramPlanner`, OpenAI ile bir `planned_elements` listesi uretir.
5. `CoachingEngine`, bu hareketlerin hangi saniyede basladigini okur.
6. Kod tarafinda:
   - prep cue zamani
   - trigger cue zamani
   - gerekirse focus cue zamani
   hesaplanir.
7. OpenAI, her hareket icin kisa ama dogal cue metni uretir.
8. Istenirse OpenAI TTS ile her cue seslendirilir.
9. Istenirse cue sesleri muzik ustune mikslenir.

## Neden bu yapi kullanildi

- Hareket zamanlari ve cue anlari deterministik olmali.
- LLM sadece metni yazmali, saniyeyi keyfi degistirmemeli.
- Ayni hareket sozlugu hem planlama hem kocluk hem de ileride video review tarafinda kullanilabilmeli.

Bu nedenle sistem iki katmanli kuruldu:

- kod:
  - beat analizi
  - timing hesaplama
  - cue zamanlarinin sabitlenmesi
- OpenAI:
  - planned elements uretme
  - cue metinlerini dogal ve teknik sekilde yazma
  - TTS ile ses klibi uretme

## Klasor yapisi

Ana dosyalar [src/voice](</d:/metu-sports-hackhaton/src/voice>) altinda:

- [audio_analyzer.py](</d:/metu-sports-hackhaton/src/voice/audio_analyzer.py>)
- [program_planner.py](</d:/metu-sports-hackhaton/src/voice/program_planner.py>)
- [coaching_engine.py](</d:/metu-sports-hackhaton/src/voice/coaching_engine.py>)
- [tts_engine.py](</d:/metu-sports-hackhaton/src/voice/tts_engine.py>)
- [main.py](</d:/metu-sports-hackhaton/src/voice/main.py>)
- [cli.py](</d:/metu-sports-hackhaton/src/voice/cli.py>)

Hareket bilgisi:

- [figure_skating_knowledge.json](</d:/metu-sports-hackhaton/src/voice/knowledge/figure_skating_knowledge.json>)
- [skating-movement-catalog.md](</d:/metu-sports-hackhaton/src/voice/knowledge/skating-movement-catalog.md>)

## Girdi semasi

Sistemin temel ortak semasi:

```json
{
  "planned_elements": [
    {
      "name": "Sit Spin",
      "type": "spin",
      "start_time": 31.0,
      "end_time": 36.5,
      "music_peak_time": 34.0
    }
  ]
}
```

## OpenAI tarafinda neler kullaniliyor

- metin/planning/cue generation:
  `Responses API`
- structured JSON:
  `text.format -> json_schema`
- TTS:
  `audio.speech.create(...)`

Varsayilan model tercihleri:

- planner: `gpt-4o-mini`
- coach text: `gpt-4o-mini`
- TTS: `gpt-4o-mini-tts`

Istersen bunlari CLI ile override edebilirsin.

## Test etme

### 1. Paketleri kur

```bash
pip install -r src/voice/requirements.txt
```

### 2. OpenAI key tanimla

PowerShell:

```powershell
$env:OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

### 3. Hazir planla ucuz test

Bu testte TTS yok, sadece planner/cue JSON uretilir:

```powershell
python -m src.voice "C:\path\to\your-music-file.mp3" --plan "src/voice/examples/planned_elements.sample.json" --output-dir "src/voice/output/demo"
```

### 4. TTS ile test

Bu testte cue sesleri de uretilir:

```powershell
python -m src.voice "C:\path\to\your-music-file.mp3" --plan "src/voice/examples/planned_elements.sample.json" --include-tts --output-dir "src/voice/output/demo_tts"
```

### 5. TTS + miks test

Bu testte cue sesleri muzik ustune de oturtulur:

```powershell
python -m src.voice "C:\path\to\your-music-file.mp3" --plan "src/voice/examples/planned_elements.sample.json" --include-tts --mix-audio --output-dir "src/voice/output/demo_mix"
```

### 6. Plansiz test

Bu testte sistem once planned elements uretir, sonra cue yazar:

```powershell
python -m src.voice "C:\path\to\your-music-file.mp3" --output-dir "src/voice/output/generated_plan"
```

## Test sonucunda ne beklemelisin

Cikti klasorunde sunlar olusur:

- `audio_analysis.json`
- `planned_elements.json`
- `coaching_cues.json`
- `coaching_cues.txt`
- opsiyonelse `cue_audio_files.json`
- opsiyonelse `coaching_mix.mp3`

## Bilinen sinirlar

- Bu sistem gercek zamanli streaming degil; offline ya da near-offline cue uretir.
- Cue metinleri OpenAI tarafindan yazilir ama cue zamanlari kod tarafinda belirlenir.
- TTS ve mix acik oldugunda maliyet ve sure artar.
- Planner ciktisi hala MVP seviyesinde koreografi taslagidir; hakem seviyesi resmi plan degildir.
