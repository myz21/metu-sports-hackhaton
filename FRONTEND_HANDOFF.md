# Frontend Handoff

Bu dokuman, frontend gelistirirken hangi dosyalarin kullanilmasi gerektigini ve hangi dosyalarin sadece teknik/artik niteliginde oldugunu netlestirir.

## Aktif kaynaklar

### UI

- `src/App.jsx`
- `src/pages/`
- `src/components/`
- `src/data/mockData.js`

### Voice

- `src/voice/main.py`
- `src/voice/program_planner.py`
- `src/voice/coaching_engine.py`
- `src/voice/tts_engine.py`

### Vision

- `src/vision/cli.py`
- `src/vision/vlm_review.py`
- `src/vision/frame_extractor.py`
- `src/vision/rag.py`

## Frontend'in beklemesi gereken veri ciktilari

### Planner

- `planned_elements.json`

### Coach

- `coaching_cues.json`
- `coaching_cues.txt`
- opsiyonelse `coaching_mix.mp3`

### Vision review

- review JSON

## Frontend ekranlari hangi dosyayi okumali

### Program Planner ekrani

- `planned_elements.json`

### Coaching preview / voice player

- `coaching_cues.json`
- varsa `coaching_mix.mp3`

### Video Analysis ekrani

- vision review JSON

## Bu branch'te olan ama frontend'in dogrudan kullanmamasi gereken kisimlar

### Teknik test klasorleri

- `src/voice/tests/`
- `src/vision/tests/`

### Gelistirme ornekleri

- `src/voice/examples/`
- `src/vision/examples/`

### Tekrar eden knowledge kopyalari

- `src/voice/knowledge/`
- `src/vision/knowledge/`

Not:

Bu iki klasor kavramsal olarak ayni hareket sozlugunun iki kopyasidir. Frontend katalog gosterecekse tek birini referans al.

Onerilen kaynak:

- `src/vision/knowledge/skating-movement-catalog.md`

### Diagram ve dokuman varyasyonlari

- `workflows/`

Runtime icin gerekli degildir.

### Hackathon notlari

- `ideas/`
- `CONTEXT.md`

## Onerilen frontend veri akisi

1. Kullanici muzik yukler.
2. Planner `planned_elements.json` uretir.
3. Frontend timeline gosterir.
4. Coach `coaching_cues.json` gosterir.
5. TTS varsa `coaching_mix.mp3` oynatilir.
6. Kullanici video yukler.
7. Vision review JSON gelir.
8. Frontend skor kartlari ve element bazli yorumlari gosterir.

## Son durum ozeti

- voice aktif
- vision aktif
- frontend prototipi aktif
- output path davranisi duzenlendi
- coach artik plan icindeki her hareketi okur
- jump cue'lari sayimli verilebilir
