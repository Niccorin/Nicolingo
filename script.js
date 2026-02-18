const problems=[
  {
    meaning:"私はサッカーをします。",
    answer:"I play soccer.",
    blocks:["I","play","soccer."]
  },
  {
    meaning:"彼は昨日学校へ行きました。",
    answer:"He went to school yesterday.",
    blocks:["He","went","to","school","yesterday."]
  }
];

let current=0;
let answer=[];
let usedFlags=[];

// ===== 効果音 =====
const soundStart=new Audio("説明ウインドウが開く.mp3");
const soundClick=new Audio("決定ボタンを押す33.mp3");
const soundCorrect=new Audio("クイズ正解4.mp3");
const soundWrong=new Audio("クイズ不正解2.mp3");

// スタート
document.getElementById("startBtn").onclick=()=>{
  soundStart.currentTime=0;
  soundStart.play();

  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  loadProblem();
};

// 決定ボタン
document.getElementById("checkBtn").onclick=()=>{
  soundClick.currentTime=0;
  soundClick.play();

  checkAnswer();
};

function loadProblem(){

  answer=[];
  const p=problems[current];

  document.getElementById("meaning").textContent=p.meaning;
  document.getElementById("result").textContent="";

  const answerArea=document.getElementById("answerArea");
  const blockArea=document.getElementById("blockArea");

  answerArea.innerHTML="";
  blockArea.innerHTML="";

  // シャッフル
  const shuffled=[...p.blocks]
    .map(v=>({v,sort:Math.random()}))
    .sort((a,b)=>a.sort-b.sort)
    .map(o=>o.v);

  usedFlags=new Array(shuffled.length).fill(false);

  function renderAnswer(){
    answerArea.innerHTML="";

    answer.forEach((word,index)=>{
      const btn=document.createElement("button");
      btn.textContent=word;

      // 回答タップで削除
      btn.onclick=()=>{
        answer.splice(index,1);
        usedFlags[shuffled.indexOf(word)]=false;
        renderAnswer();
        renderBlocks();
      };

      answerArea.appendChild(btn);
    });
  }

  function renderBlocks(){
    blockArea.innerHTML="";

    shuffled.forEach((word,i)=>{
      const b=document.createElement("button");
      b.textContent=word;

      if(usedFlags[i]){
        b.disabled=true;
      }

      b.onclick=()=>{
        if(usedFlags[i]) return;

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

function checkAnswer(){

  const p=problems[current];
  const userAnswer=answer.join(" ");

  const result=document.getElementById("result");

  if(userAnswer===p.answer){

    soundCorrect.currentTime=0;
    soundCorrect.play();

    result.textContent="正解！";

    current++;
    if(current<problems.length){
      setTimeout(loadProblem,1000);
    }else{
      result.textContent="全問クリア！";
    }

  }else{

    soundWrong.currentTime=0;
    soundWrong.play();

    result.textContent="不正解…";
  }
}
