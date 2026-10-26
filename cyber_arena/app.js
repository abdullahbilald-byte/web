// 1. TARAYICI HAFIZASINDAN (LOCALSTORAGE) MEVCUT OYUNCULARI ÇEK
let oyuncuListesi = JSON.parse(localStorage.getItem("oyuncular")) || [];

// 2. KAYIT FORMU GÖNDERİLDİĞİNDE ÇALIŞACAK FONKSİYON
function oyuncuKaydet(olay) {
    // GÖREV 7: Formun sayfayı yenilemesini engeller (preventDefault)
    olay.preventDefault();

    const ad = document.getElementById("adSoyad").value;
    const nick = document.getElementById("nickname").value;
    const yasDegeri = document.getElementById("oyuncuYas").value; // GÖREV 9: Yaş verisi
    const mail = document.getElementById("eposta").value;
    const oyun = document.getElementById("oyunSecim").value;
    const tur = document.querySelector('input[name="katilim"]:checked').value;

    // Yeni oyuncu nesnesi (Yaş eklendi)
    const yeniOyuncu = {
        adSoyad: ad,
        nickname: nick,
        yas: yasDegeri,
        eposta: mail,
        oyunAdi: oyun,
        katilimTuru: tur
    };

    // DiziyE ekle ve LocalStorage'a kaydet
    oyuncuListesi.push(yeniOyuncu);
    localStorage.setItem("oyuncular", JSON.stringify(oyuncuListesi));

    alert("Tebrikler " + nick + "! Turnuva kaydın başarıyla alındı.");
    window.location.href = "takimlar.html";
}

// 3. TABLO SAYFASI AÇILDIĞINDA VERİLERİ EKRANA BASMA
function tabloyuDoldur() {
    const tabloGovdesi = document.getElementById("tabloGövdesi");
    const sayac = document.getElementById("oyuncuSayisi");

    if (!tabloGovdesi) return;

    sayac.innerText = oyuncuListesi.length;
    tabloGovdesi.innerHTML = "";

    if (oyuncuListesi.length === 0) {
        tabloGovdesi.innerHTML = "<tr><td colspan='8' style='text-align:center;'>Henüz kayıtlı oyuncu bulunmamaktadır.</td></tr>";
        return;
    }

    // GÖREV 9 & GÖREV 10: Tabloya Yaş sütunu ve Sil butonu eklendi
    oyuncuListesi.forEach((oyuncu, siraNo) => {
        const satir = `
            <tr>
                <td>${siraNo + 1}</td>
                <td style="color:#00ffcc; font-weight:bold;">${oyuncu.nickname}</td>
                <td>${oyuncu.adSoyad}</td>
                <td>${oyuncu.yas}</td>
                <td>${oyuncu.oyunAdi}</td>
                <td>${oyuncu.katilimTuru}</td>
                <td>${oyuncu.eposta}</td>
                <td><button onclick="tekOyuncuSil(${siraNo})" class="tekli-sil-btn">❌ Sil</button></td>
            </tr>
        `;
        tabloGovdesi.innerHTML += satir;
    });
}

// GÖREV 10: TEKİL OYUNCU SİLME FONKSİYONU (splice ile)
function tekOyuncuSil(siraNo) {
    if (confirm("Bu oyuncuyu turnuvadan silmek istediğinize emin misiniz?")) {
        oyuncuListesi.splice(siraNo, 1); // Diziden o indeksteki oyuncuyu sil
        localStorage.setItem("oyuncular", JSON.stringify(oyuncuListesi)); // Hafızayı güncelle
        tabloyuDoldur(); // Tabloyu yeniden çiz
    }
}

// 4. TÜM KAYITLARI SİLME FONKSİYONU
function verileriTemizle() {
    if (confirm("Tüm turnuva kayıtlarını silmek istediğinize emin misiniz?")) {
        localStorage.removeItem("oyuncular");
        oyuncuListesi = [];
        tabloyuDoldur();
    }
}

// Sayfa yüklendiğinde tabloyu otomatik doldur
tabloyuDoldur();