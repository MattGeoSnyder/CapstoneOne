const WGER = 'https://wger.de/api/v2';


async function getWorkoutDetail(link) {
    let container = link.parentElement;
    let exerciseId = container.dataset.id;

    let workoutDetail = document.querySelector('#workout-detail');
    let label = workoutDetail.querySelector('#workout-detail-label');
    let detailImage = workoutDetail.querySelector('#detail-image');
    detailImage.innerHTML = '';
    detailImage.style.backgroundImage = '';
    let detailBody = workoutDetail.querySelector('#detail-body');


    let detailRes = await axios.get(`${WGER}/exercise/${exerciseId}`);
    let exerciseBase = detailRes.data.exercise_base;
    let imageRes;
    try {
        imageRes = await axios.get(`${WGER}/exerciseimage?exercise_base=${exerciseBase}`);
        let image = imageRes.data.results[0].image;
        detailImage.style.backgroundImage = `url(${image})`;
    } catch (error) {
        console.log(error);
        let text = document.createTextNode('Image Not Found');
        detailImage.appendChild(text);
        let icon = document.createElement('span');
        icon.innerHTML = '<i class="fa-solid fa-dumbbell fa-2xl"></i>';
        detailImage.appendChild(icon);
    }

    let detail;
    let image;

    let detailName = detailRes.data.name;
    label.innerText = detailName;

    detail = detailRes.data.description;
    if (detail) {
        detailBody.innerHTML = detail;
    } else {
        detailBody.innerHTML = '<p>Description not found.</p>';
    }

}
