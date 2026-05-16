**SkateSync AI: Müzik Analizi ve Hedef Puana Göre Artistik Paten Programı Planlayan AI Asistanı**

**SkateSync AI**, artistik buz pateni ve tekerlekli paten sporcuları için geliştirilmiş, müzik analizi, teknik element planlama ve video tabanlı performans geri bildirimi sunan yapay zekâ destekli bir program hazırlama asistanıdır. Projenin temel amacı, sporcunun elindeki müziği analiz ederek müziğin yükseliş, düşüş, ritim, vurgu ve yoğunluk noktalarına göre en uygun hareket sırasını önermek; aynı zamanda sporcunun hedeflediği teknik puana ulaşabilmesi için hangi elementleri programın hangi bölümlerine yerleştirmesi gerektiğini göstermektir.

Bu sistem, klasik bir “koreografi uygulaması” değildir. Daha özel olarak, **müzikal yapı ile teknik puan hedefini birleştiren bir paten program planlama aracıdır**. Sporcu sadece “hangi hareketi yapacağım?” sorusuna değil, aynı zamanda “bu hareketi müziğin neresinde yaparsam hem estetik hem de puan açısından daha mantıklı olur?” sorusuna cevap alır.

## 1. Problemin Tanımı

Artistik paten sporlarında iyi bir program hazırlamak yalnızca teknik hareketleri bilmekten ibaret değildir. Sporcu; jump, spin, step sequence, choreographic sequence ve geçiş hareketlerini hem müziğin yapısına hem de yarışma puanlama mantığına uygun şekilde yerleştirmek zorundadır.

Örneğin bir müzikte 55. saniyede güçlü bir yükseliş varsa, bu noktaya etkileyici bir spin, jump combination veya güçlü bir choreographic movement yerleştirmek programın görsel etkisini artırabilir. Ancak aynı anda sporcunun teknik hedefi de vardır. Program belirli bir teknik puan seviyesine ulaşmalı, hareketler sporcunun seviyesine uygun olmalı ve tüm program akıcı bir sırayla ilerlemelidir.

Bugün bu süreç çoğunlukla antrenör tecrübesi, deneme-yanılma ve manuel planlama ile yürütülür. Özellikle bireysel çalışan sporcular, amatör yarışmacılar, tekerlekli paten sporcuları veya antrenör desteğine her zaman erişemeyen kişiler için bu süreç zorlayıcıdır.

SkateSync AI bu noktada devreye girer:<br>
**Müziği analiz eder, teknik hedefi anlar, sporcunun yapabildiği elementleri dikkate alır ve müzikle uyumlu, puan odaklı bir program taslağı üretir.**

## 2. Projenin Temel Çözümü

Sistem üç ana bileşenden oluşur:

Birinci bileşen **Music Analyzer** modülüdür. Kullanıcı müzik dosyasını sisteme yükler. Sistem bu müzikten tempo, beat, enerji yoğunluğu, yükselişler, sakin bölümler ve vurgu noktaları gibi verileri çıkarır. Teknik tarafta bunun için Python tabanlı ses işleme kütüphaneleri kullanılabilir. Örneğin librosa’nın beat tracking yapısı onset strength ölçümü, tempo tahmini ve peak seçimi gibi aşamalarla beat noktalarını tespit edebilir.

İkinci bileşen **Program Planner** modülüdür. Bu modül, sporcunun seviyesi, yapabildiği hareketler, hedef puanı, program süresi ve risk tercihini dikkate alarak elementleri müzik timeline’ı üzerine yerleştirir. Örneğin müziğin sakin başlangıcına edge work ve transition, ilk yükselişe jump, ana climax noktasına spin, ritmik bölüme step sequence, kapanışa ise güçlü bir final pose yerleştirebilir.

Üçüncü bileşen ise **Performance Analyzer** modülüdür. Sporcu programını çalıştıktan sonra video kaydı yükler. Sistem bu videodan vücut landmark’larını çıkarır, hareketlerin planlanan zaman aralıklarına uyup uymadığını, sporcunun stabilitesini, dönüş/denge durumunu ve müzikle zamanlama uyumunu analiz eder. MediaPipe Pose Landmarker gibi araçlar görüntü veya videodan vücut landmark’ları çıkarabilir ve bu noktaları 2D görüntü koordinatları ile 3D dünya koordinatları olarak sağlayabilir.

