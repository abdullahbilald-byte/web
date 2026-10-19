// 1. GLOBAL DEĞİŞKENLER VE HAFIZA (LOCALSTORAGE)
let sepet = JSON.parse(localStorage.getItem("sepetim")) || [];
let vitrinUrunleri = [];
const DOLAR_KURU = 34; // GÖREV 3: Doları TL'ye Çevirme Kuru
let indirimOrani = 0; // GÖREV 6: İndirim Kuponu Durumu

// Sayfa açılır açılmaz sağ üstteki Sepet sayacını güncelle
sepetSayaciniGuncelle();

// 2. CANLI API'DEN ÜRÜN ÇEKME FONKSİYONU
async function urunleriGetir(kategori) {
    const vitrin = document.getElementById("urun-vitrini");
    if (!vitrin) return;

    vitrin.innerHTML = "<h2 style='text-align:center; width:100%;'>⏳ Ürünler Sunucudan Çekiliyor...</h2>";

    try {
        const cevap = await fetch(`https://dummyjson.com/products/category/${kategori}`);
        const veri = await cevap.json();
        
        vitrinUrunleri = veri.products;
        vitrineBas(vitrinUrunleri);

    } catch (hata) {
        vitrin.innerHTML = "<h2 style='color:red;'>Sunucu bağlantı hatası!</h2>";
    }
}

// 3. GELEN ÜRÜNLERİ VİTRİNE (GRID) DİZME (GÖREV 3: TL Fiyatı Hesaplama)
function vitrineBas(urunler) {
    const vitrin = document.getElementById("urun-vitrini");
    vitrin.innerHTML = "";

    urunler.forEach(urun => {
        // GÖREV 3: Fiyatı TL'ye Çeviriyoruz
        const tlFiyat = (urun.price * DOLAR_KURU).toFixed(2);

        const kart = `
            <article class="urun-karti">
                <div>
                    <img src="${urun.thumbnail}" alt="${urun.title}">
                    <h3>${urun.title}</h3>
                    <p style="color:#64748b; font-size:13px;">⭐ Puan: ${urun.rating} | Marka: ${urun.brand || 'Genel'}</p>
                </div>
                <div>
                    <div class="urun-fiyat">₺${tlFiyat}</div>
                    <button onclick="sepeteEkle(${urun.id})" class="ekle-btn">➕ Sepete Ekle</button>
                </div>
            </article>
        `;
        vitrin.innerHTML += kart;
    });
}

// 4. SEPETE EKLEME İŞLEMİ
function sepeteEkle(urunId) {
    const eklenecekUrun = vitrinUrunleri.find(u => u.id === urunId);

    if (eklenecekUrun) {
        sepet.push(eklenecekUrun);
        localStorage.setItem("sepetim", JSON.stringify(sepet));
        
        sepetSayaciniGuncelle();

        const ses = document.getElementById("sepetSesi");
        if (ses) ses.play();
    }
}

// 5. SAĞ ÜSTTEKİ SEPET SAYACINI GÜNCELLEME
function sepetSayaciniGuncelle() {
    const sayacElemani = document.getElementById("sepetSayaci");
    if (sayacElemani) {
        sayacElemani.innerText = sepet.length;
    }
}

// ==========================================================
// SEPET SAYFASI (sepet.html) TABLO VE HESAPLAMA FONKSİYONLARI
// ==========================================================

