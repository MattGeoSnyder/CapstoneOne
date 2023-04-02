let form = document.querySelector("#header form");
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    let monthInput = document.querySelector("input[name='month']");
    let yearInput = document.querySelector("input[name='year']");

    month = monthInput.value;
    year = yearInput.value;

    let res = await axios.get(`/completed?month=${month}&year=${year}`);
    
})