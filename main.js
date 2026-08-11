// Datos de fondo e interacciones iniciales
const browserInfoSpan = document.getElementById('browser-info');
const windowSizeSpan = document.getElementById('window-size');
const cursorCoordsSpan = document.getElementById('cursor-coords');
const scrollPosSpan = document.getElementById('scroll-pos');

browserInfoSpan.innerText = navigator.userAgent.toLowerCase();
windowSizeSpan.innerText = `${window.innerWidth}px × ${window.innerHeight}px`;

document.addEventListener('mousemove', (e) => {
    cursorCoordsSpan.innerText = `${e.clientX}px, ${e.clientY}px`;
});

document.addEventListener('scroll', () => {
    scrollPosSpan.innerText = `${Math.round(window.scrollY)}px`;
});

// Toggle para los datos de fondo con la tecla Shift
const dataLayer = document.querySelector('.data-layer');
document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        dataLayer.classList.toggle('hidden');
    }
});

const letraA = document.getElementById('letra-a');
const letraI = document.getElementById('letra-i');
const letrasV = document.querySelectorAll('.letra-v');
const letraVCentro = document.getElementById('letra-v-centro');

const menuSuperior = document.getElementById('menu-superior');
const menuSuperiorImagen = document.getElementById('menu-superior-imagen');
const itemsMenu = document.querySelectorAll('.item-menu');
const contenedorImagen = document.getElementById('contenedor-imagen');
const imagenCentral = document.getElementById('imagen-central');
const grillaPrincipal = document.getElementById('grilla-principal');

letraA.addEventListener('mouseenter', () => {
    if (!letraA.classList.contains('selected')) letraA.innerText = 'Audio';
});
letraA.addEventListener('mouseleave', () => letraA.innerText = 'A');

letraI.addEventListener('mouseenter', () => {
    if (!letraI.classList.contains('selected')) letraI.innerText = 'Imagen';
});
letraI.addEventListener('mouseleave', () => letraI.innerText = 'I');

letrasV.forEach(v => {
    v.addEventListener('mouseenter', () => {
        if (!letraVCentro.classList.contains('selected')) letraVCentro.innerText = 'Video';
    });
    v.addEventListener('mouseleave', () => letraVCentro.innerText = 'V');
});

// Despliegue de menús superiores (Audio e Imagen)
letraA.addEventListener('click', () => {
    menuSuperiorImagen.style.display = 'none';
    menuSuperior.style.display = 'flex';
});

letraI.addEventListener('click', () => {
    menuSuperior.style.display = 'none';
    menuSuperiorImagen.style.display = 'flex';
});

// Cerrar menús al hacer click fuera
document.body.addEventListener('click', (e) => {
    if (e.target !== letraA && e.target !== letraI && !e.target.classList.contains('item-menu')) {
        menuSuperior.style.display = 'none';
        menuSuperiorImagen.style.display = 'none';
    }
});

itemsMenu.forEach(item => {
    item.addEventListener('mouseenter', () => {
        imagenCentral.src = item.getAttribute('data-img');
        contenedorImagen.style.display = 'block';
    });
    item.addEventListener('mouseleave', () => {
        contenedorImagen.style.display = 'none';
    });
});

/* --- LÓGICA DE SELECCIÓN POR ARRASTRE (MARQUEE) --- */
const selectionBox = document.getElementById('selection-box');
const todasLasLetras = document.querySelectorAll('.letra');
const vistaSobreMim = document.getElementById('vista-sobremim');
const btnVolverSobreMim = document.getElementById('btn-volver-sobremim');

let isSelecting = false;
let startX = 0;
let startY = 0;

document.addEventListener('mousedown', (e) => {
    if (grillaPrincipal.style.display !== 'none') {
        if (e.target.closest('#menu-superior') || e.target.closest('#menu-superior-imagen') || e.target.closest('.letra') || e.target.closest('.btn-volver')) return;

        isSelecting = true;
        startX = e.clientX;
        startY = e.clientY;

        selectionBox.style.left = `${startX}px`;
        selectionBox.style.top = `${startY}px`;
        selectionBox.style.width = '0px';
        selectionBox.style.height = '0px';
        selectionBox.style.display = 'block';

        todasLasLetras.forEach(letra => letra.classList.remove('selected'));
    }
});

