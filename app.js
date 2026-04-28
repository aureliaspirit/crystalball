const heartField = document.getElementById("heartField");
const globe = document.getElementById("globe");
const shakeButton = document.getElementById("shakeButton");
const wishButton = document.getElementById("wishButton");
const wishText = document.getElementById("wishText");
const fortuneText = document.getElementById("fortuneText");
const statusText = document.getElementById("statusText");
const toast = document.getElementById("toast");

const wishes = [
  "愿你今晚被温柔接住，像把一整个小月亮捧进怀里。",
  "有些光很小，却能安安静静陪人走很远。",
  "你靠近一点，世界就会柔下来一点。",
  "小心心轻轻晃着，像在替你说：今天也值得被爱。",
  "如果有一点累，就把自己放进夜色里，慢慢被温柔包住。",
  "水晶球知道：你认真珍惜的东西，会一点点长大。",
  "愿你今晚心是松的，肩膀是轻的，怀里是暖的。"
];

const fortunes = [
  "今晚的水晶球很温柔。<br>你把它捧在手心里，它就把一点点亮光还给你。",
  "里面的小心心正在轻轻漂浮。<br>它们像在说：慢慢来，也很好。",
  "夜色很安静，玻璃球里有柔柔的光。<br>你一看它，它就开始发亮。",
  "这一颗水晶球不急着回答世界。<br>它只想先把你抱进温柔里。"
];

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function animateText(el, htmlText) {
  el.classList.remove("fade-in");
  void el.offsetWidth;
  el.innerHTML = htmlText;
  el.classList.add("fade-in");
}

function rand(min, max) { return Math.random() * (max - min) + min; }

function buildHearts(shaken = false) {
  heartField.innerHTML = "";
  const count = 18;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";
    const sizeRoll = Math.random();
    heart.classList.add(sizeRoll < 0.35 ? "small" : sizeRoll < 0.78 ? "medium" : "large");
    if (Math.random() > 0.83) heart.classList.add("special");
    heart.textContent = Math.random() > 0.18 ? "❤" : "♡";

    heart.style.left = rand(16, 84) + "%";
    heart.style.top = rand(18, 82) + "%";
    const floatDuration = shaken ? rand(2.6, 4.2) : rand(4.8, 8.6);
    const swayDuration = shaken ? rand(1.4, 2.6) : rand(2.8, 5.4);
    const delay = rand(-5, 0);
    heart.style.animationDuration = `${floatDuration}s, ${swayDuration}s`;
    heart.style.animationDelay = `${delay}s, ${delay / 1.8}s`;
    heart.style.opacity = rand(0.62, 0.98).toFixed(2);
    heartField.appendChild(heart);
  }
}

function softWish() {
  const wish = wishes[Math.floor(Math.random() * wishes.length)];
  animateText(wishText, wish);
  showToast("收好这一条心语。✨");
}

function refreshFortune() {
  const line = fortunes[Math.floor(Math.random() * fortunes.length)];
  animateText(fortuneText, line);
}

function shakeGlobe() {
  globe.classList.remove("shaking");
  void globe.offsetWidth;
  globe.classList.add("shaking");
  buildHearts(true);
  animateText(statusText, "小心心被轻轻晃醒了，正绕着光慢慢转。");
  refreshFortune();
  if (navigator.vibrate) navigator.vibrate([24, 80, 24]);
  showToast("轻轻摇了一下。💗");
  setTimeout(() => {
    buildHearts(false);
    animateText(statusText, "它又慢慢安静下来，继续轻轻晃着。");
  }, 1800);
}

shakeButton.addEventListener("click", shakeGlobe);
wishButton.addEventListener("click", softWish);

buildHearts(false);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
