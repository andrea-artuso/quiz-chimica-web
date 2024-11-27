const QUESTION_NUMBER = 15;
const TIME = 25*60;
let timer, questions;

async function getDataFromJson(filename){
    let rawData = await fetch(filename)
    let jsonData = await rawData.json();
    
    return jsonData;
}

function deleteAnswer(name){
    document.getElementsByName(name).forEach(el => el.checked = false)
}

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

async function loadData(examtype){
    questions = await getDataFromJson("data.json")

    if (examtype == "parziale1" || examtype == "parziale2"){
        questions = questions.filter(item => item.type === examtype);
    }
    let html

    shuffle(questions)

    document.querySelector("#questions-container").innerHTML = ""
    for (let n=0; n<QUESTION_NUMBER; n++){
        let q = questions[n]

        html = 
        `<form class="mb-3">
            <header>
            <h4>${n+1}. ${q.question}</h4>
            </header>
            <button onclick="deleteAnswer('q${n}')" class="btn btn-secondary" type="button" style="font-size: 12px">Cancella risposta</button>
            <div class="mb-2"></div>`
        for (let i=0; i<q.answers.length; i++){
            html += `<input class="form-check-input my-2" type="radio" name="q${n}" id="q${n}-${String.fromCharCode(97 + i)}" value="${String.fromCharCode(97 + i)}" /> 
            <label id="lbl_q${n}-${String.fromCharCode(97 + i)}" class="form-check-label my-1" for="q${n}-${String.fromCharCode(97 + i)}">${q.answers[i]}</label><br>`
        }
        html += "</form>"

        document.querySelector("#questions-container").innerHTML += html
    }
}

function evaluateAnswers(){
    points = 0

    for (let i=0; i<questions.length; i++){
        ans = document.querySelector(`input[name="q${i}"]:checked`)
        if (ans !== null){
            ans = ans.value
            if (ans == questions[i].correct){
                points += 0.6
            } else {
                points -= 0.12
            }
        }
    }

    return points.toFixed(2)
}

function start(){
    let examtype = document.querySelector(`input[name="examtype"]:checked`).value
    loadData(examtype)
    timer = new Timer(TIME)
    document.querySelector("#questions").classList.remove("invisible")
    document.querySelector("#btn-reset").disabled = false
    document.querySelector("#btn-start").disabled = true

    location.hash = "#top"
}

function showCorrectAnswers(){
    for (let i=0; i<QUESTION_NUMBER; i++){
        let q = questions[i]
        let correct = q.correct

        document.querySelector(`#lbl_q${i}-${correct}`).style.background = "green"
        document.querySelector(`#lbl_q${i}-${correct}`).style.color = "white"
        document.querySelector(`#lbl_q${i}-${correct}`).style.fontWeight = "bold"
    }
}

function end(){
    elapsed = timer.stopTimer()
    points = evaluateAnswers()

    showCorrectAnswers()

    document.querySelector("#btn-reset").disabled = true
    document.querySelector("#btn-start").disabled = false

    document.querySelector("#points").innerHTML = points
    document.querySelector("#maxpoints").innerHTML = 9
    if (points > 5.5) {
        document.querySelector("#tag-points").innerHTML = '<span class="badge text-bg-success">Superato</span>'
    } else {
        document.querySelector("#tag-points").innerHTML = '<span class="badge text-bg-danger">Non superato</span>'
    }
    
    document.querySelector("#time").innerHTML = Timer.formatTime(elapsed)
    if (elapsed <= TIME) {
        document.querySelector("#tag-time").innerHTML = '<span class="badge text-bg-success">Completato in tempo</span>'
    } else {
        document.querySelector("#tag-time").innerHTML = '<span class="badge text-bg-danger">Fuori tempo</span>'
    }

    // Save to localstorage
    let savedResults = localStorage.getItem("results"), jsonArr
    if (savedResults === null){
        jsonArr = [{"endTime": new Date().toLocaleString(), "points": points, "secondsElapsed": elapsed}]
    } else {
        jsonArr = JSON.parse(savedResults)
        jsonArr.push({"endTime": new Date().toLocaleString(), "points": points, "secondsElapsed": elapsed})
    }
    localStorage.setItem("results", JSON.stringify(jsonArr))
}

document.querySelector("#btn-start").addEventListener('click', start)
document.querySelector("#btn-end").addEventListener('click', end)

document.querySelector("#timer").innerHTML = Timer.formatTime(TIME)

if (localStorage.getItem("disclaimerRead") === null || localStorage.getItem("disclaimerRead") === false){
    var myModal = new bootstrap.Modal(document.getElementById('disclaimer'), {})
    myModal.toggle()
}

function hideDisclaimer(){
    localStorage.setItem("disclaimerRead", true)
}