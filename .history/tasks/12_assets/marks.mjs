import sharp from 'sharp'
import { writeFileSync } from 'fs'

const A = '#0066cc', W = '#ffffff'
const G = `<rect width="64" height="64" rx="14" fill="${A}"/>`

// 네 후보. 모두 "바탕 하나 + 도형 하나" 규칙을 지킨다.
const marks = {
  // A. 나이테 — 통나무 단면. 중심을 살짝 비틀어 과녁으로 읽히지 않게 한다.
  rings: G + `
    <g transform="translate(-1.5,1)">
      <circle cx="32" cy="32" r="4"    fill="${W}"/>
      <circle cx="32" cy="32" r="12.5" fill="none" stroke="${W}" stroke-width="5"/>
      <circle cx="32" cy="32" r="23"   fill="none" stroke="${W}" stroke-width="5"/>
    </g>`,

  // B. 아이소메트릭 큐브 — 한 덩어리, 세 얼굴.
  cube: G + `
    <path d="M32 7 L53.65 19.5 L53.65 44.5 L32 57 L10.35 44.5 L10.35 19.5 Z" fill="${W}"/>
    <path d="M32 32 L32 7 M32 32 L53.65 44.5 M32 32 L10.35 44.5"
          stroke="${A}" stroke-width="5" stroke-linecap="round"/>`,

  // C. 프리즘 — 하나의 빛이 여러 갈래로. 삼각형은 16px에서 가장 확실한 실루엣이다.
  prism: G + `<path d="M32 11 L55 51 L9 51 Z" fill="${W}"/>`,

  // D. 책갈피 — 기록(log)의 물건. 아래 V홈이 유일한 디테일.
  bookmark: G + `<path d="M19 11 H45 V53 L32 43.5 L19 53 Z" fill="${W}"/>`,
}

const wrap = (i) => `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${i}</svg>`

const out = {}
for (const [name, body] of Object.entries(marks)) {
  const svg = wrap(body)
  out[name] = { svg }
  for (const size of [16, 32]) {
    // 실제 크기로 줄인 뒤 픽셀 그대로 확대 — 뭉개지는 정도가 그대로 보인다
    const small = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()
    const big = await sharp(small).resize(192, 192, { kernel: 'nearest' }).png().toBuffer()
    out[name][`px${size}`] = 'data:image/png;base64,' + big.toString('base64')
  }
}
writeFileSync('marks.json', JSON.stringify(out))
console.log('생성 완료:', Object.keys(out).join(', '))
console.log('데이터 URI 크기(16px):', Object.entries(out).map(([k,v])=>`${k} ${(v.px16.length/1024).toFixed(1)}KB`).join(' · '))
