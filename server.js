const express=require('express');
const http=require('http');
const {Server}=require('socket.io');
const QRCode=require('qrcode');
const crypto=require('crypto');
const app=express();
const server=http.createServer(app);
const io=new Server(server);
const rooms=new Map();
const QUESTION_MS=20000;
app.use(express.static('public'));
app.get('/health',(req,res)=>res.json({ok:true,rooms:rooms.size}));
app.get('/qr.png',async(req,res)=>{
 const room=String(req.query.room||'').trim();
 if(!/^\d{6}$/.test(room))return res.status(400).send('Invalid room');
 try{
  res.type('png');
  await QRCode.toFileStream(res,`${req.protocol}://${req.get('host')}/?room=${room}`,{type:'png',width:360,margin:2,errorCorrectionLevel:'M'});
 }catch(e){console.error(e);if(!res.headersSent)res.status(500).send('QR error')}
});
function state(r){
 return {room:r.id,question:r.question,revealed:r.revealed,started:r.started,duration:QUESTION_MS,
  players:[...r.players.values()].sort((a,b)=>b.score-a.score||a.time-b.time).map(p=>({id:p.id,name:p.name,score:p.score,time:p.time,answered:p.answered}))};
}
function send(r){io.to(r.id).emit('state',state(r))}
function reveal(r){
 if(r.revealed||r.question<0)return;
 r.revealed=true;
 if(r.timer){clearTimeout(r.timer);r.timer=null}
 send(r);
}
function allAnswered(r){return r.players.size>0&&[...r.players.values()].every(p=>p.answered)}
io.on('connection',socket=>{
 socket.on('create',({token}={})=>{
  if(typeof token!=='string'||token.length<8)return;
  let r=[...rooms.values()].find(x=>x.token===token);
  if(!r){let id;do{id=String(crypto.randomInt(100000,1000000))}while(rooms.has(id));r={id,token,question:-1,revealed:false,started:0,timer:null,players:new Map()};rooms.set(id,r)}
  socket.join(r.id);socket.data.host=r.id;socket.emit('state',state(r));
 });
 socket.on('join',({room,name}={})=>{
  room=String(room||'');name=String(name||'').trim().slice(0,32);
  const r=rooms.get(room);
  if(!r)return socket.emit('errorMessage','Không tìm thấy phòng. Hãy quét lại QR mới.');
  if(!name)return socket.emit('errorMessage','Vui lòng nhập tên');
  socket.join(room);socket.data.playerRoom=room;
  // Joining during a question does not retroactively require an answer from a new player.
  const inProgress=r.question>=0&&!r.revealed;
  r.players.set(socket.id,{id:socket.id,name,score:0,time:0,answered:inProgress});
  send(r);
 });
 socket.on('next',({room,token}={})=>{
  const r=rooms.get(String(room));
  if(!r||r.token!==token||socket.data.host!==r.id)return;
  if(r.timer){clearTimeout(r.timer);r.timer=null}
  r.question=(r.question+1)%4;
  if(r.question===0){for(const p of r.players.values()){p.score=0;p.time=0}}
  r.revealed=false;r.started=Date.now();
  for(const p of r.players.values())p.answered=false;
  const question=r.question;
  r.timer=setTimeout(()=>{if(r.question===question)reveal(r)},QUESTION_MS);
  send(r);
 });
 socket.on('answer',({room,answer}={})=>{
  const r=rooms.get(String(room));const p=r?.players.get(socket.id);
  if(!p||r.question<0||r.revealed||p.answered||!Number.isInteger(answer)||answer<0||answer>3)return;
  const elapsed=Date.now()-r.started;
  if(elapsed>=QUESTION_MS){reveal(r);return}
  p.answered=true;p.time+=elapsed;
  if(answer===r.question)p.score+=Math.max(100,1000-Math.floor(elapsed/100));
  if(allAnswered(r))reveal(r);else send(r);
 });
 socket.on('disconnect',()=>{
  const r=rooms.get(socket.data.playerRoom);
  if(r){r.players.delete(socket.id);if(r.question>=0&&!r.revealed&&allAnswered(r))reveal(r);else send(r)}
 });
});
server.listen(process.env.PORT||3000,()=>console.log('Game ready on port',process.env.PORT||3000));
