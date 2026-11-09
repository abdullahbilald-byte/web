const varsayilanAnilar = [
    {
        id: 1,
        ad: "Zonguldak MTAL Bilişim Zümresi",
        sehir: "Zonguldak",
        okulNo: "1923",
        tarih: "2026-11-10",
        kategori: "Öğretmen ve Eğitimcilerin Sözü",
        unvan: "Öğretmen",
        renk: "#d4af37",
        hedef: 100,
        metin: "Aziz Atatürk; gösterdiğin 'muasır medeniyetler seviyesinin üzerine çıkma' hedefi doğrultusunda, kod yazan, üreten ve vatanını seven gençler yetiştirmeye ant içeriz."
    },
    {
        id: 2,
        ad: "11. Sınıf Web Geliştirme Öğrencileri",
        sehir: "Zonguldak",
        okulNo: "2026",
        tarih: "2026-11-10",
        kategori: "Bilim ve Teknoloji Sözü",
        unvan: "Bilişim Öğrencisi",
        renk: "#e30a17",
        hedef: 100,
        metin: "Bize emanet ettiğin Cumhuriyeti, bilim ve yazılım teknolojileriyle en güçlü şekilde geleceğe taşıyacağımıza söz veriyoruz. Ruhun şad olsun!"
    }
];

let aniListesi = JSON.parse(localStorage.getItem("ataturkAniDefteri")) || varsayilanAnilar;

$(document).ready(function() {
    sayacGuncelle();
    aniDuvariniCiz();
});

function sayacGuncelle() {
    $("#aniSayaci").text(aniListesi.length);
    const bar = document.getElementById("hedefProgress");
    if (bar) bar.value = aniListesi.length;
}

// 09:05 SAYGI DURUŞU MODU
function saygiDurusuAc() {
    $("#saygiDurusuKatmani").fadeIn(600);
}

function saygiDurusuKapat() {
    $("#saygiDurusuKatmani").fadeOut(600);
}

// RANGE GÖSTERGESİ
function hedefGuncelle(deger) {
    document.getElementById("hedefGosterge").innerText = "%" + deger;
}

// ANI DEFTERİ FORMUNU KAYDETME
function aniKaydet(olay) {
    olay.preventDefault();

    const yeniAni = {
        id: Date.now(),
        ad: $("#ziyaretciAd").val(),
        sehir: $("#ziyaretciSehir").val(),
        okulNo: $("#okulNo").val(),
        tarih: $("#ziyaretTarih").val(),
        kategori: $("#mesajKategori").val(),
        unvan: $('input[name="unvan"]:checked').val(),
        renk: $("#yaprakRengi").val(),
        hedef: parseInt($("#hedefRange").val()),
        metin: $("#aniMetni").val()
    };

    aniListesi.unshift(yeniAni);
    localStorage.setItem("ataturkAniDefteri", JSON.stringify(aniListesi));

    alert(`🇹🇷 Teşekkürler ${yeniAni.ad}. Mesajınız Dijital Anıtkabir Özel Defteri'ne kaydedildi.`);
    window.location.href = "anilar.html";
}

// ANI DUVARINI ÇİZME
function aniDuvariniCiz() {
    const duvar = document.getElementById("ani-duvari-listesi");
    if (!duvar) return;

    if (aniListesi.length === 0) {
        duvar.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-feather fa-3x text-secondary mb-3"></i>
                <h4 class="text-secondary">Henüz Anı Duvarı'nda mesaj bulunmuyor.</h4>
                <a href="defter.html" class="btn btn-warning mt-3 fw-bold text-dark">İlk İmza Atan Sen Ol</a>
            </div>
        `;
        return;
    }

    let htmlIcerik = "";
    aniListesi.forEach((ani) => {
        htmlIcerik += `
            <div class="col-md-6 col-lg-4">
                <div class="ani-yapragi" style="border-left-color: ${ani.renk};">
                    <div class="muhur-damga">MÜHÜRLÜ ANITKABİR</div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-secondary">${ani.sehir}</span>
                        <small class="text-secondary">${ani.tarih}</small>
                    </div>

                    <h5 class="text-altin mb-1">${ani.ad}</h5>
                    <small class="text-warning d-block mb-3"><i class="fa-solid fa-user-tag"></i> ${ani.unvan} (${ani.kategori})</small>

                    <p class="text-light fst-italic mb-3" style="font-size: 0.95em;">
                        "${ani.metin}"
                    </p>

                    <div class="d-flex justify-content-between align-items-center border-top border-secondary pt-2 mt-auto">
                        <small class="text-muted font-monospace">No: ${ani.okulNo} | Hedef: %${ani.hedef}</small>
                        <button onclick="aniSil(${ani.id})" class="btn btn-outline-danger btn-sm" title="Anıyı Sil">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    duvar.innerHTML = htmlIcerik;
}

// TEKİL ANIYI SİLME
function aniSil(id) {
    if (confirm("Bu anı yaprağını silmek istediğinize emin misiniz?")) {
        aniListesi = aniListesi.filter(ani => ani.id !== id);
        localStorage.setItem("ataturkAniDefteri", JSON.stringify(aniListesi));
        sayacGuncelle();
        aniDuvariniCiz();
    }
}