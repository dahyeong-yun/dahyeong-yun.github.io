import sharp from 'sharp'
import { writeFileSync } from 'fs'
const N=[[50,7],[88,26],[84,68],[52,93],[14,74],[10,30],[52,34],[68,52],[46,64],[32,45],[62,73]]
const tris={ 'T-016':[0,1,6], 'T-167':[1,6,7], 'T-459':[4,5,9] }

// 삼각형을 기울기 그대로 두고 아이콘 상자에 맞춰 키운다
function fit(idx, pad=17){
  const p=idx.map(i=>N[i])
  const xs=p.map(q=>q[0]), ys=p.map(q=>q[1])
  const w=Math.max(...xs)-Math.min(...xs), h=Math.max(...ys)-Math.min(...ys)
  const s=(100-pad*2)/Math.max(w,h)
  const cx=(Math.min(...xs)+Math.max(...xs))/2, cy=(Math.min(...ys)+Math.max(...ys))/2
  return p.map(([x,y])=>[+(50+(x-cx)*s).toFixed(2), +(50+(y-cy)*s).toFixed(2)])
}
const poly=p=>p.map((q,i)=>(i?'L':'M')+q[0]+' '+q[1]).join('')+'Z'
const K='#000000', W='#ffffff'

const cands={}
for(const [name,idx] of Object.entries(tris)){
  const p=fit(idx)
  cands[name+' 채움'] = `<rect width="100" height="100" fill="${K}"/><path d="${poly(p)}" fill="${W}"/>`
  cands[name+' 채움+노드'] = `<rect width="100" height="100" fill="${K}"/><path d="${poly(p)}" fill="${W}"/>`
    + p.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="${K}"/><circle cx="${x}" cy="${y}" r="7" fill="none" stroke="${W}" stroke-width="4"/>`).join('')
  cands[name+' 선+노드'] = `<rect width="100" height="100" fill="${K}"/><path d="${poly(p)}" fill="none" stroke="${W}" stroke-width="8" stroke-linejoin="round"/>`
}
const wrap=i=>`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 100 100">${i}</svg>`
const names=Object.keys(cands), tiles=[], out={}
for(const n of names){
  const svg=wrap(cands[n]); writeFileSync(`tf-${n.replace(/[ +]/g,'_')}.svg`,svg)
  const s=await sharp(Buffer.from(svg)).resize(16,16).png().toBuffer()
  const b=await sharp(s).resize(160,160,{kernel:'nearest'}).png().toBuffer()
  out[n]={svg:cands[n], px16:'data:image/png;base64,'+b.toString('base64')}; tiles.push(b)
}
writeFileSync('trifav.json',JSON.stringify(out))
const S=160,G=10, COLS=3
await sharp({create:{width:(S+G)*COLS+G,height:(S+G)*3+G,channels:4,background:'#888'}})
  .composite(tiles.map((b,i)=>({input:b,left:G+(i%COLS)*(S+G),top:G+Math.floor(i/COLS)*(S+G)})))
  .png().toFile('trifav-sheet.png')
console.log('행 = 삼각형(016 / 167 / 459), 열 = 채움 · 채움+노드 · 선+노드')
console.log(names.join('\n'))
