// GÖREV 4: Okul numarası 1294 (Son rakam 4 + 6 = 10)
const API_URL = "https://dummyjson.com/recipes?limit=10";

$(document).ready(function () {
    if ($("#yemekListesi").length) {
        yemekleriGetir();
    }
    if ($("#sepetTablosu").length) {
        tabloyuCiz();
    }

    $("#kuponAcBtn").click(function () {
        $("#kuponKutusu").slideToggle();
    });

    sepetRozetGuncelle();
});

function yemekleriGetir() {
    $.ajax({
        url: API_URL,
        method: "GET",
        success: function (data) {
            vitrineBas(data.recipes);
        },
        error: function () {
            $("#yemekListesi").html(`
                <div class="col-12 alert alert-danger text-center">
                    Veriler yüklenirken bir hata oluştu. Lütfen bağlantınızı kontrol edin.
                </div>
            `);
        }
    });
}

function vitrineBas(yemekler) {
    let html = "";

    yemekler.forEach(function (yemek) {
        // GÖREV 5: Kalorinin 4'e bölünüp yuvarlanmış hali
        let hesaplananFiyat = Math.round(yemek.caloriesPerServing / 4);

        // GÖREV 6: Kaloriye göre rozet rengi
        let rozetRenk = yemek.caloriesPerServing > 400 ? "bg-danger" : "bg-success";

        // GÖREV 2: col-lg-4 ile geniş ekranlarda 3'lü dizilim
        html += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border-0 yemek-karti">
                    <div class="yemek-img-wrapper">
                        <img src="${yemek.image}" class="card-img-top" alt="${yemek.name}">
                        <span class="badge ${rozetRenk} position-absolute top-0 end-0 m-3 p-2">
                            ${yemek.caloriesPerServing} kcal
                        </span>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title fw-bold text-dark">${yemek.name}</h5>
                        <p class="card-text text-muted small mb-3">
                            <i class="fa-solid fa-clock text-warning me-1"></i> ${yemek.prepTimeMinutes + yemek.cookTimeMinutes} dk hazırlanma süresi
                        </p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <span class="fs-4 fw-bold text-primary">${hesaplananFiyat} TL</span>
                            <button class="btn btn-warning fw-bold text-dark" onclick="sepeteEkle(${yemek.id}, '${yemek.name.replace(/'/g, "\\'")}', ${hesaplananFiyat}, ${yemek.caloriesPerServing}, ${yemek.prepTimeMinutes + yemek.cookTimeMinutes})">
                                <i class="fa-solid fa-plus me-1"></i> Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    $("#yemekListesi").html(html);
}

function sepetiAl() {
    return JSON.parse(localStorage.getItem("kampusSepet")) || [];
}

function sepetiKaydet(sepet) {
    localStorage.setItem("kampusSepet", JSON.stringify(sepet));
    sepetRozetGuncelle();
}

function sepeteEkle(id, ad, fiyat, kalori, sure) {
    let sepet = sepetiAl();
    sepet.push({ id, ad, fiyat, kalori, sure });
    sepetiKaydet(sepet);
    alert(`${ad} sepete eklendi!`);
}

function sepetRozetGuncelle() {
    let sepet = sepetiAl();
    $("#sepetRozet").text(sepet.length);
}

// GÖREV 8: Süre sütunu eklendi
function tabloyuCiz() {
    let sepet = sepetiAl();
    let html = "";
    let toplam = 0;

    if (sepet.length === 0) {
        $("#sepetTablosu").html(`
            <tr>
                <td colspan="5" class="text-center py-4 text-muted">
                    Sepetinizde henüz yemek bulunmamaktadır.
                </td>
            </tr>
        `);
        $("#araToplam").text("0 TL");
        $("#genelToplam").text("0 TL");
        $("#indirimMiktari").text("0 TL");
        return;
    }

    sepet.forEach(function (urun, index) {
        toplam += urun.fiyat;
        html += `
            <tr>
                <td class="fw-bold">${urun.ad}</td>
                <td>${urun.fiyat} TL</td>
                <td><span class="badge bg-info text-dark">${urun.kalori} kcal</span></td>
                <td><i class="fa-regular fa-clock text-secondary me-1"></i>${urun.sure} dk</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" onclick="sepettenCikar(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    $("#sepetTablosu").html(html);
    $("#araToplam").text(toplam + " TL");
    
    let indirimUygulandiMi = localStorage.getItem("indirimUygulandi") === "true";
    if (indirimUygulandiMi) {
        let indirim = Math.round(toplam * 0.25);
        $("#indirimMiktari").text("-" + indirim + " TL");
        $("#genelToplam").text((toplam - indirim) + " TL");
    } else {
        $("#indirimMiktari").text("0 TL");
        $("#genelToplam").text(toplam + " TL");
    }
}

function sepettenCikar(index) {
    let sepet = sepetiAl();
    sepet.splice(index, 1);
    sepetiKaydet(sepet);
    tabloyuCiz();
}

// GÖREV 10: Kupon kodu kontrolü
function indirimYap() {
    let kod = $("#kuponInput").val().trim().toUpperCase();
    
    if (kod === "ABDULLAH BİLAL DEMİR" || kod === "ABDULLAHBILALDEMIR") {
        localStorage.setItem("indirimUygulandi", "true");
        $("#kuponMesaj").removeClass("text-danger").addClass("text-success").text("%25 İndirim başarıyla uygulandı!");
        tabloyuCiz();
    } else {
        $("#kuponMesaj").removeClass("text-success").addClass("text-danger").text("Geçersiz Kupon Kodu!");
    }
}

function siparisTamamla(e) {
    e.preventDefault();
    alert("Tebrikler! Siparişiniz başarıyla alındı.");
    localStorage.removeItem("kampusSepet");
    localStorage.removeItem("indirimUygulandi");
    window.location.href = "index.html";
}