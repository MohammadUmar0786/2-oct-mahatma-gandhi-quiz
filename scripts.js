 const questionsBank = [
      {q:"In which year was Mahatma Gandhi born?", options:["1869","1889","1901","1857"], answer:"1869"},
      {q:"Where was Mahatma Gandhi born?", options:["Delhi","Porbandar","Ahmedabad","Mumbai"], answer:"Porbandar"},
      {q:"Which movement did Gandhi launch in 1942?", options:["Non-Cooperation Movement","Civil Disobedience Movement","Quit India Movement","Swadeshi Movement"], answer:"Quit India Movement"},
      {q:"What is Gandhi famously called?", options:["Bapu","Chacha Ji","Netaji","Guruji"], answer:"Bapu"},
      {q:"What did Gandhi's philosophy strongly promote?", options:["Violence","Wealth","Non-Violence","Power"], answer:"Non-Violence"},
      {q:"Where did Gandhi first practice Satyagraha?", options:["India","South Africa","England","Sri Lanka"], answer:"South Africa"},
      {q:"Which march did Gandhi lead in 1930?", options:["Dandi Salt March","Quit India March","Delhi March","Sabarmati March"], answer:"Dandi Salt March"},
      {q:"When did India gain independence?", options:["1947","1950","1930","1920"], answer:"1947"},
      {q:"What profession did Gandhi study in London?", options:["Medicine","Law","Engineering","Economics"], answer:"Law"},
      {q:"What was Gandhi's ashram in Ahmedabad called?", options:["Sevagram Ashram","Sabarmati Ashram","Wardha Ashram","Porbandar Ashram"], answer:"Sabarmati Ashram"},
      {q:"Who gave Gandhi the title 'Mahatma'?", options:["Rabindranath Tagore","Jawaharlal Nehru","Sardar Patel","Subhash Chandra Bose"], answer:"Rabindranath Tagore"},
      {q:"What is the date of Gandhi Jayanti?", options:["15th August","2nd October","26th January","30th January"], answer:"2nd October"}
    ];

    let questions = [];
    let current = 0;
    let score = 0;
    let timer;
    let timeLeft = 10;
    let totalTime = 0;

    const questionEl = document.getElementById("question");
    const optionsEl = document.getElementById("options");
    const resultEl = document.getElementById("result");
    const scoreEl = document.getElementById("score");
    const prevScoreEl = document.getElementById("prevScore");
    const timeEl = document.getElementById("time");
    const timerBox = document.getElementById("timerBox");
    const celebrationEl = document.getElementById("celebration");
    const correctSound = document.getElementById("correctSound");
    const leaderboardBody = document.querySelector("#leaderboard tbody");

    function shuffle(array) {
      let arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function startQuiz() {
      questions = shuffle(questionsBank).slice(0,10);
      current = 0;
      score = 0;
      totalTime = 0;
      loadQuestion();
      const prev = localStorage.getItem("gandhiQuizScore");
      if(prev) prevScoreEl.textContent = "📌 Previous Score: " + prev + "/10";
      renderLeaderboard();
    }

    function loadQuestion() {
      if(current >= questions.length){
        endQuiz();
        return;
      }
      const q = questions[current];
      questionEl.textContent = `Q${current+1}. ${q.q}`;
      optionsEl.innerHTML = "";
      resultEl.textContent = "";
      timeLeft = 10;
      timeEl.textContent = timeLeft;
      clearInterval(timer);
      timer = setInterval(countdown,1000);

      q.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => checkAnswer(btn, option, q.answer);
        optionsEl.appendChild(btn);
      });
      scoreEl.textContent = `Score: ${score}`;
    }

    function countdown(){
      timeLeft--;
      timeEl.textContent = timeLeft;
      totalTime++;
      if(timeLeft <= 0){
        clearInterval(timer);
        current++;
        loadQuestion();
      }
    }

    function showCelebration(){
      celebrationEl.style.display = "flex";
      celebrationEl.style.opacity = "1";
      setTimeout(() => { celebrationEl.style.display = "none"; }, 1000);
    }

    function checkAnswer(button, selected, correct) {
      clearInterval(timer);
      const buttons = optionsEl.querySelectorAll("button");
      buttons.forEach(b => b.disabled = true);

      if (selected === correct) {
        button.classList.add("correct");
        resultEl.textContent = "✅ Correct!";
        score++;
        correctSound.currentTime = 0;
        correctSound.play();
        showCelebration();
      } else {
        button.classList.add("wrong");
        resultEl.textContent = "❌ Wrong! Correct answer: " + correct;
      }

      scoreEl.textContent = `Score: ${score}`;

      setTimeout(() => {
        current++;
        loadQuestion();
      }, 1500);
    }

    function endQuiz(){
      questionEl.textContent = "🎉 Quiz Completed!";
      optionsEl.innerHTML = "";
      resultEl.innerHTML = "Your final score: " + score + "/10" + "<br>⏱ Total time taken: " + totalTime + " seconds";
      scoreEl.textContent = "";
      timerBox.style.display = "none";
      localStorage.setItem("gandhiQuizScore", score);
      addToLeaderboard(score, totalTime);
    }

    function addToLeaderboard(score, time){
      const name = prompt("Enter your name for the leaderboard:");
      if(!name) return;
      const entry = { name, score, time };
      let leaderboard = JSON.parse(localStorage.getItem("gandhiLeaderboard")) || [];
      leaderboard.push(entry);
      leaderboard.sort((a,b) => b.score - a.score || a.time - b.time);
      leaderboard = leaderboard.slice(0,10);
      localStorage.setItem("gandhiLeaderboard", JSON.stringify(leaderboard));
      renderLeaderboard();
    }

    function renderLeaderboard(){
      let leaderboard = JSON.parse(localStorage.getItem("gandhiLeaderboard")) || [];
      leaderboardBody.innerHTML = "";
      leaderboard.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${entry.name}</td><td>${entry.score}</td><td>${entry.time}</td>`;
        leaderboardBody.appendChild(row);
      });
    }

    startQuiz();