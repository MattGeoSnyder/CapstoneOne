let curr;
let head;
let tail;

function setSlidePosition() {    
    let slides = document.querySelectorAll('.slide');
    head = slides[0];
    offset = 0;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.left = `${offset}%`;
        offset += 100;
        if (i === 0){
            slides[i].id = 'curr';
            curr = slides[i];
        }
        if (i === slides.length - 1) {
            tail = slides[i];
        }
    }
}

function disableButtons() {
    let submit = document.querySelector('#submission-bar button');
    submit.disabled = true;
}

window.addEventListener('DOMContentLoaded', function() {
    setSlidePosition();
    disableButtons();
});

function createExForm(exName) {
    curr.innerHTML = '';

    let h3 = document.createElement('h3');
    h3.innerText = exName;

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


function selectExercise(card) {
    createExForm(card.innerText);
    createSetForm();
    setExInfo(card);
}

function createExerciseCard(id, name) {
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

let addSetBtn = document.querySelector('#add-set-btn');
addSetBtn.addEventListener('click', function() {
    createSetForm();
    enableButtons();
})

let nextBtn = document.querySelector('#next-btn');
nextBtn.addEventListener('click', function() {
    if (curr !== tail){
        let exWrapper = document.querySelector('#exercise-wrapper');
        curr.id = '';

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
        console.log(exValues);
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

function enableButtons() {
    let slides = document.querySelectorAll('.slide');
    let submit = document.querySelector('#submission-bar button');
    for (let slide of slides) {
        let setForm = slide.querySelector('.setForm');
        if (!setForm){
            return;
        }
    }
    submit.disabled = false;
}

let form = document.querySelector('#submit');
form.addEventListener('submit', function() {
    setValues();
});









