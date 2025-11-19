/* Core behavior:
 - cover click -> open (cover.hide) -> show stage -> type text -> play audio (fade-in)
 - mute toggle
 - "Ավելին" -> gift scene, brighten page, allow download
 - particles (canvas) for soft floating dust
*/

const cover = document.getElementById("cover");
const bg = document.getElementById("bg");
const stage = document.getElementById("stage");
const typingEl = document.getElementById("typing");
const toGift = document.getElementById("toGift");
const sceneMain = document.getElementById("sceneMain");
const sceneGift = document.getElementById("sceneGift");
const muteBtn = document.getElementById("muteBtn");
const downloadGift = document.getElementById("downloadGift");
const backBtn = document.getElementById("backBtn");
const wallBtn = document.getElementById("wallBtn");
const particlesCanvas = document.getElementById("particles");
const ctx = particlesCanvas.getContext && particlesCanvas.getContext('2d');

// Armenian long text (style B, with signature)
const fullText = `Տարիներ անց ես գուցե չհիշեմ որոշ օրեր,
բայց հաստատ կհիշեմ մարդկանց,
ովքեր դարձրել են դրանք ապրելու արժանի։

Դու հենց այդ մարդիկից ես։

Կան պահեր, որտեղ արածը քիչ է,
բայց ներկայությունն՝ անհամեմատ մեծ։
Եվ որքան էլ կյանքը մեզ տարբեր ուղղություններով քաշի,
դու մնացել ես խաղաղ տարածք,
որտեղ լռությունն անգամ չի ծանրանում։
րսը։
Շնորհակալ եմ քո լույսի, քո թեթևության,
քո այն տեսակի ջերմության համար,
որ չի պահանջում բառեր, բայց փոխում է նե

Թող քո ճանապարհը լցված լինի մարդկանցով,
ովքեր կհասկանան առանց բացատրությունների,
կսիրեն առանց սկզբի ու վերջի,
և կգնահատեն ամեն բացված առավոտը կողքիդ։

Շնորհավոր քո օրը, Մաշ։
Քամին թող մեղմ լինի,
ուշացած երազանքները՝ հասկանալի,
իսկ որտեղ ես կլինեմ՝ դու երբեք չզգաս միայնություն։

Քո խաղաղության բարեկամը՝
Արտակ`;

// typing control
let lineIndex = 0, charIndex = 0;
let lines = fullText.split('\n');

// handle cover click
cover.addEventListener('click', async () => {
  cover.classList.add('hide');
  // show stage after tiny delay
  setTimeout(() => {
    stage.classList.remove('hidden');
    stage.classList.add('show');
    startTyping();
  }, 520);

  // attempt audio play & fade-in
  try {
    bg.volume = 0;
    await bg.play();
    fadeInVolume();
  } catch (e) {
    console.warn("Autoplay blocked:", e);
  }
});

// typing function (line by line, word-aware pause)
function startTyping(){
  typingEl.textContent = '';
  lineIndex = 0; charIndex = 0;
  typeNextLine();
}
function typeNextLine(){
  if (lineIndex >= lines.length) return;
  const line = lines[lineIndex];
  charIndex = 0;
  const timer = setInterval(()=>{
    if (charIndex <= line.length){
      // append char
      typingEl.textContent += line.charAt(charIndex) || '';
      charIndex++;
    } else {
      clearInterval(timer);
      typingEl.textContent += '\n';
      lineIndex++;
      // longer pause on blank line
      setTimeout(typeNextLine, line.trim() === '' ? 400 : 420);
    }
  }, 28);
}

// Next -> gift scene
toGift.addEventListener('click', ()=> {
  sceneMain.classList.add('hidden');
  sceneGift.classList.remove('hidden');
  // brighten background
  document.body.classList.add('light-bg');
});

// back to main
backBtn.addEventListener('click', ()=> {
  sceneGift.classList.add('hidden');
  sceneMain.classList.remove('hidden');
  document.body.classList.remove('light-bg');
});

// Mute toggle
muteBtn.addEventListener('click', ()=> {
  if (bg.muted){
    bg.muted = false;
    muteBtn.textContent = "🔈";
  } else {
    bg.muted = true;
    muteBtn.textContent = "🔇";
  }
});

// fade in volume helper
function fadeInVolume(){
  let v = 0;
  const t = setInterval(()=>{
    if (v < 0.44){
      v += 0.02;
      bg.volume = v;
    } else clearInterval(t);
  }, 120);
}

// wallpaper button => open pdf (user can save)
wallBtn.addEventListener('click', ()=> {
  window.open(downloadGift.href, '_blank');
});

/* --- Particles: soft floating dust --- */
if (ctx){
  let w, h, particles = [];
  function resize(){
    particlesCanvas.width = w = window.innerWidth;
    particlesCanvas.height = h = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticles(){
    particles = [];
    const count = Math.max(40, Math.floor((w*h)/60000));
    for (let i=0;i<count;i++){
      particles.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: 0.6 + Math.random()*1.6,
        vx: (Math.random()-0.5)*0.15,
        vy: -0.1 - Math.random()*0.4,
        alpha: 0.3 + Math.random()*0.5
      });
    }
  }
  createParticles();

  function draw(){
    ctx.clearRect(0,0,w,h);
    for (let p of particles){
      ctx.beginPath();
      ctx.fillStyle = `rgba(212,162,89,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
      // move
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random()*w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
    }
    requestAnimationFrame(draw);
  }
  draw();
}
