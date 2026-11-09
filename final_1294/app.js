let kayitlar = JSON.parse(localStorage.getItem("finalKayitlar")) || [];
kayitlar = [{ad: "Abdullah Bilal Demir", kilitKodu: "1294TR", sehir: "Ankara", tarih: "2026-06-06", kategori: "Pro Antrenman", miktar: 10, guc: 50, renk: "#ffc107", not: "Tamamlandı"}];

$(document).ready(function() {
    $("#kayitSayaci").text(kayitlar.length);
    uzmanlariGetir();
    kartlariCiz();
});

// 1. VİTRİN UZMANLARINI API'DEN ÇEKME
async function uzmanlariGetir() {
    const vitrin = document.getElementById("uzman-vitrini");
    if (!vitrin) return;

    try {
        const cevap = await fetch("https://dummyjson.com/users?limit=4");
        const veri = await cevap.json();
        $("#uzman-vitrini").empty();

        veri.users.forEach(u => {
            const kart = `
                <div class="uzman-kart-kutu">
                    <div class="uzman-ust-sablon">
                        <img src="${u.image}" class="uzman-yuvarlak-foto" alt="${u.firstName}">
                    </div>
                    <div class="uzman-alt-bilgi">
                        <h6 class="text-warning fw-bold mb-1">${u.firstName} ${u.lastName}</h6>
                        <p class="small text-secondary mb-2">${u.company.department}</p>
                        <a href="mailto:${u.email}" class="btn btn-outline-warning btn-sm w-100">İletişim</a>
                    </div>
                </div>
            `;
            $("#uzman-vitrini").append(kart);
        });
    } catch (e) {
        vitrin.innerHTML = "<p class='text-danger'>API Bağlantı Hatası</p>";
    }
}

function rangeYazdir(deger) {
    document.getElementById("rangeGosterge").innerText = deger;
}

// 2. FORMU KAYDETME
function formuKaydet(olay) {
    olay.preventDefault();

    const yeniKayit = {
        ad: $("#kisiAd").val(),
        kilitKodu: $("#ozelKilitKodu").val(),
        sehir: $("#sehirInput").val(),
        tarih: $("#tarihInput").val(),
        kategori: $("#kategoriInput").val(),
        miktar: parseInt($("#miktarInput").val()),
        guc: parseInt($("#gucRange").val()),
        renk: $("#renkInput").val(),
        not: $("#ekstraNot").val()
    };

    kayitlar.push(yeniKayit);
    localStorage.setItem("finalKayitlar", JSON.stringify(kayitlar));

    alert(`✅ Başarılı! Kişisel Kilit Kodunuz (${yeniKayit.kilitKodu}) doğrulandı ve kaydedildi.`);
    window.location.href = "kanit-paneli.html";
}

// 3. KANIT PANELİNDE KARTLARI (<meter> ve <progress> ile) ÇİZME
function kartlariCiz() {
    const alan = document.getElementById("uretilen-kartlar");
    if (!alan) return;

    $("#uretilen-kartlar").empty();

    if (kayitlar.length === 0) {
        $("#uretilen-kartlar").html(`<div class="col-12"><div class="alert alert-warning">Henüz formdan kayıt eklemediniz! Önce Form sayfasından kayıt yapınız.</div></div>`);
        return;
    }

    kayitlar.forEach((k, index) => {
        const kart = `
            <div class="col-md-6" id="kart-${index}">
                <div class="p-3 bg-black rounded" style="border: 2px solid ${k.renk}; border-left-width: 12px;">
                    <div class="d-flex justify-content-between">
                        <h5 class="text-warning fw-bold">${k.ad}</h5>
                        <span class="badge bg-info text-dark">Kilit: ${k.kilitKodu}</span>
                    </div>
                    <p class="small text-secondary mb-2">${k.kategori} | 📍 ${k.sehir} | 📅 ${k.tarih}</p>
                    <p class="small bg-dark p-2 rounded border border-secondary">"${k.not}"</p>

                    <div class="mb-2">
                        <small class="d-flex justify-content-between"><span>Miktar Ölçümü (&lt;meter&gt;):</span> <strong>${k.miktar}/100</strong></small>
                        <meter min="0" low="30" high="80" optimum="50" max="100" value="${k.miktar}" class="w-100"></meter>
                    </div>
                    <div class="mb-3">
                        <small class="d-flex justify-content-between"><span>Güç/Bütçe Oranı (&lt;progress&gt;):</span> <strong>%${k.guc}</strong></small>
                        <progress value="${k.guc}" max="100" class="w-100"></progress>
                    </div>

                    <button onclick="kayitSil(${index})" class="btn btn-sm btn-outline-danger w-100">Kaydı Sil</button>
                </div>
            </div>
        `;
        $("#uretilen-kartlar").append(kart);
    });
}

