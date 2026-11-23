let dojoDurum = JSON.parse(localStorage.getItem("siberDojoPuanlar")) || {
    g1: false, g2: false, g3: false, g4: false, g5: false,
    g6: false, g7: false, g8: false, g9: false, g10: false, imza: ""
};

$(document).ready(function() {
    dojoKontrolEt();
});

function bildirimBas(no, basariliMi, mesaj) {
    const durumRozet = document.getElementById(`durum-${no}`);
    const mesajKutu = document.getElementById(`mesaj-${no}`);
    const kart = document.getElementById(`kart-gorev${no}`);
    if (!durumRozet || !mesajKutu) return;

    if (basariliMi) {
        durumRozet.className = "badge bg-success fs-6";
        durumRozet.innerText = "Tamamlandı (+10P)";
        kart.style.borderColor = "#198754";
        mesajKutu.innerHTML = `<div class="alert alert-success py-2 mb-0 small">✅ <strong>Harika İş!</strong> ${mesaj}</div>`;
    } else {
        durumRozet.className = "badge bg-danger";
        durumRozet.innerText = "Eksik Var (0P)";
        kart.style.borderColor = "#2d3748";
        mesajKutu.innerHTML = `<div class="alert alert-warning py-2 mb-0 small">⚠️ <strong>Kod Koçu İpucu:</strong> ${mesaj}</div>`;
    }
}