function sepetTablosunuCiz() {
    const tabloGovdesi = document.getElementById("sepetTabloGovdesi");
    const toplamAlani = document.getElementById("toplamTutarAlani");
    const kargoAlani = document.getElementById("kargoTutarAlani");

    if (!tabloGovdesi) return;

    tabloGovdesi.innerHTML = "";
    let araToplam = 0;

    if (sepet.length === 0) {
        tabloGovdesi.innerHTML = "<tr><td colspan='5' style='text-align:center; padding:30px;'>Sepetinizde henüz ürün bulunmamaktadır.</td></tr>";
        toplamAlani.innerText = "₺0.00";
        if (kargoAlani) kargoAlani.innerText = "₺0.00";
        return;
    }

    // GÖREV 5: Tabloya Marka (urun.brand) Bilgisi Eklendi
    sepet.forEach((urun, siraIndex) => {
        const tlFiyat = urun.price * DOLAR_KURU;
        araToplam += tlFiyat;

        const satir = `
            <tr>
                <td><img src="${urun.thumbnail}" alt="${urun.title}"></td>
                <td style="font-weight:bold; color:#64748b;">${urun.brand || 'Belirtilmemiş'}</td>
                <td style="font-weight:bold;">${urun.title}</td>
                <td>₺${tlFiyat.toFixed(2)}</td>
                <td>
                    <button onclick="sepettenSil(${siraIndex})" class="urun-sil-btn">Sil ✖</button>
                </td>
            </tr>
        `;
        tabloGovdesi.innerHTML += satir;
    });

    // GÖREV 4: KARGO ÜCRETİ MANTIĞI (1000 TL Altında 50 TL Kargo)
    let kargoUcreti = 0;
    if (araToplam < 1000 && araToplam > 0) {
        kargoUcreti = 50;
        if (kargoAlani) kargoAlani.innerText = "₺50.00";
    } else {
        if (kargoAlani) kargoAlani.innerText = "ÜCRETSİZ KARGO";
    }

    let genelToplam = araToplam + kargoUcreti;

    // GÖREV 6: İndirim Kuponu Varsa Uygula (%20 İndirim)
    if (indirimOrani > 0) {
        genelToplam = genelToplam * (1 - indirimOrani);
    }

    toplamAlani.innerText = "₺" + genelToplam.toFixed(2);
}

// GÖREV 6: İNDİRİM KUPONU FONKSİYONU
function kuponUygula() {
    const kuponKod = document.getElementById("kuponKodu").value.trim();
    const mesajAlani = document.getElementById("kuponMesaj");

    if (kuponKod === "MESLEK11") {
        indirimOrani = 0.20; // %20 İndirim
        mesajAlani.style.color = "#10b981";
        mesajAlani.innerText = "🎉 %20 İndirim Kuponu Başarıyla Uygulandı!";
        sepetTablosunuCiz();
    } else {
        indirimOrani = 0;
        mesajAlani.style.color = "#ef4444";
        mesajAlani.innerText = "❌ Geçersiz Kupon Kodu!";
        sepetTablosunuCiz();
    }
}

// 6. SEPETTEN TEK ÜRÜN SİLME
function sepettenSil(index) {
    sepet.splice(index, 1);
    localStorage.setItem("sepetim", JSON.stringify(sepet));
    sepetTablosunuCiz();
    sepetSayaciniGuncelle();
}

// 7. SEPETİ TAMAMEN BOŞALTMA
function sepetiBosalt() {
    sepet = [];
    indirimOrani = 0;
    localStorage.removeItem("sepetim");
    sepetTablosunuCiz();
    sepetSayaciniGuncelle();
}

// 8. SİPARİŞİ TAMAMLAMA (FORM GÖNDERİMİ)
function siparisiTamamla(olay) {
    olay.preventDefault();

    if (sepet.length === 0) {
        alert("HATA: Sepetiniz boşken sipariş veremezsiniz!");
        return;
    }

    const musteri = document.getElementById("musteriAd").value;
    const tutar = document.getElementById("toplamTutarAlani").innerText;

    alert(`🎉 Siparişiniz Alındı Sayın ${musteri}!\nKartınızdan ${tutar} çekilmiştir.\nÜrünleriniz kargoya hazırlanıyor.`);

    sepetiBosalt();
    window.location.href = "index.html";
}

// SİTE İLK AÇILDIĞINDA ÇALIŞACAK BAŞLANGIÇ KOMUTLARI:
urunleriGetir('laptops');
sepetTablosunuCiz();