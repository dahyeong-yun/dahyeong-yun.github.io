import sharp from 'sharp'
import { writeFileSync } from 'fs'
const hex=(R,rot=-90)=>[...Array(6)].map((_,i)=>{const a=(rot+i*60)*Math.PI/180;return [50+R*Math.cos(a),50+R*Math.sin(a)]})

// A — 깨진 이십면체 (유지)
const A=[[...hex(42),...hex(19,-60),[50,50]],[
  [0,1],[1,2],[2,3],[4,5],[5,0],[6,7],[7,8],[8,9],[10,11],
  [0,11],[0,6],[1,6],[1,7],[2,7],[2,8],[3,8],[3,9],[4,9],[4,10],[5,10],[5,11],
  [12,6],[12,8],[12,10]]]

// B — 비대칭 성좌 (유지)
const B=[[[50,7],[88,26],[84,68],[52,93],[14,74],[10,30],[52,34],[68,52],[46,64],[32,45],[62,73]],[
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[6,9],[9,4],[6,7],[7,8],[8,9],
  [1,7],[7,10],[10,3],[8,10],[5,9],[6,1]]]

// C' — 열린 프레임. 오른쪽 위 한 모서리가 통째로 없어 형태가 트여 있다.
const C=[[[50,8],[87,29],[87,71],[50,92],[13,71],[13,29],[50,30],[69,50],[50,70],[31,50]],[
  [1,2],[2,3],[3,4],[4,5],[5,0],
  [0,6],[5,9],[4,9],[3,8],[2,7],
  [6,9],[9,8],[8,7],
  [0,9],[3,9],[2,8]]]

// D' — 파편. 예각 위주로 비대칭. 아래쪽이 열려 있다.
const D=[[[50,6],[86,34],[74,78],[26,72],[16,36],[54,40],[40,58],[66,56]],[
  [0,1],[1,2],[2,3],[4,0],
  [0,5],[1,5],[1,7],[2,7],[3,6],[4,6],[4,5],
  [5,7],[5,6],[6,7],[3,7]]]

const sets={A,B,C,D}
function draw(nodes,edges,{stroke,fill,sw=1.8,r=2.6,size=300}){
  const E=edges.map(([a,b])=>`M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`).join('')
  const N=nodes.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100"><rect width="100" height="100" fill="${fill}"/><path d="${E}" stroke="${stroke}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>${N}</svg>`
}
const tiles=[]
for(const [k,[n,e]] of Object.entries(sets)){
  const l=draw(n,e,{stroke:'#111',fill:'#fff'}), d=draw(n,e,{stroke:'#fff',fill:'#000'})
  writeFileSync(`${k}2-light.svg`,l); writeFileSync(`${k}2-dark.svg`,d)
  tiles.push(await sharp(Buffer.from(l)).png().toBuffer())
  tiles.push(await sharp(Buffer.from(d)).png().toBuffer())
}
const S=300,G=10
await sharp({create:{width:(S+G)*4+G,height:(S+G)*2+G,channels:4,background:'#888'}})
  .composite(tiles.map((b,i)=>({input:b,left:G+Math.floor(i/2)*(S+G),top:G+(i%2)*(S+G)}))).png().toFile('geo-sheet2.png')
console.log('A · B · C′ · D′')
