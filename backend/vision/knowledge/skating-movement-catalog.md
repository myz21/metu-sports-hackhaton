# SkateSync AI Hareket Kataloğu

Bu doküman, SkateSync AI'nin bilmesi gereken temel artistik buz pateni hareket ailelerini insan tarafından okunabilir bir referans olarak tutar.

Bu kaynak iki amaçla kullanılır:

1. Arayüz tarafında kullanıcıya sistemin hangi hareket sözlüğüyle çalıştığını göstermek.
2. Arka planda RAG bilgi tabanını hangi hareket gruplarının beslemesi gerektiğini netleştirmek.

Not:

- Bu dosya açıklayıcı ve okunabilir referans katmanıdır.
- Asıl RAG corpus'u `src/vision/knowledge/figure_skating_knowledge.json` içinde tutulur.
- Gerekirse aynı aile altına eğitim varyasyonları da eklenebilir. Örneğin `Two Foot Spin`, `One Foot Spin` ve `Final Pose` gibi başlıklar VLM review tarafında ayrıca yararlı olabilir.

## 1. Atlayışlar

Atlayışlar, patencinin buzdan kalkış yaptığı kenara ve toe-pick desteği kullanıp kullanmadığına göre ayrılır.

### Axel

İleriye doğru kalkış yapılan tek temel atlayıştır. İleri doğru kalkıp geriye doğru inildiği için her zaman buçuklu tur atılır.

### Salchow

Sol ayağın iç kenarından kalkılır ve sağ ayağın dış kenarına inilir. Toe-pick yardımı kullanılmaz.

### Loop (Rittberger)

Sağ ayağın dış kenarından kalkılır ve yine aynı ayağın dış kenarına inilir. Havada daha kompakt ve çapraz bir pozisyon görülür.

### Toe Loop

Sağ ayağın dış kenarında kayarken, sol ayağın toe-pick'i kullanılarak sıçranır.

### Flip

Sol ayağın iç kenarında kayarken, sağ ayağın toe-pick'i ile alınan destekle kalkış yapılır.

### Lutz

Sol ayağın dış kenarında kayarken sağ ayağın toe-pick'iyle kalkılır. Kayış yönüne ters rotasyon karakteri nedeniyle zor atlayışlardan biridir.

## 2. Dönüşler

Dönüşler temel olarak vücut postürü ve ağırlık merkezine göre ayrılır. Pek çok varyasyon bu üç temel pozisyonun üzerine kurulur.

### Upright Spin

Patencinin daha dik bir postürle döndüğü temel dönüş ailesidir.

### Scratch Spin

Serbest bacağın dönen bacağın önüne çaprazlandığı, hızlanan ve çok hızlı okunabilen dik dönüş varyasyonudur.

### Layback Spin

Sırtın geriye ve başın arkaya doğru açıldığı dik dönüş varyasyonudur.

### Biellmann Spin

Patencinin serbest bacağının patenini başının üzerine kadar çektiği, yüksek esneklik isteyen dönüş varyasyonudur.

### Sit Spin

Dönen bacağın dizinin kırıldığı ve kalçanın diz hizasında ya da daha altında olduğu oturarak dönüş pozisyonudur.

### Camel Spin

Serbest bacağın geriye doğru uzatıldığı ve gövdenin kalçadan itibaren yataya yaklaştığı uzun hatlı dönüş pozisyonudur.

### Flying Spins

Dönüş pozisyonuna doğrudan sıçrayarak girilen zorlu dönüş ailesidir. Flying Camel ve Flying Sit bu gruba örnektir.

## 3. Adım ve Kenar Dönüşleri

Buz üzerinde yön, ayak ve kenar değişimini sağlayan teknik ayak hareketleridir.

### Three-Turn

Tek ayak üzerinde kenar değiştirerek yapılan ve buzda `3` şekline benzeyen temel dönüşlerden biridir.

### Bracket

Three-turn'e benzer, ancak gövde yönlenmesi farklıdır ve buzda daha çok `}` karakterine benzeyen bir iz bırakır.

### Rocker ve Counter

Tek ayak üzerinde, ileri-geri yön değişimi ve kenar hakimiyeti gerektiren daha karmaşık dönüş aileleridir.

### Mohawk ve Choctaw

İki ayak arasında geçişle yön değiştiren temel step bağlantılarıdır. Choctaw, mohawk'a göre daha talepkar bir kenar değişimi içerir.

### Twizzle

Tek ayak üzerinde ilerleyerek yapılan hızlı ve sürekli rotasyonlu adım dizisidir. Özellikle buz dansında belirleyici bir harekettir.

## 4. Alan Hareketleri ve Geçişler

Programın akışını, estetik etkisini ve hat kalitesini güçlendiren kayış figürleridir.

### Spiral

Bir ayak üzerinde kayarken serbest bacağın genellikle kalça seviyesinin üstüne kaldırıldığı uzun çizgili kayış pozisyonudur.

### Spread Eagle

Her iki patenin de buzda kaldığı, ayakların dışa açık şekilde geniş kenar üzerinde kaydığı harekettir.

### Ina Bauer

Spread Eagle'a benzer bir açık hat hareketidir ancak bacaklar ardışık yerleşir. Genellikle dramatik esneme ve müzikal vurgu için kullanılır.

### Lunge

Öndeki dizin derin büküldüğü, arkadaki bacağın düz uzatıldığı güçlü çizgili kayış pozisyonudur.

### Cantilever

Dizlerin derin kırıldığı ve gövdenin geriye doğru çok güçlü açıldığı, akrobatik etki yaratan zor bir field move'dur.

## Uygulama Notu

SkateSync AI içinde bu katalog şu işlerde ortak sözlük görevi görür:

- plan üretimi
- hareket isimlendirme tutarlılığı
- VLM review sırasında doğru RAG bağlamı çekme
- kullanıcıya sistemin neleri tanıdığını açıklama

Bir sonraki adımda bu katalog daha da büyütülebilir:

- kombinasyon atlayışlar
- spin varyasyon seviyeleri
- roller skating'e özel hareketler
- choreographic sequence ve final pose gibi ürün odaklı ek başlıklar
