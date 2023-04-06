function createWorkoutCard (workoutInfo) {
    let workout = document.createElement('div');
    workout.classList.add('workout');

    let workoutHeader = document.createElement('div');
    workoutHeader.classList.add('workout-header');

    let date = document.createElement('span');
    date.innerText = workoutInfo.completed;

    let form = createElement('form');
    form.method = 'POST';
    form.action = `/workouts/delete${workoutInfo.id}`;
    form.classList.add('del');
    
    let a = document.createElement('a');
    a.onclick(this.parentNode.submit());
    a.innerHTML = '<i class="fa-solid fa-x fa-xl"></i>';
    form.appendChild(a);

    workoutHeader.appendChild(date);
    workoutHeader.appendChild(form);
    
    workout.appendChild(workoutHeader);

    let h4 = document.createElement('h4');
    h4.innerHTML = 'Exercises <i class="fa-solid fa-caret-down"></i>';

    workout.appendChild(workoutHeader);

    exercises = document.createElement
}

function createSet(setInfo) {

}

let form = document.querySelector("#header form");
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    let monthInput = document.querySelector("input[name='month']");
    let yearInput = document.querySelector("input[name='year']");

    month = monthInput.value;
    year = yearInput.value;

    let res = await axios.get(`/completed?month=${month}&year=${year}`);

})