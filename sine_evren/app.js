const RESIM_URL = "https://image.tmdb.org/t/p/w500";
const POPULER_FILMLER_API = "https://api.themoviedb.org/3/movie/popular";
const FILM_ARAMA_API = "https://api.themoviedb.org/3/search/movie";

const filmListesi = document.getElementById("film-listesi");
const filmDurumu = document.getElementById("film-durumu");
const filmAramaFormu = document.getElementById("film-arama-formu");
const filmAramaKutusu = document.getElementById("film-arama");
const populerleriGoster = document.getElementById("populerleri-goster");
const sayfaBasligi = document.getElementById("sayfa-basligi");
const dahaFazlaFilm = document.getElementById("daha-fazla-film");
const yukariCik = document.getElementById("yukari-cik");
let sonIstek = 0;
let sayfa = 1;
let toplamSayfa = 1;
let aktifUctanNokta = POPULER_FILMLER_API;
let aktifParametreler = new URLSearchParams({ language: "tr-TR", page: "1" });
let aktifListeBasligi = "Popüler Filmler";

function filmleriEkranaBas(filmler, sonaEkle = false) {
    if (!sonaEkle) {
        filmListesi.replaceChildren();
    }

    filmler.forEach((film) => {
        const filmKutusu = document.createElement("article");
        filmKutusu.className = "film-karti";

        const filmLinki = document.createElement("a");
        filmLinki.className = "film-linki";
        filmLinki.href = `detay.html?id=${encodeURIComponent(film.id)}`;
        filmLinki.setAttribute("aria-label", `${film.title} filminin detaylarını görüntüle`);

        const puan = document.createElement("span");
        puan.className = "puan";
        puan.textContent = `⭐ ${Number(film.vote_average || 0).toFixed(1)}`;
        const filmPuani = Number(film.vote_average || 0);
        puan.style.backgroundColor = filmPuani >= 8 ? "#f39c12" : filmPuani >= 5 ? "#95a5a6" : "#c0392b";
        puan.style.color = filmPuani >= 5 ? "#101114" : "#fff";

        const afis = document.createElement("img");
        afis.src = film.poster_path ? `${RESIM_URL}${film.poster_path}` : "https://placehold.co/500x750/191a1f/ffffff?text=Afis+Yok";
        afis.alt = `${film.title} film afişi`;
        afis.loading = "lazy";

        const filmBilgi = document.createElement("div");
        filmBilgi.className = "film-bilgi";

        const baslik = document.createElement("h2");
        baslik.textContent = film.title;

        const yayinTarihi = document.createElement("p");
        yayinTarihi.textContent = `Yayın: ${film.release_date || "Tarih bilinmiyor"}`;

        filmBilgi.append(baslik, yayinTarihi);
        filmLinki.append(puan, afis, filmBilgi);
        filmKutusu.append(filmLinki);
        filmListesi.append(filmKutusu);
    });

    filmDurumu.hidden = filmListesi.childElementCount > 0;
    if (filmListesi.childElementCount === 0) {
        filmDurumu.textContent = "Şu anda gösterilecek film bulunamadı.";
    }
}

async function filmleriGetir(url, istekBasligi, sonaEkle = false) {
    if (!TMDB_ACCESS_TOKEN) {
        filmDurumu.textContent = "Filmleri yüklemek için config.example.js dosyasını config.js olarak kopyalayıp TMDB erişim token'ınızı ekleyin.";
        return;
    }

    const istekNo = ++sonIstek;
    filmDurumu.hidden = false;
    filmDurumu.textContent = sonaEkle ? "Daha fazla film yükleniyor..." : "Filmler yükleniyor...";
    if (!sonaEkle) {
        filmListesi.replaceChildren();
    }
    dahaFazlaFilm.disabled = true;

    try {
        const cevap = await fetch(url, {
            headers: { Authorization: `Bearer ${TMDB_ACCESS_TOKEN}` }
        });
        if (!cevap.ok) {
            throw new Error(`TMDB film isteği başarısız oldu (HTTP ${cevap.status}).`);
        }

        const veri = await cevap.json();
        if (!Array.isArray(veri.results)) {
            throw new Error("TMDB yanıtında film listesi bulunamadı.");
        }

        if (istekNo !== sonIstek) {
            return;
        }

        sayfaBasligi.textContent = istekBasligi;
        toplamSayfa = Number(veri.total_pages) || 1;
        filmleriEkranaBas(veri.results, sonaEkle);
        dahaFazlaFilm.hidden = sayfa >= toplamSayfa;
    } catch (hata) {
        if (istekNo !== sonIstek) {
            return;
        }

        if (sonaEkle) {
            sayfa = Math.max(1, sayfa - 1);
            aktifParametreler.set("page", String(sayfa));
        }
        console.error("Popüler filmler yüklenemedi:", hata);
        filmDurumu.hidden = false;
        filmDurumu.textContent = "Filmler yüklenemedi. Erişim token'ınızı ve internet bağlantınızı kontrol edin.";
    } finally {
        if (istekNo === sonIstek) {
            dahaFazlaFilm.disabled = false;
        }
    }
}

function populerFilmleriGetir() {
    filmAramaKutusu.value = "";
    populerleriGoster.hidden = true;
    aktifUctanNokta = POPULER_FILMLER_API;
    aktifParametreler = new URLSearchParams({ language: "tr-TR", page: "1" });
    aktifListeBasligi = "Popüler Filmler";
    sayfa = 1;
    toplamSayfa = 1;
    filmleriGetir(`${aktifUctanNokta}?${aktifParametreler}`, aktifListeBasligi);
}

filmAramaFormu.addEventListener("submit", (olay) => {
    olay.preventDefault();
    const aramaTerimi = filmAramaKutusu.value.trim();
    if (!aramaTerimi) {
        filmDurumu.hidden = false;
        filmDurumu.textContent = "Aramak için bir film adı yazın.";
        filmAramaKutusu.focus();
        return;
    }

    populerleriGoster.hidden = false;
    aktifUctanNokta = FILM_ARAMA_API;
    aktifParametreler = new URLSearchParams({ query: aramaTerimi, language: "tr-TR", page: "1", include_adult: "false" });
    aktifListeBasligi = `Arama sonuçları: ${aramaTerimi}`;
    sayfa = 1;
    toplamSayfa = 1;
    filmleriGetir(`${aktifUctanNokta}?${aktifParametreler}`, aktifListeBasligi);
});

populerleriGoster.addEventListener("click", populerFilmleriGetir);

dahaFazlaFilm.addEventListener("click", () => {
    if (sayfa >= toplamSayfa || dahaFazlaFilm.disabled) {
        return;
    }

    sayfa += 1;
    aktifParametreler.set("page", String(sayfa));
    filmleriGetir(`${aktifUctanNokta}?${aktifParametreler}`, aktifListeBasligi, true);
});

yukariCik.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

populerFilmleriGetir();
