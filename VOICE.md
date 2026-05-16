# 🎙️ Hibrit AI Sesli Koçluk Stratejisi

Bu doküman, projenin sesli geri bildirim katmanının teknik mimarisini, hibrit analiz yöntemini ve kullanıcıya ulaştırılma sürecini detaylandırır.

---

## 1. İş Akışı (Workflow)

Sistem, müziği hem matematiksel (Librosa) hem de anlamsal (LLM) olarak analiz ederek en doğru zamanlamada en doğal geri bildirimi üretir.

![Voice Workflow](https://www.plantuml.com/plantuml/svg/~1TLHTRzf047o_Nx4YKfMeGf0F0QaY5BwB10qgRlgIbyLUmmdx3jsTGsdL_zuzOy1Kn4_MpUpixAnzpzQXSLcQ2BkMQeC6KrXWk5uQdQcefnDjm1bKbY5IhiIAACOiSKEjt3TC2Luo5yiF27Fvc-3seGJcyg4sYWpSrak0NM6ajr8j8SR4aYX163hvBjqE_WZWf_kVpQiuYXjqlyUqYSWKvtUDrYAwoyyxnkZj-V7VSejGfnkjUD3BFPwUncgJkNORheR3VhDUlqpgA4nsLbhFQpLxWq7t0zxOCnvRm-vZwp8Z2EQUqkztwlt-PGhdVhJKk7ze-e6ST0d1rzt2o0WwOtZLCYJeQGnNFjcVsgpZH6_XUY8NHbk4pp2PJ6-4I2Xsu3GOkLmvYAGXpbmh8Kx1LAQPbI4C9NUemPlwONc5WtU6Ad3A1oq4BB8a8yI6BUEIe78mLCG34zoHgUHHb_GBJs_gUefkHIaw6M82CyArhNLdqnlVfnGnjofApdL6iw3weDdZY5AffDVppbdgLIu8Fd4Uoj4ljzSR5qgJgG-m9FEo8SKHyYPOOH_aYFYpHHzCNhjVafyuc9ShEraaDUptmxNp3Kz09YyvBeshvdwPGXHnGRNQFim3N-0xRY7NESSdKyRs-hN37E9GTMBCU7_I4WGozNlleqFX4SzWiymeQgkTBV_V4F0h38aYVmK8_3CtE2ntzmPmbI8PrAHlpV-0G00)

### Katmanlar ve Araçlar:
*   **Analiz Katmanı (Librosa):** Müziğin dijital sinyalini işleyerek BPM, vuruş (beat) noktaları ve enerji değişimlerini milisaniye hassasiyetinde belirler.
*   **Zekâ Katmanı (GPT-4o / Gemini):** Librosa'dan gelen teknik verileri, müziğin atmosferi (vibe) ve sporcunun o anki ihtiyacıyla birleştirerek kişiselleştirilmiş koçluk metni üretir.
*   **Sentez Katmanı (OpenAI TTS):** Metni, duygusal tonlamaya sahip doğal bir insan sesine dönüştürür.
*   **İletim Katmanı (Web Audio API):** Sesi tarayıcıda gecikmesiz (low-latency) olarak çalar.

---

## 2. Teknik Süreç (Sequence Diagram)

Aşağıdaki şema, müziğin yüklenmesinden sesli komutun kullanıcıya ulaşmasına kadar geçen teknik adımları göstermektedir:

![Sequence Diagram](https://www.plantuml.com/plantuml/svg/~1ZLHDRzD04BtxLmn1GbIYV1HKeHnGqq8_r9XQ90I1k6piIJfulMlsWv8WVakFNEczjwR_YrdRIPss1o8bihtllPbvyvmTwuHnlf2HpKcLmeW2B7xtg5A4Nn7mfsUCFjlJKXjukBNzUfnjLO_xDC4-ATpL9aDpzpnXNKgf5Chz3qIa-THehx86Diacs_YoRY1rsjodyRlTzAd8z1cfAKo4jDWwgLHJRHGQUF4yYaIGWywWr2Rry0oElPH2BIxInKK7X8MF5arKthJ6q9brMC2ULiveAT5yLO_tXNMzv8ZvxtM6Jx_PZOfSGzVfFP-HXiJe5AtLWTodiT5Mr9JcPftp0ONLAeppJatPPIOT9CFDLveB7c11YXfoFrudZZJnvWOpvKwPSrAYwXt1S3YeuNnnNsydtfNUCVuJZg5-nBFLbEesYe8hiFcc6R0ByTNbd7BuV7MPI-IcTiNrkHGkk4i_XCEb4w4S7FA8vA2dXAJv2XfssrZBmeqDNJZadGr8pOI4nLz6Oe4LTAMyDAnEONMz9h2RnF084XGv3D6Mv6WTsfw2zGhXABSeuOieX9By0oCqP6jMXdVgtcwy7w_iEER4vOxPt4282_vqjthdVLNDzECLTqHZP7oiTTPOH16gB8fkrLWE4BhZ4786e9VpwnkjYONY-zpDJ2lFgiVwwe_qESJe67yY_VMvyms5EHo8BkmJLmq8Kl2uC_9cwc6AacRQF87hSoeoWldYefJYGMSZQZl2qzniF8IBlx2K7I2_3yWcpAiTLaTyLWMg2ybU36-54voTWJCeYhPmaBeHhYDOvv85GXGhTKayNk5TPLx0MXwwBTDaj_MaIUKE-nl-zFu1)

---

## 3. Neden Hibrit Yaklaşım?

1.  **Hassas Zamanlama:** Sadece LLM kullanıldığında müziğin ritmiyle sesli komut arasında senkronizasyon sorunu oluşabilir. Librosa, bu senkronizasyonu matematiksel olarak garanti eder.
2.  **Zengin İçerik:** Sadece Librosa kullanıldığında sesli geri bildirimler "Robotik" kalır. LLM, bu geri bildirimlere duygu ve motivasyon katar.
3.  **Düşük Hata Payı:** Veri füzyonu sayesinde, sesli asistan sporcuya yanlış zamanda veya yanlış tonda komut vermez.

---

## 4. Uygulama Notları

*   **Model Seçimi:** Metin üretimi için `gpt-4o`, ses sentezi için `tts-1-hd` (yüksek kalite) modeli tercih edilecektir.
*   **Gecikme Yönetimi:** Ses dosyaları önceden (pre-fetch) oluşturulup tarayıcı önbelleğinde saklanarak vuruş (beat) anında anlık oynatılması sağlanacaktır.
