const RESIM_ORIGINAL_URL = "https://image.tmdb.org/t/p/original";
const RESIM_URL = "https://image.tmdb.org/t/p/w500";
const PROFIL_RESIM_URL = "https://image.tmdb.org/t/p/w185";
const YOUTUBE_EMBED_URL = "https://www.youtube-nocookie.com/embed/";

const urlParametreleri = new URLSearchParams(window.location.search);
const filmId = urlParametreleri.get("id");

const detayDurumu = document.getElementById("detay-durumu");
const filmDetayi = document.getElementById("film-detayi");
const arkaPlan = document.getElementById("detay-body");
const afis = document.getElementById("film-afisi");
const baslik = document.getElementById("film-basligi");
const slogan = document.getElementById("film-slogani");
const puan = document.getElementById("film-puani");
const tarih = document.getElementById("film-tarihi");
const sure = document.getElementById("film-suresi");
const ozet = document.getElementById("film-ozeti");
const butce = document.getElementById("film-butcesi");
const fragmanBolumu = document.getElementById("fragman-bolumu");
const fragman = document.getElementById("film-fragmani");
const oyuncuDurumu = document.getElementById("oyuncu-durumu");
const oyuncuListesi = document.getElementById("oyuncu-listesi");
const benzerDurumu = document.getElementById("benzer-durumu");
const benzerFilmListesi = document.getElementById("benzer-film-listesi");
const puanlamaFormu = document.getElementById("puanlama-formu");
const puanlamaDurumu = document.getElementById("puanlama-durumu");
const PUANLARIN_DEPOLAMA_ANAHTARI = "sineevren-film-puanlari";
const yukariCik = document.getElementById("yukari-cik");

yukariCik.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

function kayitliPuaniGoster() {
    try {
        const puanlar = JSON.parse(localStorage.getItem(PUANLARIN_DEPOLAMA_ANAHTARI) || "{}");
        const kayitliPuan = puanlar[filmId];
        if (Number.isInteger(kayitliPuan) && kayitliPuan >= 1 && kayitliPuan <= 5) {
            document.getElementById(`puan-${kayitliPuan}`).checked = true;
            puanlamaDurumu.textContent = `Bu filme ${kayitliPuan}/5 puan vermiştin. Yeni bir puan seçerek değiştirebilirsin.`;
        }
    } catch (hata) {
        console.error("Kaydedilmiş film puanı okunamadı:", hata);
        puanlamaDurumu.textContent = "Kayıtlı puan okunamadı; tarayıcı depolama ayarlarını kontrol edin.";
    }
}

puanlamaFormu.addEventListener("submit", (olay) => {
    olay.preventDefault();
    const secilenPuan = new FormData(puanlamaFormu).get("kullanici-puani");
    const puanDegeri = Number(secilenPuan);
    if (!Number.isInteger(puanDegeri) || puanDegeri < 1 || puanDegeri > 5) {
        puanlamaDurumu.textContent = "Lütfen kaydetmeden önce 1 ile 5 arasında bir yıldız seçin.";
        return;
    }

    try {
        const puanlar = JSON.parse(localStorage.getItem(PUANLARIN_DEPOLAMA_ANAHTARI) || "{}");
        puanlar[filmId] = puanDegeri;
        localStorage.setItem(PUANLARIN_DEPOLAMA_ANAHTARI, JSON.stringify(puanlar));
        puanlamaDurumu.textContent = `Puanın kaydedildi: ${puanDegeri}/5`;
    } catch (hata) {
        console.error("Film puanı kaydedilemedi:", hata);
        puanlamaDurumu.textContent = "Puan kaydedilemedi; tarayıcı depolama ayarlarını kontrol edin.";
    }
});

function oyunculariEkranaBas(oyuncular) {
    oyuncuListesi.replaceChildren();
    oyuncular.slice(0, 5).forEach((oyuncu) => {
        const kart = document.createElement("div");
        kart.className = "oyuncu-karti";

        const resim = document.createElement("img");
        resim.src = oyuncu.profile_path
            ? `${PROFIL_RESIM_URL}${oyuncu.profile_path}`
            : "https://placehold.co/185x185/292a30/ffffff?text=Foto+Yok";
        resim.alt = oyuncu.name ? `${oyuncu.name} fotoğrafı` : "Oyuncu fotoğrafı bulunmuyor";
        resim.loading = "lazy";

        const ad = document.createElement("p");
        ad.textContent = oyuncu.name || "İsmi bilinmiyor";
        kart.append(resim, ad);
        oyuncuListesi.append(kart);
    });

    oyuncuDurumu.hidden = oyuncular.length > 0;
    if (oyuncular.length === 0) {
        oyuncuDurumu.textContent = "Oyuncu bilgisi bulunamadı.";
    }
}

function benzerFilmleriEkranaBas(filmler) {
    benzerFilmListesi.replaceChildren();
    filmler.slice(0, 4).forEach((film) => {
        const link = document.createElement("a");
        link.className = "benzer-film-karti";
        link.href = `detay.html?id=${encodeURIComponent(film.id)}`;
        link.setAttribute("aria-label", `${film.title} filminin detaylarını görüntüle`);

        const resim = document.createElement("img");
        resim.src = film.poster_path
            ? `${RESIM_URL}${film.poster_path}`
            : "https://placehold.co/500x750/191a1f/ffffff?text=Afis+Yok";
        resim.alt = `${film.title || "İsimsiz film"} film afişi`;
        resim.loading = "lazy";

        const ad = document.createElement("span");
        ad.textContent = film.title || "İsimsiz film";
        link.append(resim, ad);
        benzerFilmListesi.append(link);
    });

    benzerDurumu.hidden = filmler.length > 0;
    if (filmler.length === 0) {
        benzerDurumu.textContent = "Benzer film bulunamadı.";
    }
}

