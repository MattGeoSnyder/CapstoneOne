if (window.innerWidth <= 768) {
    let profile = document.querySelector('#profile-link');
    profile.innerHTML = 'Profile';
}

window.addEventListener('resize', function(e) {
    let profile = document.querySelector('#profile-link');
    if (window.outerWidth <= 768) {
        profile.innerHTML = 'Profile';
    }
    if (window.outerWidth > 768) {
        let div = document.createElement('div');
        div.id = 'profile';
        div.style.height = '40px';
        div.style.width = '40px';
        div.innerHTML = '<i class="fa-solid fa-user"></i>';
        profile.innerHTML = '';
        profile.appendChild(div);
    }
})