let problems = JSON.parse(localStorage.getItem("problems")) || [
  {meaning:"私はサッカーをします", blocks:["I","play","soccer"], answer:"I play soccer"}
];

let current = 0;
let answer = [];

function save(){
  localStorage.setItem("problems", JSON.stringify(problems));
}

/* 画面切替 */
function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function startGame(){
  show("gameScreen");
  loadProblem();
}

function openSettings(){
  show("settingsScreen");
  updateList();
}

function backToStart(){
  show("startScreen");
}

/* 問題表示 */
function loadProblem(){
  answer=[];
  let p=problems[current];
  document.getElementById("meaning").textContent=p.meaning;
  document.getElementById("answerArea").textContent="";
  let area=document.getElementById("blockArea");
  area.innerHTML="";
  p.blocks.sort(()=>Math.random()-0.5).forEach(word=>{
    let b=document.createElement("button");
    b.textContent=word;
    b.onclick=()=>{
      answer.push(word);
      document.getElementById("answerArea").textContent=answer.join(" ");
    };
    area.appendChild(b);
  });
}

/* 判定 */
function checkAnswer(){
  if(answer.join(" ")===problems[current].answer){
    alert("正解！");
    current=(current+1)%problems.length;
    loadProblem();
  }else{
    alert("違います");
  }
}

/* 追加 */
function addProblem(){
  let m=document.getElementById("newMeaning").value;
  let b=document.getElementById("newBlocks").value.split(",");
  let a=document.getElementById("newAnswer").value;

  if(!m||!a||b.length==0) return;

  problems.push({meaning:m,blocks:b,answer:a});
  save();
  updateList();
}

/* 一覧 */
function updateList(){
  let ul=document.getElementById("problemList");
  ul.innerHTML="";
  problems.forEach((p,i)=>{
    let li=document.createElement("li");
    li.textContent=p.meaning+" ";
    let del=document.createElement("button");
    del.textContent="削除";
    del.onclick=()=>{
      problems.splice(i,1);
      save();
      updateList();
    };
    li.appendChild(del);
    ul.appendChild(li);
  });
}

/* BGM */
let playing=false;
function toggleBGM(){
  let bgm=document.getElementById("bgm");
  if(!playing){bgm.play();}else{bgm.pause();}
  playing=!playing;
}