Bu üç yapı birleştiğinde proje sadece program öneren değil, aynı zamanda sporcunun yaptığı programı analiz edip geri bildirim veren bir sisteme dönüşür.

## 3. Sistem Nasıl Çalışır?

Kullanıcı ilk olarak sisteme müzik dosyasını yükler. Bu dosya MP3 veya WAV formatında olabilir. Sistem müziği analiz eder ve timeline üzerinde önemli müzikal bölgeleri çıkarır. Örneğin:

- 0:00–0:15 arası sakin giriş
- 0:16–0:32 arası ilk yükseliş
- 0:33–0:48 arası ritmik bölüm
- 0:49–1:05 arası ana climax
- 1:06–1:25 arası ikinci yükseliş
- 1:26–1:30 arası final vurgusu

Daha sonra kullanıcı kendi bilgilerini girer:

- Spor türü: buz pateni / tekerlekli paten
- Seviye: başlangıç / orta / ileri
- Program süresi: örneğin 90 saniye
- Hedef teknik puan: örneğin 18 puan
- Yapabildiği elementler: single salchow, toe loop, upright spin, sit spin, step sequence vb.
- Risk tercihi: düşük / orta / yüksek

Sistem bu verilere göre önerilen program akışını üretir. Örneğin:

Bu akışın yanında sistem toplam tahmini teknik değer, müzik uyum skoru ve program zorluk seviyesini de gösterir.

## 4. Puanlama Mantığı

Bu projede çok dikkatli olunması gereken nokta şudur: Sistem **resmi hakem puanı verdiğini iddia etmemelidir**. Çünkü artistik patende resmi puanlama çok detaylıdır. ISU sisteminde tanınan teknik elementlerin base value değerleri Scale of Values tablolarında yayınlanır; jump elementlerinde değerler rotasyon sayısına, spin, step, lift gibi elementlerde ise zorluk seviyesine göre değişir.

Bu yüzden SkateSync AI, MVP aşamasında resmi hakem yerine geçmez. Bunun yerine **tahmini program hazırlık skoru** üretir.

Sistemin skor yaklaşımı şöyle olabilir:

**Estimated Program Score = Base Technical Value + Execution Support Score + Music Sync Bonus - Risk/Error Penalty**

Buradaki değerler şu şekilde yorumlanır:

**Base Technical Value**, seçilen elementlerin sadeleştirilmiş teknik değerlerinden gelir. MVP’de tüm resmi ISU tablosunu eksiksiz uygulamak yerine, örnek elementlerden oluşan sade bir puan tablosu kullanılabilir. İleri aşamada sezonluk resmi tablolar sisteme entegre edilebilir.

**Execution Support Score**, video analizinden gelen denge, stabilite, süre, dönüş merkezi, iniş sonrası kontrol ve hareket sürekliliği gibi metriklere dayanır.

**Music Sync Bonus**, hareketlerin müzikteki peak, beat veya vurgu noktalarına ne kadar iyi denk geldiğini ölçer.

**Risk/Error Penalty**, sporcunun seviyesinin çok üstünde hareket seçilmesi, video analizinde denge kaybı görülmesi veya planlanan zamanlamadan ciddi sapma olması durumunda uygulanır.

MVP’de kullanıcıya üç ana skor gösterilebilir:

- Technical Target Score<br>
Planlanan elementlerin hedef puana ne kadar yaklaştığını gösterir.
- Music Sync Score<br>
Hareketlerin müzik ritmi ve vurgu noktalarıyla ne kadar uyumlu olduğunu gösterir.
- Program Readiness Score<br>
Programın genel olarak yarışma/antrenman için ne kadar hazır göründüğünü gösterir.

Örnek çıktı:

Bu yapı jüri karşısında güvenli ve savunulabilir olur. Çünkü sistem “hakemim” demiyor; “sporcuya program hazırlık ve analiz desteği veriyorum” diyor.

## 5. Kamera ve Video Analizi

Projenin ikinci güçlü tarafı, sporcunun gerçek performans videosunu analiz edebilmesidir. Bu analiz iki şekilde yapılabilir: eş zamanlı kamera analizi veya video kaydı üzerinden analiz.

