# 🎙️ Hibrit AI Sesli Koçluk Stratejisi

Bu doküman, projenin sesli geri bildirim katmanının teknik mimarisini, hibrit analiz yöntemini ve kullanıcıya ulaştırılma sürecini detaylandırır.

---

## 🎙️ Süreç Nasıl İşliyor? (Basitçe Anlatım)

Sistemimiz bir sporcunun antrenörü gibi çalışır. Süreç şu şekilde ilerler:

1.  **Müziği Hafızaya Alma:** Sporcu müziğini yüklediğinde, sistem bunu güvenli bir şekilde **Supabase** (lokal veri merkezi) içine kaydeder.
2.  **Ritmi ve Ruhu Anlama:** 
    *   **Librosa** (matematiksel araç) müziğin içindeki vuruşları, saniyenin binde biri hassasiyetinde ölçer ("Tık tık" ritmi nerede?).
    *   **GPT-4o / Gemini** (zekâ katmanı) müziği "dinler" ve havasını anlar (Bu müzik hüzünlü mü, yoksa gaza getirici mi?).
3.  **Kişisel Koçluk Planı:** Sistem, ritim noktalarıyla müziğin havasını birleştirir. Sadece "Zıpla" demek yerine, *"Müzik burada yükseliyor, tam bu ritimle beraber zıpla!"* gibi doğal ve motive edici cümleler hazırlar.
4.  **Sesli Geri Bildirim:** Hazırlanan bu cümleler, **OpenAI TTS** ile gerçek bir insan sesi kalitesinde seslendirilir ve sporcuya tam vaktinde iletilir.

---

---

## 1. İş Akışı (Workflow)

Sistem, müziği hem matematiksel (Librosa) hem de anlamsal (LLM) olarak analiz ederek en doğru zamanlamada en doğal geri bildirimi üretir.

![Voice Workflow](./workflow.svg)

### Katmanlar ve Araçlar:
*   **Veri Katmanı (Supabase - Local):** Müzik dosyalarının saklandığı (Storage) ve koçluk planlarının/analiz verilerinin tutulduğu (Database) merkezdir.
*   **Analiz Katmanı (Librosa):** Supabase'den çekilen müziğin BPM ve ritim noktalarını matematiksel olarak analiz eder.
*   **Zekâ Katmanı (GPT-4o / Gemini):** Teknik verileri, müziğin atmosferiyle birleştirerek kişiselleştirilmiş koçluk metni üretir.
*   **Sentez Katmanı (OpenAI TTS):** Metni doğal bir insan sesine dönüştürür.
*   **İletim Katmanı (Web Audio API):** Sesi tarayıcıda gecikmesiz olarak çalar.

---

## 2. Teknik Süreç (Sequence Diagram)

Aşağıdaki şema, müziğin yüklenmesinden sesli komutun kullanıcıya ulaşmasına kadar geçen teknik adımları göstermektedir:

![Sequence Diagram](./sequence.svg)

---

## 3. Neden Hibrit Yaklaşım?

1.  **Hassas Zamanlama:** Sadece LLM kullanıldığında müziğin ritmiyle sesli komut arasında senkronizasyon sorunu oluşabilir. Librosa, bu senkronizasyonu matematiksel olarak garanti eder.
2.  **Zengin İçerik:** Sadece Librosa kullanıldığında sesli geri bildirimler "Robotik" kalır. LLM, bu geri bildirimlere duygu ve motivasyon katar.
3.  **Düşük Hata Payı:** Veri füzyonu sayesinde, sesli asistan sporcuya yanlış zamanda veya yanlış tonda komut vermez.

---

## 4. Uygulama Notları

*   **Model Seçimi:** Metin üretimi için `gpt-4o`, ses sentezi için `tts-1-hd` (yüksek kalite) modeli tercih edilecektir.
*   **Gecikme Yönetimi:** Ses dosyaları önceden (pre-fetch) oluşturulup tarayıcı önbelleğinde saklanarak vuruş (beat) anında anlık oynatılması sağlanacaktır.
