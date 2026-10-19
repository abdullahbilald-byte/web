// 1. TARAYICI HAFIZASINDAN (LOCALSTORAGE) MEVCUT OYUNCULARI ÇEK
// Eğer hafızada 'oyuncular' diye bir kayıt varsa onu diziye çevir (JSON.parse), yoksa boş bir dizi [] oluştur.
let oyuncuListesi = JSON.parse(localStorage.getItem("oyuncular")) || [];


// 2. KAYIT FORMU GÖNDERİLDİĞİNDE ÇALIŞACAK FONKSİYON (kayit.html için)
function oyuncuKaydet(olay) {
    // Formun varsayılan davranışı sayfayı yenilemektir. Bunu engelliyoruz!
    olay.preventDefault();

    // HTML'deki kutulardan değerleri (value) alıyoruz
    const ad = document.getElementById("adSoyad").value;
    const nick = document.getElementById("nickname").value;
    const mail = document.getElementById("eposta").value;
    const oyun = document.getElementById("oyunSecim").value;
    
    // Seçili olan radyo butonunu (Bireysel mi Takım mı) yakalama
    const tur = document.querySelector('input[name="katilim"]:checked').value;

    // Yeni oyuncuyu bir NESNE (Object) olarak paketliyoruz
    const yeniOyuncu = {
        adSoyad: ad,
        nickname: nick,
        eposta: mail,
        oyunAdi: oyun,
        katilimTuru: tur
    };

    // Bu paketi dizimize (Array) ekliyoruz
    oyuncuListesi.push(yeniOyuncu);

    // DİZİYİ TARAYICI HAFIZASINA (LOCALSTORAGE) KAYDET! (Metne çevirerek - JSON.stringify)
    localStorage.setItem("oyuncular", JSON.stringify(oyuncuListesi));

    // Kullanıcıya bilgi ver ve Tablo sayfasına yönlendir!
    alert("Tebrikler " + nick + "! Turnuva kaydın başarıyla alındı.");
    window.location.href = "takimlar.html";
}


// 3. TABLO SAYFASI AÇILDIĞINDA VERİLERİ EKRANA BASMA (takimlar.html için)
function tabloyuDoldur() {
    const tabloGovdesi = document.getElementById("tabloGövdesi");
    const sayac = document.getElementById("oyuncuSayisi");

    // DİKKAT: Bu JS dosyası tüm sayfalara bağlı. Eğer şu an açık olan sayfada "tabloGövdesi" yoksa (yani kayit sayfasındaysak) hata vermemesi için fonksiyonu durdur (return)!
    if (!tabloGovdesi) return;

    // Oyuncu sayısını güncelle
    sayac.innerText = oyuncuListesi.length;

    // Tabloyu temizle
    tabloGovdesi.innerHTML = "";

    // Eğer hiç kayıt yoksa tabloya mesaj yaz
    if (oyuncuListesi.length === 0) {
        tabloGovdesi.innerHTML = "<tr><td colspan='6' style='text-align:center;'>Henüz kayıtlı oyuncu bulunmamaktadır.</td></tr>";
        return;
    }

    // Dizideki her bir oyuncu için döngü kur ve tabloya satır (<tr>) ekle
    oyuncuListesi.forEach((oyuncu, siraNo) => {
        const satir = `
            <tr>
                <td>${siraNo + 1}</td>
                <td style="color:#00ffcc; font-weight:bold;">${oyuncu.nickname}</td>
                <td>${oyuncu.adSoyad}</td>
                <td>${oyuncu.oyunAdi}</td>
                <td>${oyuncu.katilimTuru}</td>
                <td>${oyuncu.eposta}</td>
            </tr>
        `;
        tabloGovdesi.innerHTML += satir;
    });
}

// 4. TÜM KAYITLARI SİLME FONKSİYONU
function verileriTemizle() {
    if (confirm("Tüm turnuva kayıtlarını silmek istediğinize emin misiniz?")) {
        localStorage.removeItem("oyuncular"); // Hafızayı sil
        oyuncuListesi = []; // Diziyi boşalt
        tabloyuDoldur(); // Tabloyu yeniden çiz
    }
}

// Sayfa yüklendiğinde tabloyu doldurma fonksiyonunu otomatik çağır
tabloyuDoldur();
