window.addEventListener('DOMContentLoaded', function() {
    positionIcons()
});

function shuffleIcons(array) {
    let currIndex = array.length;
    
    let icons = Array.from(array);

    while (currIndex != 0) {
        randomIndex = Math.floor(Math.random() * currIndex);
        currIndex--;

        [icons[currIndex], icons[randomIndex]] = [icons[randomIndex], icons[currIndex]];
    }

    return icons;
}

let x = [5, 20, 75, 90];
let y = [5, 25, 45, 65, 85];

coords = [];
for (let y_0 of y){
    for (let x_0 of x) {
        coords.push({x_0,y_0});
    }
}

function positionIcons() {
    let icons = document.querySelectorAll('.bg-icon');
    let background = document.querySelector('#background');

    icons = shuffleIcons(icons);
    coordIndex = 0;
    for (let icon of icons) {
        let deg = Math.floor(Math.random()*90) - 45;

        icon.style.transform = `rotate(${deg}deg)`;
        icon.style.left = `${coords[coordIndex].x_0}vw`;
        icon.style.top = `${coords[coordIndex].y_0}vh`;
        coordIndex++;
    }
}
