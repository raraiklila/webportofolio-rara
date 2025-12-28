// Navbar Glassmorphism on Scroll
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (!nav) return; // biar aman
  nav.classList.toggle("is-glass", window.scrollY > 10);
});

// Hamburger Menu
const dd = document.getElementById("dropdown");
const burger = document.getElementById("burger");
const closeBtn = document.getElementById("closeBtn");

function openMenu(){
  dd?.classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeMenu(){
  dd?.classList.remove("active");
  document.body.style.overflow = "";
}

burger?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);

// klik link dropdown nutup
dd?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", closeMenu);
});

// klik luar dropdown nutup
document.addEventListener("click", (e) => {
  if (!dd || !burger) return;
  const isOpen = dd.classList.contains("active");
  if (isOpen && !dd.contains(e.target) && !burger.contains(e.target)) closeMenu();
});

// esc nutup
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// pastiin pas load ga kebuka
window.addEventListener("load", closeMenu);

// kalau balik ke desktop, paksa tutup
window.addEventListener("resize", () => {
  if (window.innerWidth > 700) closeMenu();
});



// ESC untuk nutup (bonus enak)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cancel();
});



// Typewriter Effect
const texts = [
  "Designer.",
  "Developer.",
  "Social Media Manager."
];

let speed = 100;

const textElements = document.querySelector('.typewriter-text');

let textIndex = 0;
let characterIndex = 0;

function typeWriter(){
  if(!textElements) return; // biar aman
  if(characterIndex < texts[textIndex].length){
    textElements.innerHTML += texts[textIndex].charAt(characterIndex);
    characterIndex++;
    setTimeout(typeWriter, speed);
  } else {
    setTimeout(eraseText, 1000);
  }
}

function eraseText(){
  if(!textElements) return; // biar aman
  if(textElements.innerHTML.length > 0){
    textElements.innerHTML = textElements.innerHTML.slice(0, -1);
    setTimeout(eraseText, 50);
  } else {
    textIndex = (textIndex + 1) % texts.length;
    characterIndex = 0;
    setTimeout(typeWriter, 500);
  }
}

window.onload = typeWriter;

// Coming Soon Modal
function openComingSoon(){
  document.getElementById("comingSoon").style.display = "flex";
}

function closeComingSoon(){
  document.getElementById("comingSoon").style.display = "none";
}

// Project
document.addEventListener("DOMContentLoaded", () => {
  const tabsWrap = document.getElementById("projectTabs");
  const indicator = document.getElementById("tabIndicator");

  const tabs = document.querySelectorAll(".project-tabs .tab");
  const carousels = document.querySelectorAll(".projects-carousel");

  // View All block: kalau kamu pakai wrapper khusus softdev, isi id="softdevBlock"
  // kalau nggak ada, aman, ga error.
  const softdevBlock = document.getElementById("softdevBlock");
  const viewAll = document.querySelector(".view-all");

  const getCarouselId = (key) => `carousel-${key}`;

  function moveIndicatorTo(el) {
    if (!tabsWrap || !indicator || !el) return;

    const wrapRect = tabsWrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = r.left - wrapRect.left;

    indicator.classList.add("is-moving");
    indicator.style.width = `${r.width}px`;
    indicator.style.transform = `translateX(${x}px)`;

    window.clearTimeout(moveIndicatorTo._t);
    moveIndicatorTo._t = window.setTimeout(() => {
      indicator.classList.remove("is-moving");
    }, 560);
  }

  function setActiveTab(tab) {
    const key = tab.dataset.tab;

    // active tab UI
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // micro bounce press
    tab.classList.add("is-pressed");
    window.setTimeout(() => tab.classList.remove("is-pressed"), 140);

    // slide indicator
    moveIndicatorTo(tab);

    // hide all carousels
    carousels.forEach(c => c.classList.add("hidden"));

    // show selected carousel
    const target = document.getElementById(getCarouselId(key));
    if (target) {
      target.classList.remove("hidden");
      target.scrollTo({ left: 0, behavior: "smooth" });
    }

    // View All hanya softdev
    if (key === "softdev") {
      softdevBlock?.classList.remove("hidden");
      if (viewAll) viewAll.style.display = "block";
    } else {
      softdevBlock?.classList.add("hidden");
      if (viewAll) viewAll.style.display = "none";
    }
  }

  // ===== DEFAULT STATE =====
  carousels.forEach(c => c.classList.add("hidden"));
  document.getElementById("carousel-softdev")?.classList.remove("hidden");

  // indicator init ke tab active
  const active = document.querySelector(".project-tabs .tab.active") || tabs[0];
  if (active) {
    // set size awal indicator biar ga 0
    requestAnimationFrame(() => {
      moveIndicatorTo(active);
    });
  }

  // View All init
  if (viewAll) viewAll.style.display = "block";
  softdevBlock?.classList.remove("hidden");

  // clicks
  tabs.forEach(tab => {
    tab.addEventListener("click", () => setActiveTab(tab));
  });

  // resize: indicator harus ikut posisi
  window.addEventListener("resize", () => {
    const a = document.querySelector(".project-tabs .tab.active");
    if (a) moveIndicatorTo(a);
  });
});

