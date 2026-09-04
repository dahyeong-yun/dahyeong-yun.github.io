// Polymorlog 아이콘 생성기 — public/ 의 네 파일을 만든다.
// 레포 루트에서 실행:  node .history/tasks/12_assets/build-icons.mjs
//
// 마크는 "기울어진 결정(B)". 꼭짓점 11개를 선으로 이은 불완전한 격자이고,
// 그 안의 삼각형 하나(노드 1-6-7)만 파랑으로 채운다.
// 채운 그 삼각형을 떼어내 기울기 그대로 키운 것이 파비콘이다.
import sharp from 'sharp'
import { writeFileSync } from 'fs'

const BG = '#000000'   // 탭 줄이 대체로 밝은 회색이라 검은 바탕이 가장 빨리 찾힌다
const LINE = '#ffffff'
const TRI = '#0a84ff'  // 다크 배경용 강조색. 라이트용 #0066cc 는 검정 위에서 3.8:1 로 탁하다

// ── 마크 좌표 (100×100) ──────────────────────────────────
const N = [[50,7],[88,26],[84,68],[52,93],[14,74],[10,30],
           [52,34],[68,52],[46,64],[32,45],[62,73]]
const E = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],
           [0,6],[6,9],[9,4],[6,7],[7,8],[8,9],
           [1,7],[7,10],[10,3],[8,10],[5,9],[6,1]]
const TRI_NODES = [1,6,7]

// 삼각형을 기울기 그대로 아이콘 상자에 맞춰 키운다.
// 각도를 바로 세우면 흔한 삼각형이 되므로 회전은 주지 않는다.
function fitTriangle(idx, pad = 17) {
  const p = idx.map(i => N[i])
  const xs = p.map(q => q[0]), ys = p.map(q => q[1])
  const w = Math.max(...xs) - Math.min(...xs)
  const h = Math.max(...ys) - Math.min(...ys)
  const s = (100 - pad * 2) / Math.max(w, h)
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2
  return p.map(([x, y]) => [+(50 + (x - cx) * s).toFixed(2), +(50 + (y - cy) * s).toFixed(2)])
}
const poly = p => p.map((q, i) => (i ? 'L' : 'M') + q[0] + ' ' + q[1]).join('') + 'Z'
const TRI_PATH = poly(fitTriangle(TRI_NODES))

/** 파비콘: 검은 바탕 + 파란 삼각형 하나. 안쪽 디테일 없음 —
 *  16px 에서 도형 안을 가르는 시도는 네 번 다 실패했다. */
const faviconSvg = () =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="${BG}"/>
  <path d="${TRI_PATH}" fill="${TRI}"/>
</svg>`

/** 전체 마크: 채운 삼각형 + 격자 선 + 노드 */
function markSvg(scale = 1, sw = 1.8, r = 2.6) {
  const edges = E.map(([a, b]) => `M${N[a][0]} ${N[a][1]}L${N[b][0]} ${N[b][1]}`).join('')
  const nodes = N.map(([x, y]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${BG}" stroke="${LINE}" stroke-width="${sw}"/>`).join('')
  return `<path d="${poly(TRI_NODES.map(i => N[i]))}" fill="${TRI}"/>`
       + `<path d="${edges}" stroke="${LINE}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`
       + nodes
}

// ── ICO 인코더 ───────────────────────────────────────────
// sharp 는 .ico 를 못 쓴다. PNG 를 그대로 담는 ICO 로 조립한다(모던 브라우저 지원).
function buildIco(pngs) {
  const n = pngs.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(n, 4)
  let offset = 6 + n * 16
  const dir = [], body = []
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt8(0, 2); e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6)
    e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12)
    offset += buf.length
    dir.push(e); body.push(buf)
  }
  return Buffer.concat([header, ...dir, ...body])
}

// ── 생성 ─────────────────────────────────────────────────
const fav = Buffer.from(faviconSvg())

// 1. favicon.svg — 최신 브라우저가 우선한다
writeFileSync('public/favicon.svg', faviconSvg())

// 2. favicon.ico — 16/32/48 세 크기
const icoPngs = []
for (const size of [16, 32, 48]) {
  icoPngs.push({ size, buf: await sharp(fav).resize(size, size).png().toBuffer() })
}
writeFileSync('public/favicon.ico', buildIco(icoPngs))

// 3. apple-touch-icon.png — 180×180.
//    iOS 가 모서리를 알아서 깎으므로 여기서는 사각 그대로 둔다.
await sharp(fav).resize(180, 180).png().toFile('public/apple-touch-icon.png')

// 4. og-default.png — 1200×630 공유 카드
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <g transform="translate(96,175) scale(2.4)">${markSvg()}</g>
  <text x="400" y="286" font-family="SF Pro Display, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="84" font-weight="700" fill="${LINE}" letter-spacing="-2">Polymorlog</text>
  <text x="400" y="344" font-family="Apple SD Gothic Neo, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="34" fill="#8e8e93">개발, 성장, 회고를 기록합니다.</text>
  <text x="400" y="420" font-family="SF Pro Text, Helvetica Neue, Helvetica, Arial, sans-serif"
        font-size="28" fill="${TRI}">dahyeong-yun.github.io</text>
</svg>`
await sharp(Buffer.from(og)).png().toFile('public/og-default.png')

console.log('생성 완료')
console.log('  public/favicon.svg')
console.log('  public/favicon.ico          16 · 32 · 48')
console.log('  public/apple-touch-icon.png 180×180')
console.log('  public/og-default.png       1200×630')
