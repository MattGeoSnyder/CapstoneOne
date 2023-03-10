const WGER = 'https://wger.de/api/v2';

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
        else if (i === slides.length - 1) {
            slides[i].id = 'tail';
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
        console.log(setForm);
        curr.removeChild(setForm);
    });
    h4.appendChild(deleteIcon);


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
                    let setValues = {tw: setInputs[0].value,
                                    tr: setInputs[1].value,
                                    trpe: setInputs[2].value,
                                    rt: setInputs[3].value};
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









