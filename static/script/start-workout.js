let curr;
let head;
let tail;
let currSet;

currSetIndex = 0;

let finishBtn = document.querySelector('#submission-bar button');
finishBtn.disabled = true;

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

function setCurrSet() {
    currSet = document.querySelector('#curr .set-form:first-of-type');
}

window.addEventListener('DOMContentLoaded', function() {
    setSlidePosition();
    setCurrSet();
});

let nextBtn = document.querySelector('#next-btn');
nextBtn.disabled = true;
nextBtn.addEventListener('click', function() {
    curr.id = '';
    nextBtn.disabled = true;

    let exInfo = curr.querySelector('input[name="ex-info"]');
    if (!exInfo){
        return;
    }

    if (curr === tail) {
        return;
    }

    let slides = document.querySelectorAll('.slide');
    for (let slide of slides) {
        let percent = slide.style.left;
        let p = parseInt(percent.replace('%', '')) - 100;
        if (p === 0) {
            slide.id = 'curr';
            curr = slide;
        }
        slide.style.left = `${p}%`;
    }

    currSet = curr.querySelector('#curr .set-form:first-of-type');
    currSetIndex = 0;
});

let backBtn = document.querySelector('#back-btn');
backBtn.addEventListener('click', function() {
    if (curr !== head) {
        curr.id = '';

        let slides = document.querySelectorAll('.slide');
        for (let slide of slides) {
            let percent = slide.style.left;
            let p = parseInt(percent.replace('%', '')) + 100;
            if (p === 0){
                slide.id = 'curr';
                curr = slide;
            }
            slide.style.left = `${p}%`;
        }
        
        let sets = curr.querySelector('.set-form');
        currSetIndex = sets.length-1 ;
        currSet = sets[currSetIndex];
    }
});

function showCurrSet() {
    let sets = document.querySelector('#curr .set-form');

    for (let i = 0; i < sets.length; i++) {
        
    }
}

function nextSet() {
    let sets = document.querySelectorAll('#curr .set-form');
    
    if (currSetIndex < sets.length - 1) {
        currSet.style = "height: 0px; display: none;"
        currSetIndex++;
        currSet = sets[currSetIndex];
        currSet.style = "";
    } else {
        nextBtn.disabled = false;
        if (curr == tail) {
            finishBtn.disabled = false;
        }
    }



}

function showTimer() {
    let timer = document.querySelector('#timer');
    timer.style.top = "0px";
}

function activateTimer() {

    let time = document.querySelector('#time');
    if (time.getAttribute('active') === 'true'){
        return;
    }

    time.setAttribute('active', 'true');
    let rtMin = curr.querySelector('.rt input[name="rt-min"]').value;
    let rtSec = curr.querySelector('.rt input[name="rt-sec"]').value;
    console.log(typeof rtMin);
    console.log(rtMin);
    console.log(rtSec);
    let rt = parseInt(rtMin)*60 + parseInt(rtSec);
    console.log(rt);
    rtMin = Math.floor(rt/60);
    rtSec = rt % 60;
    
    if (rt) {
        showTimer();
    }

    if (rtSec < 10) {
        time.innerText = `${rtMin}:0${rtSec}`;
    }
    else {
        time.innerText = `${rtMin}:${rtSec}`;
    }    


    let id = setInterval(() => {
        rt--;
        if (rt > 0){
            rtMin = Math.floor(rt/60);
            rtSec = rt % 60;
            if (rtSec < 10) {
                time.innerText = `${rtMin}:0${rtSec}`;
            }
            else {
                time.innerText = `${rtMin}:${rtSec}`;
            }    
        }
        else {
            clearInterval(id);
            hideTimer();
        }
    }, 1000);

    let stopTimer = document.querySelector('#stop-timer');
    stopTimer.addEventListener('click', function() {
        clearInterval(id);
        hideTimer();
    })

}

function hideTimer() {
    let timer = document.querySelector('#timer');
    time = timer.querySelector('#time');
    time.setAttribute('active', 'false');
    timer.style.top = "100%";
}


let nextSetBtn = document.querySelector('#next-set-btn');
nextSetBtn.addEventListener('click', function() {
    let sets = curr.querySelectorAll('.set-form');

    if (currSetIndex < sets.length){
        activateTimer();
    }

    nextSet();
});

function setValues() {
    let slides = document.querySelectorAll('.slide');
    for (let slide of slides) {
        let input = slide.querySelector('input[name="ex-info"]');
        let sets = slide.querySelectorAll('.set-form');
        let exValues = {exId: input.dataset.id,
                        sets: []};
        for (let set of sets) {
            let tw = parseInt(set.querySelector('.tw input').value);
            let cw = parseInt(set.querySelector('.cw input').value);
            let tr = parseInt(set.querySelector('.tr input').value);
            let cr = parseInt(set.querySelector('.cr input').value);
            let trpe = parseFloat(set.querySelector('.trpe input').value);
            let crpe = parseFloat(set.querySelector('.crpe input').value);
            let rtMin = parseInt(set.querySelector('.rt input[name="rt-min"]').value)*60;
            let rtSec = parseInt(set.querySelector('.rt input[name="rt-sec"]').value);
            let rt = rtMin + rtSec;

            setValues = {
                tw,
                cw,
                tr,
                cr,
                trpe,
                crpe,
                rt
            }
            exValues.sets.push(setValues);
        }
        input.value =  JSON.stringify(exValues);       
    }
}

let form = document.querySelector('#submit');
form.addEventListener('submit', function() {
    setValues();
});





