# SkateSync AI - Workspace Monorepo

Bu depo, **SkateSync AI** projesinin tüm ön uç (React/Vite/Tailwind) ve yapay zeka/arka uç (Python Vision & Voice Engines) modüllerini temiz, modüler ve ölçeklenebilir bir monorepo yapısında bir araya getirir.

---

## 📂 Monorepo Yapısı

Sürdürülebilirlik ve bağımsız ölçeklenebilirlik kuralları gereği, proje endüstri standartlarında bir monorepo düzenine ayrılmıştır:

```text
metu-sports-hackhaton/
├── frontend/               # React + Vite + Tailwind CSS Uygulaması
│   ├── src/                # Arayüz kodları, App.jsx, firebase vb.
│   ├── public/             # Statik varlıklar (resim, ses, video)
│   ├── knowledge/          # Figür pateni hareket katalogları ve JSON verileri
│   ├── package.json        # Ön uç bağımlılıkları ve betikleri
│   └── vite.config.js      # Vite yapılandırması
│
├── backend/                # Yapay Zeka & Analiz Motorları (Python 3.10+)
│   ├── vision/             # VLM timing ve video analiz motoru (vlm_review.py vb.)
│   └── voice/              # Librosa ritim analizi ve ses koçluk motoru (audio_analyzer.py vb.)
│
├── docs/                   # Genel sistem mimarisi, tasarım ve akış şemaları (Workflows)
│   ├── CONTEXT.md          # Proje bağlamı ve genel vizyon
│   ├── DESIGN.md           # Sistem tasarımı ve mimari kararlar
│   └── workflows/          # SVG Akış şemaları ve sekans diyagramları
│
├── .gitignore              # Global git yoksayma dosyası
├── netlify.toml            # Ön uç otomatik dağıtım (deploy) yapılandırması
└── README.md               # Bu belge (Ana çalışma alanı açıklaması)
```

---

## 🚀 Başlangıç

### 🖥️ 1. Ön Yüz (Frontend) Kurulumu ve Çalıştırma

Ön yüz uygulaması **React**, **Vite** ve **TailwindCSS** ile geliştirilmiştir. Firebase Auth/Firestore entegrasyonuna ve yerel veri yedekleme mekanizmasına sahiptir.

1. **Ön Yüz Dizinine Geçin:**
   ```bash
   cd frontend
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   *Uygulama yerel olarak `http://localhost:5173` adresinde çalışacaktır.*

4. **Production Build Alın:**
   ```bash
   npm run build
   ```

---

### 🐍 2. Yapay Zeka Motorları (Backend) Kurulumu

Python modülleri, ritim analizini (`librosa` tabanlı) ve antrenman videoları ile planlanan koreografi zamanlamasını karşılaştıran VLM (`vision` motoru) süreçlerini yürütür.

1. **Ses ve Ritim Analiz Motoru (Voice Engine):**
   ```bash
   cd backend/voice
   pip install -r requirements.txt
   python -m src.voice --help
   ```

2. **Görüntü ve VLM Analiz Motoru (Vision Engine):**
   ```bash
   cd backend/vision
   pip install -r requirements.txt
   python -m src.vision --help
   ```

---

## 📊 Entegre Veri Akışı

1. **Müzik Analizi (Voice Engine):** Sporcu müziğini yükler. Sistem tempoları (BPM), ritim vuruşlarını analiz eder ve koreografi için planlanabilir zaman pencerelerini (`planned_elements.json`) çıkartır.
2. **Koreografi Planlama (Frontend):** Sporcu veya antrenör, ön yüz arayüzünden müzik zaman tüneline uygun teknik hareketleri yerleştirir.
3. **Video Karşılaştırma (Vision Engine):** Sporcu antrenman videosunu sisteme yüklediğinde, VLM motoru planlanan zaman pencerelerine karşılık gelen video karelerini çıkararak timing farklarını offset analiz raporu olarak sunar.
