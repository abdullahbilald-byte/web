// Global Değişkenlerimiz
var ilerleme = 0;
var kilitKirmaZamanlayici; // setInterval için
var sifreDondurmeZamanlayici; // setInterval için

// Sisteme sızarken ekrana yazdıracağımız sahte log mesajlarını bir DİZİ (Array) içinde tutuyoruz.
var sahteLoglar = [
    "> Güvenlik duvarı atlanıyor...",
    "> Şifreleme algoritmaları çözülüyor...",
    "> Veritabanı portları taranıyor...",
    "> Yönetici (Admin) yetkileri alınıyor...",
    "> Veriler indiriliyor..."
];

// Butona tıklandığında çalışacak ana fonksiyon
function kodKirmayiBaslat() {
    // 1. Butonu devre dışı bırakalım ki bir daha basamasınlar
    document.getElementById("baslatBtn").disabled = true;
    document.getElementById("baslatBtn").innerHTML = "[ İŞLEM DEVAM EDİYOR... ]";

    // 2. Rastgele Şifre Döndürme İşlemi (Her 100 milisaniyede bir çalışır)
    sifreDondurmeZamanlayici = setInterval(rastgeleSifreUret, 100);

    // 3. Yükleme Barını Doldurma İşlemi (Her 500 milisaniyede bir çalışır)
    kilitKirmaZamanlayici = setInterval(barDoldur, 500);
}

// Şifre ekranında film efekti gibi rastgele rakamlar çıkaran fonksiyon
function rastgeleSifreUret() {
    // Math.random() 0 ile 1 arası sayı üretir. Bunu 9999 ile çarpıp tam sayıya yuvarlıyoruz.
    var s1 = Math.floor(Math.random() * 9999);
    var s2 = Math.floor(Math.random() * 9999);
    var s3 = Math.floor(Math.random() * 9999);
    var s4 = Math.floor(Math.random() * 9999);

    document.getElementById("ekran").innerHTML = s1 + "-" + s2 + "-" + s3 + "-" + s4;
}

// Progress Barı (İlerleme çubuğunu) dolduran fonksiyon
function barDoldur() {
    ilerleme = ilerleme + 10; // Her çalışmada ilerlemeyi 10 artır
    
    // HTML'deki <progress> etiketinin value değerini güncelliyoruz
    document.getElementById("yuklemeBari").value = ilerleme;
    document.getElementById("yuzdeYazi").innerHTML = "%" + ilerleme + " Tamamlandı";

    // Rastgele bir log mesajını (Diziden) ekrana yazdırma
    var rastgeleIndex = Math.floor(Math.random() * sahteLoglar.length); // 0 ile 4 arası rastgele sayı
    // Diziye Yeni Eleman Ekleme (HTML içine li etiketi olarak basıyoruz)
    document.getElementById("logListesi").innerHTML += "<li>" + sahteLoglar[rastgeleIndex] + "</li>";

    // EĞER İLERLEME %100 OLDUYSA (İşlem Bitti)
    if (ilerleme >= 100) {
        // Zamanlayıcıları (Döngüleri) durdur (Çok Önemli!)
        clearInterval(kilitKirmaZamanlayici);
        clearInterval(sifreDondurmeZamanlayici);

        // Ekranı Başarılı durumuna getir
        document.getElementById("ekran").innerHTML = "ERİŞİM ONAYLANDI";
        document.getElementById("ekran").style.color = "white";
        document.getElementById("ekran").style.backgroundColor = "green";
        
        document.getElementById("baslatBtn").innerHTML = "[ SİSTEME GİR ]";
        document.getElementById("baslatBtn").disabled = false;
        
        // Sisteme Gir butonuna tıklanınca başka sayfaya (Google'a) yönlendir
        document.getElementById("baslatBtn").setAttribute("onclick", "window.location.href='https://www.google.com'");
    }
}
