const express=require('express');const http=require('http');const {Server}=require('socket.io');const crypto=require('crypto');
const QRCode=require('qrcode');
const app=express();
app.get('/qr.png',async(req,res)=>{
 const room=String(req.query.room||'');
 if(!/^\d{6}$/.test(room))return res.status(400).send('Mã phòng không hợp lệ');
 const proto=(req.get('x-forwarded-proto')||req.protocol).split(',')[0];
 const joinUrl=proto+'://'+req.get('host')+'/?room='+room;
 try{
   const png=await QRCode.toBuffer(joinUrl,{type:'png',width:300,margin:2,errorCorrectionLevel:'M',color:{dark:'#000000',light:'#FFFFFF'}});
   res.status(200).set({'Content-Type':'image/png','Content-Length':String(png.length),'Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'}).end(png);
 }catch(err){console.error('QR error',err);res.status(500).send('Không tạo được mã QR')}
});app.use(express.static('public'));const server=http.createServer(app);const io=new Server(server,{maxHttpBufferSize:1e5});
const names=['Doraemon','Conan','Tom','Minion'];const rooms=new Map();const DURATION=20000;
const uid=()=>crypto.randomBytes(12).toString('hex');
function publicState(r){return {code:r.code,phase:r.phase,index:r.index,total:names.length,deadline:r.deadline,players:[...r.players.values()].map(p=>({name:p.name,score:p.score,time:p.time,answered:p.answered})),leaderboard:rank(r)}}
function rank(r){return [...r.players.values()].sort((a,b)=>b.score-a.score||a.time-b.time||a.name.localeCompare(b.name,'vi')).map((p,i)=>({rank:i+1,name:p.name,score:p.score,time:Math.round(p.time)/1000,answered:p.answered}))}
function broadcast(r){io.to(r.code).emit('state',publicState(r))}
function advance(r){if(r.timer)clearTimeout(r.timer);if(r.index>=names.length-1){r.phase='finished';r.deadline=null}else{r.index++;r.phase='question';r.deadline=Date.now()+DURATION;r.players.forEach(p=>{p.answered=false;p.correct=false});const index=r.index;r.timer=setTimeout(()=>{if(r.phase==='question'&&r.index===index){r.phase='reveal';broadcast(r)}},DURATION)}broadcast(r)}
io.on('connection',s=>{
 s.on('create',(_,cb)=>{let code;do{code=String(Math.floor(100000+Math.random()*900000))}while(rooms.has(code));let r={code,host:s.id,phase:'lobby',index:-1,deadline:null,players:new Map(),timer:null};rooms.set(code,r);s.join(code);s.data.host=code;cb({ok:true,code});broadcast(r)});
 s.on('join',({code,name,token},cb)=>{let r=rooms.get(String(code||''));name=String(name||'').trim().slice(0,32);if(!r||!name)return cb({ok:false,error:'Mã phòng hoặc tên không hợp lệ.'});let p=token&&r.players.get(token);if(!p){if(r.phase!=='lobby')return cb({ok:false,error:'Phòng đã bắt đầu, không thể vào mới.'});if([...r.players.values()].some(x=>x.name.toLowerCase()===name.toLowerCase()))return cb({ok:false,error:'Tên đã được sử dụng.'});token=uid();p={name,score:0,time:0,answered:false,correct:false,socket:s.id};r.players.set(token,p)}else p.socket=s.id;s.join(r.code);s.data.player={code:r.code,token};cb({ok:true,token});broadcast(r)});
 s.on('start',(_,cb)=>{const r=rooms.get(s.data.host);if(!r||r.host!==s.id||r.phase!=='lobby')return cb?.({ok:false});if(!r.players.size)return cb?.({ok:false,error:'Chưa có học sinh.'});advance(r);cb?.({ok:true})});
 s.on('answer',({choice},cb)=>{const d=s.data.player,r=d&&rooms.get(d.code),p=r&&r.players.get(d.token);if(!r||!p||r.phase!=='question'||p.answered)return cb?.({ok:false});const now=Date.now();if(now>r.deadline)return cb?.({ok:false});const elapsed=Math.max(0,DURATION-(r.deadline-now));const correct=names[r.index]===choice;p.answered=true;p.correct=correct;if(correct){p.score+=Math.max(500,1000-Math.floor(elapsed/40));p.time+=elapsed}else p.time+=DURATION;cb?.({ok:true,correct,answer:names[r.index],score:p.score});broadcast(r);if([...r.players.values()].every(x=>x.answered)){clearTimeout(r.timer);r.phase='reveal';broadcast(r)}});
 s.on('next',(_,cb)=>{let r=rooms.get(s.data.host);if(!r||r.host!==s.id||r.phase!=='reveal')return cb?.({ok:false});advance(r);cb?.({ok:true})});
 s.on('reset',(_,cb)=>{let r=rooms.get(s.data.host);if(!r||r.host!==s.id)return cb?.({ok:false});clearTimeout(r.timer);r.index=-1;r.phase='lobby';r.deadline=null;r.players.forEach(p=>{p.score=0;p.time=0;p.answered=false});broadcast(r);cb?.({ok:true})});
 s.on('disconnect',()=>{let r=rooms.get(s.data.host);if(r&&r.host===s.id){clearTimeout(r.timer);rooms.delete(r.code);io.to(r.code).emit('closed')}});
});
app.get('/health',(req,res)=>res.json({ok:true}));server.listen(process.env.PORT||3000,()=>console.log('Game running'));
