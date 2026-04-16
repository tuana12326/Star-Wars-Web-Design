const FACTS = [
  { title: 'Işın Kılıcı Renkleri', text: 'Mavi=Jedi Koruyucu · Yeşil=Jedi Bilge · Kırmızı=Sith · Mor=eşsiz (Samuel L. Jackson) · Sarı=Tapınak Muhafızı' },
  { title: 'The Force (Güç)', text: 'Tüm canlıları birbirine bağlayan mistik enerji. Jedi ışık, Sith karanlık tarafı kullanır.' },
  { title: 'Darth Vader', text: 'Aslında Anakin Skywalker — Luke’un babası. Karanlığa geçişi galaksiyi değiştirdi.' },
  { title: 'Yoda', text: '900 yıl yaşadı. Jedi Konseyi lideriydi. "Güç seninle olsun" diyenin ta kendisi.' },
  { title: 'Millennium Falcon', text: 'Han Solo’nun gemisi. Kessel Koşusu’nu 12 parsekten daha az bir sürede tamamladı.' }
];

// 1. Yıldız Alanı
const sf = document.getElementById('starfield');
for (let i = 0; i < 200; i++) {
  const star = document.createElement('div');
  const size = Math.random() * 2 + 'px';
  star.style.position = 'absolute';
  star.style.width = size;
  star.style.height = size;
  star.style.background = '#fff';
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 100 + '%';
  star.style.borderRadius = '50%';
  star.style.opacity = Math.random();
  star.style.animation = `tw ${Math.random() * 3 + 2}s infinite`;
  sf.appendChild(star);
}

// 2. Işın Kılıcı Çizimi
const canvas = document.getElementById('lsCanvas');
const ctx = canvas.getContext('2d');
let trail = [], isDrawing = false, hasDrew = false, factIdx = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function drawTrail() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (trail.length < 2) return;

  // Parlama Efektleri (Katman katman)
  [
    ['rgba(0, 190, 255, 0.42)', 12, 18, '#00ccff'], // Dış parlama
    ['rgba(220, 248, 255, 0.97)', 4, 8, '#00eeff']   // İç beyazlık
  ].forEach(([color, lineWidth, shadowBlur, shadowColor]) => {
    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);
    trail.forEach(p => ctx.lineTo(p.x, p.y));
    
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  });
}

// 3. Etkileşimler
const cursor = document.getElementById('cursor');
const factCard = document.getElementById('factCard');
const drawText = document.getElementById('drawText');
const subText = document.getElementById('subText');
const cParts = ['cc', 'ct', 'cb', 'cl', 'cr'].map(id => document.getElementById(id));

function setCursorColor(color) {
  cParts.forEach(el => el.setAttribute('stroke', color));
}

function showFact(x, y) {
  const fact = FACTS[factIdx % FACTS.length];
  factIdx++;
  document.getElementById('factTitle').textContent = fact.title;
  document.getElementById('factText').textContent = fact.text;

  factCard.style.left = Math.min(Math.max(x - 150, 10), window.innerWidth - 320) + 'px';
  factCard.style.top = Math.max(y - 160, 10) + 'px';
  factCard.style.display = 'block';
}

window.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';

  if (isDrawing) {
    trail.push({ x: e.clientX, y: e.clientY });
    if (trail.length > 50) trail.shift();
    drawTrail();
    if (!hasDrew) {
      hasDrew = true;
      subText.style.opacity = '0';
    }
  }
});

window.addEventListener('mousedown', (e) => {
  isDrawing = true;
  trail = [];
  factCard.style.display = 'none';
  drawText.textContent = '⚡ Çiziyorsun...';
  drawText.classList.add('holding');
  setCursorColor('#00eeff');
});

window.addEventListener('mouseup', (e) => {
  if (!isDrawing) return;
  isDrawing = false;
  drawText.textContent = '◈ Çiz ve Bilgiyi Gör ◈';
  drawText.classList.remove('holding');
  setCursorColor('#ffd700');

  if (trail.length > 5) {
    showFact(e.clientX, e.clientY);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

factCard.addEventListener('click', () => {
  factCard.style.display = 'none';
});