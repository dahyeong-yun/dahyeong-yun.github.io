import sharp from 'sharp'
import { writeFileSync } from 'fs'

// 100×100 좌표계. 노드는 [x,y], 엣지는 노드 인덱스 쌍.
const hex = (R, rot=-90) => [...Array(6)].map((_,i)=>{
  const a=(rot+i*60)*Math.PI/180
  return [50+R*Math.cos(a), 50+R*Math.sin(a)]
})

// A — 깨진 이십면체. 참조 이미지에 가장 가깝되 엣지를 덜어냈다.
const A_n = [...hex(42), ...hex(19,-60), [50,50]]
const A_e = [
  [0,1],[1,2],[2,3],[4,5],[5,0],            // 외곽: 3-4 구간 없음
  [6,7],[7,8],[8,9],[10,11],                 // 내곽: 9-10, 11-6 없음
  [0,11],[0,6],[1,6],[1,7],[2,7],[2,8],
  [3,8],[3,9],[4,9],[4,10],[5,10],[5,11],
  [12,6],[12,8],[12,10],                     // 중심 스포크 셋만
]
// B — 비대칭 성좌. 정다각형이 아니라 일부러 흐트러뜨렸다.
const B_n = [
  [50,7],[88,26],[84,68],[52,93],[14,74],[10,30],
  [52,34],[68,52],[46,64],[32,45],[62,73],
]
const B_e = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],
  [0,6],[6,9],[9,4],[6,7],[7,8],[8,9],
  [1,7],[7,10],[10,3],[8,10],[5,9],[6,1],
]
// C — 열린 프레임. 외곽 한 변이 통째로 비고 노드 하나가 바깥에 떠 있다.
const C_n = [...hex(42), ...hex(21,-60), [50,50], [50,50]]
C_n[12] = [70,20]
const C_e = [
  [0,1],[1,2],[2,3],[3,4],[5,0],
  [6,7],[8,9],[9,10],[11,6],
  [0,6],[1,7],[2,8],[3,9],[4,10],[5,11],
  [7,9],[9,11],[11,7],
  [12,0],[12,1],
]
// D — 삼각분할 마름모. 각이 가장 날카롭다.
const D_n = [
  [50,6],[92,50],[50,94],[8,50],
  [50,30],[68,50],[50,70],[32,50],[50,50],
]
const D_e = [
  [0,1],[1,2],[2,3],[3,0],
  [0,4],[1,5],[2,6],[3,7],
  [4,5],[5,6],[7,4],
  [8,4],[8,6],[8,7],[0,7],[1,6],
]

const sets = { A:[A_n,A_e], B:[B_n,B_e], C:[C_n,C_e], D:[D_n,D_e] }

function draw(nodes, edges, { stroke, fill, sw=1.8, r=2.6, size=300 }) {
  const E = edges.map(([a,b])=>`M${nodes[a][0].toFixed(2)} ${nodes[a][1].toFixed(2)}L${nodes[b][0].toFixed(2)} ${nodes[b][1].toFixed(2)}`).join('')
  const N = nodes.map(([x,y])=>`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">`
    + `<rect width="100" height="100" fill="${fill}"/>`
    + `<path d="${E}" stroke="${stroke}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`
    + N + `</svg>`
}

const tiles = []
for (const [k,[n,e]] of Object.entries(sets)) {
  const light = draw(n,e,{stroke:'#111111', fill:'#ffffff'})
  const dark  = draw(n,e,{stroke:'#ffffff', fill:'#000000'})
  writeFileSync(`${k}-light.svg`, light)
  writeFileSync(`${k}-dark.svg`, dark)
  tiles.push(await sharp(Buffer.from(light)).png().toBuffer())
  tiles.push(await sharp(Buffer.from(dark)).png().toBuffer())
}
const S=300, G=10
await sharp({create:{width:(S+G)*4+G, height:(S+G)*2+G, channels:4, background:'#888888'}})
  .composite(tiles.map((b,i)=>({input:b, left:G+Math.floor(i/2)*(S+G), top:G+(i%2)*(S+G)})))
  .png().toFile('geo-sheet.png')
console.log('A · B · C · D  (위=흰바탕, 아래=검은바탕)')
