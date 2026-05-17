# Voice Mimarisi

Bu dokuman, SkateSync AI icindeki sesli koçluk hattinin guncel halini aciklar.

## Guncel hedef

Sesli tarafin amaci:

- muzikten `planned_elements` uretmek
- her plan hareketi icin bir coaching cue uretmek
- istenirse bu cue'lari TTS ile seslendirmek
- istenirse bu sesleri muzik ustune mikslemek

## Guncel davranis

Voice hattinda artik iki farkli karar katmani var:

### 1. Planner

- OpenAI kullanir
- muzik analizinden hareket listesi uretir
- sadece izinli hareket adlarini kullanir
- hareketleri tum parcaya yaymaya calisir

### 2. Coaching engine

- artik serbest LLM cümlesi yazdirmiyor
- deterministic hareket callout'lari uretir
- `plan.json` icindeki her hareket icin en az bir cue verir
- ozellikle jump'larda sayimli giris kullanir

Ornek cue'lar:

- `Bir iki üç, aksel`
- `Camel spin, hattı uzat`
- `Spiral, çizgiyi uzat`
- `One foot glide, dengeyi koru`

Uzun spinlerde ek sayim cue'su da gelebilir:

- `Bir iki üç, sit spin`

## Ana dosyalar

Kod [src/voice](</d:/metu-sports-hackhaton/__worktree_ai_core/src/voice>) altinda:

- [audio_analyzer.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/voice/audio_analyzer.py>)
- [program_planner.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/voice/program_planner.py>)
- [coaching_engine.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/voice/coaching_engine.py>)
- [tts_engine.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/voice/tts_engine.py>)
- [main.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/voice/main.py>)
- [cli.py](</d:/metu-sports-hackhaton/__worktree_ai_core/src/voice/cli.py>)

Bilgi tabani:

- [figure_skating_knowledge.json](</d:/metu-sports-hackhaton/__worktree_ai_core/src/voice/knowledge/figure_skating_knowledge.json>)
- [skating-movement-catalog.md](</d:/metu-sports-hackhaton/__worktree_ai_core/src/voice/knowledge/skating-movement-catalog.md>)

## Girdi semasi

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

## Cikti dosyalari

Her run sonunda su dosyalar olusabilir:

- `audio_analysis.json`
- `planned_elements.json`
- `coaching_cues.json`
- `coaching_cues.txt`
- opsiyonelse `cue_audio_files.json`
- opsiyonelse `coaching_mix.mp3`

## Varsayilan output davranisi

`--output-dir` verilmezse output otomatik olarak su klasore gider:

- `data/runtime/voice/<session_id>/`

`--output-dir` verilirse cikti o klasore yazilir.

## OpenAI kullanan kisimlar

- planner: OpenAI Responses API
- TTS: OpenAI speech API

Not:

- coaching cue metni artik OpenAI tarafinda serbestce yazdirilmiyor
- coach deterministic callout kullanir
- bu sayede frontend ve TTS davranisi daha kararlidir

## Hangi hareketler soylenebilir

Coach sadece katalogdaki hareketleri soylemelidir.

Ozellikle desteklenen ve frontend icin de onemli olanlar:

- `Camel Spin`
- `Spiral`
- `One Foot Glide`
- `Two Foot Glide`
- `Axel`
- diger izinli jump/spin/turn/transition hareketleri

## Hızlı test

### Planner + cue uretimi

```powershell
python -m src.voice "C:\path\to\music.mp3"
```

### Hazir planla cue uretimi

```powershell
python -m src.voice "C:\path\to\music.mp3" --plan "path\to\planned_elements.json"
```

### TTS

```powershell
python -m src.voice "C:\path\to\music.mp3" --plan "path\to\planned_elements.json" --include-tts
```

### TTS + mix

```powershell
python -m src.voice "C:\path\to\music.mp3" --plan "path\to\planned_elements.json" --include-tts --mix-audio
```

## Frontend icin kritik notlar

- frontend `planned_elements.json` ve `coaching_cues.json` dosyalarina baglanmali
- frontend cue preview ekraninda `text`, `time`, `element_name`, `cue_kind` gosterebilir
- TTS varsa `coaching_mix.mp3` dogrudan oynatilabilir
- coach artik bazi hareketleri atlamaz; plan icindeki tum hareketleri okur

## Bilinen sinirlar

- planner hala MVP seviyesindedir; resmi koreografi motoru degildir
- `.m4a` dosyalarda `librosa` fallback nedeniyle islem yavaslayabilir
- TTS ve mix maliyet ve sureyi artirir
