/** Supplement the bundled display font with precomposed Croatian letters.
 * Uses its own outlines, acute and caron; preserves letter widths and line metrics.
 * Run once after changing the original font. The generated WOFF is committed.
 */
import {readFileSync, writeFileSync} from 'node:fs'
import {deflateSync} from 'node:zlib'
import {create} from 'fontkitten'
const source=create(readFileSync(new URL('../public/fonts/myfont.woff2',import.meta.url)))
const u16=n=>{let b=Buffer.alloc(2);b.writeUInt16BE(n&65535);return b}
const i16=u16
const u32=n=>{let b=Buffer.alloc(4);b.writeUInt32BE(n>>>0);return b}
const pad=b=>Buffer.concat([b,Buffer.alloc((4-b.length%4)%4)])
const sum=b=>{b=pad(b);let n=0;for(let i=0;i<b.length;i+=4)n=(n+b.readUInt32BE(i))>>>0;return n}
const raw=tag=>{const stream=source._getTableStream(tag);return Buffer.from(stream.buffer.subarray(stream.pos,stream.pos+source.directory.tables[tag].length))}
function contours(commands,dx=0,dy=0){
 const out=[];let points=[]
 const point=(x,y,on)=>({x:Math.round(x+dx),y:Math.round(y+dy),on})
 for(const {command,args:a} of commands){
  if(command==='moveTo'){if(points.length)out.push(points);points=[point(a[0],a[1],true)]}
  else if(command==='lineTo')points.push(point(a[0],a[1],true))
  else if(command==='quadraticCurveTo')points.push(point(a[0],a[1],false),point(a[2],a[3],true))
  else if(command==='closePath'){if(points.length>1&&points[0].x===points.at(-1).x&&points[0].y===points.at(-1).y)points.pop();out.push(points);points=[]}
  else throw new Error('Unsupported outline command '+command)
 }
 if(points.length)out.push(points)
 return out
}
const caron=source.glyphForCodePoint(0x30c)
const acute=source.glyphForCodePoint(0x107).path.commands.filter((_,i)=>i>=source.glyphForCodePoint(99).path.commands.length)
const glyphs=[{width:1024,contours:[]}];const mapping=[]
for(const [letter,base,accent] of [['Ć','C','acute'],['ć','c','acute'],['Č','C','caron'],['č','c','caron'],['Đ','D','bar'],['đ','d','bar'],['Š','S','caron'],['š','s','caron'],['Ž','Z','caron'],['ž','z','caron']]){
 const glyph=source.glyphForCodePoint(base.codePointAt(0));const c=contours(glyph.path.commands)
 const center=(glyph.bbox.minX+glyph.bbox.maxX)/2
 if(accent==='caron')c.push(...contours(caron.path.commands,center-(caron.bbox.minX+caron.bbox.maxX)/2))
 else if(accent==='acute')c.push(...contours(acute,center-438))
 else c.push([{x:74,y:660,on:true},{x:74,y:780,on:true},{x:510,y:780,on:true},{x:510,y:660,on:true}])
 mapping.push([letter.codePointAt(0),glyphs.length]);glyphs.push({width:glyph.advanceWidth,contours:c})
}
mapping.sort((a,b)=>a[0]-b[0])
let offset=0;const offsets=[];const encoded=[];const boxes=[]
for(const g of glyphs){
 offsets.push(offset)
 const points=g.contours.flat();const xs=points.map(p=>p.x),ys=points.map(p=>p.y)
 const box=points.length?[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)]:[0,0,0,0];boxes.push(box)
 let ends=[],n=-1;for(const c of g.contours){n+=c.length;ends.push(u16(n))}
 let x=0,y=0,dx=[],dy=[];for(const p of points){dx.push(i16(p.x-x));dy.push(i16(p.y-y));x=p.x;y=p.y}
 const data=pad(Buffer.concat([i16(g.contours.length),...box.map(i16),...ends,u16(0),Buffer.from(points.map(p=>p.on?1:0)),...dx,...dy]))
 encoded.push(data);offset+=data.length
}
offsets.push(offset)
const tables={glyf:Buffer.concat(encoded),loca:Buffer.concat(offsets.map(u32)),hmtx:Buffer.concat(glyphs.map((g,i)=>Buffer.concat([u16(g.width),i16(boxes[i][0])])))}
tables.head=raw('head');tables.head.writeUInt32BE(0,8);tables.head.writeInt16BE(1,50)
const bounds=[Math.min(...boxes.map(b=>b[0])),Math.min(...boxes.map(b=>b[1])),Math.max(...boxes.map(b=>b[2])),Math.max(...boxes.map(b=>b[3]))]
bounds.forEach((n,i)=>tables.head.writeInt16BE(n,36+i*2))
tables.hhea=raw('hhea');tables.hhea.writeUInt16BE(glyphs.length,34);tables.hhea.writeUInt16BE(Math.max(...glyphs.map(g=>g.width)),10)
tables.maxp=Buffer.alloc(32);tables.maxp.writeUInt32BE(0x10000);tables.maxp.writeUInt16BE(glyphs.length,4);tables.maxp.writeUInt16BE(Math.max(...glyphs.map(g=>g.contours.flat().length)),6);tables.maxp.writeUInt16BE(Math.max(...glyphs.map(g=>g.contours.length)),8);tables.maxp.writeUInt16BE(1,14)
tables['OS/2']=raw('OS/2');tables['OS/2'].writeUInt16BE(mapping[0][0],64);tables['OS/2'].writeUInt16BE(mapping.at(-1)[0],66)
const segs=[...mapping,[65535,0]];const count=segs.length;const log=Math.floor(Math.log2(count))
const format4=Buffer.concat([u16(4),u16(16+count*8),u16(0),u16(count*2),u16(2*(2**log)),u16(log),u16(count*2-2*(2**log)),...segs.map(([c])=>u16(c)),u16(0),...segs.map(([c])=>u16(c)),...segs.map(([c,g])=>u16(g-c)),...segs.map(()=>u16(0))])
tables.cmap=Buffer.concat([u16(0),u16(1),u16(3),u16(1),u32(12),format4])
tables.post=Buffer.alloc(32);tables.post.writeUInt32BE(0x30000);tables.post.writeInt16BE(source.underlinePosition,8);tables.post.writeInt16BE(source.underlineThickness,10)
const names={0:source.copyright,1:'Portfolio Croatian Supplement',2:'Regular',3:'PortfolioCroatianSupplement-1.0',4:'Portfolio Croatian Supplement',5:'Version 1.0',6:'PortfolioCroatianSupplement'};let strings=[],records=[],nameOffset=0
for(const [id,value] of Object.entries(names)){const text=Buffer.from(value,'utf16le').swap16();records.push(Buffer.concat([u16(3),u16(1),u16(0x409),u16(+id),u16(text.length),u16(nameOffset)]));strings.push(text);nameOffset+=text.length}
tables.name=Buffer.concat([u16(0),u16(records.length),u16(6+records.length*12),...records,...strings])
const tags=Object.keys(tables).sort();const num=tags.length;const power=2**Math.floor(Math.log2(num));let sfntOffset=12+16*num;const directory=[];const data=[]
for(const tag of tags){const b=tables[tag];directory.push(Buffer.concat([Buffer.from(tag),u32(sum(b)),u32(sfntOffset),u32(b.length)]));data.push(pad(b));sfntOffset+=pad(b).length}
const sfnt=Buffer.concat([u32(0x10000),u16(num),u16(power*16),u16(Math.log2(power)),u16(num*16-power*16),...directory,...data])
tables.head.writeUInt32BE((0xB1B0AFBA-sum(sfnt))>>>0,8)
let woffOffset=44+20*num;const woffDir=[],woffData=[]
for(const tag of tags){const b=tables[tag],compressed=deflateSync(b);const payload=compressed.length<b.length?compressed:b;const checksum=tag==='head'?sum(Buffer.concat([b.subarray(0,8),u32(0),b.subarray(12)])):sum(b);woffDir.push(Buffer.concat([Buffer.from(tag),u32(woffOffset),u32(payload.length),u32(b.length),u32(checksum)]));woffData.push(pad(payload));woffOffset+=pad(payload).length}
const woff=Buffer.concat([Buffer.from('wOFF'),u32(0x10000),u32(woffOffset),u16(num),u16(0),u32(sfnt.length),u16(1),u16(0),...Array.from({length:5},()=>u32(0)),...woffDir,...woffData])
const output=new URL('../public/fonts/myfont-hr-v1.woff',import.meta.url);writeFileSync(output,woff)
const verify=create(woff)
for(const [cp] of mapping){const g=verify.glyphForCodePoint(cp);if(!g.id||g.advanceWidth!==source.glyphForCodePoint(String.fromCodePoint(cp).normalize('NFD')[0].codePointAt(0)).advanceWidth&&![0x110,0x111].includes(cp))throw new Error('Invalid glyph '+cp)}
console.log('Generated Croatian glyphs:',mapping.map(([cp])=>String.fromCodePoint(cp)).join(' '),woff.length+' bytes')