24 saatlik MVP için en güvenli yöntem **video kaydı üzerinden analizdir**. Çünkü video tekrar tekrar işlenebilir, zaman çizelgesiyle eşleştirilebilir ve demo sırasında canlı kamera riski azalır. Eş zamanlı kamera ise ileride “live training mode” olarak eklenebilir.

Video analizinde sistem şu işlemleri yapar:

Önce videodan frame’ler alınır. Her frame’de vücut landmark’ları çıkarılır. Omuz, kalça, diz, ayak bileği, dirsek ve bilek gibi noktalar takip edilir. Ardından bu noktaların zaman içindeki değişimi analiz edilir.

Sistem tam olarak “bu kesin triple salchow” gibi iddialı bir hareket tanıma yapmaz. Bunun yerine kullanıcı tarafından planlanan timeline’a bakar. Örneğin sistem, 0:52–0:59 arası sit spin planlandıysa bu aralıkta sporcunun dönme hareketi, merkez stabilitesi, vücut hizası ve hareket süresi gibi metrikleri analiz eder.

Bu daha gerçekçi ve güvenli bir yaklaşımdır. Çünkü tek kamera ile jump rotasyon sayısını, edge doğruluğunu veya under-rotation gibi profesyonel detayları güvenilir şekilde ölçmek zordur. Ancak denge, timing, genel stabilite, hareket yoğunluğu ve müzik uyumu gibi metrikler MVP için ölçülebilir.

## 6. Hareket Türlerine Göre Analiz

## Spin Analizi

Spin hareketleri sistem için en uygun analiz alanlarından biridir. Çünkü spin belirli bir süre devam eder, vücut merkezi takip edilebilir ve müzikal vurgu ile eşleşmesi görsel olarak güçlüdür.

Sistem spin için şu metrikleri çıkarabilir:

- Spin başlangıç zamanı
- Spin süresi
- Merkez kayması
- Omuz-kalça hizası
- Dönüş sırasında vücut stabilitesi
- Planlanan müzik peak noktasına yakınlık

Örnek geri bildirim:

Sit spin, müziğin ana yükselişinden 0.4 saniye sonra başladı. Müzikal uyum yüksek. Spin süresi 5.8 saniye. Merkez stabilitesi 78/100. Daha yüksek skor için dönüş sırasında vücut merkezini daha sabit tutman önerilir.

## Jump Analizi

Jump analizi daha hassastır. MVP’de sistem jump’ın teknik türünü otomatik belirlemek yerine, kullanıcının planladığı element üzerinden analiz yapmalıdır.

Örneğin kullanıcı 0:21’de Single Salchow planladıysa sistem bu bölgede:

- Zıplama başlangıcı
- Havalanma/iniş anı tahmini
- İniş sonrası denge
- Müziğin vurgusuna yakınlık
- Hareket sonrası akış devamlılığı

gibi noktaları değerlendirir.

Örnek geri bildirim:

Single Salchow planlanan yükseliş bölgesine yakın yapıldı. İniş sonrası denge skoru 72/100. Hareket müzikal vurgudan 0.6 saniye önce tamamlandığı için timing iyileştirilebilir.

## Step Sequence ve Transition Analizi

Step sequence gibi bölümlerde sistem profesyonel teknik panel gibi level belirlemek yerine akış ve müzik uyumunu ölçer.

Şu metrikler kullanılabilir:

- Hareket yoğunluğu
- Yön değişimi sayısı
- Vücut pozisyon değişimi
- Beat ile zamanlama uyumu
- Boş geçen zaman oranı
- Akış sürekliliği

Örnek geri bildirim:

Step sequence bölgesinde hareket yoğunluğu yüksek ve beat uyumu %82. Ancak 0:43–0:46 aralığında hareket yoğunluğu düştüğü için bu bölgeye kısa bir transition eklenebilir.

## 7. Teknik Mimari

Sistemin teknik mimarisi 5 ana katmandan oluşabilir.

## 1. Frontend Katmanı

Kullanıcının müzik ve video yüklediği, hedef puanı girdiği, elementleri seçtiği ve önerilen program timeline’ını gördüğü arayüzdür.

MVP için React veya Next.js kullanılabilir. Arayüzde şu ekranlar yer alır:

