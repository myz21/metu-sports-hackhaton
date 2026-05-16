# 🎙️ Voice Coaching Strategy (Output Only)

Bu doküman, Sport AI Twin projesinin sesli geri bildirim (koçluk) katmanının teknik mimarisini ve iş akışını tanımlar. Kullanıcıdan sesli komut alınmayacak, sadece sistemden kullanıcıya akıllı sesli geri bildirimler iletilecektir.

---

## 1. İş Akışı (Workflow)

Aşağıdaki şema, ham görüntü verisinden sesli koçluk çıktısına kadar olan süreci ve kullanılan araçları göstermektedir:

![Voice Workflow](https://www.plantuml.com/plantuml/svg/TLF1Rjf04BtlLuoI2nnGI8A0L14AJZ2Ab0PKM-c5oyOUmmfxrzeTXzAg_zvPsqtSYlXaptlpPjxpxfqZQQagSk7sIfVIoW9UPRBVMbFfzDxanW9PgHr3gAd3IZ6JLKwXqVGi2uHLHPdwX12fdmYNemvOooV6QhHmEUm0RYTJSr1w2vdC7OeE91DIRugEy4i0Fy5_QvvdQJR6wmOpDaNRrg_6qzVqggxFhJM7Vyk_koCIKvH6iz7JCsvlOwksMxIp6Po7uSDaE3nDUthwwYatqp2ucNwY54UUCftSBnR1QGf7MbRKp1fVZoP-LrAK8ymVuSMe1669dA0aPJHyDtQVvUO0lPNEZotUIFI5o34Z80Ey_uuWLHOJtoN4X-MpwEW82rYy-QyBsEWNvRnoQ_eCklwb-rllIh1nw2tNyM1aM669XTAglz7jcWWn_Y3uXexv3hrWanIByKjNg2R61g8ICTbjT6zLecRR75k_NgIEpoyHHzs-UPKgqzhche3_j-CprfJdwyUw-JrOxezyu4AqNc0mcFbLu0kiqMR65b9pZ0-IfF1b3_D4XfybLLRc42Ac_iRKreJ7FATMPLOpDoABVBek8AYoZ0CJTwXJV-d-0000)

### Kullanılan Araçlar:
*   **System/Vision Trigger:** Analiz katmanından gelen "Hata yapıldı" veya "Set bitti" gibi olay bazlı tetikleyiciler.
*   **GPT-4o / Gemini:** Teknik veriyi doğal bir koçluk cümlesine çeviren LLM katmanı.
*   **OpenAI TTS:** Metni yüksek kaliteli ses dosyasına dönüştüren model.
*   **Web Audio API:** Tarayıcı üzerinden sesi kullanıcıya ulaştıran çıkış katmanı.

---

## 2. Teknik Süreç (Sequence Diagram)

Sistemin bileşenleri arasındaki iletişim sırası:

![Sequence Diagram](https://www.plantuml.com/plantuml/svg/ZPFFRjD04CRl-nI3aH0z88k2AkH3rQGG_YIXaHnouZBnZjEHrxjclQQA4S_3ENTkpODrR4UqAHpmnTRCzzkPRsPzKGVqeIcDgWks5Nei0RFWV1gsXW1lg7ObFKZMzAqXcn7yK23Fo7jtS-cCy_3qzEpDMf_suHddD6DBO-Sr-R_p2odA6LTem_z8C2istZLM7sIvpi_erMFPnDdm6Kk2goRa7FwLJhabUFbQ_LIgTmbHMZcVDH33j346xNwNxNSHO0rVQlAgkiSXMd7Dpi8xkn5dN-tpEMd61LSKNrLaBrSdFJUeZia9aLwB2PYv3MU2BhRXsjduKteuRK3xx34v-WWhnpBkkTDaXEnAIN2vJ0T6FXuHZMRNZQ1gWkZ7iXzn4gSLOK5-W7gDKfr5U75-Q3c13-Yfe233MBWMLkGbhWwkHTQtby3KoSROOZ3euTaVQ4brnO5LhteWdpXVmiYYuPP5FdU1lsEzbIEdSg7yVdTFY9S4tajP6BFHxBc4EGNBOYDwowsHZ6NGU8sGOsiGrhU_YoVHYHAmutjRoV22D7YI-nh3kCbpMUKG5LNdEe6KQiFYvVQNQOgZljG5MTtz4NS0)

---

## 3. Stratejik Notlar

*   **Düşük Gecikme (Low Latency):** Hareket anında geri bildirim vermek kritik olduğu için, TTS çıktıları mümkünse kısa cümleler halinde üretilmeli.
*   **Psikolojik Etki:** Sadece hataları değil, başarıları da seslendirmek (örn: "Bugünkü 10. setin, harikasın!") kullanıcı sadakatini artırır.
*   **Gürültü Bağışıklığı:** Dinleme özelliği olmadığı için, sistem dış gürültüden etkilenmez; bu da spor salonu gibi ortamlarda %100 kararlılık sağlar.
