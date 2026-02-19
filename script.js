 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/script.js b/script.js
index 887e56b4fab4f34af1c2ee7a0ef2743656870bec..0524abf241984ad8f9a380594781b65d628464a6 100644
--- a/script.js
+++ b/script.js
@@ -1,205 +1,235 @@
 /* 問題集 */
 let sets = JSON.parse(localStorage.getItem("sets")) || {
   "デフォルト":[
     {meaning:"私はサッカーをします", blocks:["I","play","soccer"], answer:"I play soccer"}
   ]
 };
 
 let currentSet="デフォルト";
 let problems=sets[currentSet];
 
 let current=0;
 let answer=[];
 
+/* 効果音 */
+const se = {
+  wrong: new Audio("クイズ不正解2.mp3"),
+  correct: new Audio("クイズ正解4.mp3"),
+  button: new Audio("決定ボタンを押す33.mp3"),
+  start: new Audio("説明ウインドウが開く.mp3")
+};
+
+function playSE(type){
+  const sound = se[type];
+  if(!sound) return;
+
+  sound.currentTime = 0;
+  sound.play().catch(()=>{});
+}
+
 /* 保存 */
 function save(){
   sets[currentSet]=problems;
   localStorage.setItem("sets", JSON.stringify(sets));
 }
 
 /* 画面切替 */
 function show(id){
   document.querySelectorAll(".screen")
     .forEach(s=>s.classList.add("hidden"));
 
   document.getElementById(id)
     .classList.remove("hidden");
 }
 
 function startGame(){
+  playSE("start");
   show("gameScreen");
   loadProblem();
 }
 
 function openSettings(){
+  playSE("button");
   show("settingsScreen");
   updateSetList();
   updateList();
 }
 
 function backToStart(){
+  playSE("button");
   show("startScreen");
 }
 
 /* 問題表示 */
 function loadProblem(){
   answer=[];
   let p=problems[current];
 
   document.getElementById("meaning").textContent=p.meaning;
 
   const answerArea=document.getElementById("answerArea");
   const blockArea=document.getElementById("blockArea");
 
   answerArea.innerHTML="";
   blockArea.innerHTML="";
 
   let usedFlags = new Array(p.blocks.length).fill(false);
 
   function renderAnswer(){
     answerArea.innerHTML="";
 
     answer.forEach((word,index)=>{
       const btn=document.createElement("button");
       btn.textContent=word;
 
       btn.onclick=()=>{
+        playSE("button");
         answer.splice(index,1);
         usedFlags[p.blocks.indexOf(word)]=false;
         renderAnswer();
         renderBlocks();
       };
 
       answerArea.appendChild(btn);
     });
   }
 
   function renderBlocks(){
     blockArea.innerHTML="";
 
     p.blocks.forEach((word,i)=>{
       const b=document.createElement("button");
       b.textContent=word;
 
       if(usedFlags[i]){
         b.disabled=true;
       }
 
       b.onclick=()=>{
         if(usedFlags[i]) return;
 
+        playSE("button");
         answer.push(word);
         usedFlags[i]=true;
         renderAnswer();
         renderBlocks();
       };
 
       blockArea.appendChild(b);
     });
   }
 
   renderBlocks();
 }
 
 /* 判定 */
 function checkAnswer(){
+  playSE("button");
   if(answer.join(" ")===problems[current].answer){
+    playSE("correct");
     alert("正解！");
     current=(current+1)%problems.length;
   }else{
+    playSE("wrong");
     alert("違います");
   }
   loadProblem();
 }
 
 /* 問題追加 */
 function addProblem(){
+  playSE("button");
   let m=document.getElementById("newMeaning").value;
   let b=document.getElementById("newBlocks").value.split(",");
   let a=document.getElementById("newAnswer").value;
 
   if(!m||!a||b.length==0) return;
 
   problems.push({meaning:m,blocks:b,answer:a});
   save();
   updateList();
 }
 
 /* 問題一覧 */
 function updateList(){
   let ul=document.getElementById("problemList");
   ul.innerHTML="";
   problems.forEach((p,i)=>{
     let li=document.createElement("li");
     li.textContent=p.meaning+" ";
     let del=document.createElement("button");
     del.textContent="削除";
     del.onclick=()=>{
+      playSE("button");
       problems.splice(i,1);
       save();
       updateList();
     };
     li.appendChild(del);
     ul.appendChild(li);
   });
 }
 
 /* 問題集一覧 */
 function updateSetList(){
   const ul=document.getElementById("setList");
   ul.innerHTML="";
   Object.keys(sets).forEach(name=>{
     const li=document.createElement("li");
 
     const select=document.createElement("button");
     select.textContent=name;
     select.onclick=()=>{
+      playSE("button");
       currentSet=name;
       problems=sets[name];
       updateList();
       alert("問題集を切り替えました");
     };
 
     const del=document.createElement("button");
     del.textContent="削除";
     del.onclick=()=>{
+      playSE("button");
       if(confirm("削除しますか？")){
         delete sets[name];
         localStorage.setItem("sets", JSON.stringify(sets));
         currentSet=Object.keys(sets)[0];
         problems=sets[currentSet];
         updateSetList();
         updateList();
       }
     };
 
     li.appendChild(select);
     li.appendChild(del);
     ul.appendChild(li);
   });
 }
 
 function createSet(){
+  playSE("button");
   const name=document.getElementById("setName").value.trim();
   if(!name) return;
 
   if(sets[name]){
     alert("既に存在します");
     return;
   }
 
   sets[name]=[];
   currentSet=name;
   problems=sets[name];
   save();
   updateSetList();
   updateList();
 }
 
 /* BGM */
 let playing=false;
 function toggleBGM(){
+  playSE("button");
   let bgm=document.getElementById("bgm");
   if(!playing){bgm.play();}else{bgm.pause();}
   playing=!playing;
 }
 
EOF
)