- Müzik yükleme ekranı
- Element seçme ekranı
- Hedef puan ve seviye belirleme ekranı
- Program timeline ekranı
- Video analiz ekranı
- AI geri bildirim ekranı

## 2. Audio Analysis Katmanı

Python tarafında müzik dosyasını analiz eder.

Kullanılabilecek araçlar:

- librosa
- numpy
- scipy
- matplotlib veya plotly

Çıktılar:

- BPM
- beat noktaları
- onset strength
- enerji grafiği
- peak noktaları
- bölüm tahmini

## 3. Element Planning Katmanı

Bu katman hareketleri timeline üzerine yerleştirir.

Veri yapısı şöyle olabilir:

{<br>
  "element": "Sit Spin",<br>
  "type": "spin",<br>
  "base_value": 2.5,<br>
  "duration": 6,<br>
  "risk": "medium",<br>
  "best_music_zone": "climax"<br>
}

Sistem müzikteki peak ve sakin bölgeleri bu elementlerin türleriyle eşleştirir.

Örneğin:

- Spin → climax veya uzun vurgu
- Jump → ani yükseliş veya güçlü beat
- Step sequence → ritmik ve beat yoğunluğu yüksek bölüm
- Transition → sakin veya bağlantı bölümü
- Final pose → kapanış vurgusu

## 4. Video Pose Analysis Katmanı

Bu katman video üzerinden vücut landmark’larını çıkarır ve planlanan element zamanlarına göre analiz yapar.

Kullanılabilecek araçlar:

- OpenCV
- MediaPipe Pose Landmarker
- NumPy
- basit açı / hız / stabilite hesapları

Çıktılar:

- vücut merkezi değişimi
- hareket yoğunluğu
- stabilite skoru
- timing sapması
- element bölgesi performans özeti

## 5. AI Feedback Katmanı

Bu katman teknik metrikleri kullanıcı dostu açıklamaya çevirir.

Örneğin sistem şu veriyi alır:

{<br>
  "element": "Sit Spin",<br>
  "planned_time": "0:55",<br>
  "actual_time": "0:55.4",<br>
  "music_peak_time": "0:55.0",<br>
  "stability": 78,<br>
  "duration": 5.8<br>
}

Bunu şöyle açıklar:

Spin hareketin müziğin ana vurgusuna oldukça yakın başladı. Bu yüzden müzikal uyumun güçlü. Ancak dönüş sırasında merkezde hafif kayma var. Bir sonraki denemede spin’e girişten sonra üst gövdeni daha sabit tutarsan hem görsel etki hem de stabilite skorun artabilir.

AI burada hakemlik yapmaz; veriyi anlamlı antrenman geri bildirimine dönüştürür.

## 8. 24 Saatlik MVP Kapsamı

Bu projeyi 24 saatte yetiştirmek için kapsamı net sınırlamak gerekir.

## MVP’de Kesin Olacaklar

- Müzik yükleme
- Müzik enerji grafiği çıkarma
- BPM / beat / peak noktalarını bulma
- Kullanıcının seviye ve hedef puan girmesi
- Kullanıcının yapabildiği elementleri seçmesi
- Sadeleştirilmiş element puan tablosu
- Hedef puana göre önerilen program timeline’ı
- Tahmini teknik değer hesaplama
- Video yükleme
- MediaPipe/OpenCV ile temel pose analizi
- Planlanan element zamanlarında stabilite ve timing analizi
- Music Sync Score
- Program Readiness Score
- AI açıklama/geri bildirim

## MVP’de Olmayacaklar

- Resmi hakem puanı
- Tüm ISU kurallarının birebir uygulanması
- Jump rotasyon sayısının kesin tespiti
- Under-rotation veya edge error tespiti
- Resmi spin level belirleme
- Çok kameralı analiz
- Canlı yarışma değerlendirmesi
- Tam otomatik “hangi hareketi yaptı” sınıflandırması

Bu ayrım çok önemli. Çünkü jüriye gerçekçi ve sağlam bir sistem gösterirsin.

## 9. Kullanıcı Senaryosu

Bir sporcu yarışma için 90 saniyelik bir program hazırlamak istiyor. Elinde bir müzik var ama hangi hareketi nereye koyacağını bilmiyor. Ayrıca hedef teknik puanı 18 civarında.

