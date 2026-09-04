import sharp from 'sharp'
import { writeFileSync } from 'fs'
const A='#0066cc', W='#ffffff'
const G=`<rect width="64" height="64" rx="14" fill="${A}"/>`
const HEX='M32 6 L54.5 19 L54.5 45 L32 58 L9.5 45 L9.5 19 Z'

const v = {
  // 큐브: 가르는 선을 얇게 → 16px에서는 육각 덩어리, 32px부터 입체가 드러난다
  'cube-sw3':   G+`<path d="${HEX}" fill="${W}"/><path d="M32 32 V6 M32 32 L54.5 45 M32 32 L9.5 45" stroke="${A}" stroke-width="3" stroke-linecap="round"/>`,
  'cube-sw2':   G+`<path d="${HEX}" fill="${W}"/><path d="M32 32 V6 M32 32 L54.5 45 M32 32 L9.5 45" stroke="${A}" stroke-width="2" stroke-linecap="round"/>`,
  // 나이테: 편심을 크게 주고 타원으로 → 과녁이 아니라 나무 단면으로
  'rings-ecc':  G+`<g fill="none" stroke="${W}" stroke-width="4.5">
      <ellipse cx="35" cy="30" rx="4" ry="3.2" fill="${W}" stroke="none"/>
      <ellipse cx="33.5" cy="31" rx="12" ry="10.5"/>
      <ellipse cx="32" cy="32" rx="22" ry="20"/></g>`,
  // 나이테: 링 두 개만, 편심 최대
  'rings-2':    G+`<g fill="none" stroke="${W}" stroke-width="5.5">
      <ellipse cx="37" cy="28" rx="4.5" ry="3.5" fill="${W}" stroke="none"/>
      <ellipse cx="33" cy="31" rx="21" ry="18.5"/></g>`,
  // 프리즘: 큰 크기용 분광선을 넣으면 16px에서 어떻게 되는지 확인
  'prism-beam': G+`<path d="M32 11 L55 51 L9 51 Z" fill="${W}"/><path d="M4 30 H20 M44 38 H60 M44 44 H60" stroke="${W}" stroke-width="3"/>`,
}
const wrap=i=>`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${i}</svg>`
const names=Object.keys(v)
const tiles=[]
const out={}
for(const n of names){
  const svg=wrap(v[n]); out[n]={svg}
  const s=await sharp(Buffer.from(svg)).resize(16,16).png().toBuffer()
  const b=await sharp(s).resize(192,192,{kernel:'nearest'}).png().toBuffer()
  out[n].px16='data:image/png;base64,'+b.toString('base64')
  tiles.push(b)
}
const SZ=192,GAP=16
await sharp({create:{width:SZ*names.length+GAP*(names.length+1),height:SZ+GAP*2,channels:4,background:'#dddddd'}})
  .composite(tiles.map((b,i)=>({input:b,left:GAP+i*(SZ+GAP),top:GAP}))).png().toFile('sheet16-pass2.png')
writeFileSync('marks-pass2.json',JSON.stringify(out))
console.log('좌→우: '+names.join(', '))
