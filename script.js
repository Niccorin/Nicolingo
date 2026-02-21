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

function save(){
  sets[currentSet]=problems;
  localStorage.setItem("sets", JSON.stringify(sets));
}

/* 画面 */
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
  updateSetList();
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

  const answerArea=document.getElementById("answerArea");
  answerArea.innerHTML="";

  const blockArea=document.getElementById("blockArea");
  blockArea.innerHTML="";

  function renderAnswer(){
    answerArea.innerHTML="";
    answer.forEach((word,i)=>{
      let btn=document.createElement("button");
      btn.textContent=word;
      btn.onclick=()=>{
        answer.splice(i,1);
        renderAnswer();
      };
      answerArea.appendChild(btn);
    });
  }

  p.blocks.sort(()=>Math.random()-0.5).forEach(word=>{
    let b=document.createElement("button");
    b.textContent=word;
    b.onclick=()=>{
      answer.push(word);
      renderAnswer();
    };
    blockArea.appendChild(b);
  });
}

/* 判定 */
function checkAnswer(){
  if(answer.join(" ")===problems[current].answer){
    alert("正解！");
    current=(current+1)%problems.length;
  }else{
    alert("違います");
  }
  loadProblem();
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
      currentSet=name;
      problems=sets[name];
      updateList();
      alert("問題集を切り替えました");
    };

    const del=document.createElement("button");
    del.textContent="削除";
    del.onclick=()=>{
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
  let bgm=document.getElementById("bgm");
  if(!playing){bgm.play();}else{bgm.pause();}
  playing=!playing;
}

function Log(){
alert("アップデート履歴　2/21リリース")
}
