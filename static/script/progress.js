window.addEventListener('DOMContentLoaded', function() {
    let icons = document.querySelectorAll('#completed-workouts i');

    for (let icon of icons) {
        icon.dataset.down = false;
        icon.addEventListener('click', dropdownHandler)
    }
});

function expand(icon) {
    icon.dataset.down = true;
    icon.classList.remove('fa-caret-down');
    icon.classList.add('fa-caret-up');
    let workoutContainer = icon.parentElement;
    let exercises = workoutContainer.nextElementSibling;

    exercises.style.maxHeight = '1000px';
}

function shrink(icon) {
    icon.dataset.down = false;
    icon.classList.remove('fa-caret-up');
    icon.classList.add('fa-caret-down');
    let workoutContainer = icon.parentElement;
    let exercises = workoutContainer.nextElementSibling;

    exercises.style.maxHeight = '0px';

}

function dropdownHandler(e) {
    let icon = e.target
    let sibling = e.target.parentElement.nextElementSibling;
    if (icon.dataset.down === 'true') {
        shrink(icon);
    } else {
        expand(icon);
    }
    scrollTo(sibling);
}