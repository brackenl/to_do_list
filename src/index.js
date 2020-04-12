import format from 'date-fns/format';
import { resetAll } from './view';
import { exampleGen } from './exampleGen';

/* Global Variables */

const model = {
    projectTracker: '',
    projectsArr: ['All', 'Work', 'Personal'],
    toDoArr: [],
    nextid: -1
}

/* To Do Factory */

function ToDoFactory (description, dueDate, priority, project = '') {

    model.nextid++;
    return {
        id: model.nextid,
        description,
        dueDate,
        priority,
        project
    }
}

/* Generate examples */

exampleGen(model.toDoArr);

/* Add new To Do */

function generateToDo (event) {
    event.preventDefault();

    const description = document.getElementById('todo-desc').value;
    const priority = document.getElementById('selectbasic').value;
    const dateFromForm = document.getElementById('due-date').value;
    const dueDate = format(new Date(dateFromForm), 'd MMMM yyyy');
    const project = model.projectTracker;

    const newToDo = ToDoFactory(description, dueDate, priority, project);
    model.toDoArr.push(newToDo);
    
    resetAll();
}

/* Add new Project */

function generateProject (event) {
    event.preventDefault()
    const newProject = document.getElementById('textinput').value;
    model.projectsArr.push(newProject);
    resetAll();
}

/* Update Project Tracker */

function updateProjectTracker (event) {
    if (event.target.innerHTML === 'All') {
        model.projectTracker = '';
    } else {
        model.projectTracker = event.target.innerHTML;
    }

    resetAll();
}

resetAll();

export { model, generateProject, generateToDo, updateProjectTracker, ToDoFactory };