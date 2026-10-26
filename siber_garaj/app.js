let garajListesi = JSON.parse(localStorage.getItem("siberGaraj")) || [];
let gelenAraclar = [];
let indirimOrani = 1;

const yedekOtomobiller = [
    { id: 101, title: "Porsche 911 GT3 RS", price: 45000, thumbnail: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=500&q=80", description: "V8 Motor, 520 HP güç ve pist modu ayarlarıyla kusursuz sürüş deneyimi.", brand: "Porsche", rating: 4.9 },
    { id: 102, title: "BMW M4 Competition", price: 32000, thumbnail: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80", description: "TwinPower Turbo motor, karbon fiber detaylar ve agresif tasarım.", brand: "BMW", rating: 4.8 },
    { id: 103, title: "Mercedes-AMG GT R", price: 38000, thumbnail: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&q=80", description: "Yeşil Cehennem canavarı, aerodinamik gövde ve yarış egzozu.", brand: "Mercedes", rating: 4.9 },
    { id: 104, title: "Audi RS R8 V10", price: 41000, thumbnail: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&q=80", description: "Quattro 4 çeker sistemi ve atmosferik V10 motor sesi.", brand: "Audi", rating: 4.7 }
];

const yedekMotosikletler = [
    { id: 201, title: "Kawasaki Ninja H2R", price: 28000, thumbnail: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&q=80", description: "Supercharged 310 HP güç, kompozit kanatçıklar ve maksimum hız.", brand: "Kawasaki", rating: 5.0 },
    { id: 202, title: "Ducati Panigale V4 S", price: 25000, thumbnail: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&q=80", description: "MotoGP teknolojisi, elektronik süspansiyon ve hafif şasi.", brand: "Ducati", rating: 4.9 },
    { id: 203, title: "BMW S1000RR", price: 22000, thumbnail: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&q=80", description: "ShiftCam teknolojili 207 HP motor ve yarış modu paketleri.", brand: "BMW Motorrad", rating: 4.8 }
];

$(document).ready(function() {
    // Görev 5: slideToggle hızı 3000 ms (3 saniye) yapıldı
    $("#kampanyaBtn").click(function() {
        $("#kuponKutusu").slideToggle(3000);
    });

    sayaciGuncelle();
    araclariGetir('vehicle');
    garajTablosunuCiz();
});

async function araclariGetir(kategori) {
    const listeKutusu = document.getElementById("arac-listesi");
    if (!listeKutusu) return;

    listeKutusu.innerHTML = `<div class="col-12 text-center py-5"><div class="spinner-border text-warning"></div><p class="mt-2 text-warning fw-bold">Araçlar Filodan Yükleniyor...</p></div>`;

    let apiKategori = (kategori === 'vehicle') ? 'vehicle' : 'motorcycle';

    try {
        const cevap = await fetch(`https://dummyjson.com/products/category/${apiKategori}`);
        const veri = await cevap.json();
        
        if (veri.products && veri.products.length > 0) {
            gelenAraclar = veri.products;
        } else {
            gelenAraclar = (kategori === 'vehicle') ? yedekOtomobiller : yedekMotosikletler;
        }
    } catch (hata) {
        gelenAraclar = (kategori === 'vehicle') ? yedekOtomobiller : yedekMotosikletler;
    }

    vitrineDiz(gelenAraclar);
}

// Görev 10: Canlı Arama Fonksiyonu
function aramaYap() {
    const arananMetin = $("#aracAra").val().toLowerCase().trim();
    const filtrelenmisAraclar = gelenAraclar.filter(arac => 
        arac.title.toLowerCase().includes(arananMetin) || 
        (arac.description && arac.description.toLowerCase().includes(arananMetin))
    );
    vitrineDiz(filtrelenmisAraclar);
}

function vitrineDiz(araclar) {
    $("#arac-listesi").empty();

    if (!araclar || araclar.length === 0) {
        $("#arac-listesi").html(`<div class="alert alert-warning text-center">Aradığınız kriterlere uygun araç bulunamadı.</div>`);
        return;
    }

    araclar.forEach(arac => {
        const gunlukKira = Math.round(arac.price / 150) + 50;
        const resimUrl = arac.thumbnail || arac.images?.[0] || 'https://via.placeholder.com/300x200?text=SiberGaraj';

        // Görev 1: col-lg-4 yerine col-lg-3 yapıldı (1 satıra 4 kart sığar)
        const kartHTML = `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card bg-black text-light border-secondary h-100 arac-karti">
                    <div class="position-relative">
                        <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2 fs-6">
                            $${gunlukKira} / Gün
                        </span>
                        <img src="${resimUrl}" class="card-img-top" alt="${arac.title}">
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title text-warning fw-bold">${arac.title}</h5>
                            <p class="card-text text-secondary small">${arac.description ? arac.description.substring(0, 70) : 'VIP Kiralık Araç'}...</p>
                        </div>
                        <div class="mt-3">
                            <button onclick="modalAc(${arac.id})" class="btn btn-outline-info btn-sm w-100 mb-2">
                                <i class="fa-solid fa-magnifying-glass"></i> Detaylı İncele (Modal)
                            </button>
                            <button onclick="garajaEkle(${arac.id})" class="btn btn-warning btn-sm w-100 fw-bold">
                                <i class="fa-solid fa-plus"></i> Garaja Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $("#arac-listesi").append(kartHTML);
    });
}

function modalAc(aracId) {
    const secilen = gelenAraclar.find(a => a.id === aracId);
    if (!secilen) return;

    const gunlukKira = Math.round(secilen.price / 150) + 50;

    $("#modalBaslik").text(secilen.title);
    $("#modalResim").attr("src", secilen.thumbnail);
    $("#modalAciklama").text(secilen.description);
    $("#modalMarka").text(secilen.brand || "VIP Özel");
    $("#modalPuan").text(secilen.rating || "4.8");
    $("#modalFiyat").text("$" + gunlukKira);

    document.getElementById("modalKiralaBtn").onclick = function() {
        garajaEkle(secilen.id);
        const modalElement = document.getElementById('aracDetayModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();
    };

    const detayModal = new bootstrap.Modal(document.getElementById('aracDetayModal'));
    detayModal.show();
}

function garajaEkle(aracId) {
    const arac = gelenAraclar.find(a => a.id === aracId);
    if (!arac) return;

    const gunlukKira = Math.round(arac.price / 150) + 50;

    const mevcutArac = garajListesi.find(item => item.id === aracId);
    if (mevcutArac) {
        mevcutArac.gun += 1;
    } else {
        garajListesi.push({
            id: arac.id,
            baslik: arac.title,
            resim: arac.thumbnail,
            gunlukUcret: gunlukKira,
            gun: 1
        });
    }

    localStorage.setItem("siberGaraj", JSON.stringify(garajListesi));
    sayaciGuncelle();
    alert(`🔑 ${arac.title} garajınıza eklendi!`);
}

function sayaciGuncelle() {
    $("#garajSayaci").text(garajListesi.length);
}

function garajTablosunuCiz() {
    const tablo = document.getElementById("garajTabloGovdesi");
    if (!tablo) return;

    $("#garajTabloGovdesi").empty();
    let toplamTutar = 0;

    if (garajListesi.length === 0) {
        $("#garajTabloGovdesi").html(`<tr><td colspan="6" class="py-4 text-secondary">Garajınızda henüz araç yok. Vitrinden araç seçiniz.</td></tr>`);
        $("#genelToplamText").text("$0");
        return;
    }

    garajListesi.forEach((arac, index) => {
        const araToplam = arac.gunlukUcret * arac.gun;
        toplamTutar += araToplam;

        const satir = `
            <tr id="satir-${index}">
                <td><img src="${arac.resim}" width="70" class="rounded"></td>
                <td class="fw-bold text-dark">${arac.baslik}</td>
                <td>$${arac.gunlukUcret}</td>
                <td>
                    <button onclick="gunDegistir(${index}, -1)" class="btn btn-sm btn-secondary">-</button>
                    <span class="mx-2 fw-bold">${arac.gun} Gün</span>
                    <button onclick="gunDegistir(${index}, 1)" class="btn btn-sm btn-secondary">+</button>
                </td>
                <td class="fw-bold text-primary">$${araToplam}</td>
                <td>
                    <button onclick="aracSil(${index})" class="btn btn-sm btn-danger">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        $("#garajTabloGovdesi").append(satir);
    });

    // Görev 9: VIP Çekici Eklenmesi (+$100)
    const vipCekiciSecili = $("#vipCekiciCheck").is(":checked");
    if (vipCekiciSecili) {
        toplamTutar += 100;
    }

    const indirimliToplam = Math.round(toplamTutar * indirimOrani);
    $("#genelToplamText").text("$" + indirimliToplam);
}

function gunDegistir(index, miktar) {
    garajListesi[index].gun += miktar;
    if (garajListesi[index].gun <= 0) {
        aracSil(index);
    } else {
        localStorage.setItem("siberGaraj", JSON.stringify(garajListesi));
        garajTablosunuCiz();
    }
}

function aracSil(index) {
    $(`#satir-${index}`).fadeOut(400, function() {
        garajListesi.splice(index, 1);
        localStorage.setItem("siberGaraj", JSON.stringify(garajListesi));
        garajTablosunuCiz();
        sayaciGuncelle();
    });
}

function garajiTemizle() {
    garajListesi = [];
    localStorage.removeItem("siberGaraj");
    garajTablosunuCiz();
    sayaciGuncelle();
}

function kuponUygula() {
    const girilenKod = $("#kuponInput").val().trim();

    if (girilenKod === "VIPGARAJ20") {
        indirimOrani = 0.8;
        $("#kuponMesaj").html(`<div class="alert alert-success py-1 small">✅ %20 VIP İndirimi Uygulandı!</div>`);
        
        // Görev 6: jQuery css() fonksiyonu ile toplam fiyatı altın sarısı yapıp büyütüyoruz
        $("#genelToplamText").css({
            "color": "#ffc107",
            "font-size": "40px"
        });

        garajTablosunuCiz();
    } else {
        $("#kuponMesaj").html(`<div class="alert alert-danger py-1 small">❌ Geçersiz Kupon Kodu!</div>`);
    }
}

function rezervasyonTamamla(event) {
    event.preventDefault();

    const ad = $("#surucuAd").val().trim();
    const yas = parseInt($("#surucuYas").val());
    const ehliyet = $("#ehliyetSinifi").val();
    const sube = $("#subeSecim").val();

    const uyariKutusu = $("#formUyariKutusu");
    uyariKutusu.show();

    if (garajListesi.length === 0) {
        uyariKutusu.html(`<div class="alert alert-danger">⚠️ Rezervasyon onaylanamadı! Garajınızda henüz hiç araç bulunmuyor.</div>`);
        return;
    }

    if (yas < 21) {
        uyariKutusu.html(`<div class="alert alert-danger">❌ Yaş Sınırı Hatası: VIP araçlarımızı kiralayabilmek için en az 21 yaşında olmalısınız!</div>`);
        return;
    }

    // Görev 8: Ehliyet Sınıfı Uyuşmazlığı Kontrolü
    // Eğer sürücü sadece B Sınıfı seçtiyse ama garajdaki araçlar arasında motosiklet varsa uyarı verelim
    if (ehliyet === "B") {
        const motosikletVarMi = garajListesi.some(arac => 
            arac.baslik.toLowerCase().includes("ninja") || 
            arac.baslik.toLowerCase().includes("ducati") || 
            arac.baslik.toLowerCase().includes("bmw s1000") ||
            arac.baslik.toLowerCase().includes("moto")
        );
        if (motosikletVarMi) {
            uyariKutusu.html(`<div class="alert alert-warning">⚠️ Ehliyet Uyuşmazlığı: 'B Sınıfı' seçtiniz ancak garajınızda motosiklet bulunuyor! Lütfen ehliyet sınıfınızı 'A+B' olarak güncelleyin veya motosikleti sepetten çıkarın.</div>`);
            return;
        }
    }

    uyariKutusu.html(`
        <div class="alert alert-success">
            <h4 class="alert-heading"><i class="fa-solid fa-circle-check"></i> Rezervasyonunuz Başarıyla Onaylandı!</h4>
            <p>Sayın <strong>${ad}</strong>, <strong>${sube}</strong> lokasyonundan teslim almak üzere işlemleriniz tamamlanmıştır.</p>
            <hr>
            <p class="mb-0">Seçilen Ehliyet Sınıfı: ${ehliyet} | Güvenli yolculuklar dileriz!</p>
        </div>
    `);

    garajListesi = [];
    localStorage.removeItem("siberGaraj");
    sayaciGuncelle();
}