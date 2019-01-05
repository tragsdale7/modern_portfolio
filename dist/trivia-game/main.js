let domElements = {
	questionContainer: document.querySelector('.question-container'),
	question: document.getElementById('question'),
	questionNumber: document.getElementById('question-number'),
	questionTitle: document.querySelector('.question-title-container'),
	answersContainer: document.querySelector('.answer-container'),
	answers: document.querySelectorAll('.answer'),
	radios: document.getElementsByName('answer'),
	checkedRadio: document.querySelector('input[name="answer"]:checked'),
	startBtn: document.querySelector('.start'),
	submitBtn: document.querySelector('.submitBtn'),
	alert: document.querySelector('.popup'),
	introContainer: document.querySelector('.intro'),
	score: document.querySelector('.score')
}

let quizBank = [];
let newScore = 0;

// event listeners
domElements.startBtn.addEventListener('click', startQuiz);
domElements.submitBtn.addEventListener('click', checkAnswer);

// create a request variable and assign a new XMLHttpRequest object to it
let request = new XMLHttpRequest();

// open a new connection using the GET request on the url endpoint
request.open('GET', 'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple', true);

request.onload = function() {
	console.log(request.status);
	// convert JSON data into JS data
	let data = JSON.parse(this.response);
	console.log(data.results);

	// update testBank with data fetched from API
	quizBank = data.results;
}

// send request
request.send();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getIncorrectAnswers(data) {
	return data.results[0].incorrect_answers;
}

function getCorrectAnswer(data) {
	return data.results[0].correct_answer;
}

function startQuiz(){
	domElements.introContainer.classList.toggle('hide');
	domElements.questionContainer.classList.toggle('hide');

	// display the first question
	updateQuestion(0);

	// display answer choices
	updateAnswers(0);
		
}

function updateRadioValues(answersArray) {
	domElements.radios.forEach((element, index) => {
		element.value = answersArray[index];
	});
}

function resetRadioButtons(){
	domElements.radios.forEach(element => {
		element.checked = false;
	});
}

function updateQuestion(num){
	//display question number in html
	domElements.questionNumber.innerHTML = num + 1;

	//display question in html if it exists
	domElements.question.innerHTML = quizBank[num].question;
}

function updateAnswers(num){
	// store incorrect answers array in variable
	let answers = quizBank[num].incorrect_answers;

	// append correct answer to the answers array
	answers.push(quizBank[num].correct_answer);

	// randomize the answers in the array
	shuffleArray(answers);

	// display answers in HTML
	domElements.answers.forEach((element, index) => {
		element.innerHTML = answers[index];
	})

	// update radio input values with question answers
	updateRadioValues(answers);

}

function checkAnswer(){
	// obtain the checked radio input
	domElements.checkedRadio = document.querySelector('input[name="answer"]:checked');

	// check if a radio input was checked
	if(!domElements.checkedRadio){
		// update HTML of alert
		domElements.alert.innerHTML = 'Error: Please select an answer before submitting!'

		// display error if nothing was checked
		domElements.alert.classList.remove('hide');

		//shake the submit button
		domElements.submitBtn.classList.add('shake');

		//reset shake
		setTimeout(function(){
			domElements.submitBtn.classList.remove('shake');
		}, 300);

		return;
	}

	// check if error was displayed earler and hide if so
	if(!domElements.alert.classList.contains('hide')){
		domElements.alert.classList.add('hide');
	}

	// update question number count
	let questionCount = incrementQuestion();

	// display correct or incorrect based upon checked answer
	if(isCorrect(domElements.checkedRadio.value, questionCount)){
		displayCorrectAlert();

		//update score
		newScore = incrementScore();
		displayNewScore(newScore, questionCount + 1);

	} else {
		displayIncorrectAlert();

		//update score
		displayNewScore(newScore, questionCount + 1);
	}
	
	// display next question and answers if they exist
	if(questionCount + 1 === quizBank.length) {
		displayFinalScore(newScore, questionCount + 1);
	} else {
		updateQuestion(questionCount + 1);
		updateAnswers(questionCount + 1);
	}

	//uncheck radio button
	resetRadioButtons();
}

function isCorrect(value, questionCount) {
	if(value === quizBank[questionCount].correct_answer){
		return true;
	} else {
		return false;
	}
}

function displayCorrectAlert(){
	domElements.alert.innerHTML = 'Correct!';
	domElements.alert.style.backgroundColor = '#88CC88';
	domElements.alert.classList.remove('hide');
}

function displayIncorrectAlert(){
	domElements.alert.innerHTML = 'Incorrect!';
	domElements.alert.style.backgroundColor = '#FFAAAA';
	domElements.alert.classList.remove('hide');
}

function displayNewScore(newScore, questionCount) {
	domElements.score.innerHTML = 'Score: ' +newScore+ '/' + questionCount;
}

function displayFinalScore(newScore, questionCount) {
	// hide question and answers
	domElements.questionTitle.classList.add('hide');
	domElements.answersContainer.classList.add('hide');
	domElements.submitBtn.classList.add('hide');
	
	// display the final score
	domElements.score.innerHTML = 'Your final score is: ' +newScore+ '/' + questionCount;
	domElements.score.classList.add('enlarge');
}

// practicing the use of closures
let incrementQuestion = (function(n) {
	return function() {
		n += 1;
		return n;
	}
})(-1);

let incrementScore = (function(n) {
	return function() {
		n+=1;
		return n;
	}
})(0);

