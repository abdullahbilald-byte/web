let projeEkibi = JSON.parse(localStorage.getItem("siberEkip")) || [];
let gelenUzmanlar = [];
let indirimOrani = 1;
let calismaDurumlari = new Map();
let calismaHareketleri = [];
let calismaZamanlayici = null;

$(document).ready(function () {
    $("#tesvikBtn").click(function () {
        $("#gizliTesvikKutusu").fadeToggle(1000);
    });

    sayacGuncelle();
    uzmanlariGetir();
    tabloyuCiz();
    calismaSimulasyonunuBaslat();
});

async function uzmanlariGetir() {
    const vitrin = document.getElementById("uzman-listesi");
    if (!vitrin) return;

    try {
        const cevap = await fetch("https://dummyjson.com/users?limit=12");
        if (!cevap.ok) {
            throw new Error(`Uzman servisi ${cevap.status} durum koduyla yanıt verdi.`);
        }

        const veri = await cevap.json();
        if (!Array.isArray(veri.users)) {
            throw new Error("Uzman servisinden beklenen kullanıcı listesi alınamadı.");
        }

        gelenUzmanlar = veri.users;
        vitrineBas(gelenUzmanlar);
    } catch (hata) {
        console.error("Uzmanlar yüklenemedi:", hata);
        vitrin.innerHTML = '<div class="col-12"><p class="alert alert-danger text-center">Uzmanlar yüklenemedi. İnternet bağlantınızı kontrol edip sayfayı yenileyin.</p></div>';
    }
}

