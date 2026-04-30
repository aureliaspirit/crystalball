# 心心水晶球给 Spirit 的开发地图

这份是下一版添内容用的小地图。当前版本重点是保留水晶球视觉，只把 PWA 外壳、图标、缓存和交接说明补齐。

## 先看这里

- `index.html`：页面结构、标题、版本号、主屏幕/PWA 标签。
- `app.js`：按钮逻辑、心语池、小回声池、复制给 Spirit 文案、service worker 注册版本。
- `style.css`：水晶球视觉和排版。除非特意要改球，请先不动核心视觉块。
- `manifest.json`：主屏幕安装信息。
- `service-worker.js`：离线缓存和版本更新。

## 添内容的位置

### 心语

在 `app.js` 里找：

```js
const wishes = [
```

这里每一行是一条“收一条心语”会抽到的内容。直接追加新字符串即可。

### 水晶球小回声

在 `app.js` 里找：

```js
const fortunes = [
```

这里每一行是点“轻轻摇一摇”时水晶球上方会出现的小回声。可以包含 `<br>` 做换行。

### 内容数量

页面上的“心语小池”数量来自代码自动计算：

```js
poolSummary.textContent = `现在有 ${wishes.length} 条心语 · ${fortunes.length} 条小回声。`;
```

添完内容后不用手动改数量。

## 版本更新清单

每次发新版本时，建议同步改这些地方：

- `index.html`：`manifest.json?v=...`、`style.css?v=...`、顶部 `Crystal Heart Globe · v...`、`app.js?v=...`
- `app.js`：复制文案里的版本号、`service-worker.js?v=...`
- `service-worker.js`：`CACHE_NAME` 和预缓存文件里的 `?v=...`
- `manifest.json`：description 里的版本说明
- `README.md`：标题和更新记录

## 尽量别动的视觉块

现在的球体视觉效果已经确认保留。若只是添内容，建议不要改这些 CSS 区域：

- `.globe-wrap`
- `.crystal-glow`
- `.globe`
- `.globe-stand`
- `.heart`
- `@keyframes floatHeart`

## 发版前检查

在 `crystalball` 文件夹里跑：

```bash
node --check app.js
node --check service-worker.js
python -m json.tool manifest.json
```

然后本地打开 `index.html`，确认：

- 水晶球视觉没变形。
- “轻轻摇一摇”和“收一条心语”都能动。
- “复制给 Spirit”能复制最新版本号。
- “刷新水晶球”能刷新并清掉旧 service worker。
