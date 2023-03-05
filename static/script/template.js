const WGER = 'https://wger.de/api/v2';
let searchBtn = document.querySelector('#search-bar button');
let selectedExs = document.querySelector('#selected-exercises');

async function getExercises() {
    let muscleGroup = document.querySelector('#search-bar select[name="muscle_groups"]');
    let val = parseInt(muscleGroup.value);
    let res = await axios.get(`${WGER}/exercise?muscles=${val}&language=2&limit=50`);
    return res.data.results;
}

function createExerciseCard(id, name) {
    let exChoices = document.querySelector('#exercise-choices');

    
    card = document.createElement('div');
    card.innerText = name;
    card.setAttribute('data-id', id);
    
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
    input.value = card.dataset.id;
    input.name = 'exercise'

    oldCard.removeEventListener('click', cardHandler);
}

function cardHandler(event) {
    selectCard(event.target);
}

searchBtn.addEventListener('click', async (e) => {
    let exChoices = document.querySelector('#exercise-choices');
    exChoices.innerHTML = '';

    let exercises = await getExercises();
    exercises.forEach(exercise => {
        let card = createExerciseCard(exercise.id, exercise.name);
        card.addEventListener('click', cardHandler);
    });
});

