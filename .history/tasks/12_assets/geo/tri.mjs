const N=[[50,7],[88,26],[84,68],[52,93],[14,74],[10,30],[52,34],[68,52],[46,64],[32,45],[62,73]]
const E=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[6,9],[9,4],[6,7],[7,8],[8,9],
         [1,7],[7,10],[10,3],[8,10],[5,9],[6,1]]
const has=(a,b)=>E.some(([x,y])=>(x===a&&y===b)||(x===b&&y===a))
const area=(p,q,r)=>Math.abs((q[0]-p[0])*(r[1]-p[1])-(r[0]-p[0])*(q[1]-p[1]))/2
const tris=[]
for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++)for(let k=j+1;k<N.length;k++)
  if(has(i,j)&&has(j,k)&&has(i,k)) tris.push([i,j,k])
// 각 삼각형이 마크 안에서 얼마나 크고 중앙에 있는지
console.log('삼각형 개수:', tris.length, '\n')
for(const t of tris){
  const p=t.map(i=>N[i])
  const cx=(p[0][0]+p[1][0]+p[2][0])/3, cy=(p[0][1]+p[1][1]+p[2][1])/3
  const d=Math.hypot(cx-50,cy-50)
  // 세 변 길이로 뾰족한 정도 확인 (가장 짧은 변 / 가장 긴 변)
  const L=[Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]),
           Math.hypot(p[1][0]-p[2][0],p[1][1]-p[2][1]),
           Math.hypot(p[2][0]-p[0][0],p[2][1]-p[0][1])].sort((a,b)=>a-b)
  console.log(`노드 ${t.join('-').padEnd(8)} 넓이 ${area(...p).toFixed(0).padStart(4)}  중심거리 ${d.toFixed(0).padStart(2)}  납작함 ${(L[0]/L[2]).toFixed(2)}`)
}
