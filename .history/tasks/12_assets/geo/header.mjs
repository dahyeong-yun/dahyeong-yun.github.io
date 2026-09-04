import sharp from 'sharp'
const N=[[50,7],[88,26],[84,68],[52,93],[14,74],[10,30],[52,34],[68,52],[46,64],[32,45],[62,73]]
const E=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[6,9],[9,4],[6,7],[7,8],[8,9],
         [1,7],[7,10],[10,3],[8,10],[5,9],[6,1]]
const TRI='M83 26.17L17 40.83L46.33 73.83Z'
const triNodes=[1,6,7]
const poly=p=>p.map((q,i)=>(i?'L':'M')+q[0]+' '+q[1]).join('')+'Z'
const edges=E.map(([a,b])=>`M${N[a][0]} ${N[a][1]}L${N[b][0]} ${N[b][1]}`).join('')

// 헤더 배경 위에 얹어 본다. 라이트=#fafafa, 다크=#0c0c0e
function lattice(line,bg,acc){
  return `<path d="${poly(triNodes.map(i=>N[i]))}" fill="${acc}"/>`
   +`<path d="${edges}" stroke="${line}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
   +N.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="${bg}" stroke="${line}" stroke-width="2.2"/>`).join('')
}
const rows=[
  {name:'라이트', bg:'#fafafa', line:'#1d1d1f', acc:'#0066cc'},
  {name:'다크',   bg:'#0c0c0e', line:'#f5f5f7', acc:'#0a84ff'},
]
const sizes=[24,28,32]
const tiles=[]
for(const r of rows){
  for(const s of sizes){
    // 격자형
    tiles.push(await sharp(Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 100 100">${lattice(r.line,r.bg,r.acc)}</svg>`))
      .resize(s,s).extend({top:(56-s)>>1,bottom:(56-s+1)>>1,left:16,right:16,background:r.bg})
      .resize(120,120,{fit:'contain',background:r.bg,kernel:'nearest'}).png().toBuffer())
  }
  for(const s of sizes){
    // 삼각형만
    tiles.push(await sharp(Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 100 100"><path d="${TRI}" fill="${r.acc}"/></svg>`))
      .resize(s,s).extend({top:(56-s)>>1,bottom:(56-s+1)>>1,left:16,right:16,background:r.bg})
      .resize(120,120,{fit:'contain',background:r.bg,kernel:'nearest'}).png().toBuffer())
  }
}
const S=120,G=8,COLS=6
await sharp({create:{width:(S+G)*COLS+G,height:(S+G)*2+G,channels:4,background:'#888'}})
  .composite(tiles.map((b,i)=>({input:b,left:G+(i%COLS)*(S+G),top:G+Math.floor(i/COLS)*(S+G)})))
  .png().toFile('header-sheet.png')
console.log('행: 라이트 / 다크    열: 격자 24·28·32  |  삼각 24·28·32')
