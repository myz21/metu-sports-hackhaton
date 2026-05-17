# SkateSync AI - Frontend Handoff Ozeti

Bu branch, frontend ekibine verilecek guncel MVP yapisini icerir.

Ana parcalar:

- React frontend prototipi: `src/`
- sesli planlama ve TTS hattı: `src/voice/`
- videodan skor ve yorum ureten review hattı: `src/vision/`

Bu branch'in amaci, frontend'in baglanacagi giris noktalarini ve veri yapilarini net tutmaktir.

## Frontend icin aktif akis

1. Kullanici muzigi yukler.
2. `src.voice` muzigi analiz eder ve `planned_elements.json` uretir.
3. Ayni akis `coaching_cues.json` uretir.
4. Istenirse TTS ve `coaching_mix.mp3` uretilir.
5. Kullanici antrenman videosu yukler.
6. `src.vision` video ile `planned_elements.json` dosyasini karsilastirir.
7. Sonuc olarak review JSON ve skorlar doner.

## Frontend'in kullanmasi gereken temel veri dosyalari

### Voice tarafi

- `planned_elements.json`
- `coaching_cues.json`
- `coaching_cues.txt`
- opsiyonelse `coaching_mix.mp3`

### Vision tarafi

- review output JSON
- `overall_match_score`
- element bazli skorlar
- element bazli timing offset'leri
- opsiyonelse LLM feedback alanlari

## Frontend icin temel semalar

### Planned elements

```json
{
  "planned_elements": [
    {
      "name": "Camel Spin",
      "type": "spin",
      "start_time": 31.0,
      "end_time": 36.5,
      "music_peak_time": 34.0
    }
  ]
}
```

### Coaching cues

```json
{
  "cues": [
    {
      "element_index": 0,
      "element_name": "Camel Spin",
      "element_type": "spin",
      "cue_kind": "trigger",
      "time": 30.8,
      "text": "Camel spin, hattı uzat"
    }
  ]
}
```

### Vision review

Review JSON icinde frontend'in ilk asamada okuyacagi temel alanlar:

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

## Klasorler ne ise yariyor

### Frontend

- `src/App.jsx`
- `src/pages/`
- `src/components/`
- `src/data/mockData.js`

### Voice

- `src/voice/audio_analyzer.py`
- `src/voice/program_planner.py`
- `src/voice/coaching_engine.py`
- `src/voice/tts_engine.py`
- `src/voice/main.py`
- `src/voice/cli.py`

### Vision

- `src/vision/vlm_review.py`
- `src/vision/frame_extractor.py`
- `src/vision/rag.py`
- `src/vision/llm_feedback.py`
- `src/vision/cli.py`

## Bu branch'te fazla / tekrar eden kisimlar

Frontend gelistirirken bunlari aktif kaynak olarak alma:

### 1. Tekrar eden knowledge dosyalari

Ayni hareket bilgisi hem burada var:

- `src/voice/knowledge/`
- `src/vision/knowledge/`

Bu tekrarli bir yapi. Simdilik iki taraf kendi kopyasini kullaniyor. Frontend tek bir katalog gosterecekse birini referans almak daha dogru.

Pratik tercih:

- frontend gosterimi icin `src/vision/knowledge/skating-movement-catalog.md`

### 2. Workflow dosyalari

`workflows/` altinda birden fazla varyasyon var:

- `classic`
- `plan_c`
- `vlm`
- `embedded`
- `sync`

Bunlar runtime icin gerekli degil. Dokuman/diagram amaclidir.

### 3. Test dosyalari

- `src/voice/tests/`
- `src/vision/tests/`

Frontend tarafi bunlari kullanmaz.

### 4. Ornek ve teknik dosyalar

- `src/voice/examples/`
- `src/vision/examples/`
- `src/vision/performance-review-contract.md`

Bunlar gelistirme referansi icindir, runtime UI verisi degildir.

### 5. Ideas klasoru

- `ideas/`

Hackathon notlari icindir. Uygulama akisina bagli degildir.

## Output path kurali

Voice tarafinda varsayilan output artik kaynak kod klasorune degil, proje altindaki runtime klasorune gider:

- `data/runtime/voice/<session_id>/`

Eger `--output-dir` verilirse, cikti o klasore gider.

Vision tarafinda output dosyasi sadece `--output` ile verildiginde dosyaya yazilir.

## Frontend icin dikkat edilmesi gerekenler

- Voice ve vision ayni `planned_elements` yapisi uzerinden baglanmali.
- Coach metni artik her plan hareketi icin uretilir.
- Coach cue'lari hareket adi odaklidir; ozellikle jump'larda sayimli giris kullanilir.
- Vision skoru resmi hakem puani degil, MVP training review skorudur.
- `high` quality mod demo icin daha uygundur.

## Sonraki temizleme adimlari

Bu branch calisir durumda, ama ileride su temizlikler yapilabilir:

1. `voice/knowledge` ve `vision/knowledge` tek klasorde birlestirilebilir.
2. `workflows/` altindaki fazla varyasyonlar sadeletilebilir.
3. `ideas/` ve `CONTEXT.md` gibi not dosyalari ayri bir docs klasorune tasinabilir.
4. Frontend icin tek bir API/contract dokumani ayrilabilir.
