let problems = JSON.parse(localStorage.getItem("problems")) || [];
let currentProblem = null;
let selectedWords = [];

/* =========================
   配列シャッフル関数
   ========================= */
function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/* =========================
   問題スタート
   ========================= */
function startGame() {
  if (problems.length === 0) {
    alert("問題がありません！");
    return;
  }

  document.getElementById("titleScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";

  nextProblem();
}

/* =========================
   次の問題
   ========================= */
function nextProblem() {
  selectedWords = [];

  currentProblem = problems[Math.floor(Math.random() * problems.length)];

  document.getElementById("question").textContent = currentProblem.jp;
  document.getElementById("answerArea").innerHTML = "";

  const choicesArea = document.getElementById("choices");
  choicesArea.innerHTML = "";

  // ★ここでシャッフル！！
  const shuffledWords = shuffle(currentProblem.words);

  shuffledWords.forEach(word => {
    const btn = document.createElement("button");
    btn.textContent = word;
    btn.className = "word";

    btn.onclick = () => selectWord(word, btn);

    choicesArea.appendChild(btn);
  });
}

/* =========================
   単語選択
   ========================= */
function selectWord(word, btn) {
  selectedWords.push(word);
  btn.disabled = true;

  const answerArea = document.getElementById("answerArea");

  const wordBtn = document.createElement("button");
  wordBtn.textContent = word;
  wordBtn.className = "answerWord";

  // ★タップで戻せる
  wordBtn.onclick = () => {
    selectedWords = selectedWords.filter((w, i) => i !== selectedWords.indexOf(word));
    btn.disabled = false;
    wordBtn.remove();
  };

  answerArea.appendChild(wordBtn);
}

/* =========================
   判定
   ========================= */
function checkAnswer() {
  const answer = selectedWords.join(" ");

  if (answer === currentProblem.en) {
    alert("正解！");
  } else {
    alert("不正解！ 正解: " + currentProblem.en);
  }

  nextProblem();
}

/* =========================
   問題追加
   ========================= */
function addProblem() {
  const jp = document.getElementById("jpInput").value;
  const en = document.getElementById("enInput").value;

  if (!jp || !en) {
    alert("入力してください");
    return;
  }

  const words = en.split(" ");

  problems.push({ jp, en, words });
  localStorage.setItem("problems", JSON.stringify(problems));

  alert("追加しました！");
}

/* =========================
   初期データ（初回だけ）
   ========================= */
if (problems.length === 0) {
  problems = [
    { jp: "彼女はテニスをします", en: "She plays tennis", words: ["She", "plays", "tennis"] },
    { jp: "私は学生です", en: "I am a student", words: ["I", "am", "a", "student"] }
  ];
  localStorage.setItem("problems", JSON.stringify(problems));
}
