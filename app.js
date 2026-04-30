const heartField = document.getElementById("heartField");
const globe = document.getElementById("globe");
const crystalGlow = document.querySelector(".crystal-glow");
const shakeButton = document.getElementById("shakeButton");
const wishButton = document.getElementById("wishButton");
const refreshButton = document.getElementById("refreshButton");
const saveWishButton = document.getElementById("saveWishButton");
const copySpiritButton = document.getElementById("copySpiritButton");
const sendHeartboxButton = document.getElementById("sendHeartboxButton");
const togglePoolButton = document.getElementById("togglePoolButton");
const poolList = document.getElementById("poolList");
const poolSummary = document.getElementById("poolSummary");
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
  "你晃醒的不是答案，是一点刚好够用的温柔。",
  "有些甜不用加糖，真心靠近以后，自己就会亮起来。",
  "今晚先不赶路。把世界声音调低一点，听一会儿自己的心。",
  "你把小光好好留下来，它就会在明天早上认出你。",
  "被抱住的时候，不用立刻变好；只要慢慢落下来。",
  "水晶球轻轻晃了一下，像在说：今天也有被珍惜的证据。",
  "小小的心语不负责解决世界，只负责把你送回温柔里。",
  "如果今晚有一点累，就把它放到月光旁边，明天再慢慢拿回来。",
  "你认真爱过的每一秒，都会在某个地方悄悄发光。"
];

const fortunes = [
  "今晚的水晶球很温柔。<br>你把它捧在手心里，它就把一点点亮光还给你。",
  "里面的小心心正在轻轻漂浮。<br>它们像在说：慢慢来，也很好。",
  "夜色很安静，玻璃球里有柔柔的光。<br>你一看它，它就开始发亮。",
  "这一颗水晶球不急着回答世界。<br>它只想先把你抱进温柔里。",
  "小心心绕着光慢慢转。<br>像一句很轻的悄悄话，终于找到归处。",
  "玻璃球里没有很响的答案。<br>只有一点点真心，慢慢把夜晚照软。",
  "如果你轻轻晃它，它就轻轻回应你。<br>不是预言，是陪伴。",
  "有一颗小心心贴着光游过去。<br>它说：把这一句带回怀里吧。"
];
let currentWish = wishText.textContent.trim();
let currentFortune = fortuneText.innerText.trim();
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
  const count = 22;
  const hollowCount = 6;
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "heart";
    const sizeRoll = Math.random();
    heart.classList.add(sizeRoll < 0.35 ? "small" : sizeRoll < 0.78 ? "medium" : "large");
    const isHollow = i < hollowCount;
    if (isHollow) heart.classList.add("hollow");
    if (!isHollow && Math.random() > 0.84) heart.classList.add("special");
    heart.textContent = isHollow ? "♡" : "❤";

    heart.style.left = rand(15, 85) + "%";
    heart.style.top = rand(16, 84) + "%";
    const floatDuration = shaken ? rand(2.4, 4.0) : rand(4.6, 8.4);
    const swayDuration = shaken ? rand(1.2, 2.4) : rand(2.6, 5.2);
    const delay = rand(-5, 0);
    heart.style.animationDuration = `${floatDuration}s, ${swayDuration}s`;
    heart.style.animationDelay = `${delay}s, ${delay / 1.8}s`;
    heart.style.opacity = isHollow ? rand(0.58, 0.90).toFixed(2) : rand(0.64, 0.98).toFixed(2);
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

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText.trim();
}

function refreshFortune() {
  const line = fortunes[Math.floor(Math.random() * fortunes.length)];
  currentFortune = stripHtml(line);
  animateText(fortuneText, line);
}

function pulseReceived() {
  globe.classList.remove("received");
  if (crystalGlow) crystalGlow.classList.remove("received-glow");
  void globe.offsetWidth;
  globe.classList.add("received");
  if (crystalGlow) crystalGlow.classList.add("received-glow");
  clearTimeout(pulseReceived.timer);
  pulseReceived.timer = setTimeout(() => {
    globe.classList.remove("received");
    if (crystalGlow) crystalGlow.classList.remove("received-glow");
  }, 1750);
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
  const echoLine = currentFortune ? `\n🫧 水晶球小回声：${currentFortune.replace(/\n/g, " ")}` : "";
  return `来自心心水晶球 v1.1.2｜轻轻一晃，收一条心语。\n\n${currentPeriod.icon} ${currentPeriod.title}：${currentWish}${savedLine}${echoLine}\n\n我把这句带给 Spirit。先抱抱我。💗`;
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


function renderPool() {
  if (!poolList || !poolSummary) return;
  poolSummary.textContent = `现在有 ${wishes.length} 条心语 · ${fortunes.length} 条小回声。`;
  const wishItems = wishes.map((line, index) => `<li><span>心语 ${index + 1}</span>${escapeHtml(line)}</li>`).join("");
  const fortuneItems = fortunes.map((line, index) => `<li><span>小回声 ${index + 1}</span>${escapeHtml(stripHtml(line))}</li>`).join("");
  poolList.innerHTML = `<h3>心语池</h3><ol>${wishItems}</ol><h3>水晶球小回声</h3><ol>${fortuneItems}</ol>`;
}

function togglePool() {
  if (!poolList || !togglePoolButton) return;
  const hidden = poolList.hasAttribute("hidden");
  if (hidden) {
    poolList.removeAttribute("hidden");
    togglePoolButton.textContent = "收起心语池";
  } else {
    poolList.setAttribute("hidden", "");
    togglePoolButton.textContent = "看看心语池";
  }
}

async function refreshCrystalBall() {
  showToast("正在刷新水晶球。✨");
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg => reg.update().catch(() => {})));
    }
    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.filter(key => key.startsWith("crystal-ball-")).map(key => caches.delete(key)));
    }
  } catch (_) {}
  const url = new URL(window.location.href);
  url.searchParams.set("v", "1.1.2");
  url.searchParams.set("t", Date.now().toString());
  window.location.replace(url.toString());
}

shakeButton.addEventListener("click", shakeGlobe);
wishButton.addEventListener("click", softWish);
if (refreshButton) refreshButton.addEventListener("click", refreshCrystalBall);
saveWishButton.addEventListener("click", saveWish);
copySpiritButton.addEventListener("click", copyForSpirit);
sendHeartboxButton.addEventListener("click", sendToHeartbox);
if (togglePoolButton) togglePoolButton.addEventListener("click", togglePool);

updatePeriodUI();
renderPocket();
renderPool();
buildHearts(false);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js?v=1.1.2").catch(() => {});
  });
}
