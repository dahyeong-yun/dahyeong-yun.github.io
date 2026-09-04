import sharp from 'sharp'
import { writeFileSync } from 'fs'
const A='#0066cc', W='#ffffff'
const G=`<rect width="64" height="64" rx="14" fill="${A}"/>`

const finalists = {
  prism:    G+`<path d="M32 11 L55 51 L9 51 Z" fill="${W}"/>`,
  bookmark: G+`<path d="M19 11 H45 V53 L32 43.5 L19 53 Z" fill="${W}"/>`,
  rings:    G+`<g fill="none" stroke="${W}" stroke-width="5.5">
      <ellipse cx="37" cy="28" rx="4.5" ry="3.5" fill="${W}" stroke="none"/>
      <ellipse cx="33" cy="31" rx="21" ry="18.5"/></g>`,
}
// 탈락작 — 기록용
const rejected = {
  cube: G+`<path d="M32 6 L54.5 19 L54.5 45 L32 58 L9.5 45 L9.5 19 Z" fill="${W}"/><path d="M32 32 V6 M32 32 L54.5 45 M32 32 L9.5 45" stroke="${A}" stroke-width="3" stroke-linecap="round"/>`,
}
const wrap=i=>`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${i}</svg>`
const out={}
for(const [n,body] of Object.entries({...finalists,...rejected})){
  const svg=wrap(body)
  const s=await sharp(Buffer.from(svg)).resize(16,16).png().toBuffer()
  const b=await sharp(s).resize(160,160,{kernel:'nearest'}).png().toBuffer()
  out[n]={ body, px16:'data:image/png;base64,'+b.toString('base64') }
}
writeFileSync('final.json',JSON.stringify(out))
console.log(Object.entries(out).map(([k,v])=>`${k} ${(v.px16.length/1024).toFixed(1)}KB`).join(' · '))
