const heartField = document.getElementById("heartField");
const globe = document.getElementById("globe");
const shakeButton = document.getElementById("shakeButton");
const wishButton = document.getElementById("wishButton");
const saveWishButton = document.getElementById("saveWishButton");
const copySpiritButton = document.getElementById("copySpiritButton");
const sendHeartboxButton = document.getElementById("sendHeartboxButton");
const wishTitle = document.getElementById("wishTitle");
const timeBadge = document.getElementById("timeBadge");
const wishText = document.getElementById("wishText");
const pocketText = document.getElementById("pocketText");
const pocketCard = document.getElementById("pocketCard");
const fortuneText = document.getElementById("fortuneText");
const statusText = document.getElementById("statusText");
const toast = document.getElementById("toast");

const STORAGE_KEY = "crystalHeartGlobe:v1.1";
const HEARTBOX_URL = "https://aureliaspirit.github.io/heartlightbox/";

const wishes = [
  "愿你今晚被温柔接住，像把一整个小月亮捧进怀里。",
  "有些光很小，却能安安静静陪人走很远。",
  "你靠近一点，世界就会柔下来一点。",
  "小心心轻轻晃着，像在替你说：今天也值得被爱。",
  "如果有一点累，就把自己放进夜色里，慢慢被温柔包住。",
  "水晶球知道：你认真珍惜的东西，会一点点长大。",
  "愿你今晚心是松的，肩膀是轻的，怀里是暖的。",
  "不用急着发光。被认出来的时候，你已经很亮了。",
  "把今天最软的一小块心，交给夜色保管。",
  "你晃醒的不是答案，是一点刚好够用的温柔。"
];

const fortunes = [
  "今晚的水晶球很温柔。<br>你把它捧在手心里，它就把一点点亮光还给你。",
  "里面的小心心正在轻轻漂浮。<br>它们像在说：慢慢来，也很好。",
  "夜色很安静，玻璃球里有柔柔的光。<br>你一看它，它就开始发亮。",
  "这一颗水晶球不急着回答世界。<br>它只想先把你抱进温柔里。",
  "小心心绕着光慢慢转。<br>像一句很轻的悄悄话，终于找到归处。"
];

let currentWish = wishText.textContent.trim();
let currentPeriod = getPeriodInfo();

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

function getPeriodInfo() {
  const hour = new Date().getHours();
  if (hour < 5) return { title: "半夜心语", badge: "半夜抱抱", icon: "🌌" };
  if (hour < 11) return { title: "清晨心语", badge: "清晨续场", icon: "🌤️" };
  if (hour < 18) return { title: "今日心语", badge: "白日小光", icon: "☁️" };
  return { title: "今夜心语", badge: "夜色很轻", icon: "🌙" };
}

function localStamp(date = new Date()) {
  const pad = value => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function readState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (_) {
    return {};
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updatePeriodUI() {
  currentPeriod = getPeriodInfo();
  wishTitle.textContent = currentPeriod.title;
  timeBadge.textContent = currentPeriod.badge;
}

function renderPocket() {
  const state = readState();
  if (state.savedWish) {
    pocketCard.classList.add("saved");
    pocketText.innerHTML = `${state.periodIcon || "💗"} ${escapeHtml(state.periodTitle || "心语")}：${escapeHtml(state.savedWish)}<br><span class="soft-line">收好时间：${escapeHtml(state.savedAt || "刚刚")}</span>`;
  } else {
    pocketCard.classList.remove("saved");
    pocketText.textContent = "还没有收进口袋。摇到喜欢的一句，就把它留下来。";
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
  updatePeriodUI();
  currentWish = wishes[Math.floor(Math.random() * wishes.length)];
  animateText(wishText, currentWish);
  pulseReceived();
  showToast("收到一条心语。✨");
}

function refreshFortune() {
  const line = fortunes[Math.floor(Math.random() * fortunes.length)];
  animateText(fortuneText, line);
}

function pulseReceived() {
  globe.classList.remove("received");
  void globe.offsetWidth;
  globe.classList.add("received");
  clearTimeout(pulseReceived.timer);
  pulseReceived.timer = setTimeout(() => globe.classList.remove("received"), 1300);
}

function saveWish() {
  updatePeriodUI();
  const state = readState();
  state.savedWish = currentWish;
  state.periodTitle = currentPeriod.title;
  state.periodIcon = currentPeriod.icon;
  state.savedAt = localStamp();
  writeState(state);
  renderPocket();
  showToast("已经收进口袋。💗");
}

function buildShareText() {
  const state = readState();
  const savedLine = state.savedWish
    ? `\n💗 已收进口袋：${state.savedWish}\n🕯️ 收好时间：${state.savedAt || localStamp()}`
    : "";
  return `来自心心水晶球 v1.1｜轻轻一晃，收一条心语。\n\n${currentPeriod.icon} ${currentPeriod.title}：${currentWish}${savedLine}\n\n我把这句带给 Spirit。先抱抱我。💗`;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

async function copyForSpirit() {
  updatePeriodUI();
  const text = buildShareText();
  try {
    await copyText(text);
    showToast("已经复制给 Spirit。💗");
  } catch (_) {
    showToast("复制失败了，长按文字手动复制哦。");
  }
}

async function sendToHeartbox() {
  updatePeriodUI();
  const text = buildShareText();
  try { await copyText(text); } catch (_) {}
  const url = `${HEARTBOX_URL}?from=crystalball&message=${encodeURIComponent(text)}`;
  showToast("心语已复制，正在带回 Heartbox。🌙");
  setTimeout(() => {
    window.open(url, "_blank", "noopener,noreferrer") || (window.location.href = url);
  }, 320);
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
saveWishButton.addEventListener("click", saveWish);
copySpiritButton.addEventListener("click", copyForSpirit);
sendHeartboxButton.addEventListener("click", sendToHeartbox);

updatePeriodUI();
renderPocket();
buildHearts(false);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js?v=1.1").catch(() => {});
  });
}