function vitrineBas(uzmanlar) {
    $("#uzman-listesi").empty();

    const ekibeAlinanIdler = new Set(projeEkibi.map((kisi) => kisi.id).filter((id) => id !== undefined));
    const pazardakiUzmanlar = uzmanlar.filter((uzman) => !ekibeAlinanIdler.has(uzman.id));

    if (pazardakiUzmanlar.length === 0) {
        $("#uzman-listesi").html('<div class="col-12"><p class="alert alert-success text-center">Pazardaki tüm uzmanları ekibinize aldınız. Ekibinizi görmek için <a href="ekibim.html" class="alert-link">Proje Ekibim</a> sayfasını açın.</p></div>');
        return;
    }

    pazardakiUzmanlar.forEach((uzman) => {
        const gunlukUcret = uzman.age * 15;
        let rozetRenk;
        let seviye;

        if (uzman.age > 35) {
            rozetRenk = "bg-warning text-dark";
            seviye = "Senior (Kıdemli)";
        } else {
            rozetRenk = "bg-info text-dark";
            seviye = "Junior (Genç)";
        }

        const kart = `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card text-light border-secondary h-100 text-center p-2 uzman-karti">
                    <div class="position-relative">
                        <span class="badge ${rozetRenk} position-absolute top-0 end-0 m-1">${seviye}</span>
                        <img src="${uzman.image}" class="uzman-avatar" alt="${uzman.firstName} ${uzman.lastName}">
                    </div>
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h2 class="h5 card-title text-info fw-bold mb-1">${uzman.firstName} ${uzman.lastName}</h2>
                            <p class="text-warning small mb-1">${uzman.company.department}</p>
                            <p class="text-secondary small">Yaş: ${uzman.age}</p>
                        </div>
                        <div>
                            <div class="fs-4 fw-bold text-success mb-2">$${gunlukUcret} <small class="fs-6 text-secondary">/Gün</small></div>
                            <button onclick="cvAc(${uzman.id})" class="btn btn-outline-light btn-sm w-100 mb-2">
                                <i class="fa-solid fa-id-card"></i> CV İncele
                            </button>
                            <button onclick="ekibeEkle(${uzman.id})" class="btn btn-info btn-sm w-100 fw-bold text-dark">
                                <i class="fa-solid fa-user-plus"></i> Ekibe Kat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $("#uzman-listesi").append(kart);
    });
}

function cvAc(id) {
    const secilen = gelenUzmanlar.find((uzman) => uzman.id === id);
    if (!secilen) return;

    $("#modalAdSoyad").text(`${secilen.firstName} ${secilen.lastName}`);
    $("#modalAvatar").attr("src", secilen.image).attr("alt", `${secilen.firstName} ${secilen.lastName}`);
    $("#modalUnvan").text(secilen.company.title);
    $("#modalIp").text(secilen.ip);
    $("#modalUni").text(secilen.university);
    $("#modalMail").text(secilen.email);

    const modal = new bootstrap.Modal(document.getElementById("cvModal"));
    modal.show();
}

function ekibeEkle(id) {
    const secilen = gelenUzmanlar.find((uzman) => uzman.id === id);
    if (!secilen || projeEkibi.some((kisi) => kisi.id === id)) return;

    const hesaplananUcret = secilen.age * 15;
    projeEkibi.push({
        id: secilen.id,
        adSoyad: `${secilen.firstName} ${secilen.lastName}`,
        foto: secilen.image,
        departman: secilen.company.department,
        yas: secilen.age,
        ucret: hesaplananUcret
    });

    localStorage.setItem("siberEkip", JSON.stringify(projeEkibi));
    sayacGuncelle();
    vitrineBas(gelenUzmanlar);
}

function sayacGuncelle() {
    $("#ekipSayaci").text(projeEkibi.length);
}

function tabloyuCiz() {
    const govde = document.getElementById("ekipTabloGovdesi");
    if (!govde) return;

    $("#ekipTabloGovdesi").empty();
    let topYas = 0;
    let topMaliyet = 0;

    projeEkibi.forEach((kisi, index) => {
        topYas += kisi.yas;
        topMaliyet += kisi.ucret;

        const satir = `
            <tr id="satir-${index}">
                <td><img src="${kisi.foto}" width="50" class="rounded-circle" alt=""></td>
                <td class="fw-bold text-info">${kisi.adSoyad}</td>
                <td>${kisi.departman}</td>
                <td>${kisi.yas}</td>
                <td class="text-success fw-bold">$${kisi.ucret}</td>
                <td>
                    <button onclick="uzmanCikar(${index})" class="btn btn-sm btn-danger" aria-label="${kisi.adSoyad} uzmanını çıkar">
                        <i class="fa-solid fa-user-xmark"></i>
                    </button>
                </td>
            </tr>
        `;

        $("#ekipTabloGovdesi").append(satir);
    });

    $("#toplamYas").text(`Toplam Yaş: ${topYas}`);
    $("#toplamMaliyet").text(`$${Math.round(topMaliyet * indirimOrani)}`);
}

function gorevleriGetir(departman) {
    const alan = (departman || "").toLocaleLowerCase("tr-TR");

    if (alan.includes("engineer") || alan.includes("mühendis")) {
        return ["Yeni özellik üzerinde kod yazıyor", "Kod testlerini çalıştırıyor", "Hata düzeltmelerini gözden geçiriyor"];
    }
    if (alan.includes("support") || alan.includes("destek")) {
        return ["Sistem kayıtlarını inceliyor", "Bir destek talebini çözüyor", "Servis kontrollerini tamamlıyor"];
    }
    if (alan.includes("research") || alan.includes("araştır")) {
        return ["Teknik kaynakları araştırıyor", "Prototip sonuçlarını değerlendiriyor", "Bulguları proje notlarına aktarıyor"];
    }
    if (alan.includes("product") || alan.includes("ürün")) {
        return ["Ürün gereksinimlerini düzenliyor", "Kullanıcı akışını gözden geçiriyor", "Özellik listesini güncelliyor"];
    }
    if (alan.includes("market") || alan.includes("pazarlama")) {
        return ["Kampanya içeriği hazırlıyor", "Hedef kitle verilerini inceliyor", "Tanıtım planını güncelliyor"];
    }
    if (alan.includes("human resources") || alan.includes("insan kaynak")) {
        return ["Ekip iş planını düzenliyor", "İş bölümü takibini yapıyor", "Proje ekibi durumunu güncelliyor"];
    }
    return ["Proje görevlerini inceliyor", "Çözüm önerileri üzerinde çalışıyor", "İş sonuçlarını kontrol ediyor"];
}

function calismaSimulasyonunuBaslat() {
    if (!document.getElementById("calismaKartlari")) return;

    if (projeEkibi.length === 0) {
        if (calismaZamanlayici) {
            clearInterval(calismaZamanlayici);
            calismaZamanlayici = null;
        }
        calismaDurumlari.clear();
        calismaHareketleri = [];
        $("#calismaKartlari").html('<div class="col-12"><p class="alert alert-secondary mb-0">Simülasyonu başlatmak için önce <a href="index.html" class="alert-link">uzman pazarından ekibinize kişi alın</a>.</p></div>');
        $("#calismaAkisi").html('<li>Ekibiniz oluşturulunca çalışma hareketleri burada görünür.</li>');
        return;
    }

    projeEkibi.forEach((kisi, index) => {
        const anahtar = kisi.id ?? `eski-kayit-${index}`;
        if (!calismaDurumlari.has(anahtar)) {
            calismaDurumlari.set(anahtar, { gorevIndexi: 0, ilerleme: 10 });
            calismaHareketiEkle(kisi, `${gorevleriGetir(kisi.departman)[0]} görevine başladı.`);
        }
    });

    calismaKartlariniGoster();
    if (!calismaZamanlayici) {
        calismaZamanlayici = setInterval(calismaAdiminiIlerle, 2500);
    }
}

function calismaAdiminiIlerle() {
    projeEkibi.forEach((kisi, index) => {
        const anahtar = kisi.id ?? `eski-kayit-${index}`;
        const durum = calismaDurumlari.get(anahtar);
        if (!durum) return;

        durum.ilerleme += 20;
        if (durum.ilerleme >= 100) {
            const gorevler = gorevleriGetir(kisi.departman);
            durum.gorevIndexi = (durum.gorevIndexi + 1) % gorevler.length;
            durum.ilerleme = 0;
            calismaHareketiEkle(kisi, `${gorevler[durum.gorevIndexi]} görevini tamamladı.`);
        }
    });

    calismaKartlariniGoster();
}

function calismaHareketiEkle(kisi, aciklama) {
    calismaHareketleri.unshift({
        adSoyad: kisi.adSoyad,
        aciklama,
        saat: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    });
    calismaHareketleri = calismaHareketleri.slice(0, 6);
}

function calismaKartlariniGoster() {
    const kartlar = projeEkibi.map((kisi, index) => {
        const anahtar = kisi.id ?? `eski-kayit-${index}`;
        const durum = calismaDurumlari.get(anahtar);
        const gorevler = gorevleriGetir(kisi.departman);
        const gorev = gorevler[durum.gorevIndexi];

        return `
            <div class="col-12 col-md-6 col-xl-4">
                <article class="work-card">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <img src="${kisi.foto}" alt="">
                        <div class="min-w-0">
                            <h3 class="h6 text-light text-truncate mb-1">${kisi.adSoyad}</h3>
                            <span class="small text-secondary">${kisi.departman}</span>
                        </div>
                        <span class="badge bg-success ms-auto">Çalışıyor</span>
                    </div>
                    <p class="small text-light mb-2"><i class="fa-solid fa-laptop-code text-info me-1"></i>${gorev}</p>
                    <div class="progress" role="progressbar" aria-label="${kisi.adSoyad} görev ilerlemesi" aria-valuenow="${durum.ilerleme}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-info" style="width: ${durum.ilerleme}%"></div>
                    </div>
                    <div class="d-flex justify-content-between mt-2 small text-secondary">
                        <span>Görev ilerlemesi</span>
                        <span>${durum.ilerleme}%</span>
                    </div>
                </article>
            </div>
        `;
    });

    $("#calismaKartlari").html(kartlar.join(""));
    const hareketler = calismaHareketleri.map((hareket) => `
        <li><span class="activity-time">${hareket.saat}</span><strong class="text-light">${hareket.adSoyad}</strong> — ${hareket.aciklama}</li>
    `);
    $("#calismaAkisi").html(hareketler.join(""));
}

function uzmanCikar(index) {
    projeEkibi.splice(index, 1);
    localStorage.setItem("siberEkip", JSON.stringify(projeEkibi));
    tabloyuCiz();
    sayacGuncelle();
    calismaSimulasyonunuBaslat();
}

function tesvikUygula() {
    const girilen = $("#hibeInput").val().trim();

    if (girilen === "DEMİR") {
        indirimOrani = 0.70;
        $("#hibeMesaj").html('<div class="alert alert-success py-1 small">✅ %30 Devlet Teşviği Uygulandı!</div>');
        tabloyuCiz();
    } else {
        $("#hibeMesaj").html('<div class="alert alert-danger py-1 small">❌ Geçersiz Hibe Kodu!</div>');
    }
}

function sozlesmeOnayla(e) {
    e.preventDefault();

    const kurumNo = $("#kurumNo").val().trim();
    if (kurumNo !== "1294") {
        alert("HATA: Geçersiz okul numarası! Lütfen 1294 giriniz.");
        return;
    }

    if (projeEkibi.length === 0) {
        alert("HATA: Proje ekibinizde hiç uzman yok!");
        return;
    }

    const yonetici = $("#yoneticiAd").val();
    alert(`Tebrikler Sayın ${yonetici}! Proje sözleşmesi onaylandı.`);
    localStorage.removeItem("siberEkip");
    window.location.href = "index.html";
}