function dojoKontrolEt() {
    // --- 1. SAYFA KONTROLLERİ ---
    const insa1 = document.getElementById("insa-1");
    if (insa1) {
        const h2 = insa1.querySelector("h2");
        const p = insa1.querySelector("p");
        const strong = insa1.querySelector("strong");
        const mark = insa1.querySelector("mark");
        const del = insa1.querySelector("del");
        const sub = insa1.querySelector("sub");

        if (!h2) bildirimBas(1, false, "Henüz <code>&lt;h2&gt;</code> başlığı yazmadın.");
        else if (!p) bildirimBas(1, false, "<code>&lt;h2&gt;</code> harika! Şimdi altına bir <code>&lt;p&gt;</code> paragrafı aç.");
        else if (!strong || !mark || !del || !sub) bildirimBas(1, false, "Paragrafın içinde <code>&lt;strong&gt;</code>, <code>&lt;mark&gt;</code>, <code>&lt;del&gt;</code> ve <code>&lt;sub&gt;</code> etiketlerinden biri eksik!");
        else { dojoDurum.g1 = true; bildirimBas(1, true, "Başlık ve tüm metin biçimlendirme etiketlerini kendi elinle doğru kodladın!"); }
    }

    const insa2 = document.getElementById("insa-2");
    if (insa2) {
        const ol = insa2.querySelector("ol");
        const ul = insa2.querySelector("ul");
        if (!ol) bildirimBas(2, false, "Henüz <code>&lt;ol&gt;</code> sıralı listesini açmadın.");
        else if (ol.getAttribute("type") !== "A" || ol.getAttribute("start") !== "3" || !ol.hasAttribute("reversed"))
            bildirimBas(2, false, "<code>&lt;ol&gt;</code> açtın ama <code>type=\"A\"</code>, <code>start=\"3\"</code> veya <code>reversed</code> parametrelerinden biri eksik!");
        else if (!ul || ul.getAttribute("type") !== "square")
            bildirimBas(2, false, "Sıralı liste süper! Şimdi altına <code>&lt;ul type=\"square\"&gt;</code> listesini ve <code>&lt;li&gt;</code> elemanlarını ekle.");
        else { dojoDurum.g2 = true; bildirimBas(2, true, "Sıralı ve sırasız liste parametrelerini (type, start, reversed) kusursuz yazdın!"); }
    }

    const insa3 = document.getElementById("insa-3");
    if (insa3) {
        const blankLink = insa3.querySelector('a[target="_blank"]');
        const mailLink = insa3.querySelector('a[href^="mailto:"]');
        const img = insa3.querySelector("img");
        if (!blankLink) bildirimBas(3, false, "<code>target=\"_blank\"</code> parametresine sahip bir <code>&lt;a&gt;</code> etiketi yazmadın.");
        else if (!mailLink) bildirimBas(3, false, "<code>href=\"mailto:...\"</code> parametresine sahip e-posta bağlantısını eklemedin.");
        else if (!img || !img.hasAttribute("alt") || !img.hasAttribute("title") || !img.hasAttribute("width"))
            bildirimBas(3, false, "<code>&lt;img&gt;</code> etiketinde <code>src</code>, <code>alt</code>, <code>title</code> veya <code>width</code> parametrelerinden biri eksik!");
        else { dojoDurum.g3 = true; bildirimBas(3, true, "Bağlantı ve görsel parametrelerini eksiksiz kodladın!"); }
    }

    const insa4 = document.getElementById("insa-4");
    if (insa4) {
        const table = insa4.querySelector("table");
        const colspanEl = insa4.querySelector('[colspan="3"]');
        const rowspanEl = insa4.querySelector('[rowspan="2"]');
        if (!table || !table.hasAttribute("border")) bildirimBas(4, false, "<code>&lt;table border=\"2\" cellpadding=\"10\"&gt;</code> etiketini henüz açmadın.");
        else if (!colspanEl) bildirimBas(4, false, "Tablo içinde <code>colspan=\"3\"</code> parametresiyle 3 sütunu birleştiren başlığı yazmadın.");
        else if (!rowspanEl) bildirimBas(4, false, "Harika gidiyorsun! Şimdi 2 satırı birleştiren <code>&lt;td rowspan=\"2\"&gt;</code> hücresini ekle.");
        else { dojoDurum.g4 = true; bildirimBas(4, true, "Sıfırdan birleşik hücreli (rowspan & colspan) HTML5 tablosu inşa ettin!"); }
    }

    // --- 2. SAYFA KONTROLLERİ ---
    const insa5 = document.getElementById("insa-5");
    if (insa5) {
        const fieldset = insa5.querySelector("fieldset");
        const legend = insa5.querySelector("legend");
        const txt = insa5.querySelector('input[type="text"][required][placeholder]');
        const pass = insa5.querySelector('input[type="password"][required][pattern]');
        const num = insa5.querySelector('input[type="number"][min][max][step]');
        if (!fieldset || !legend) bildirimBas(5, false, "Önce <code>&lt;fieldset&gt;</code> ve içine <code>&lt;legend&gt;</code> etiketlerini açmalısın.");
        else if (!txt) bildirimBas(5, false, "<code>required</code> ve <code>placeholder</code> parametreli <code>type=\"text\"</code> kutusu eksik.");
        else if (!pass) bildirimBas(5, false, "<code>required</code> ve <code>pattern</code> parametreli <code>type=\"password\"</code> kutusu eksik.");
        else if (!num) bildirimBas(5, false, "<code>min</code>, <code>max</code> ve <code>step</code> parametreli <code>type=\"number\"</code> kutusu eksik.");
        else { dojoDurum.g5 = true; bildirimBas(5, true, "Fieldset ve tüm input doğrulama parametrelerini kendi elinle yazdın!"); }
    }

    const insa6 = document.getElementById("insa-6");
    if (insa6) {
        const optgroups = insa6.querySelectorAll("select optgroup");
        const datalist = insa6.querySelector("datalist");
        const listInput = insa6.querySelector("input[list]");
        if (optgroups.length < 2) bildirimBas(6, false, "<code>&lt;select&gt;</code> içinde en az 2 adet <code>&lt;optgroup label=\"...\"&gt;</code> bulunamadı.");
        else if (!datalist || !listInput) bildirimBas(6, false, "<code>&lt;input list=\"...\"&gt;</code> ve ona bağlı <code>&lt;datalist id=\"...\"&gt;</code> yapısı eksik.");
        else { dojoDurum.g6 = true; bildirimBas(6, true, "Gruplu açılır liste (optgroup) ve otomatik tamamlama (datalist) kodlaması başarılı!"); }
    }

    const insa7 = document.getElementById("insa-7");
    if (insa7) {
        const c = insa7.querySelector('input[type="color"]');
        const d = insa7.querySelector('input[type="date"]');
        const r = insa7.querySelector('input[type="range"]');
        const m = insa7.querySelector("meter");
        const p = insa7.querySelector("progress");
        if (!c || !d || !r) bildirimBas(7, false, "<code>type=\"color\"</code>, <code>type=\"date\"</code> veya <code>type=\"range\"</code> inputlarından biri eksik.");
        else if (!m || !p) bildirimBas(7, false, "<code>&lt;meter&gt;</code> veya <code>&lt;progress&gt;</code> etiketlerinden biri eksik!");
        else { dojoDurum.g7 = true; bildirimBas(7, true, "Modern HTML5 form ve ölçüm etiketlerinin tamamını kodladın!"); }
    }

    // --- 3. SAYFA KONTROLLERİ ---
    const testKutu8 = document.getElementById("testKutu8");
    if (testKutu8) {
        const st8 = window.getComputedStyle(testKutu8);
        if (parseInt(st8.paddingTop) >= 20 && st8.borderStyle !== "none" && st8.backgroundImage.includes("gradient")) {
            dojoDurum.g8 = true;
            bildirimBas(8, true, "style.css içinde Kutu Modeli ve linear-gradient kuralını sıfırdan yazdın!");
        } else {
            bildirimBas(8, false, "<code>style.css</code> en altına <code>.benim-ozel-kutum</code> için padding, border ve linear-gradient henüz yazılmamış.");
        }
    }

    const testZindan9 = document.getElementById("testZindan9");
    const testRozet9 = document.getElementById("testRozet9");
    if (testZindan9 && testRozet9) {
        const stZindan = window.getComputedStyle(testZindan9);
        const stRozet = window.getComputedStyle(testRozet9);
        if (stZindan.position === "relative" && stRozet.position === "absolute") {
            dojoDurum.g9 = true;
            bildirimBas(9, true, "position: relative ve absolute ilişkisini kendi elinle kodladın!");
        } else {
            bildirimBas(9, false, "<code>style.css</code> içinde <code>.zindan-kapsayici</code> (relative) ve <code>.kose-rozeti</code> (absolute) henüz tanımlanmamış.");
        }
    }

    const imzaAlan = document.getElementById("imzaSonucAlani");
    if (imzaAlan) {
        if (imzaAlan.innerText !== "Henüz İmzalanmadı" && imzaAlan.innerText.trim().length > 3) {
            dojoDurum.g10 = true;
            dojoDurum.imza = imzaAlan.innerText;
            bildirimBas(10, true, "JavaScript fonksiyonunu kendi elinle kodladın ve çalıştırdın!");
        } else {
            bildirimBas(10, false, "<code>app.js</code> en altındaki <code>sertifikaImzala()</code> fonksiyonunu yazıp kutudan adını imzala!");
        }
    }

    // TOPLAM PUAN HESAPLAMA VE SERTİFİKA KİLİDİ
    let toplam = 0;
    for (let i = 1; i <= 10; i++) {
        if (dojoDurum[`g${i}`]) toplam += 10;
    }

    localStorage.setItem("siberDojoPuanlar", JSON.stringify(dojoDurum));
    $("#toplamPuanRozet").text(`${toplam} / 100 Puan`);
    $("#genelIlerlemeBari").val(toplam);

    if (toplam === 100 && document.getElementById("sertifikaKutusu")) {
        $("#sertifikaOgrenciAdi").text(dojoDurum.imza || "USTA KODLAYICI");
        $("#sertifikaKutusu").slideDown(600);
    }
}

// =================================================================
// ✍️ ÖĞRENCİ JAVASCRIPT KODLAMA ALANI (GÖREV 10'U BURAYA YAZIN)
// =================================================================
function sertifikaImzala() {
    let ad = document.getElementById("ogrenciImzaInput").value;
    document.getElementById("imzaSonucAlani").innerHTML = ad;
}
