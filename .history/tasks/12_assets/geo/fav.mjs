import sharp from 'sharp'
import { writeFileSync } from 'fs'
const K='#000000', W='#ffffff'
const hexPts=(R,rot=-90)=>[...Array(6)].map((_,i)=>{const a=(rot+i*60)*Math.PI/180;return [50+R*Math.cos(a),50+R*Math.sin(a)]})
const P=hexPts(40).map(p=>p.map(v=>+v.toFixed(1)))
const poly=p=>p.map((q,i)=>(i?'L':'M')+q[0]+' '+q[1]).join('')+'Z'

// 축약형 후보 — 전부 검은 바탕 + 흰 도형
const cands = {
  // 1. 육각 외곽선 굵게, 한 변 없음, 노드 없음
  'hex-open': `<rect width="100" height="100" fill="${K}"/><path d="M${P[0]}L${P[1]}L${P[2]}L${P[3]}L${P[4]}L${P[5]}" stroke="${W}" stroke-width="9" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`,
  // 2. 속을 채운 육각형에서 안쪽 선을 파냄 (음각)
  'hex-solid-cut': `<rect width="100" height="100" fill="${K}"/><path d="${poly(P)}" fill="${W}"/><path d="M50 10L50 50L84 70M50 50L16 70" stroke="${K}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  // 3. 채운 육각형 + 모서리 하나 잘라냄
  'hex-solid-notch': `<rect width="100" height="100" fill="${K}"/><path d="${poly(P)}" fill="${W}"/><path d="M84 70L50 90L16 70Z" fill="${K}"/>`,
  // 4. 삼각 두 개 (B의 실루엣 축약)
  'shard': `<rect width="100" height="100" fill="${K}"/><path d="M50 10L86 34L62 52Z" fill="${W}"/><path d="M50 58L74 84L20 76Z" fill="${W}"/>`,
  // 5. 굵은 외곽선 + 큰 노드 셋
  'hex-nodes': `<rect width="100" height="100" fill="${K}"/><path d="M${P[0]}L${P[1]}L${P[2]}L${P[3]}L${P[4]}L${P[5]}Z" stroke="${W}" stroke-width="6" fill="none" stroke-linejoin="round"/><circle cx="${P[0][0]}" cy="${P[0][1]}" r="11" fill="${W}"/><circle cx="${P[2][0]}" cy="${P[2][1]}" r="11" fill="${W}"/><circle cx="${P[4][0]}" cy="${P[4][1]}" r="11" fill="${W}"/>`,
  // 6. 채운 육각 + 굵은 V 음각 (원본 A 의 중심 스포크 느낌)
  'hex-y': `<rect width="100" height="100" fill="${K}"/><path d="${poly(P)}" fill="${W}"/><path d="M50 48L50 14M50 48L82 66M50 48L18 66" stroke="${K}" stroke-width="9" stroke-linecap="round"/>`,
}
const wrap=i=>`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 100 100">${i}</svg>`
const names=Object.keys(cands), tiles=[], out={}
for(const n of names){
  const svg=wrap(cands[n]); writeFileSync(`fav-${n}.svg`,svg)
  const s=await sharp(Buffer.from(svg)).resize(16,16).png().toBuffer()
  const b=await sharp(s).resize(176,176,{kernel:'nearest'}).png().toBuffer()
  out[n]='data:image/png;base64,'+b.toString('base64'); tiles.push(b)
}
const S=176,G=12
await sharp({create:{width:(S+G)*names.length+G,height:S+G*2,channels:4,background:'#888'}})
  .composite(tiles.map((b,i)=>({input:b,left:G+i*(S+G),top:G}))).png().toFile('fav-sheet16.png')
writeFileSync('fav16.json',JSON.stringify(out))
console.log(names.join(' · '))