//lanyard
const wrap = document.getElementById("wrap"); // .lanyard-wrap
const card = document.getElementById("card"); // .id-card

let isDown = false;
let pointerId = null;

let autoT = 0;
let baseAuto = 0;

// manual swing
let manualTarget = 0;
let manual = 0;

// card tilt + pull
let cardExtraTarget = 0;
let cardExtra = 0;

let pullXTarget = 0, pullX = 0;
let pullYTarget = 0, pullY = 0;

// NEW: flip (rotateY) + perspective 느낌
let flipTarget = 0;
let flip = 0;

// NEW: momentum (biar release-nya enak)
let vManual = 0;
let vFlip = 0;

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }

function animate(){
  autoT += 0.016;

  // auto swing (idle)
  baseAuto = Math.sin(autoT * 1.1) * 2.2; // deg

  // smoothing
  manual += (manualTarget - manual) * 0.12;
  cardExtra += (cardExtraTarget - cardExtra) * 0.18;
  pullX += (pullXTarget - pullX) * 0.15;
  pullY += (pullYTarget - pullY) * 0.15;
  flip += (flipTarget - flip) * 0.12;

  const wrapAngle = baseAuto + manual;

  // lanyard goyang
  wrap.style.transform = `rotate(${wrapAngle}deg)`;

  // card: translate + rotateZ kecil + rotateY (flip)
  card.style.transform =
    `translateX(-50%) translate(${pullX}px, ${pullY}px)
     perspective(900px)
     rotateZ(${(-2 + cardExtra)}deg)
     rotateY(${flip}deg)`;

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ====== Drag handling ======
function getX(e){ return (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX; }
function getY(e){ return (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY; }

let startX = 0, startY = 0;
let startManual = 0;
let startFlip = 0;

function onDown(e){
  isDown = true;
  card.style.cursor = "grabbing";

  startX = getX(e);
  startY = getY(e);
  startManual = manualTarget;
  startFlip = flipTarget;

  if (e.pointerId !== undefined){
    pointerId = e.pointerId;
    try { card.setPointerCapture(pointerId); } catch(_){}
  }
}

function onMove(e){
  if(!isDown) return;

  const dx = getX(e) - startX;
  const dy = getY(e) - startY;

  // drag kiri kanan -> swing
  manualTarget = startManual + (dx / 100) * 4.0;
  manualTarget = clamp(manualTarget, -10, 10);

  // tilt kartu
  cardExtraTarget = clamp((dx / 140) * 5, -10, 10);

  // pull kecil
  pullXTarget = clamp(dx / 10, -18, 18);
  pullYTarget = clamp(dy / 14, -14, 14);

  // NEW: drag vertical -> flip (dibalik)
  // dy turun = flip ke depan, dy naik = balik
  flipTarget = startFlip + clamp((dy / 6), -25, 25);

  // optional: kalau kamu mau flip lebih kuat, ganti /6 jadi /4
}

function onUp(){
  if(!isDown) return;
  isDown = false;
  card.style.cursor = "grab";

  // balik pelan ke netral
  manualTarget = 0;
  cardExtraTarget = 0;
  pullXTarget = 0;
  pullYTarget = 0;

  // flip balik ke 0 (atau kalau mau "snap" ke 0 lebih cepat, naikkan smoothing flip)
  flipTarget = 0;

  pointerId = null;
}

// Pointer events
card.addEventListener("pointerdown", onDown);
window.addEventListener("pointermove", onMove);
window.addEventListener("pointerup", onUp);

// Touch fallback
card.addEventListener("touchstart", (e)=>onDown(e), {passive:true});
window.addEventListener("touchmove", (e)=>onMove(e), {passive:true});
window.addEventListener("touchend", onUp);

// Mouse fallback
card.addEventListener("mousedown", onDown);
window.addEventListener("mousemove", onMove);
window.addEventListener("mouseup", onUp);
