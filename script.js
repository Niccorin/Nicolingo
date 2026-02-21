let problems = [
  { jp:"彼女はテニスをします", en:"She plays tennis" },
  { jp:"私は学生です", en:"I am a student" }
];

let currentProblem;
let selected = [];
let buttons = [];

/* ---------- シャッフル ---------- */
function shuffle(array){
  const arr=[...array];
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

/* ---------- スタート ---------- */
function startGame(){
  document.getElementById("titleScreen").style.display="none";
  document.getElementById("gameScreen").style.display="block";
  nextProblem();
}

/* ---------- 次の問題 ---------- */
function nextProblem(){

  selected=[];
  buttons=[];

  currentProblem=problems[Math.floor(Math.random()*problems.length)];

  document.getElementById("question").textContent=currentProblem.jp;
  document.getElementById("answerArea").innerHTML="";
  document.getElementById("choices").innerHTML="";

  const words=shuffle(currentProblem.en.split(" "));

  words.forEach(word=>{
    const btn=document.createElement("button");
    btn.textContent=word;
    btn.className="word";

    btn.onclick=()=>{
      btn.disabled=true;
      selected.push(word);
      buttons.push(btn);
      renderAnswer();
    };

    document.getElementById("choices").appendChild(btn);
  });
}

/* ---------- 回答表示 ---------- */
function renderAnswer(){
  const area=document.getElementById("answerArea");
  area.innerHTML="";

  selected.forEach((word,index)=>{
    const w=document.createElement("button");
    w.textContent=word;
    w.className="answerWord";

    // ←タップで戻す
    w.onclick=()=>{
      buttons[index].disabled=false;
      selected.splice(index,1);
      buttons.splice(index,1);
      renderAnswer();
    };

    area.appendChild(w);
  });
}

/* ---------- 判定 ---------- */
function checkAnswer(){
  const ans=selected.join(" ");

  if(ans===currentProblem.en){
    alert("正解！");
  }else{
    alert("不正解\n正解: "+currentProblem.en);
  }

  nextProblem();
}
