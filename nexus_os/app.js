$(document).ready(function() {
    maratonCanliKontrol();
});

function maratonFormKaydet(e) {
    e.preventDefault();
    maratonCanliKontrol();
    alert("✅ Form Görevleriniz (Görev 8-14) doğrulandı ve hafızaya kaydedildi!");
}

async function sayfaDOMGetir(dosyaAdi, mevcutSayfaIdKontrol) {
    if (document.getElementById(mevcutSayfaIdKontrol)) return document;
    try {
        const res = await fetch(dosyaAdi, { cache: "no-store" });
        const text = await res.text();
        return new DOMParser().parseFromString(text, "text/html");
    } catch (err) {
        return null;
    }
}

async function tumGorevleriAnalizEt() {
    const doc1 = await sayfaDOMGetir("index.html", "gorev1-alan");
    const doc2 = await sayfaDOMGetir("form-merkezi.html", "gorev8-alan");
    const doc3 = await sayfaDOMGetir("css-js-merkezi.html", "testG15");

    let liste = JSON.parse(localStorage.getItem("nexus20Rapor")) || {};

    if (doc1) {
        const a1 = doc1.getElementById("gorev1-alan");
        const g1Ok = a1 && a1.querySelector("h2") && a1.querySelector("strong") && a1.querySelector("mark") && a1.querySelector("del") && a1.querySelector("ins") && a1.querySelector("sub") && a1.querySelector("sup");
        liste.g1 = { ok: !!g1Ok, detay: g1Ok ? `Başlık ve tüm metin etiketleri tam.` : `h2, strong, mark, del, ins, sub veya sup eksik.` };

        const a2 = doc1.getElementById("gorev2-alan");
        const ol = a2 ? a2.querySelector("ol") : null;
        const dl = a2 ? a2.querySelector("dl") : null;
        const g2Ok = ol && ol.getAttribute("type") === "I" && ol.getAttribute("start") === "4" && ol.hasAttribute("reversed") && dl && dl.querySelectorAll("dt").length >= 2 && dl.querySelectorAll("dd").length >= 2;
        liste.g2 = { ok: !!g2Ok, detay: g2Ok ? `<ol type="I" start="4" reversed> ve <dl>/<dt>/<dd> tam.` : `<ol> parametreleri veya <dl> eksik.` };

        const a3 = doc1.getElementById("gorev3-alan");
        const img = a3 ? a3.querySelector("figure img") : null;
        const g3Ok = a3 && a3.querySelector("details summary") && a3.querySelector("figure figcaption") && img && img.hasAttribute("alt") && img.hasAttribute("title") && img.hasAttribute("width");
        liste.g3 = { ok: !!g3Ok, detay: g3Ok ? `<details>/<summary> ve <figure>/<img>/<figcaption> tam.` : `<details>, <figure> veya <img> eksik.` };

        const a4 = doc1.getElementById("gorev4-alan");
        const g4Ok = a4 && a4.querySelector('a[href^="#"]') && a4.querySelector('a[href^="mailto:"]') && a4.querySelector('a[target="_blank"][download]');
        liste.g4 = { ok: !!g4Ok, detay: g4Ok ? `Çıpa (#), mailto: ve download linkleri tam.` : `Bağlantılardan biri eksik.` };

        const a56 = doc1.getElementById("gorev56-alan");
        const tbl = a56 ? a56.querySelector("table") : null;
        const g5Ok = tbl && tbl.getAttribute("border") === "3" && tbl.getAttribute("cellpadding") === "12" && tbl.querySelector("caption") && tbl.querySelector("thead") && tbl.querySelector("tbody") && tbl.querySelector("tfoot");
        liste.g5 = { ok: !!g5Ok, detay: g5Ok ? `Tablo parametreleri ve bölümleri tam.` : `Tablo parametreleri eksik.` };

        const g6Ok = tbl && tbl.querySelector('[colspan="4"]') && tbl.querySelector('[rowspan="3"]');
        liste.g6 = { ok: !!g6Ok, detay: g6Ok ? `colspan="4" ve rowspan="3" hücre birleştirmeleri tam.` : `Colspan veya rowspan bulunamadı.` };

        const a7 = doc1.getElementById("gorev7-alan");
        const vid = a7 ? a7.querySelector("video") : null;
        const g7Ok = vid && vid.hasAttribute("controls") && vid.hasAttribute("autoplay") && vid.hasAttribute("muted") && vid.hasAttribute("loop");
        // Görev 7 detayına video elementinin kendisini tekrar ekledik:
        liste.g7 = { 
            ok: !!g7Ok, 
            detay: g7Ok ? `Video Parametreleri Tam:<br>` + (a7 ? a7.innerHTML : "") : `<video> etiketinde parametreler eksik.` 
        };
    }

    if (doc2) {
        const a8 = doc2.getElementById("gorev8-alan");
        const kilit = a8 ? a8.querySelector("#ajanKilit") : null;
        const adIn = a8 ? a8.querySelector("#ajanAd") : null;
        const g8Ok = a8 && a8.querySelector("fieldset legend") && adIn && adIn.hasAttribute("required") && adIn.hasAttribute("autofocus") && kilit && kilit.hasAttribute("pattern") && kilit.getAttribute("pattern").includes("[A-Z]");
        liste.g8 = { ok: !!g8Ok, detay: g8Ok ? `Fieldset ve Pattern Kilidi (${kilit ? kilit.getAttribute("pattern") : ''}) tam.` : `Fieldset, autofocus veya pattern kuralı eksik.` };

        const a9 = doc2.getElementById("gorev9-alan");
        const g9Ok = a9 && a9.querySelector("input[readonly]") && a9.querySelector("input[disabled]") && a9.querySelector('input[type="hidden"]');
        liste.g9 = { ok: !!g9Ok, detay: g9Ok ? `readonly, disabled ve hidden inputlar tam.` : `Input türlerinden biri eksik.` };

        const a10 = doc2.getElementById("gorev10-alan");
        const num = a10 ? a10.querySelector('input[type="number"]') : null;
        const rng = a10 ? a10.querySelector('input[type="range"]') : null;
        const g10Ok = num && num.getAttribute("min") === "100" && num.getAttribute("max") === "500" && num.getAttribute("step") === "25" && rng && rng.getAttribute("step") === "10";
        liste.g10 = { ok: !!g10Ok, detay: g10Ok ? `Number ve range parametreleri tam.` : `Number/range step veya min-max değerleri hatalı.` };

        const a11 = doc2.getElementById("gorev11-alan");
        const g11Ok = a11 && a11.querySelectorAll("select optgroup").length >= 2 && a11.querySelector("datalist") && a11.querySelector("input[list]");
        liste.g11 = { ok: !!g11Ok, detay: g11Ok ? `Optgroup ve datalist yapıları tam.` : `Optgroup veya datalist eksik.` };

        const a12 = doc2.getElementById("gorev12-alan");
        const g12Ok = a12 && a12.querySelector('input[type="color"]') && a12.querySelector('input[type="date"]') && a12.querySelectorAll('input[type="radio"]').length >= 2 && a12.querySelector('input[type="checkbox"]');
        liste.g12 = { ok: !!g12Ok, detay: g12Ok ? `Color, date, radio ve checkbox tam.` : `Seçici elemanlardan biri eksik.` };

        const a13 = doc2.getElementById("gorev13-alan");
        const mtr = a13 ? a13.querySelector("meter") : null;
        const prg = a13 ? a13.querySelector("progress") : null;
        const g13Ok = mtr && mtr.hasAttribute("low") && mtr.hasAttribute("high") && prg && prg.hasAttribute("max") && prg.hasAttribute("value");
        liste.g13 = { ok: !!g13Ok, detay: g13Ok ? `Meter ve progress etiketleri tam.` : `Meter veya progress parametreleri eksik.` };

        const a14 = doc2.getElementById("gorev14-alan");
        const ta = a14 ? a14.querySelector("textarea") : null;
        const g14Ok = ta && ta.hasAttribute("required") && ta.hasAttribute("maxlength") && a14.querySelector('button[type="submit"]') && a14.querySelector('button[type="reset"]');
        liste.g14 = { ok: !!g14Ok, detay: g14Ok ? `Textarea ve submit/reset butonları tam.` : `Textarea veya butonlar eksik.` };
    }

    const test15 = document.createElement("div"); test15.className = "ozel-komuta-karti"; document.body.appendChild(test15);
    const st15 = window.getComputedStyle(test15);
    const g15Ok = parseInt(st15.paddingTop) >= 20 && st15.borderStyle === "dashed" && st15.backgroundImage.includes("gradient");
    liste.g15 = { ok: g15Ok, detay: g15Ok ? `Kutu modeli ve linear-gradient aktif.` : `.ozel-komuta-karti kuralları eksik.` };
    document.body.removeChild(test15);

    const test16 = document.createElement("div"); test16.className = "enerji-bari"; document.body.appendChild(test16);
    const st16 = window.getComputedStyle(test16);
    const g16Ok = parseFloat(st16.transitionDuration) > 0 && st16.backgroundImage.includes("gradient");
    liste.g16 = { ok: g16Ok, detay: g16Ok ? `Geçişli bar ve transition aktif.` : `.enerji-bari transition veya gradient eksik.` };
    document.body.removeChild(test16);

    const test17 = document.createElement("h4"); test17.className = "komuta-baslik"; document.body.appendChild(test17);
    const st17 = window.getComputedStyle(test17);
    const st17After = window.getComputedStyle(test17, "::after").content;
    const g17Ok = parseInt(st17.letterSpacing) >= 2 && st17.textTransform === "uppercase" && st17After && st17After !== "none" && st17After.length > 4;
    liste.g17 = { ok: !!g17Ok, detay: g17Ok ? `Tipografi ve ::after imzası aktif.` : `.komuta-baslik veya ::after eksik.` };
    document.body.removeChild(test17);

    const test18K = document.createElement("div"); test18K.className = "ajan-kapak";
    const test18A = document.createElement("img"); test18A.className = "ajan-avatar";
    document.body.appendChild(test18K); document.body.appendChild(test18A);
    const g18Ok = window.getComputedStyle(test18K).position === "relative" && window.getComputedStyle(test18A).position === "absolute" && window.getComputedStyle(test18A).borderRadius === "50%";
    liste.g18 = { ok: g18Ok, detay: g18Ok ? `Position relative/absolute ve border-radius aktif.` : `Ajan kapak/avatar pozisyonları eksik.` };
    document.body.removeChild(test18K); document.body.removeChild(test18A);

    try {
        const cssRes = await fetch("style.css", { cache: "no-store" });
        const cssText = await cssRes.text();
        const g19Ok = cssText.includes(".odak-test:focus") && cssText.includes("rgb");
        liste.g19 = { ok: g19Ok, detay: g19Ok ? `.odak-test:focus kuralı doğrulandı.` : `style.css içinde .odak-test:focus bulunamadı.` };
    } catch (e) {
        liste.g19 = { ok: false, detay: "style.css okunamadı." };
    }

    const yEkran = document.getElementById("yetkiEkran");
    if (yEkran && yEkran.innerText.includes("YETKİ:")) {
        liste.g20 = { ok: true, detay: `yetkiHesapla() çalıştırıldı -> "${yEkran.innerText}"` };
    } else if (!liste.g20) {
        liste.g20 = { ok: false, detay: `yetkiHesapla() fonksiyonu henüz çalıştırılmadı.` };
    }

    localStorage.setItem("nexus20Rapor", JSON.stringify(liste));
    return liste;
}

