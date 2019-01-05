// variables
let addTodoArray = document.querySelectorAll('.fa-plus');
let popUp = document.querySelector('.pop-up-container');
let exit = document.querySelector('.fa-times');
let todoList = document.querySelector('.todo-list-container');
let todoListDone = document.querySelector('.todo-list-done-container');
let todoItemsArray = document.querySelectorAll('.todo-items');
let todoName = document.getElementById('todoName').value;
let todoName1 = document.getElementById('todoName');
let todoNotes = document.getElementById('todoNotes').value;
let todoNotes1 = document.getElementById('todoNotes');
let pomodoroContainer = document.querySelector('.pomodoro-container');
let timer = document.querySelector('.pomodoro-timer');
let count = 0;
let from = 5;
let timingClock;
let currentId;
let done = false;
let stop = document.querySelector('.pomodoro-stop');
let start = document.querySelector('.pomodoro-start');


// event listeners
addTodoArray.forEach(function(elem){
	elem.addEventListener('click', displayPopUp);
});

exit.addEventListener('click', function(e){
	popUp.style.display = 'none';
	// clear form
	todoName1.setAttribute('value', '');
	todoNotes1.textContent = '';
	document.getElementById('myForm').reset();

});

window.ondblclick = function(e){
	if(e.target === popUp){
		popUp.style.display = 'none';
		// clear form
		todoName1.setAttribute('value', '');
		todoNotes1.textContent = '';
		document.getElementById('myForm').reset();
	}
}

window.onload = function(){
	fetchTodos();
}


// functions
function displayPopUp(e){
	console.log(e.target.classList.contains('done'));
	let popUpType;
	currentId = e.target.getAttribute('id');

	if (e.target.classList.contains('done')) {
		done = true;
	}

	if(e.target.className.includes('fa-plus')){
		// popUpType is newTodo
		popUpType = 'newTodo';

		// modify popup buttons
		modifyPopUp(popUpType);

		// show popup
		popUp.style.display = 'block';

		

	} else if(e.target.className.includes('todo-items')){
		// popUpType is existing
		popUpType = 'existing';

		// show popup
		popUp.style.display = 'block';

		// get todos from localStorage
		let todos = JSON.parse(localStorage.getItem('todos'));

		// match chosen todo with todos
		for(let i = 0; i < todos.length; i++){
			let id = todos[i].id;
			if(id === e.target.getAttribute('id')){
				todoName1.setAttribute('value', todos[i].name);
				
				if(todos[i].notes){
					todoNotes1.textContent = todos[i].notes;
				}
			}
		}

		// modify popup buttons
		modifyPopUp(popUpType, currentId);

		e.preventDefault();
		
	}
}

function hidePopUp(){
	popUp.style.display = 'none';
}

function modifyPopUp(type, id){
	
	if(type === 'newTodo') {
		// get pop up button container
		let popUpBtnContainer = document.querySelector('.pop-up-btn-container');

		// insert new buttons inside container
		popUpBtnContainer.innerHTML = 	'<button type="submit" class="submitBtn">'+
											'Save & Add More'+
										'</button>'+
										'<button type="submit" class="submitBtn close">'+
											'Save & Close'+
										'</button>'
		// store buttons in variable
		let popUpButtons = document.querySelectorAll('.submitBtn');

		// re-add event listeners
		popUpButtons.forEach(function(elem){
			elem.addEventListener('click', saveTodo);
		});



	} else if(type === 'existing') {
		// get pop up button container
		let popUpBtnContainer = document.querySelector('.pop-up-btn-container');

		// insert new buttons inside container
		popUpBtnContainer.innerHTML = 	'<button type="submit" class="submitBtn2 save">' +
											"Save" +		
										'</button>' +

										'<button type="submit" class="submitBtn2">'+
											"Delete"+
										'</button>' +

										'<button type="submit" class="submitBtn2">'+
											"Start Pomodoro"+
										'</button>'

		// select buttons in order to adjust their size to fit container
		let popUpButtons2 = document.querySelectorAll('.submitBtn2');

		// adjust button size to fit container
		popUpButtons2.forEach(function(elem){
			elem.style.width = '100px';
		});

		// add event listeners
		popUpButtons2[0].addEventListener('click', function(e){
			update(e, id);
		});

		popUpButtons2[1].addEventListener('click', function(e){
			console.log('clicked!');
			console.log(id);

			// e.preventDefault();

			// delete todo
			deleteTodo(e, id);

			// exit popup
			hidePopUp();

			// re-fetch todos
			fetchTodos();

			//prevent form submission
			e.preventDefault();
		});

		popUpButtons2[2].addEventListener('click', function(e){
			//prevent form from submitting
			e.preventDefault();

			//initialize variables
			let timer = document.querySelector('.pomodoro-timer');
			

			timer.innerHTML = '25:00';

			//close popup
			popUp.style.display = 'none';

			//display pomodoro timer
			pomodoroContainer.style.display = 'block';

			// add event listener to stop button
			stop.addEventListener('click', stopClicked);

			start.addEventListener('click', startTimer);

			//start timer
			timingClock = setInterval(timeIt, 1000);

			//prevent form from submitting
			e.preventDefault();
		})
	}
}