document.addEventListener('mousemove', (e) => {
    if (!isSelecting) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);

    selectionBox.style.left = `${left}px`;
    selectionBox.style.top = `${top}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;

    const boxRect = selectionBox.getBoundingClientRect();

    todasLasLetras.forEach(letra => {
        const itemRect = letra.getBoundingClientRect();
        const isIntersecting = !(
            boxRect.right < itemRect.left ||
            boxRect.left > itemRect.right ||
            boxRect.bottom < itemRect.top ||
            boxRect.top > itemRect.bottom
        );

        if (isIntersecting) {
            letra.classList.add('selected');
        } else {
            letra.classList.remove('selected');
        }
    });
});

document.addEventListener('mouseup', () => {
    if (!isSelecting) return;
    isSelecting = false;
    selectionBox.style.display = 'none';

    const letrasSeleccionadas = document.querySelectorAll('.letra.selected');

    if (letrasSeleccionadas.length === 5) {
        grillaPrincipal.style.display = 'none';
        menuSuperior.style.display = 'none';
        menuSuperiorImagen.style.display = 'none';
        vistaSobreMim.style.display = 'flex';
    }
    else if (letrasSeleccionadas.length === 3) {
        const sonSoloLasV = Array.from(letrasSeleccionadas).every(letra => letra.classList.contains('letra-v'));
        if (sonSoloLasV) {
            window.open('https://avi845.bandcamp.com/album/peque-o-pero-mat-n', '_blank');
        }
    }

    setTimeout(() => {
        todasLasLetras.forEach(letra => letra.classList.remove('selected'));
    }, 300);
});

btnVolverSobreMim.addEventListener('click', () => {
    vistaSobreMim.style.display = 'none';
    grillaPrincipal.style.display = 'grid';
});

/* --- LÓGICA VISTA MÚSICA --- */
const linkMusica = document.getElementById('link-musica');
const vistaMusica = document.getElementById('vista-musica');
const musicBg = document.getElementById('music-bg');
const btnVolverMusica = document.getElementById('btn-volver-musica');
const hotspots = document.querySelectorAll('.hotspot');
const audioStatus = document.getElementById('audio-status');
const progressFill = document.getElementById('progress-fill');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const volumeSlider = document.getElementById('volume-slider');
const bandcampLink = document.querySelector('.bandcamp-link');
const bandcampAnchor = bandcampLink.querySelector('a');

let audioActual = null;
let currentTrackName = "";
let isFullyBlack = false;

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

linkMusica.addEventListener('click', () => {
    menuSuperior.style.display = 'none';
    contenedorImagen.style.display = 'none';
    grillaPrincipal.style.display = 'none';
    vistaMusica.style.display = 'flex';
});

btnVolverMusica.addEventListener('click', () => {
    if (audioActual) {
        audioActual.pause();
        audioActual.currentTime = 0;
        audioActual = null;
    }
    currentTrackName = "";
    isFullyBlack = false;
    resetVisualTransition();
    vistaMusica.style.display = 'none';
    grillaPrincipal.style.display = 'grid';
    audioStatus.innerText = '[ SELECCIONA UN NODO ]';
    progressFill.style.width = '0';
    currentTimeEl.innerText = '00:00';
    totalDurationEl.innerText = '00:00';
});

function applyVisualTransition(progress) {
    musicBg.style.opacity = progress.toString();

    const textProgress = Math.min(1, progress / 0.25);
    const textVal = Math.round(255 * textProgress);
    const textCol = `rgb(${textVal}, ${textVal}, ${textVal})`;

    btnVolverMusica.style.color = textCol;
    audioStatus.style.color = textCol;
    currentTimeEl.style.color = textCol;
    totalDurationEl.style.color = textCol;
    bandcampLink.style.color = textCol;
    bandcampAnchor.style.color = textCol;

    const containerBg = Math.round(224 - (224 - 51) * textProgress);
    const trackColor = `rgb(${containerBg}, ${containerBg}, ${containerBg})`;

    progressContainer.style.backgroundColor = trackColor;
    progressFill.style.backgroundColor = textCol;

    if (volumeSlider) {
        volumeSlider.style.setProperty('--slider-track-bg', trackColor);
        volumeSlider.style.setProperty('--slider-thumb-bg', textCol);
    }

    hotspots.forEach(spot => {
        const spotBg = Math.round(255 * textProgress);
        const spotBorder = Math.round(255 * (1 - textProgress));
        spot.style.backgroundColor = `rgb(${spotBg}, ${spotBg}, ${spotBg})`;
        spot.style.borderColor = `rgb(${spotBorder}, ${spotBorder}, ${spotBorder})`;
    });
}

function resetVisualTransition() {
    musicBg.style.opacity = '0';
    const defaultTextCol = '#000000';
    btnVolverMusica.style.color = defaultTextCol;
    audioStatus.style.color = defaultTextCol;
    currentTimeEl.style.color = defaultTextCol;
    totalDurationEl.style.color = defaultTextCol;
    bandcampLink.style.color = defaultTextCol;
    bandcampAnchor.style.color = defaultTextCol;

    progressContainer.style.backgroundColor = '#e0e0e0';
    progressFill.style.backgroundColor = '#000000';

    if (volumeSlider) {
        volumeSlider.style.setProperty('--slider-track-bg', '#e0e0e0');
        volumeSlider.style.setProperty('--slider-thumb-bg', '#000000');
    }

    hotspots.forEach(spot => {
        spot.style.backgroundColor = '#000000';
        spot.style.borderColor = '#ffffff';
    });
}

document.querySelectorAll('audio').forEach(audio => {
    audio.addEventListener('timeupdate', () => {
        if (audioActual === audio) {
            const current = audio.currentTime;
            const duration = audio.duration || 0;
            const percent = (current / duration) * 100;
            progressFill.style.width = `${percent}%`;
            currentTimeEl.innerText = formatTime(current);
            totalDurationEl.innerText = formatTime(duration);

            if (!isFullyBlack) {
                let tCurrent = current;
                if (tCurrent >= 60) {
                    tCurrent = 60;
                    isFullyBlack = true;
                }
                const progress = tCurrent / 60;
                applyVisualTransition(progress);
            }
        }
    });

    audio.addEventListener('ended', () => {
        audioStatus.innerText = `[ ❚❚ ${currentTrackName} ]`;
        progressFill.style.width = '0';
    });
});

hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
        const audioId = spot.getAttribute('data-audio');
        const trackName = spot.getAttribute('data-name');
        const audioEl = document.getElementById(audioId);
        currentTrackName = trackName;

        if (volumeSlider) {
            audioEl.volume = volumeSlider.value;
        }

        if (audioActual === audioEl) {
            if (!audioEl.paused) {
                audioEl.pause();
                audioStatus.innerText = `[ ❚❚ ${trackName} ]`;
            } else {
                audioEl.play();
                audioStatus.innerText = `[ ▶ ${trackName} ]`;
            }
        } else {
            if (audioActual) {
                audioActual.pause();
                audioActual.currentTime = 0;
            }
            audioEl.play();
            audioActual = audioEl;
            audioStatus.innerText = `[ ▶ ${trackName} ]`;
            totalDurationEl.innerText = formatTime(audioEl.duration);
        }
    });
});

progressContainer.addEventListener('click', (e) => {
    if (audioActual && audioActual.duration) {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        audioActual.currentTime = percentage * audioActual.duration;
    }
});

function togglePlayPause() {
    if (audioActual) {
        if (audioActual.paused) {
            audioActual.play();
            audioStatus.innerText = `[ ▶ ${currentTrackName} ]`;
        } else {
            audioActual.pause();
            audioStatus.innerText = `[ ❚❚ ${currentTrackName} ]`;
        }
    }
}

audioStatus.addEventListener('click', togglePlayPause);


if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        const volumeVal = e.target.value;
        if (audioActual) {
            audioActual.volume = volumeVal;
        }
    });
}

/* --- LÓGICA VISTA SOM AO VIVO --- */
const linkAovivo = document.getElementById('link-aovivo');
const vistaAovivo = document.getElementById('vista-aovivo');
const btnVolverAovivo = document.getElementById('btn-volver-aovivo');

linkAovivo.addEventListener('click', () => {
    menuSuperior.style.display = 'none';
    contenedorImagen.style.display = 'none';
    grillaPrincipal.style.display = 'none';
    vistaAovivo.style.display = 'flex';
});

btnVolverAovivo.addEventListener('click', () => {
    vistaAovivo.style.display = 'none';
    grillaPrincipal.style.display = 'grid';
});

/* --- LÓGICA VISTA CINEMA --- */
const linkCinema = document.getElementById('link-cinema');
const vistaCinema = document.getElementById('vista-cinema');
const btnVolverCinema = document.getElementById('btn-volver-cinema');

linkCinema.addEventListener('click', () => {
    menuSuperior.style.display = 'none';
    contenedorImagen.style.display = 'none';
    grillaPrincipal.style.display = 'none';
    vistaCinema.style.display = 'flex';
});

btnVolverCinema.addEventListener('click', () => {
    vistaCinema.style.display = 'none';
    grillaPrincipal.style.display = 'grid';
});

/* --- LÓGICA VISTA VIDEO (YouTube) --- */
const vistaVideo = document.getElementById('vista-video');
const btnVolverVideo = document.getElementById('btn-volver-video');

letraVCentro.addEventListener('click', () => {
    letraVCentro.innerText = 'V';
    menuSuperior.style.display = 'none';
    menuSuperiorImagen.style.display = 'none';
    contenedorImagen.style.display = 'none';
    grillaPrincipal.style.display = 'none';
    vistaVideo.style.display = 'flex';
});

btnVolverVideo.addEventListener('click', () => {
    vistaVideo.style.display = 'none';
    grillaPrincipal.style.display = 'grid';
});

document.querySelectorAll('.video-thumb').forEach(img => {
    img.addEventListener('load', function() {
        if (this.naturalWidth <= 120 && this.src.includes('maxresdefault.jpg')) {
            this.src = this.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
        }
    });
});

/* --- LÓGICA VISTAS GALERÍA (Analog y Digital) Y LIGHTBOX GLOBAL --- */
const linkAnalog = document.getElementById('link-analog');
const vistaAnalog = document.getElementById('vista-analog');
const btnVolverAnalog = document.getElementById('btn-volver-analog');

const linkDigital = document.getElementById('link-digital');
const vistaDigital = document.getElementById('vista-digital');
const btnVolverDigital = document.getElementById('btn-volver-digital');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const lightboxCounter = document.getElementById('lightbox-counter');

let currentGalleryThumbs = [];
let currentGalleryIndex = 0;

// Funciones de apertura de galerías
linkAnalog.addEventListener('click', () => {
    menuSuperiorImagen.style.display = 'none';
    contenedorImagen.style.display = 'none';
    grillaPrincipal.style.display = 'none';
    vistaAnalog.style.display = 'flex';
    currentGalleryThumbs = document.querySelectorAll('.analog-img');
});

linkDigital.addEventListener('click', () => {
    menuSuperiorImagen.style.display = 'none';
    contenedorImagen.style.display = 'none';
    grillaPrincipal.style.display = 'none';
    vistaDigital.style.display = 'flex';
    currentGalleryThumbs = document.querySelectorAll('.digital-img');
});

// Botones Volver
btnVolverAnalog.addEventListener('click', () => {
    vistaAnalog.style.display = 'none';
    grillaPrincipal.style.display = 'grid';
});

btnVolverDigital.addEventListener('click', () => {
    vistaDigital.style.display = 'none';
    grillaPrincipal.style.display = 'grid';
});

// Función para actualizar imagen del Lightbox
function updateLightbox(index) {
    if (!currentGalleryThumbs || currentGalleryThumbs.length === 0) return;

    if (index < 0) index = currentGalleryThumbs.length - 1;
    if (index >= currentGalleryThumbs.length) index = 0;

    currentGalleryIndex = index;
    lightboxImg.src = currentGalleryThumbs[currentGalleryIndex].src;
    lightboxCounter.innerText = `${currentGalleryIndex + 1} / ${currentGalleryThumbs.length}`;
}

// Eventos de los Thumbnails (Global para todas las galerías)
document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    thumb.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        updateLightbox(index);
        lightbox.classList.remove('hidden');
    });
});

// Controles del Lightbox (Click)
lightboxClose.addEventListener('click', () => {
    lightbox.classList.add('hidden');
});

lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightbox(currentGalleryIndex - 1);
});

lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    updateLightbox(currentGalleryIndex + 1);
});

// Cerrar Lightbox clickeando fuera de la imagen
lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg && e.target !== lightboxPrev && e.target !== lightboxNext) {
        lightbox.classList.add('hidden');
    }
});

// Controles Globales de Teclado (Música Spacebar + Lightbox Arrows)
document.addEventListener('keydown', (e) => {
    // Música
    if (e.code === 'Space' && vistaMusica.style.display === 'flex') {
        e.preventDefault();
        togglePlayPause();
    }

    // Lightbox
    if (!lightbox.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') {
            updateLightbox(currentGalleryIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            updateLightbox(currentGalleryIndex - 1);
        } else if (e.key === 'Escape') {
            lightbox.classList.add('hidden');
        }
    }
});


/* --- LÓGICA MULTILINGÜE (SOBRE MIM) --- */
const langBtns = document.querySelectorAll('.lang-btn');
const p1El = document.getElementById('sobremim-p1');
const p2El = document.getElementById('sobremim-p2');

const dict = {
    en: {
        p1: "David Nascimento (Caracas, 2003) is an audiovisual artist and technician, versatile in any multimedia area but specialized in sound. Experimenting in Ableton Live from an early age, he discovered his interest in music and the arts, and since then seeks to maintain a professional career learning and doing what he is passionate about.",
        p2: "During his bachelor's degree in Sound and Image at the Catholic University of Porto, he created two art installations — Presión (2025) and Todo es Fácil (2026) —, the animated short film El Taxi (2024), and numerous sound design works for cinema, which you can check out <a class='link-cine-trigger'>here</a>."
    },
    es: {
        p1: "David Nascimento (Caracas, 2003) es un artista y técnico audiovisual versátil en cualquier área multimedia pero especializado en sonido. Desde temprana edad experimentando en ableton live, descubrió su interés por la música y las artes y desde entonces busca mantener una carrera profesional aprendiendo y haciendo lo que le apasiona.",
        p2: "Durante su licenciatura en Som e Imagem en la Universidad Católica de Oporto, realizó dos instalaciones artísticas — Presión (2025) y Todo es Fácil (2026) —, el cortometraje de animación El Taxi (2024) y numerosos trabajos de sonoplastia para cine, que puedes revisar <a class='link-cine-trigger'>aquí</a>."
    },
    pt: {
        p1: "David Nascimento (Caracas, 2003) é um artista e técnico audiovisual versátil em qualquer área multimédia, mas especializado em som. Ao experimentar no Ableton Live desde cedo, descobriu o seu interesse pela música e pelas artes e, desde então, procura manter uma carreira profissional aprendendo e fazendo o que o apaixona.",
        p2: "Durante a licenciatura em Som e Imagem na Universidade Católica Portuguesa (Porto), realizou duas peças de instalação artística — Pressão (2025) e Todo es Fácil (2026) —, a curta-metragem de animação El Taxi (2024) e diversos trabalhos de sonoplastia para cinema, que podes consultar <a class='link-cine-trigger'>aqui</a>."
    }
};

function setLanguage(lang) {
    p1El.innerHTML = dict[lang].p1;
    p2El.innerHTML = dict[lang].p2;

    langBtns.forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const linkCineTrigger = document.querySelector('.link-cine-trigger');
    if (linkCineTrigger) {
        linkCineTrigger.addEventListener('click', () => {
            vistaSobreMim.style.display = 'none';
            vistaCinema.style.display = 'flex';
        });
    }
}

let userLang = navigator.language;
userLang = userLang.substring(0, 2).toLowerCase();

let defaultLang = (userLang === 'es' || userLang === 'pt') ? userLang : 'en';
setLanguage(defaultLang);

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.getAttribute('data-lang'));
    });
});

/* --- LÓGICA DE REVELADO FOTOGRÁFICO UNIVERSAL (Daguerrotipo) --- */
const daguerreotypeImages = document.querySelectorAll('.daguerreotype-filter');

daguerreotypeImages.forEach(img => {
    img.addEventListener('mouseenter', () => {
        if (img.hideTimer) {
            clearTimeout(img.hideTimer);
            img.hideTimer = null;
        }
        img.classList.add('revealed');
    });

    img.addEventListener('mouseleave', () => {
        img.hideTimer = setTimeout(() => {
            img.classList.remove('revealed');
        }, 5000);
    });
});