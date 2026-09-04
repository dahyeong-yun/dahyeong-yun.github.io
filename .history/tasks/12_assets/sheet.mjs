import sharp from 'sharp'
import { readFileSync } from 'fs'
const m = JSON.parse(readFileSync('marks.json','utf8'))
const names = ['rings','cube','prism','bookmark']
// 16px 확대본을 가로로 이어 붙여 한 장으로 본다
const tiles = names.map(n => Buffer.from(m[n].px16.split(',')[1], 'base64'))
const W = 192, GAP = 16
const canvas = sharp({ create: { width: W*4 + GAP*5, height: W + GAP*2, channels: 4, background: '#dddddd' } })
await canvas.composite(tiles.map((b,i)=>({ input: b, left: GAP + i*(W+GAP), top: GAP }))).png().toFile('sheet16.png')
console.log('sheet16.png — 좌→우: ' + names.join(', '))
