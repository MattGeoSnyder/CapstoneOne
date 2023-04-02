let searchBtn = document.querySelector('#search-bar button');
let selectedExs = document.querySelector('#selected-exercises');

async function getExercises() {
    let muscleGroup = document.querySelector('#search-bar select[name="muscle_groups"]');
    let val = parseInt(muscleGroup.value);
    let res = await axios.get(`${WGER}/exercise?muscles=${val}&language=2&limit=50`);
    return res.data.results;
}


function createExerciseCard(id, name, index) {
    let exChoices = document.querySelector('#exercise-choices');
    let select = document.querySelector('#search-bar select');
    let optionIndex = select.selectedIndex
    let muscleGroup = select.options[optionIndex].innerText;
    
    card = document.createElement('div');

    let link = document.createElement('a');
    link.dataset.bsToggle = "offcanvas";
    link.href = "#workout-detail";
    link.innerText = name;
    link.addEventListener('click', async function(e) {
        getWorkoutDetail(e.target);
    });

    card.appendChild(link);

    card.dataset.id = id;
    card.dataset.muscle = muscleGroup;
    card.dataset.index = index;
    card.classList.add('my-card');
    
    icon = document.createElement('span');
    icon.innerHTML = '<i class="fa-solid fa-plus fa-2xl"></i>';
    icon.addEventListener('click', cardHandler);

    
    card.appendChild(icon);
    exChoices.appendChild(card);

    return card;
}

function selectCard(card) {
    let exChoices = document.querySelector('#exercise-choices');
    let selectedExs = document.querySelector('#selected-exercises');

    oldCard = exChoices.removeChild(card);
    selectedExs.appendChild(oldCard);
    input = document.createElement('input');
    input.type = 'hidden';
    input_val = {
        id: card.dataset.id,
        name: card.innerText,
        muscle: card.dataset.muscle
    }
    input.value = JSON.stringify(input_val);
    input.name = 'exercise'

    icon = oldCard.querySelector('span');
    icon.innerHTML ='<i class="fa-solid fa-minus fa-2xl"></i>';

    oldCard.setAttribute('selected', true);
    oldCard.appendChild(icon);
    oldCard.appendChild(input);
}

function unSelectCard(card) {
    let exChoices = document.querySelector('#exercise-choices');
    let selectedExs = document.querySelector('#selected-exercises');

    oldCard = selectedExs.removeChild(card);
    let input = oldCard.querySelector('input');
    let icon = oldCard.querySelector('span');

    oldCard.removeChild(input);
    icon.innerHTML = '<i class="fa-solid fa-plus fa-2xl"></i>';
    oldCard.setAttribute('selected', "");

    if (exChoices.children[0].dataset.muscle === oldCard.dataset.muscle){
        exChoices.insertBefore(oldCard,exChoices.children[oldCard.dataset.index]);
    }
}

function cardHandler(event) {
    let card = event.target.parentElement.parentElement;

    if(card.getAttribute('selected')) {
        unSelectCard(card)
    } else {
        selectCard(card);
    }
}

searchBtn.addEventListener('click', async (e) => {
    let exChoices = document.querySelector('#exercise-choices');
    exChoices.innerHTML = '';

    let exercises = await getExercises();
    exercises.forEach((exercise, index) => {
        createExerciseCard(exercise.id, exercise.name, index);
    });
});


window.addEventListener('load', function() {
    let exercises = document.querySelectorAll('.my-card');
    for (let exercise of exercises) {
        console.log(exercise);
        exercise.setAttribute('selected', true);
        let icon = exercise.querySelector('i');
        icon.addEventListener('click', cardHandler);

    }
});



