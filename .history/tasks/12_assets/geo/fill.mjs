import sharp from 'sharp'
import { writeFileSync } from 'fs'
const N=[[50,7],[88,26],[84,68],[52,93],[14,74],[10,30],[52,34],[68,52],[46,64],[32,45],[62,73]]
function fit(idx,pad=17){
  const p=idx.map(i=>N[i]), xs=p.map(q=>q[0]), ys=p.map(q=>q[1])
  const w=Math.max(...xs)-Math.min(...xs), h=Math.max(...ys)-Math.min(...ys)
  const s=(100-pad*2)/Math.max(w,h)
  const cx=(Math.min(...xs)+Math.max(...xs))/2, cy=(Math.min(...ys)+Math.max(...ys))/2
  return p.map(([x,y])=>[+(50+(x-cx)*s).toFixed(2),+(50+(y-cy)*s).toFixed(2)])
}
const poly=p=>p.map((q,i)=>(i?'L':'M')+q[0]+' '+q[1]).join('')+'Z'
const T=fit([1,6,7])
const opts={
  '흰 삼각 / 검은 바탕': `<rect width="100" height="100" fill="#000"/><path d="${poly(T)}" fill="#fff"/>`,
  '파랑 삼각 / 검은 바탕': `<rect width="100" height="100" fill="#000"/><path d="${poly(T)}" fill="#0a84ff"/>`,
  '검은 삼각 / 흰 바탕': `<rect width="100" height="100" fill="#fff"/><path d="${poly(T)}" fill="#111"/>`,
  '파랑 삼각 / 흰 바탕': `<rect width="100" height="100" fill="#fff"/><path d="${poly(T)}" fill="#0066cc"/>`,
}
const wrap=i=>`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 100 100">${i}</svg>`
const names=Object.keys(opts), tiles=[], out={}
for(const n of names){
  const svg=wrap(opts[n])
  const s=await sharp(Buffer.from(svg)).resize(16,16).png().toBuffer()
  const b=await sharp(s).resize(170,170,{kernel:'nearest'}).png().toBuffer()
  out[n]={inner:opts[n], px16:'data:image/png;base64,'+b.toString('base64')}; tiles.push(b)
}
out.__T__=T
writeFileSync('fill.json',JSON.stringify(out))
const S=170,G=10
await sharp({create:{width:(S+G)*4+G,height:S+G*2,channels:4,background:'#888'}})
  .composite(tiles.map((b,i)=>({input:b,left:G+i*(S+G),top:G}))).png().toFile('fill-sheet.png')
console.log(names.join(' · '))
console.log('삼각형 좌표', JSON.stringify(T))
