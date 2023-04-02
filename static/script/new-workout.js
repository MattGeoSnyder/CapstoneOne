// const WGER = 'https://wger.de/api/v2';

let curr = document.querySelector('#curr');
let head = curr;
let tail = curr;

function setSlidePosition() {    
    curr.style.left = '0%';
}

function disableButtons() {
    let setBtn = document.querySelector('#add-set-btn');
    let nextBtn = document.querySelector('#next-btn');

    setBtn.disabled = true;
    nextBtn.disabled = true;
}

function enableButtons() {
    let setBtn = document.querySelector('#add-set-btn');
    let nextBtn = document.querySelector('#next-btn');

    setBtn.disabled = false;
    nextBtn.disabled = false;
}

window.addEventListener('DOMContentLoaded', function() {
    setSlidePosition();
    disableButtons();
})

async function getExercises() {
    let muscleGroup = document.querySelector('#search-bar select[name="muscle_groups"]');
    let val = parseInt(muscleGroup.value);
    let res = await axios.get(`${WGER}/exercise?muscles=${val}&language=2&limit=50`);
    return res.data.results;
}

function createExForm(exName) {
    curr.innerHTML = '';

    let h3 = document.createElement('h3');
    h3.innerText = exName;

    let deleteIcon = document.createElement('span');
    deleteIcon.innerHTML = '<i class="fa-solid fa-x"></i>';
    deleteIcon.addEventListener('click', function(){
        curr.innerHTML = '';
    });
    h3.appendChild(deleteIcon);

    let exInfo = document.createElement('input');
    exInfo.type = 'hidden';
    exInfo.name = 'ex-info';

    curr.appendChild(h3);
    curr.appendChild(exInfo);
}

function createSetForm() {
    let setWrapper = document.createElement('div');
    setWrapper.classList.add('setForm');

    let setCount = document.querySelectorAll('#curr .setForm').length;

    let h4 = document.createElement('h4');
    h4.innerText = `Set ${setCount + 1}`;
    setWrapper.appendChild(h4);

    let deleteIcon = document.createElement('span');
    deleteIcon.innerHTML = '<i class="fa-solid fa-x"></i>';
    deleteIcon.addEventListener('click', function(e) {
        let setForm = e.target.parentElement.parentElement.parentElement;
        curr.removeChild(setForm);
    });
    h4.appendChild(deleteIcon);

    let div = document.createElement('div');
    div.classList.add('tw');
    let tw_label = document.createElement('label');
    let tw_input = document.createElement('input')
    tw_input.id = 'tw';
    tw_input.type = 'number';
    tw_input.name = 'tw';
    tw_input.classList.add('form-control');
    tw_label.for = 'tw';
    tw_label.innerText = 'Target Weight';
    div.appendChild(tw_label);
    div.appendChild(tw_input);
    setWrapper.appendChild(div);

    div = document.createElement('div');
    div.classList.add('tr');
    let tr_label = document.createElement('label');
    let tr_input = document.createElement('input')
    tr_input.id = 'tr';
    tr_input.type = 'number';
    tr_input.name = 'tr';
    tr_input.classList.add('form-control');
    tr_label.for = 'tr';
    tr_label.innerText = 'Target Reps';
    div.appendChild(tr_label);
    div.appendChild(tr_input);
    setWrapper.appendChild(div);


    div = document.createElement('div');
    div.classList.add('trpe');
    let trpe_label = document.createElement('label');
    let trpe_input = document.createElement('input')
    trpe_input.id = 'trpe';
    trpe_input.type = 'number';
    trpe_input.name = 'trpe';
    trpe_input.classList.add('form-control');
    trpe_label.for = 'trpe';
    trpe_label.innerText = 'Target RPE';
    div.appendChild(trpe_label);
    div.appendChild(trpe_input);
    setWrapper.appendChild(div);


    div = document.createElement('div');
    div.classList.add('rt');
    let rtMin = document.createElement('input');
    let rtSec = document.createElement('input');
    rtMin.type = 'number';
    rtSec.type = 'number';

    rtMin.placeholder = 'min';
    rtSec.placeholder = 'sec';
    rtMin.id = 'rt-min';
    rtSec.id = 'rt-sec';
    
    rtMin.classList.add('form-control', 'min');
    rtSec.classList.add('form-control', 'sec');
    let rt_label = document.createElement('label');
    rt_label.for = 'rt-min';
    rt_label.innerText = 'Rest Time';
    div.appendChild(rt_label);
    div.appendChild(rtMin);
    div.appendChild(rtSec);

    setWrapper.appendChild(div);

    curr.appendChild(setWrapper);
}

