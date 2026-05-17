# VOICE LAST

Bu sürümde sesli koçluk hattı, `VOICE.md` içindeki hibrit stratejiye sadık kalacak şekilde yeniden kurulmuştur.

## Ne değişti?

* `src/voice/coaching_engine.py`
  Gemini 2.5 Flash ile yapılandırılmış JSON cue üretimi yapıyor.
  Librosa'dan gelen BPM, beat listesi ve enerji profilini prompt içine koyuyor.
  Hazırlık cue'ları için yaklaşık `target - 2.0s`, tetikleyici cue'lar için yaklaşık `target - 0.35s` latency telafili beat noktaları hesaplanıyor.

* `src/voice/tts_engine.py`
  Tek parça metin yerine her cue için ayrı ses klibi üretiyor.
  Klipler paralel olarak oluşturuluyor.
  Her klip için `lead_in_ms` ve `duration_ms` ölçülerek miksaj katmanına aktarılıyor.

* `src/voice/main.py`
  `full_text = " ".join(...)` yaklaşımı tamamen kaldırıldı.
  Orijinal müzik ile cue klipleri `pydub.AudioSegment.overlay()` kullanılarak milisaniye bazında karıştırılıyor.
  Miks konumu şu mantıkla belirleniyor:
  `cue_time_ms - lead_in_ms - playback_latency_ms`

* `src/voice/audio_analyzer.py`
  Analiz çıktısına `energy_profile` eklendi.
  `m4a` uyumsuzlukları için ffmpeg tabanlı WAV fallback korundu.

* `src/voice/test_voice.py`
  Dinamik program üretip hibrit hattı uçtan uca çalıştırıyor.
  Terminalde Gemini cue JSON'unu, miks loglarını ve çıktı doğrulamasını gösteriyor.

## Doğrulanan davranış

`python src/voice/test_voice.py` çalıştırıldığında:

* Gemini dinamik cue JSON üretti.
* Her cue için ayrı TTS klibi oluşturuldu.
* Miksaj loglarında milisaniye seviyesinde overlay pozisyonları görüldü.
* `src/voice/output_test.mp3` başarıyla üretildi.
* Çıktı süresi giriş müziğiyle eşleşti (`169.5s`).

## Diyagram kaynakları

* [workflows/voice_hybrid_workflow.puml](/home/neo/Downloads/METU%20SPORTS%20HACKHATON/metu-sports-hackhaton/workflows/voice_hybrid_workflow.puml)
* [workflows/voice_hybrid_sequence.puml](/home/neo/Downloads/METU%20SPORTS%20HACKHATON/metu-sports-hackhaton/workflows/voice_hybrid_sequence.puml)

Bu oturumda PlantUML MCP veya yerel `plantuml` binary'si mevcut olmadığı için `.svg` render alınmadı; fakat `.puml` kaynakları doğrudan hazırlandı.