function saveTodo(e){
	//get form values after they are inputted
	let todoId = randomId();
	let todoName = document.getElementById('todoName').value;
	let todoNotes = document.getElementById('todoNotes').value;

	// check if todo name entered
	if(!validateForm(todoName)){
		e.preventDefault();
		return false;
	}

	let todo = {
		name: todoName,
		notes: todoNotes,
		id: todoId,
		pomodoros: 0
	}

	if(done) {
		todo.pomodoros++;
		done = false;
	};

	console.log(e.target.parentNode);

	// test if todos is null
	if(localStorage.getItem('todos') === null){
		//initialize an array
		let todos = [];

		// add todo to array
		todos.push(todo);

		// set to localStorage
		localStorage.setItem('todos', JSON.stringify(todos));
	} else {
		//get todos from localStorage
		let todos = JSON.parse(localStorage.getItem('todos'));

		// add todo to array
		todos.push(todo);

		// re-set to localStorage
		localStorage.setItem('todos', JSON.stringify(todos));
	}

	// clear form
	document.getElementById('myForm').reset();

	// re-fetch todos
	fetchTodos();

	// check if close button clicked and close popup if so
	if(e.target.className.includes('close')){
		hidePopUp();
	}

	//prevent form from submitting
	e.preventDefault();
}

function validateForm(todoName){
	if(!todoName){
		console.log(todoName);
		alert('Please enter in a todo name!')
		return false;
	}

	return true;
}

function fetchTodos(){
	// get todos from localStorage
	let todos = JSON.parse(localStorage.getItem('todos'));

	// build todo list output
	todoList.innerHTML = '';
	todoListDone.innerHTML = '';

	for(let i = 0; i < todos.length; i++){
		let name = todos[i].name;
		let notes = todos[i].notes;
		let id = todos[i].id;
		let pomodoros = todos[i].pomodoros;

		
		console.log(todos[i].id);
		

		if(notes && !pomodoros){
			todoList.innerHTML += 	'<div class="todo-items" id="'+id+'">'+
										name +
										'<i class="fas fa-comment"></i>'
									'</div>'
		} else if(!pomodoros) {
			todoList.innerHTML += 	'<div class="todo-items" id="'+id+'">'+
										name +
									'</div>'
		} else if(notes && pomodoros){
			todoListDone.innerHTML += 	'<div class="todo-items" id="'+id+'">'+
											name +
											'<i class="fas fa-comment"></i>'
										'</div>'
		} else if (pomodoros) {
			todoListDone.innerHTML += 	'<div class="todo-items" id="'+id+'">'+
											name +
										'</div>'
		}	
	}

	todoItemsArray = document.querySelectorAll('.todo-items');

	// attach event listeners
	todoItemsArray.forEach(function(elem){
		elem.addEventListener('click', displayPopUp);
	});
};

function randomId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function update(e, id){
	e.preventDefault();
	
	// get name and notes values
	let nameValue = document.getElementById('todoName').value;
	let notesValue = document.getElementById('todoNotes').value;

	if(!checkForChange(nameValue, notesValue, id)){
		return false;
	}

	// get todos from localStorage
	let todos = JSON.parse(localStorage.getItem('todos'));

	for (let i = 0; i < todos.length; i++){
		if(todos[i].id === id){
			//update changes 
			todos[i].name = nameValue;
			todos[i].notes = notesValue;

			// re-set to localStorage
			localStorage.setItem('todos', JSON.stringify(todos));

		}
	}

	//re-fetch todos
	fetchTodos();

	//exit popup screen
	popUp.style.display = 'none';
	

}

function test(){
	console.log('callback works!');
}

function checkForChange (name, note, id) {
	console.log(name);
	console.log(note);
	console.log(id);

	// get todos from localStorage
	let todos = JSON.parse(localStorage.getItem('todos'));

	for (let i = 0; i < todos.length; i++){
		if(todos[i].id === id && todos[i].name === name && todos[i].notes === note){
			return false;
		} else {
			return true
		}
	}
}

function convertSeconds(s){
	let minutes = Math.floor(s / 60);
	let seconds = (s % 60);

	if(seconds < 10){
		seconds = '0' + seconds;
	}

	if(minutes < 10){
		minutes = '0' + minutes;
	}

	if(s === -1) {
		stopTimer();
		pomodoroContainer.style.display = 'none';
		start.removeEventListener('click', startTimer);
		stop.removeEventListener('click', stopClicked);
		updatePomodoro();
		resetPomodoro();
		markItemDone(currentId);
		alert('Congrats! You finished a pomodoro session.')
		fetchTodos();
	}

	return minutes + ':' + seconds;
}

function timeIt(){
	//update DOM with time left
	timer.innerHTML = convertSeconds(from - count);

	// increment count
	count++;
	
	console.log(count);
}

function stopTimer(){
	clearInterval(timingClock);
}

function updatePomodoro(){
	console.log('update pomo ran!');
	//get todos from localStorage
	let todos = JSON.parse(localStorage.getItem('todos'));

	for(let i = 0; i < todos.length; i++){
		if(currentId === todos[i].id){

			todos[i].pomodoros++;

			// re-set to localStorage
			localStorage.setItem('todos', JSON.stringify(todos));
			
			let todos1 = JSON.parse(localStorage.getItem('todos'));
			console.log(todos1);
			
		}
	}
}

function resetPomodoro() {
	count = 0;
}

function markItemDone(id) {

}

function deleteTodo(event, id) {
	//get todos from localStorage
	let todos = JSON.parse(localStorage.getItem('todos'));

	for(let i = 0; i < todos.length; i++) {
		if(id === todos[i].id){

			todos.splice(i, 1);

			// reset to localStorage
			localStorage.setItem('todos', JSON.stringify(todos));
		}
	}
}

function startTimer(){
	console.log('start clicked!')
	timingClock = setInterval(timeIt, 1000);
	stop.style.display = 'block';
	start.style.display = 'none';
}

function stopClicked() {
	console.log('stop clicked!');
	stopTimer();
	stop.style.display = 'none';
	start.style.display = 'block';
}