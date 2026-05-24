# SkateSync AI - AI Coaching Backend

Bu dizin, SkateSync AI projesinin yapay zeka ve analiz motorlarını barındıran Python çalışma alanıdır (workspace).

---

## 📂 Dizin Yapısı

- `vision/`: VLM timing ve video değerlendirme modülü.
- `voice/`: Librosa ritim analizi ve ses koçluk modülü.
- `pyproject.toml`: Modern PEP 621 standartlarında birleşik Python bağımlılık ve araç yapılandırması.

---

## 🛠️ Kurulum

Python 3.10+ kurulu olduğundan emin olun. Bağımlılıkları en temiz ve modern yöntem olan standard sanal ortam (venv) ve `pyproject.toml` ile kurabilirsiniz:

1. **Sanal Ortam Oluşturun:**
   ```bash
   python -m venv .venv
   ```

2. **Sanal Ortamı Aktif Edin:**
   - **Linux/macOS:**
     ```bash
     source .venv/bin/activate
     ```
   - **Windows (PowerShell):**
     ```bash
     .venv\Scripts\Activate.ps1
     ```

3. **Bağımlılıkları Yükleyin:**
   Sanal ortam aktifken, `pyproject.toml` üzerinden bağımlılıkları yüklemek için:
   ```bash
   pip install -e .
   ```

   *Geliştirici paketlerini (ruff, pytest) de yüklemek isterseniz:*
   ```bash
   pip install -e .[dev]
   ```

---

## 🚀 Motorları Çalıştırma

### 1. Ses ve Ritim Analiz Motoru (Voice Engine)
```bash
python -m voice --help
```

### 2. Görüntü ve VLM Analiz Motoru (Vision Engine)
```bash
python -m vision --help
```
