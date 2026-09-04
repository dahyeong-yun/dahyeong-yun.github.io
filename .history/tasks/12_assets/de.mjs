const hex=h=>{h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))}
const f=t=>t>0.008856?Math.cbrt(t):(7.787*t)+16/116
function lab(h){let[r,g,b]=hex(h).map(v=>{v/=255;return v>0.04045?Math.pow((v+0.055)/1.055,2.4):v/12.92})
 let X=(r*0.4124+g*0.3576+b*0.1805)/0.95047,Y=r*0.2126+g*0.7152+b*0.0722,Z=(r*0.0193+g*0.1192+b*0.9505)/1.08883
 return [116*f(Y)-16,500*(f(X)-f(Y)),200*(f(Y)-f(Z))]}
const dE=(a,b)=>{const A=lab(a),B=lab(b);return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2])}
console.log('테라코타 #b03a1f vs --color-error #b3402f :', dE('#b03a1f','#b3402f').toFixed(1))
console.log('포레스트 #2c6e49 vs --color-success #1a7a38:', dE('#2c6e49','#1a7a38').toFixed(1))
console.log('딥틸    #0f766e vs --color-success #1a7a38:', dE('#0f766e','#1a7a38').toFixed(1))
console.log('인디고  #4f46e5 vs --color-error   #b3402f:', dE('#4f46e5','#b3402f').toFixed(1))
console.log('현재파랑 #0066cc vs --color-error  #b3402f:', dE('#0066cc','#b3402f').toFixed(1))
console.log('--- 대안 검토 ---')
console.log('버-nt 오렌지 #c2410c vs error #b3402f:', dE('#c2410c','#b3402f').toFixed(1))
console.log('머스터드/황토 #a16207 vs warning #c99a10:', dE('#a16207','#c99a10').toFixed(1))
