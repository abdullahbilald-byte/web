// 1. LOCALSTORAGE HAFIZASI
let projelerListesi = JSON.parse(localStorage.getItem("siberFestProjeler")) || [];

$(document).ready(function() {
    sayacGuncelle();
    jurileriGetir();       // index.html sayfasındaysak API'den jüri çek
    projeTablosunuCiz();   // projeler.html sayfasındaysak tabloyu çiz
});

function sayacGuncelle() {
    $("#projeSayaci").text(projelerListesi.length);
}


// ==========================================================
// 1. SAYFA: CANLI API'DEN JÜRİ ÇEKME VE MAILTO: BAĞLANTISI
// ==========================================================
async function jurileriGetir() {
    const kutu = document.getElementById("juri-listesi");
    if (!kutu) return;

    try {
        const cevap = await fetch("https://dummyjson.com/users?limit=4");
        const veri = await cevap.json();
        
        $("#juri-listesi").empty();

        veri.users.forEach(juri => {
            const kart = `
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card text-light border-secondary h-100 text-center p-3 juri-karti">
                        <img src="${juri.image}" class="rounded-circle mx-auto border border-info p-1 mb-3" width="95">
                        <h5 class="text-info fw-bold mb-1">${juri.firstName} ${juri.lastName}</h5>
                        <p class="text-warning small mb-1">${juri.company.title}</p>
                        <p class="text-secondary small mb-3">${juri.university}</p>
                        
                        <a href="mailto:${juri.email}?subject=SiberFest%20Mentorluk%20Talebi" class="btn btn-outline-info btn-sm mt-auto">
                            <i class="fa-solid fa-envelope"></i> Mentöre Yaz
                        </a>
                    </div>
                </div>
            `;
            $("#juri-listesi").append(kart);
        });
    } catch (hata) {
        kutu.innerHTML = `<div class="alert alert-danger">Jüri verileri yüklenemedi.</div>`;
    }
}


// ==========================================================
// 2. SAYFA: FORM RANGE GÖSTERGELERİ VE PROJE KAYDETME
// ==========================================================
function butceYazdir(deger) {
    document.getElementById("butceGosterge").innerText = deger + " TL";
}

function hazirlikYazdir(deger) {
    document.getElementById("hazirlikGosterge").innerText = "%" + deger;
}

function projeKaydet(olay) {
    olay.preventDefault();

    const yeniProje = {
        takim: $("#takimAdi").val(),
        kaptan: $("#kaptanAd").val(),
        mail: $("#kaptanMail").val(),
        tel: $("#kaptanTel").val(),
        sehir: $("#sehirSecim").val(),
        proje: $("#projeAdi").val(),
        kategori: $("#kategoriSecim").val(),
        uye: $("#uyeSayisi").val(),
        tarih: $("#sunumTarihi").val(), // Tarih verisi
        renk: $("#takimRengi").val(),
        butce: parseInt($("#butceRange").val()),
        hazirlik: parseInt($("#hazirlikRange").val()),
        github: $("#githubUrl").val() || "https://github.com",
        seviye: $('input[name="seviye"]:checked').val(),
        ozet: $("#projeOzet").val()
    };

    projelerListesi.push(yeniProje);
    localStorage.setItem("siberFestProjeler", JSON.stringify(projelerListesi));

    alert(`🚀 Tebrikler ${yeniProje.takim}! "${yeniProje.proje}" başlıklı projeniz başarıyla kaydedildi.`);
    window.location.href = "projeler.html";
}


// ==========================================================
// 3. SAYFA: <METER> VE <PROGRESS> İLE PROJE ANALİZ TABLOSU
// ==========================================================
function projeTablosunuCiz() {
    const govde = document.getElementById("projeTabloGovdesi");
    if (!govde) return;

    $("#projeTabloGovdesi").empty();

    if (projelerListesi.length === 0) {
        $("#projeTabloGovdesi").html(`
            <tr>
                <td colspan="8" class="py-4 text-secondary">
                    Henüz kayıtlı proje bulunmamaktadır. <a href="basvuru.html" class="text-info">İlk başvuruyu siz yapın!</a>
                </td>
            </tr>
        `);
        return;
    }

    projelerListesi.forEach((p, index) => {
        const satir = `
            <tr id="proje-satir-${index}">
                <td>
                    <span class="badge p-2 w-100" style="background-color: ${p.renk}; color: #000; font-size:14px;">
                        <i class="fa-solid fa-flag"></i> ${p.takim}
                    </span>
                    <small class="text-secondary d-block mt-1">${p.seviye} (${p.uye} Kişi)</small>
                </td>
                <td class="text-start">
                    <strong class="text-info">${p.proje}</strong>
                    <span class="badge bg-secondary d-block mt-1" style="width: fit-content;">${p.kategori}</span>
                </td>
                <td>
                    <div>${p.kaptan}</div>
                    <small class="text-warning"><i class="fa-solid fa-location-dot"></i> ${p.sehir}</small>
                </td>
                <td>
                    <!-- GÖREV 9: Sunum Tarihi Sütunu -->
                    <span class="badge bg-dark border border-info text-info"><i class="fa-regular fa-calendar"></i> ${p.tarih}</span>
                </td>
                <td>
                    <meter min="5000" low="15000" high="35000" optimum="10000" max="50000" value="${p.butce}" class="w-100" style="height:18px;"></meter>
                    <div class="small fw-bold">${p.butce.toLocaleString('tr-TR')} TL</div>
                </td>
                <td>
                    <progress value="${p.hazirlik}" max="100" class="w-100" style="height:18px;"></progress>
                    <div class="small text-info fw-bold">%${p.hazirlik} Hazır</div>
                </td>
                <td>
                    <a href="mailto:${p.mail}" class="btn btn-sm btn-outline-light me-1" title="${p.mail}">
                        <i class="fa-solid fa-envelope"></i>
                    </a>
                    <a href="${p.github}" target="_blank" class="btn btn-sm btn-outline-info" title="GitHub Deposu">
                        <i class="fa-brands fa-github"></i>
                    </a>
                </td>
                <td>
                    <button onclick="projeSil(${index})" class="btn btn-sm btn-danger">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        $("#projeTabloGovdesi").append(satir);
    });
}

function projeSil(index) {
    $(`#proje-satir-${index}`).fadeOut(400, function() {
        projelerListesi.splice(index, 1);
        localStorage.setItem("siberFestProjeler", JSON.stringify(projelerListesi));
        sayacGuncelle();
        projeTablosunuCiz();
    });
}

function tumProjeleriSil() {
    if (confirm("Tüm kayıtlı projeleri silmek istediğinize emin misiniz?")) {
        projelerListesi = [];
        localStorage.removeItem("siberFestProjeler");
        sayacGuncelle();
        projeTablosunuCiz();
    }
}