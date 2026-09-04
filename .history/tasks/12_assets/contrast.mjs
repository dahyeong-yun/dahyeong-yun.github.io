const hex=h=>{h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))}
const lin=c=>{c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)}
const L=h=>{const[r,g,b]=hex(h);return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)}
const ratio=(a,b)=>{const l1=L(a),l2=L(b);const[hi,lo]=l1>l2?[l1,l2]:[l2,l1];return (hi+0.05)/(lo+0.05)}
const cands={
  '현재 파랑':      {light:'#0066cc', dark:'#0a84ff'},
  '인디고':        {light:'#4f46e5', dark:'#a5a0ff'},
  '딥 틸':         {light:'#0f766e', dark:'#2dd4bf'},
  '테라코타':      {light:'#b03a1f', dark:'#ff8a65'},
  '포레스트':      {light:'#2c6e49', dark:'#57d98a'},
}
for(const[n,v]of Object.entries(cands)){
  const w=ratio(v.light,'#ffffff'), k=ratio(v.dark,'#000000')
  // 다크모드 본문 배경은 순검정, 헤더는 #0c0c0e
  console.log(`${n.padEnd(8)} light ${v.light} on #fff = ${w.toFixed(2)}:1 ${w>=4.5?'AA':'✗'}   dark ${v.dark} on #000 = ${k.toFixed(2)}:1 ${k>=4.5?'AA':'✗'}`)
}