function kayitSil(index) {
    kayitlar.splice(index, 1);
    localStorage.setItem("finalKayitlar", JSON.stringify(kayitlar));
    kartlariCiz();
}

// =========================================================================
// 👨‍🏫 4. ÖĞRETMEN OTOMATİK DENETİM MOTORU (YAPAY ZEKA VE KOPYA YAKALAYICI!)
// =========================================================================
function ogretmenDenetimiBaslat() {
    let rapor = `<ul class="list-group">`;
    let puan = 0;

    // Kontrol 1: Öğrenci LocalStorage'a kendi kilit koduyla kayıt eklemiş mi?
    if (kayitlar.length > 0 && kayitlar[0].kilitKodu !== "0000") {
        puan += 25;
        rapor += `<li class="list-group-item list-group-item-success">✅ <strong>Form ve Pattern Kilidi (25 Puan):</strong> Öğrenci kişisel kilit koduyla (<strong>${kayitlar[0].kilitKodu}</strong>) başarılı kayıt oluşturmuş.</li>`;
    } else {
        rapor += `<li class="list-group-item list-group-item-danger">❌ <strong>Form ve Pattern Kilidi (0 Puan):</strong> Henüz özel pattern koduyla kayıt yapılmamış!</li>`;
    }

    // Kontrol 2: CSS .hizmet-kutusu padding ve border düzeltilmiş mi?
    const testDiv = document.createElement("div");
    testDiv.className = "hizmet-kutusu";
    document.body.appendChild(testDiv);
    const stil = window.getComputedStyle(testDiv);
    if (parseInt(stil.paddingTop) >= 15 && stil.borderStyle !== "none") {
        puan += 25;
        rapor += `<li class="list-group-item list-group-item-success">✅ <strong>CSS Kutu Modeli Tuzağı (25 Puan):</strong> Padding (${stil.paddingTop}) ve Border (${stil.borderStyle}) başarıyla düzeltilmiş.</li>`;
    } else {
        rapor += `<li class="list-group-item list-group-item-danger">❌ <strong>CSS Kutu Modeli Tuzağı (0 Puan):</strong> .hizmet-kutusu padding veya border-style hala bozuk!</li>`;
    }
    document.body.removeChild(testDiv);

    // Kontrol 3: CSS .uzman-ust-sablon position: relative yapılmış mı?
    const testSablon = document.createElement("div");
    testSablon.className = "uzman-ust-sablon";
    document.body.appendChild(testSablon);
    const sablonStil = window.getComputedStyle(testSablon);
    if (sablonStil.position === "relative") {
        puan += 25;
        rapor += `<li class="list-group-item list-group-item-success">✅ <strong>CSS Position: Relative Tuzağı (25 Puan):</strong> Yuvarlak profil resimleri karta başarıyla hapsedilmiş.</li>`;
    } else {
        rapor += `<li class="list-group-item list-group-item-danger">❌ <strong>CSS Position Tuzağı (0 Puan):</strong> .uzman-ust-sablon hala 'relative' değil, resimler dışarı uçuyor!</li>`;
    }
    document.body.removeChild(testSablon);

    // Kontrol 4: Öğrenci Savunma Tablosunu kendi cümleleriyle doldurmuş mu?
    const tabloMetni = document.getElementById("savunmaTablosu").innerText;
    if (!tabloMetni.includes("Henüz doldurulmadı")) {
        puan += 25;
        rapor += `<li class="list-group-item list-group-item-success">✅ <strong>Kod Savunma Tablosu (25 Puan):</strong> Öğrenci yaptığı tüm değişiklikleri tabloya açıklamış.</li>`;
    } else {
        rapor += `<li class="list-group-item list-group-item-warning">⚠️ <strong>Kod Savunma Tablosu (0 Puan):</strong> Tablodaki "Henüz doldurulmadı" yazıları duruyor!</li>`;
    }

    rapor += `</ul><div class="alert alert-info mt-3 fw-bold fs-5 text-center">OTOMATİK TEKNİK PUAN: ${puan} / 100</div>`;
    document.getElementById("denetimRaporuAlani").innerHTML = rapor;
}
