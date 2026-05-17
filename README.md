# SkateSync AI - Unified System

Bu proje, SkateSync AI uygulaması için geliştirilmiş React (Vite/Tailwind) frontend uygulaması ile Librosa-tabanlı ritim analizi, LLM/VLM koçluk motoru ve video değerlendirme modüllerini (ai-core) bir araya getirir.

---

## 🚀 Başlangıç

### Ön Koşullar
Bilgisayarınızda **Node.js** (v18+) ve **Python 3.10+** kurulu olduğundan emin olun.

### Kurulum ve Çalıştırma

1. **Bağımlılıkları Yükleyin**
   Gerekli kütüphaneleri yüklemek için aşağıdaki komutu çalıştırın:
   ```bash
   npm install
   ```

2. **Geliştirme Sunucusunu Başlatın**
   Uygulamayı yerel olarak ayağa kaldırmak için:
   ```bash
   npm run dev
   ```

3. **Tarayıcıda Görüntüleyin**
   Terminalde beliren adrese (genellikle `http://localhost:5173/`) giderek uygulamayı kullanmaya başlayabilirsiniz.

---

## 🛠️ Derleme ve Dağıtım

- **Uygulamayı Canlı İçin Derleme (Build):**
  ```bash
  npm run build
  ```

- **Derlenmiş Hali Önizleme:**
  ```bash
  npm run preview
  ```

---

## 📂 Proje Yapısı

### Frontend (`src/`)
- `src/App.jsx`: Ana uygulama bileşeni ve Hash-tabanlı router.
- `src/pages/`: Alt sayfalar (`LandingPage`, `DashboardPage`, `MusicAnalysisPage`, `ChoreographyPage`, `VideoAnalysisPage`, `LibraryPage`).
- `src/components/`: Ortak kullanılan UI bileşenleri.
- `src/data/mockData.js`: Arayüzde kullanılan statik/mock veriler.
- `src/data/db.js`: Firebase entegrasyonu ve LocalStorage fallback veritabanı bağdaştırıcısı.

### Voice Engine (`src/voice/`)
Librosa ritim analizi ve OpenAI/Gemini koçluk motorunu barındırır.
- `src/voice/audio_analyzer.py`
- `src/voice/program_planner.py`
- `src/voice/coaching_engine.py`
- `src/voice/tts_engine.py`
- `src/voice/main.py`
- `src/voice/cli.py`

### Vision Engine (`src/vision/`)
Antrenman videosu ile planlanan timeline'ı karşılaştıran VLM modülünü içerir.
- `src/vision/vlm_review.py`
- `src/vision/frame_extractor.py`
- `src/vision/rag.py`
- `src/vision/llm_feedback.py`
- `src/vision/cli.py`

---

## 📊 Entegre Veri Akışı

1. **Müzik Analizi:** Kullanıcı müzik dosyasını yükler. `src.voice` modülü ritmi çıkarır, tempoları (BPM) ölçer ve `planned_elements.json` ile `coaching_cues.json` dosyalarını üretir.
2. **Koreografi Planlama:** Kullanıcı hareket sözlüğünü kullanarak müziğe uygun koreografiyi planlar.
3. **Video Analizi:** Kullanıcı antrenman videosunu yüklediğinde `src.vision` VLM motoru, planlanan zaman pencerelerine göre frame'leri çeker ve timing farklarını offset olarak çıkarıp final analiz raporunu hazırlar.
4. **Firebase Kaydı:** Giriş yapmış kullanıcıların tüm profilleri, program taslakları ve analiz geçmişleri Firestore veri tabanında (veya LocalStorage fallback üzerinde) saklanır.
