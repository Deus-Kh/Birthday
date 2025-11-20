let current = 1;
const music = document.getElementById('music')
const muteBtn = document.getElementById('muteBtn');
const stage = document.getElementById("stage");
music.currentTime=71;


// mute
let muted = false;
muteBtn.onclick = () => {
  muted = !muted;
  music.muted = muted;
  muteBtn.textContent = muted ? "🔇" : "🔈";
};

// particles
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.getElementById("particles").appendChild(canvas);

let w, h, particles = [];
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.onresize = resize;
resize();
const count = Math.max(40, Math.floor((w*h)/60000));
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random()*w,
    y: Math.random()*h,
    s: Math.random()*1.4 + 0.4,
    v: Math.random()*0.4 + 0.1,
    alpha: 0.3 + Math.random()*0.5
  });
}

function draw() {
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = `rgba(212,162,89,0.5)`;
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.s, 0, Math.PI*2);
    ctx.fill();
    p.y -= p.v;
    if (p.y < -5) p.y = h + 5;
  });
  requestAnimationFrame(draw);
}
draw();



let cover = document.getElementById('cover')
const typingEl = document.getElementById("textbox");
const fullText = `Մաշ,

Կան մարդիկ, որոնք մեր կյանք չեն մտնում բարձր ձայնով։
Նրանք գալիս են լույսով՝ առանց կտրուկ գույների,
մի քիչ ամաչկոտ, մի քիչ խորություն ունեցող հայացքով,
ու դու հենց այդպես էլ արեցիր։

Քո 20 տարին ոչ թե պարզապես թիվ է։
Դա այն ամենն է, ինչը պատմում է քո ուժի, քնքշության
ու այն հոգու մասին, որի կողքին տաք է նույնիսկ լռության մեջ։

Թող այս օրը լինի այն նուրբ շեմը,
որտեղ ավարտվում են կասկածները
և սկսվում է կյանքը, որ իսկապես քոնն է։

Երբ աշխարհը դառնա ծանր —
մի մոռացիր, որ դու ունես ուժ
փոխել շրջապատդ հենց քո լռությամբ, քո ժպիտով,
քո էակով։

Տարիներ անց ես գուցե չհիշեմ որոշ օրեր,
բայց հաստատ կհիշեմ մարդկանց,
ովքեր դարձրել են դրանք ապրելու արժանի։

Դու հենց այդ մարդիկից ես։

Կան պահեր, որտեղ արածը քիչ է,
բայց ներկայությունն՝ անհամեմատ մեծ։
Եվ որքան էլ կյանքը մեզ տարբեր ուղղություններով քաշի,
դու դարձել ես խաղաղ տարածք,
որտեղ լռությունն անգամ չի ծանրանում։

Շնորհակալ եմ քո լույսի, քո թեթևության,
քո այն տեսակի ջերմության համար,
որ չի պահանջում բառեր, բայց փոխում է ներսը։

Թող քո ճանապարհը լցված լինի մարդկանցով,
ովքեր կհասկանան առանց բացատրությունների,
կսիրեն առանց սկզբի ու վերջի,
և կգնահատեն ամեն բացված առավոտը կողքիդ։

Շնորհավոր քո օրը, Մաշ։
Քամին թող մեղմ լինի,
ուշացած երազանքները՝ հասկանալի,
իսկ որտեղ ես կլինեմ՝ դու երբեք չզգաս միայնություն։

Շնորհավոր ծնունդդ․․․

Քո խաղաղության բարեկամ՝
Արտակ`

let lineIndex = 0, charIndex = 0;
let lines = fullText.split('\n');

// handle cover clickx
cover.addEventListener('click', async () => {
  cover.classList.add('hide');
  // show stage after tiny delay
  setTimeout(() => {
    cover.classList.remove('active');
    stage.classList.add('active');
    startTyping();
  }, 520);

  // attempt audio play & fade-in
  try {
    music.volume = 0;
    await music.play();
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
      window.scrollTo(0,document.body.scrollHeight)
    } else {
      clearInterval(timer);
      typingEl.textContent += '\n';
      lineIndex++;
      // longer pause on blank line
      setTimeout(typeNextLine, line.trim() === '' ? 410 : 430);
    }
  }, 45);
}
function fadeInVolume(){
  let v = 0;
  const t = setInterval(()=>{
    if (v < 0.1){
      v += 0.02;
      music.volume = v;
    } else clearInterval(t);
  }, 150);
}