async function maratonCanliKontrol() {
    const liste = await tumGorevleriAnalizEt();
    let toplamPuan = 0;

    for (let i = 1; i <= 20; i++) {
        const g = liste[`g${i}`];
        const rozet = document.getElementById(`rozet-g${i}`);
        if (g && g.ok) {
            toplamPuan += 5;
            if (rozet) { rozet.className = "badge bg-success"; rozet.innerText = `G${i}: Tamam (+5P)`; }
        } else {
            if (rozet) { rozet.className = "badge bg-danger"; rozet.innerText = `G${i}: Eksik (0P)`; }
        }
    }
    $("#ustPuanRozet").text(`Puan: ${toplamPuan} / 100`);
}

async function tumProjeyiTekTiklaDenetle() {
    const liste = await tumGorevleriAnalizEt();
    let toplamPuan = 0;
    let satirlar = "";

    for (let i = 1; i <= 20; i++) {
        const g = liste[`g${i}`] || { ok: false, detay: "Henüz kontrol edilmedi." };
        if (g.ok) toplamPuan += 5;

        satirlar += `
            <tr class="${g.ok ? 'table-success text-dark' : 'table-danger text-dark'}">
                <td class="fw-bold">Görev ${i}</td>
                <td class="fw-bold">${g.ok ? '✅ BAŞARILI (+5 Puan)' : '❌ EKSİK (0 Puan)'}</td>
                <td>${g.detay}</td>
            </tr>
        `;
    }

    const html = `
        <div class="alert ${toplamPuan >= 70 ? 'alert-success' : 'alert-warning'} text-center fw-bold fs-4">
            TOPLAM PROJE PUANI: ${toplamPuan} / 100
        </div>
        <table class="table table-bordered align-middle small">
            <thead class="table-dark">
                <tr>
                    <th width="12%">Görev No</th>
                    <th width="23%">Durum</th>
                    <th>Tespit Edilen Öğrenci Kodu / Hata Detayı</th>
                </tr>
            </thead>
            <tbody>${satirlar}</tbody>
        </table>
    `;

    document.getElementById("denetimModalGovde").innerHTML = html;
    new bootstrap.Modal(document.getElementById("denetimModal")).show();
    maratonCanliKontrol();
}

function yetkiHesapla() {
    let girdiDegeri = document.getElementById("seviyeKutusu").value;
    let sonuc = Number(girdiDegeri) * 15;
    let ekran = document.getElementById("yetkiEkran");

    if (sonuc > 500) {
        ekran.innerText = "ÜST DÜZEY YETKİ: " + sonuc;
    } else {
        ekran.innerText = "STANDART YETKİ: " + sonuc;
    }
}