Sporcu müziği SkateSync AI’a yükler. Sistem müziğin ilk 15 saniyesinin sakin olduğunu, 22. saniyede ilk yükselişin başladığını, 55. saniyede ana climax olduğunu ve 87. saniyede final vurgusu bulunduğunu gösterir.

Sporcu yapabildiği elementleri seçer: Single Salchow, Toe Loop, Sit Spin, Upright Spin, Step Sequence ve Choreo Pose.

Sistem 90 saniyelik bir program önerir. İlk bölümde transition, ilk yükselişte jump, ritmik bölümde step sequence, ana climax’te spin ve kapanışta final pose önerir. Toplam tahmini teknik değer 18.4 olarak hesaplanır.

Daha sonra sporcu antrenmanda bu programı dener ve videosunu sisteme yükler. Sistem videoyu analiz eder. Spin’in müzikal peak’e çok iyi denk geldiğini, ancak jump inişinde stabilitenin düşük olduğunu söyler. Step sequence bölümünde ise müzikle uyumun iyi ama hareket yoğunluğunun biraz düşük olduğunu belirtir.

Sonuçta sporcu hem programını hem de antrenman performansını daha stratejik şekilde geliştirebilir.

## 10. Projenin Değer Önerisi

SkateSync AI’ın değeri üç noktada toplanır.

Birincisi, sporcuya **müziğe göre program planlama desteği** verir. Sporcu müziğin hangi bölümünün hangi hareket için daha uygun olduğunu görür.

İkincisi, sporcuya **hedef puan odaklı program kurma imkânı** sağlar. Sadece estetik değil, teknik değer de hesaba katılır.

Üçüncüsü, video analiziyle **antrenman geri bildirimi** verir. Sporcu yaptığı programın müzikle uyumunu, stabilitesini ve genel hazır oluşunu ölçebilir.

Bu yönüyle proje; sporcu, antrenör ve kulüp için kullanılabilir bir yardımcı araçtır.

## 11. 3 Dakikalık Sunumda Anlatım

Sunumda uzun teknik detaylara girilmemeli. Ana akış şöyle olmalı:

**Problem:**<br>
Artistik patende iyi bir program hazırlamak sadece hareket seçmek değildir. Hareketleri müziğin doğru anına yerleştirmek, hedef teknik puana ulaşmak ve programı akıcı kurmak gerekir. Bu süreç hâlâ çoğunlukla manuel ve deneyime dayalıdır.

**Çözüm:**<br>
SkateSync AI, müziği analiz ederek tempo, beat, enerji ve müzikal zirve noktalarını çıkarır. Sporcunun seviyesi, yapabildiği elementler ve hedef puanıyla birlikte program timeline’ı önerir.

**Demo:**<br>
Müzik yüklenir. Sistem enerji grafiğini çıkarır. Hedef puan girilir. Elementler seçilir. Sistem 90 saniyelik program akışı önerir. Daha sonra sporcu videosu yüklenir ve sistem müzik uyumu, stabilite ve program hazırlık skoru verir.

**Teknik:**<br>
Müzik analizi için ses işleme, video analizi için pose estimation, skor için sadeleştirilmiş element değerleri ve AI geri bildirim katmanı kullanılır.

**Kapanış:**<br>
Bu sistem resmi hakemin yerine geçmez. Sporcunun programını müziğe ve hedef puana göre daha bilinçli hazırlamasını sağlayan bir antrenman ve koreografi asistanıdır.

## 12. Tek Cümlelik Proje Tanımı

**SkateSync AI, artistik buz pateni ve tekerlekli paten sporcuları için müziği analiz eden, hedef teknik puana göre hareket sırası öneren ve antrenman videosunu inceleyerek müzik uyumu, stabilite ve tahmini program hazırlık skoru üreten AI destekli program planlama asistanıdır.**

Bence bu fikir bu haliyle çok temiz: hem kişisel bir probleme dayanıyor, hem teknik olarak yapılabilir, hem de 3 dakikada kolay anlatılır. En güçlü tarafı şu: “AI koreografi yapıyor” gibi genel bir iddia yerine, **müziğin yapısı + teknik puan hedefi + video geri bildirimi** üçlüsünü birleştiriyor.
