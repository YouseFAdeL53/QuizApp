// Selectors
let questCount = document.querySelector(".count span");
let spanBullte = document.querySelector(".bulltes .spans");
let quizAnswer = document.querySelector(".quiz-answer");
let quizArea = document.querySelector(".quiz-area");
let theBtn = document.querySelector(".thebtn");
let theResult = document.querySelector(".result");
let theBullte = document.querySelector(".bulltes");
let theCountDown = document.querySelector(".countdown");
// Set Option's
let currentIdx = 0,
  rightAnswer = 0,
  theInterval;

// GetData
(function getData() {
  let theRes = new XMLHttpRequest();
  theRes.onreadystatechange = function () {
    if (theRes.readyState === 4 && theRes.status === 200) {
      // Convert To JS Object
      let theData = JSON.parse(theRes.responseText);
      // Get Length of theData
      let theLength = theData.length;
      // CreateBulltes
      createBulltes(theLength);
      //ShowDataTo
      showDataTo(theData[currentIdx], theLength);
      countDown(5, theLength);
      // Click On Button
      theBtn.addEventListener("click", (e) => {
        let theRightAnswer = theData[currentIdx].right_answer;
        // Function CheckAnswer
        checkAnswer(theRightAnswer, theLength);
        // Increase CurrentIndx 1
        currentIdx++;
        // Clear InnerHTML
        quizArea.innerHTML = "";
        quizAnswer.innerHTML = "";
        //ShowDataTo
        showDataTo(theData[currentIdx], theLength);
        // handleActiveClass
        handleActiveClass();
        // ShowResult
        showResult(theLength);
        // Clean Interval
        clearInterval(theInterval);
        // Interval
        countDown(5, theLength);
      });
    }
  };
  theRes.open("GET", "quiz_questions.json");
  theRes.send();
})();

function createBulltes(Length) {
  questCount.innerHTML = Length;
  // Loop ========= Create Bullte
  for (let i = 0; i < Length; i++) {
    let span = document.createElement("span");
    // Check And Add Class Active
    if (i === 0) {
      span.classList.add("active");
    }
    spanBullte.appendChild(span);
  }
}

function showDataTo(data, length) {
  // Data < Length
  if (currentIdx < length) {
    // Quiz Area
    let theHeading = document.createElement("h2");
    theHeading.appendChild(document.createTextNode(data.title));
    quizArea.appendChild(theHeading);
    for (let i = 1; i <= 4; i++) {
      // Create Div As Main ==== > Input Type Radio ======= > Label
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      // Create Input
      let theInp = document.createElement("input");
      theInp.type = "radio";
      theInp.id = `answer_${i}`;
      if (i === 1) {
        theInp.checked = true;
      }
      theInp.name = "question";
      theInp.dataset.theAnswer = data[`answer_${i}`];
      // Create Label
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      theLabel.appendChild(document.createTextNode(data[`answer_${i}`]));
      // Append input and label
      mainDiv.appendChild(theInp);
      mainDiv.appendChild(theLabel);
      quizAnswer.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, theLength) {
  let allSpans = document.getElementsByName("question");
  let theChossen;
  for (let i = 0; i < allSpans.length; i++) {
    if (allSpans[i].checked) {
      theChossen = allSpans[i].dataset.theAnswer;
    }
  }
  if (theChossen === rAnswer) {
    rightAnswer++;
  }
}

function handleActiveClass() {
  let allSpans = document.querySelectorAll(".spans span");
  allSpans.forEach((span, indx) => {
    if (currentIdx === indx) {
      span.classList.add("active");
    }
  });
}

function showResult(length) {
  let result;
  if (currentIdx === length) {
    quizArea.remove();
    quizAnswer.remove();
    theBtn.remove();
    theBullte.remove();
    if (rightAnswer > length / 2 && rightAnswer < length) {
      result = `<span class="good">Good</span> You Answer ${rightAnswer} From ${length}`;
    } else if (rightAnswer === length) {
      result = `<span class="perfect">Perfect</span> All Your Answer Is Right`;
    } else {
      result = `<span class="bad">Bad</span> You Answer ${rightAnswer} From ${length}`;
    }
    theResult.innerHTML = result;
    theResult.style.cssText = `padding: 20px; background: #f9f9f9; font-weight: 600; text-align: center;`;
    setTimeout(() => window.location.reload(), 2000);
  }
}

function countDown(duration, count) {
  if (currentIdx < count) {
    let minutes, seconds;
    theInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      theCountDown.innerHTML = `${minutes} : ${seconds}`;
      if (--duration < 0) {
        clearInterval(theInterval);
        theBtn.click();
      }
    }, 1000);
  }
}