function setExInfo(card) {
    let exInfo = document.querySelector('#curr input[name="ex-info"]');
    let select = document.querySelector('#search-bar select');
    let index = select.selectedIndex;
    let muscleGroup = select.options[index].innerText;
    exInfo.dataset.id = card.dataset.id;
    exInfo.dataset.name = card.innerText;
    exInfo.dataset.muscle = muscleGroup;
}

function selectExercise(card) {
    createExForm(card.innerText);
    createSetForm();
    enableButtons();
    setExInfo(card);
}

function createExerciseCard(id, name) {
    card = document.createElement('div');
    card.setAttribute('data-id', id);
    card.classList.add('my-card');

    
    let link = document.createElement('a');
    link.dataset.bsToggle = "offcanvas";
    link.href = "#workout-detail";
    link.innerText = name;
    link.addEventListener('click', async function(e) {
        getWorkoutDetail(e.target);
    });

    card.appendChild(link);
    
    icon = document.createElement('span');
    icon.innerHTML = '<i class="fa-solid fa-plus fa-2xl"></i>';
    icon.addEventListener('click', function(e) {
        card = e.target.parentElement.parentElement;
        selectExercise(card);
    });
    
    card.appendChild(icon);
    curr.appendChild(card);

    return card;
}


let searchBtn = document.querySelector('#search-btn')
searchBtn.addEventListener('click', async function() {
    curr.innerHTML = '';
    let exercises = await getExercises();

    exercises.forEach(exercise => {
        createExerciseCard(exercise.id, exercise.name);
    });
});

let addSetBtn = document.querySelector('#add-set-btn');
addSetBtn.addEventListener('click', function() {
    createSetForm();
})

let nextBtn = document.querySelector('#next-btn');
nextBtn.addEventListener('click', function() {
    let exWrapper = document.querySelector('#exercise-wrapper');
    curr.id = '';

    let exInfo = curr.querySelector('input[name="ex-info"]');
    if (!exInfo){
        return;
    }

    if (curr === tail) {
        let newTail = document.createElement('div');
        newTail.classList.add('slide');
        newTail.style.left = '100%';
        tail = newTail;
        exWrapper.appendChild(newTail);    
    }

    slides = document.querySelectorAll('.slide');
    for (let slide of slides) {
        let percent = slide.style.left;
        let p = parseInt(percent.replace('%', '')) - 100;
        if (p === 0) {
            slide.id = 'curr';
            curr = slide;
        }
        slide.style.left = `${p}%`;
    }
});

let backBtn = document.querySelector('#back-btn');
backBtn.addEventListener('click', function() {
    if (curr !== head) {
        curr.id = '';

        slides = document.querySelectorAll('.slide');
        for (let slide of slides) {
            let percent = slide.style.left;
            let p = parseInt(percent.replace('%', '')) + 100;
            if (p === 0){
                slide.id = 'curr';
                curr = slide;
            }
            slide.style.left = `${p}%`;
        }    
    }
});

function setValues() {
    let slides = document.querySelectorAll('.slide');
    for (let slide of slides) {
        let input = slide.querySelector('input[name="ex-info"]');
        let sets = slide.querySelectorAll('.setForm');
        let exValues = {exId: input.dataset.id,
                        name: input.dataset.name,
                        muscle: input.dataset.muscle,
                        sets: []};
        for (let set of sets) {
            setInputs = set.querySelectorAll('input');
            if (setInputs.length > 0) {
                if (Array.from(setInputs).map((input) => input.value).some((val) => val !== '')){
                    let setValues = {tw: parseInt(setInputs[0].value),
                                    tr: parseInt(setInputs[1].value),
                                    trpe: parseFloat(setInputs[2].value),
                                    rt: parseInt(setInputs[3].value)*60 + parseInt(setInputs[4].value)};
                    exValues.sets.push(setValues);
                }
            }   
        }
        input.value =  JSON.stringify(exValues);       
    }
}

let form = document.querySelector('#submit');
form.addEventListener('submit', function() {
    setValues();
});