function filmDetayiGoster(film, videolar) {
    document.title = `${film.title} | SineEvren`;
    baslik.textContent = film.title || "İsimsiz film";
    slogan.textContent = film.tagline || "";
    slogan.hidden = !film.tagline;
    puan.textContent = `⭐ ${Number(film.vote_average || 0).toFixed(1)}`;
    tarih.textContent = film.release_date || "Tarih bilinmiyor";
    sure.textContent = film.runtime ? `${film.runtime} dk` : "Süre bilinmiyor";
    ozet.textContent = film.overview || "Bu film için henüz Türkçe özet girilmemiştir.";
    butce.textContent = film.budget > 0
        ? `Bütçe: $${Number(film.budget).toLocaleString("en-US")}`
        : "Bütçe bilgisi bulunamadı.";

    if (film.poster_path) {
        afis.src = `${RESIM_URL}${film.poster_path}`;
    } else {
        afis.hidden = true;
    }

    if (film.backdrop_path) {
        arkaPlan.style.backgroundImage = `linear-gradient(rgba(16, 17, 20, 0.85), rgba(16, 17, 20, 0.9)), url("${RESIM_ORIGINAL_URL}${film.backdrop_path}")`;
    }

    const fragmanVerisi = videolar.results.find((video) =>
        video.site === "YouTube" && video.type === "Trailer" && video.key
    );

    if (fragmanVerisi) {
        fragman.src = `${YOUTUBE_EMBED_URL}${encodeURIComponent(fragmanVerisi.key)}`;
    } else {
        fragmanBolumu.remove();
    }

    detayDurumu.hidden = true;
    filmDetayi.hidden = false;
    kayitliPuaniGoster();
}

async function tmdbJsonGetir(url, headers, istekAdi) {
    const cevap = await fetch(url, { headers });
    if (!cevap.ok) {
        throw new Error(`${istekAdi} isteği başarısız oldu (HTTP ${cevap.status}).`);
    }

    return cevap.json();
}

async function filmDetaylariniGetir() {
    if (!filmId || !/^\d+$/.test(filmId)) {
        detayDurumu.textContent = "Geçersiz film bağlantısı. Ana sayfadan bir film seçin.";
        return;
    }

    if (!TMDB_ACCESS_TOKEN) {
        detayDurumu.textContent = "Film bilgilerini yüklemek için config.example.js dosyasını config.js olarak kopyalayıp TMDB erişim token'ınızı ekleyin.";
        return;
    }

    const temelUrl = `https://api.themoviedb.org/3/movie/${encodeURIComponent(filmId)}`;
    const headers = { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` };
    const detayUrl = `${temelUrl}?language=tr-TR`;
    const videoUrl = `${temelUrl}/videos?language=en-US`;
    const oyuncuUrl = `${temelUrl}/credits?language=tr-TR`;
    const benzerUrl = `${temelUrl}/similar?language=tr-TR&page=1`;

    try {
        const [detayCevap, videoCevap] = await Promise.all([
            fetch(detayUrl, { headers }),
            fetch(videoUrl, { headers })
        ]);
        if (!detayCevap.ok) {
            throw new Error(`TMDB film isteği başarısız oldu (HTTP ${detayCevap.status}).`);
        }
        if (!videoCevap.ok) {
            throw new Error(`TMDB fragman isteği başarısız oldu (HTTP ${videoCevap.status}).`);
        }

        const [film, videolar] = await Promise.all([detayCevap.json(), videoCevap.json()]);
        if (!Array.isArray(videolar.results)) {
            throw new Error("TMDB yanıtında video listesi bulunamadı.");
        }

        filmDetayiGoster(film, videolar);
        const [oyuncuSonucu, benzerSonucu] = await Promise.allSettled([
            tmdbJsonGetir(oyuncuUrl, headers, "TMDB oyuncu kadrosu"),
            tmdbJsonGetir(benzerUrl, headers, "TMDB benzer filmler")
        ]);

        if (oyuncuSonucu.status === "fulfilled" && Array.isArray(oyuncuSonucu.value.cast)) {
            oyunculariEkranaBas(oyuncuSonucu.value.cast);
        } else {
            const hata = oyuncuSonucu.status === "rejected"
                ? oyuncuSonucu.reason
                : new Error("TMDB yanıtında oyuncu kadrosu bulunamadı.");
            console.error("Oyuncu kadrosu yüklenemedi:", hata);
            oyuncuDurumu.textContent = "Oyuncu bilgileri yüklenemedi.";
        }

        if (benzerSonucu.status === "fulfilled" && Array.isArray(benzerSonucu.value.results)) {
            benzerFilmleriEkranaBas(benzerSonucu.value.results);
        } else {
            const hata = benzerSonucu.status === "rejected"
                ? benzerSonucu.reason
                : new Error("TMDB yanıtında benzer film listesi bulunamadı.");
            console.error("Benzer filmler yüklenemedi:", hata);
            benzerDurumu.textContent = "Benzer filmler yüklenemedi.";
        }
    } catch (hata) {
        console.error("Film detayları yüklenemedi:", hata);
        detayDurumu.textContent = "Film bilgileri alınamadı. Erişim token'ınızı ve internet bağlantınızı kontrol edip tekrar deneyin.";
    }
}

filmDetaylariniGetir();
