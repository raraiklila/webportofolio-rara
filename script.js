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
const wrap = document.getElementById("wrap");
const card = document.getElementById("card");

let isDown = false;
let pointerId = null;

let baseAuto = 0;          // current auto angle
let autoT = 0;             // time
let manualTarget = 0;      // desired manual angle from drag
let manual = 0;            // smoothed manual angle
let cardExtra = 0;         // extra card tilt while dragging
let cardExtraTarget = 0;

let pullXTarget = 0;       // tiny translate
let pullX = 0;
let pullYTarget = 0;
let pullY = 0;

// ====== Auto swing (smooth sine) ======
function animate(){
  autoT += 0.016;
  baseAuto = Math.sin(autoT * 1.1) * 2.2; // deg

  // smooth manual and card extra
  manual += (manualTarget - manual) * 0.12;
  cardExtra += (cardExtraTarget - cardExtra) * 0.18;

  pullX += (pullXTarget - pullX) * 0.15;
  pullY += (pullYTarget - pullY) * 0.15;

  const wrapAngle = baseAuto + manual;

  // apply to wrap
  wrap.style.transform = `rotate(${wrapAngle}deg)`;

  // apply to card (slightly more tilt + tiny pull translate)
  // rotate a bit relative to wrap so it feels "hinge"
  card.style.transform =
    `translateX(-50%) translate(${pullX}px, ${pullY}px) rotate(${(-2 + cardExtra)}deg)`;

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ====== Drag handling (mouse + touch unified) ======
function getX(e){
  return (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
}
function getY(e){
  return (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
}

let startX = 0, startY = 0;
let startManual = 0;

function onDown(e){
  // pointer events preferred
  isDown = true;
  card.style.cursor = "grabbing";

  startX = getX(e);
  startY = getY(e);
  startManual = manualTarget;

  // capture pointer if available
  if (e.pointerId !== undefined){
    pointerId = e.pointerId;
    try { card.setPointerCapture(pointerId); } catch(_){}
  }
}

function onMove(e){
  if(!isDown) return;

  const dx = getX(e) - startX;
  const dy = getY(e) - startY;

  // map drag -> angle (deg)
  // drag 100px -> about 4deg
  manualTarget = startManual + (dx / 100) * 4.0;

  // clamp to avoid crazy
  manualTarget = Math.max(-8, Math.min(8, manualTarget));

  // card extra tilt & small pull
  cardExtraTarget = (dx / 140) * 5;   // deg
  cardExtraTarget = Math.max(-8, Math.min(8, cardExtraTarget));

  pullXTarget = Math.max(-14, Math.min(14, dx / 10));
  pullYTarget = Math.max(-10, Math.min(10, dy / 14));
}

function onUp(){
  if(!isDown) return;
  isDown = false;
  card.style.cursor = "grab";

  // when released, ease back to 0 manual (auto continues)
  manualTarget = 0;
  cardExtraTarget = 0;
  pullXTarget = 0;
  pullYTarget = 0;

  pointerId = null;
}

// Pointer events (best)
card.addEventListener("pointerdown", onDown);
window.addEventListener("pointermove", onMove);
window.addEventListener("pointerup", onUp);

// Fallback touch (if needed)
card.addEventListener("touchstart", (e)=>onDown(e), {passive:true});
window.addEventListener("touchmove", (e)=>onMove(e), {passive:true});
window.addEventListener("touchend", onUp);
// Fallback mouse (if needed)
card.addEventListener("mousedown", onDown);
window.addEventListener("mousemove", onMove);
window.addEventListener("mouseup", onUp);
