# 🎙️ Voice Coaching Strategy (Output Only)

Bu doküman, Sport AI Twin projesinin sesli geri bildirim (koçluk) katmanının teknik mimarisini ve iş akışını tanımlar. Kullanıcıdan sesli komut alınmayacak, sadece sistemden kullanıcıya akıllı sesli geri bildirimler iletilecektir.

---

## 1. İş Akışı (Workflow)

Aşağıdaki şema, ham görüntü verisinden sesli koçluk çıktısına kadar olan süreci ve kullanılan araçları göstermektedir:

![Voice Workflow](https://www.plantuml.com/plantuml/svg/TLJ1Rjf04BtlLqo9L2M7g9H4GA8eYi60a82WWD9BBnFl65ROkzRkEeHM_VVEsYc1YlZccJTlthmP-y5vjBxCC_55KgeqmTEWlunceya0aWoT4swZT84MStZ1PBEofjIoRp9ZmLlKZbEa_G6AQR3C_D1eFyESuB7qgVe4i52_2BvVYuDinPyOgyb2gtcGS6kKPglq2bBC71tMOEBLg_8x-2s0dzv_EizIcRRfgiuPAyc-nrljxejiLV78MhCz3lyvR96Ol32Q9ptTu-vkh8lItz_3sN0OTvhDqw1dvPJH0TNjz0U3tcdKnAnK4a0ttM7lfdiQ58q38ewZPXoVHh3nUqdjg-jE6CWhdn54OtWsAY7e6qpMmT8VncxIp6pXlAw2HvtjBeJ8AFNW3LYrMdkGoX9RRRGG1NV35K6ZcXick2FRgBpvSAhHv_rRX6_mh2GPM7XBc3VWmonqm9WWRCyNQSnsJhbFAEV64SJaQnq_zVcKfCAvAkWY4EyDPkRf_BZqgUJH1th5HyvryvrV6msLrrNfFzUvCY2FHOtXwxjbfsKDYMJuF614GTHelhoyDZpuY7AbLSLVBOp99vFfSUsItZmisPw2A5bpzMD1cZikbukZGdu_4XLJfbx9xZwH59LI6QZNoQJCZXko5UF-CfXr4IucyF8YuFBodcs3MtZ2RRqqmQyXMfbtowsqpD5k84QFeWg6BC_4oJdPrDWSDTiq9MzLuaJ810IBPyGCVManWxrT3DDAX6G0LLeOLaklpqM81z8o_A3-0W00)

### Kullanılan Araçlar:
*   **MediaPipe:** Video stream üzerinden vücut landmark'larının (poz tespiti) anlık çıkarılması.
*   **Custom Rule Engine (Python):** Hareketin doğruluğunu, hızını ve stabilitesini ölçen matematiksel mantık katmanı.
*   **GPT-4o / Gemini:** Teknik metrikleri (örn: "Diz açısı 45 derece") doğal ve motive edici bir dille ("Dizlerini biraz daha kırarsan mükemmel olacak!") koçluk cümlesine çeviren zekâ katmanı.
*   **OpenAI TTS:** Metni yüksek kaliteli ve doğal bir insan sesine dönüştüren katman.
*   **Web Audio API:** Browser tarafında sesin gecikmesiz çalınmasını sağlayan katman.

---

## 2. Teknik Süreç (Sequence Diagram)

Sistemin bileşenleri arasındaki iletişim sırası:

![Sequence Diagram](https://www.plantuml.com/plantuml/svg/ZPFFRjD04CRl-nI3aH0z88k2AkH3rQGG_YIXaHnouZBnZjEHrxjclQQA4S_3ENTkpODrR4UqAHpmnTRCzzkPRsPzKGVqeIcDgWks5Nei0RFWV1gsXW1lg7ObFKZMzAqXcn7yK23Fo7jtS-cCy_3qzEpDMf_suHddD6DBO-Sr-R_p2odA6LTem_z8C2istZLM7sIvpi_erMFPnDdm6Kk2goRa7FwLJhabUFbQ_LIgTmbHMZcVDH33j346xNwNxNSHO0rVQlAgkiSXMd7Dpi8xkn5dN-tpEMd61LSKNrLaBrSdFJUeZia9aLwB2PYv3MU2BhRXsjduKteuRK3xx34v-WWhnpBkkTDaXEnAIN2vJ0T6FXuHZMRNZQ1gWkZ7iXzn4gSLOK5-W7gDKfr5U75-Q3c13-Yfe233MBWMLkGbhWwkHTQtby3KoSROOZ3euTaVQ4brnO5LhteWdpXVmiYYuPP5FdU1lsEzbIEdSg7yVdTFY9S4tajP6BFHxBc4EGNBOYDwowsHZ6NGU8sGOsiGrhU_YoVHYHAmutjRoV22D7YI-nh3kCbpMUKG5LNdEe6KQiFYvVQNQOgZljG5MTtz4NS0)

---

## 3. Stratejik Notlar

*   **Düşük Gecikme (Low Latency):** Hareket anında geri bildirim vermek kritik olduğu için, TTS çıktıları mümkünse kısa cümleler halinde üretilmeli.
*   **Psikolojik Etki:** Sadece hataları değil, başarıları da seslendirmek (örn: "Bugünkü 10. setin, harikasın!") kullanıcı sadakatini artırır.
*   **Gürültü Bağışıklığı:** Dinleme özelliği olmadığı için, sistem dış gürültüden etkilenmez; bu da spor salonu gibi ortamlarda %100 kararlılık sağlar.
