let biletListesi = JSON.parse(localStorage.getItem("aeroSiberBiletler")) || [];

$(document).ready(function() {
    biletSayaciGuncelle();
    kaptanlariGetir();
    binisKartlariniCiz();
});

function biletSayaciGuncelle() {
    $("#biletSayaci").text(biletListesi.length);
}

// 1. API'DEN KAPTANLARI ÇEKME
async function kaptanlariGetir() {
    const alan = document.getElementById("kaptan-listesi");
    if (!alan) return;

    try {
        const cevap = await fetch("https://dummyjson.com/users?limit=4");
        const veri = await cevap.json();
        
        let htmlIcerik = "";
        veri.users.forEach((user, index) => {
            htmlIcerik += `
                <div class="kaptan-kart">
                    <div class="profil-ust-sablon">
                        <img src="${user.image}" alt="Kaptan" class="profil-yuvarlak-resim">
                    </div>
                    <div class="kaptan-bilgi">
                        <h5 class="text-info mb-1">${user.firstName} ${user.lastName}</h5>
                        <p class="text-secondary small mb-2">Kıdemli Pilot #${101 + index}</p>
                        <span class="badge bg-success">Uçuşa Hazır</span>
                    </div>
                </div>
            `;
        });
        alan.innerHTML = htmlIcerik;
    } catch (hata) {
        console.error("Kaptanlar yüklenirken hata oluştu:", hata);
        alan.innerHTML = "<p class='text-danger'>Mürettebat bilgileri yüklenemedi.</p>";
    }
}

// KOLTUK RANGE GÜNCELLEME
function koltukGuncelle(deger) {
    const harfler = ["A", "B", "C", "D", "E", "F"];
    const rastgeleHarf = harfler[Math.floor(Math.random() * harfler.length)];
    document.getElementById("koltukGosterge").innerText = deger + rastgeleHarf;
}

// 2. FORM OLUŞTURMA VE KAYDETME
function biletOlustur(event) {
    event.preventDefault();

    const yeniBilet = {
        id: Date.now(),
        yolcuAd: document.getElementById("yolcuAd").value,
        tcNo: document.getElementById("tcNo").value,
        kalkis: document.getElementById("kalkisYeri").value,
        varis: document.getElementById("varisYeri").value,
        tarih: document.getElementById("ucusTarihi").value,
        saat: document.getElementById("ucusSaati").value,
        koltuk: document.getElementById("koltukGosterge").innerText,
        bagajKg: document.getElementById("bagajKg").value,
        sinif: document.querySelector('input[name="sinifSecim"]:checked').value,
        temaRengi: document.getElementById("kartRengi").value,
        terminal: document.getElementById("terminalKodu").value
    };

    biletListesi.push(yeniBilet);
    localStorage.setItem("aeroSiberBiletler", JSON.stringify(biletListesi));

    alert("Biletiniz başarıyla oluşturuldu! Biniş Kartlarım sayfasına yönlendiriliyorsunuz.");
    window.location.href = "biletlerim.html";
}

// 3. BİNİŞ KARTLARINI ÇİZME
function binisKartlariniCiz() {
    const alan = document.getElementById("binis-kartlari-alani");
    if (!alan) return;

    if (biletListesi.length === 0) {
        alan.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-ticket fa-3x text-secondary mb-3"></i>
                <h4 class="text-secondary">Henüz kayıtlı biniş kartınız bulunmuyor.</h4>
                <a href="rezervasyon.html" class="btn btn-info mt-3 fw-bold">Hemen Bilet Al</a>
            </div>
        `;
        return;
    }

    let biletHtml = "";
    biletListesi.forEach((bilet) => {
        biletHtml += `
            <div class="col-md-6">
                <div class="binis-karti" style="border-left-color: ${bilet.temaRengi};">
                    <div class="onay-damgasi">ONAYLANDI</div>
                    
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="text-info mb-0"><i class="fa-solid fa-plane-departure"></i> AEROSİBER PASS</h5>
                        <span class="badge bg-secondary">${bilet.terminal}</span>
                    </div>

                    <div class="row g-2 mb-3">
                        <div class="col-7">
                            <small class="text-secondary d-block">YOLCU</small>
                            <strong class="fs-6">${bilet.yolcuAd}</strong>
                        </div>
                        <div class="col-5">
                            <small class="text-secondary d-block">KOLTUK</small>
                            <span class="badge bg-warning text-dark fs-6">${bilet.koltuk}</span>
                        </div>
                    </div>

                    <div class="row g-2 mb-3 bg-black p-2 rounded border border-secondary">
                        <div class="col-6">
                            <small class="text-secondary d-block">KALKIŞ</small>
                            <span>${bilet.kalkis}</span>
                        </div>
                        <div class="col-6">
                            <small class="text-secondary d-block">VARIŞ</small>
                            <span>${bilet.varis}</span>
                        </div>
                    </div>

                    <div class="row g-2 align-items-center mb-3">
                        <div class="col-6">
                            <small class="text-secondary d-block">TARİH & SAAT</small>
                            <span>${bilet.tarih} | ${bilet.saat}</span>
                        </div>
                        <div class="col-6">
                            <small class="text-secondary d-block">SINIF</small>
                            <span class="text-info fw-bold">${bilet.sinif}</span>
                        </div>
                    </div>

                    <div class="mb-3">
                        <div class="d-flex justify-content-between small text-secondary mb-1">
                            <span>Bagaj Yükü: ${bilet.bagajKg} Kg</span>
                            <span>Max: 50 Kg</span>
                        </div>
                        <meter class="w-100" min="0" max="50" value="${bilet.bagajKg}" low="25" high="40" optimum="20"></meter>
                    </div>

                    <div class="d-flex justify-content-between align-items-center border-top border-secondary pt-2">
                        <small class="text-muted font-monospace">T.C: ${bilet.tcNo.substring(0, 3)}****${bilet.tcNo.substring(7)}</small>
                        <button onclick="biletIptal(${bilet.id})" class="btn btn-outline-danger btn-sm">
                            <i class="fa-solid fa-trash"></i> İptal Et
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    alan.innerHTML = biletHtml;
}

function biletIptal(id) {
    if (confirm("Bu biniş kartını iptal etmek istediğinize emin misiniz?")) {
        biletListesi = biletListesi.filter(bilet => bilet.id !== id);
        localStorage.setItem("aeroSiberBiletler", JSON.stringify(biletListesi));
        biletSayaciGuncelle();
        binisKartlariniCiz();
    }
}

function tumBiletleriSil() {
    if (confirm("Tüm biniş kartlarınız silinecektir. Onaylıyor musunuz?")) {
        biletListesi = [];
        localStorage.removeItem("aeroSiberBiletler");
        biletSayaciGuncelle();
        binisKartlariniCiz();
    }
}