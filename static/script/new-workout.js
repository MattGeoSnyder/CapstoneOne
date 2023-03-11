const WGER = 'https://wger.de/api/v2';
let setCount = 1;

function createSlides(){
    let exWrapper = document.querySelector('#exercise-wrapper')
    let curr = document.createElement('div');
    let next = document.createElement('div');

    curr.classList.add('slide');
    curr.id = 'curr';
    next.classList.add('slide');
    next.id = 'next';

    exWrapper.appendChild(curr);
    exWrapper.appendChild(next);
}


window.addEventListener('load', function() {
    createSlides();
});

async function getExercises() {
    let muscleGroup = document.querySelector('#search-bar select[name="muscle_groups"]');
    let val = parseInt(muscleGroup.value);
    let res = await axios.get(`${WGER}/exercise?muscles=${val}&language=2&limit=50`);
    return res.data.results;
}

function createExForm(exName) {
    let curr = document.querySelector('#curr');
    curr.innerHTML = '';

    let h3 = document.createElement('h3');
    h3.innerText = exName;

    let exInfo = document.createElement('input');
    exInfo.type = 'hidden';
    exInfo.name = 'exInfo';

    curr.appendChild(h3);
    curr.appendChild(exInfo);
}

function createSetForm() {
    let curr = document.querySelector('#curr');
    let setWrapper = document.createElement('div');
    setWrapper.classList.add('setForm');

    let h4 = document.createElement('h4');
    h4.innerText = `Set ${setCount}`;
    setWrapper.appendChild(h4);

    let setInfo = document.createElement('input');
    setInfo.type = 'hidden';
    setInfo.name = 'setInfo';
    setWrapper.appendChild(setInfo);

    let tw_label = document.createElement('label');
    let tw_input = document.createElement('input')
    tw_input.id = 'tw';
    tw_input.type = 'number';
    tw_input.name = 'tw';
    tw_input.classList.add('form-control', 'col-1');
    tw_label.for = 'tw';
    tw_label.innerText = 'Target Weight';
    setWrapper.appendChild(tw_label);
    setWrapper.appendChild(tw_input);

    let tr_label = document.createElement('label');
    let tr_input = document.createElement('input')
    tr_input.id = 'tr';
    tr_input.type = 'number';
    tr_input.name = 'tr';
    tr_input.classList.add('form-control', 'col-2');
    tr_label.for = 'tr';
    tr_label.innerText = 'Target Reps';
    setWrapper.appendChild(tr_label);
    setWrapper.appendChild(tr_input);


    let trpe_label = document.createElement('label');
    let trpe_input = document.createElement('input')
    trpe_input.id = 'trpe';
    trpe_input.type = 'number';
    trpe_input.name = 'trpe';
    trpe_input.classList.add('form-control', 'col-3');
    trpe_label.for = 'trpe';
    trpe_label.innerText = 'Target RPE';
    setWrapper.appendChild(trpe_label);
    setWrapper.appendChild(trpe_input);


    let rt_label = document.createElement('label');
    let rt_input = document.createElement('input')
    rt_input.id = 'rt';
    rt_input.type = 'number';
    rt_input.name = 'rt';
    rt_input.classList.add('form-control', 'col-4');
    rt_label.for = 'rt';
    rt_label.innerText = 'Rest Time';
    setWrapper.appendChild(rt_label);
    setWrapper.appendChild(rt_input);

    curr.appendChild(setWrapper);
}

function createSetButton() {
    btnBar = document.querySelector('#btn-bar');
    btn = document.createElement('button');
    btn.type = 'button';
    btn.classList.add('btn');
    btn.innerText = 'Add Set';
    btn.addEventListener('click', function(e) {
        setCount += 1;
        createSetForm();
    })
    btn.id = 'add-set'

    btnBar.insertBefore(btn, btnBar.children[1])
}

function selectExercise(card) {
    createExForm(card.innerText);
    createSetForm();
    createSetButton();
}

function createExerciseCard(id, name) {
    let curr = document.querySelector('#curr');

    card = document.createElement('div');
    card.innerText = name;
    card.setAttribute('data-id', id);
    card.classList.add('my-card');
    
    icon = document.createElement('span');
    icon.innerHTML = '<i class="fa-solid fa-plus fa-2xl"></i>';
    icon.addEventListener('click', function(e) {
        console.log(e.target);
        card = e.target.parentElement.parentElement;
        selectExercise(card);
    });
    
    card.appendChild(icon);
    curr.appendChild(card);

    return card;
}


let searchBtn = document.querySelector('#search-btn')
searchBtn.addEventListener('click', async function() {
    let exercises = await getExercises();

    exercises.forEach(exercise => {
        createExerciseCard(exercise.id, exercise.name);
    });
});






