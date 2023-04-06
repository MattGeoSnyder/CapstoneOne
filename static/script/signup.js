let $reqInfo = $('#req-info');
let $addInfo = $("#add-info");
let $nxtBtn = $('#next');
let $backBtn = $('#back');
let form = document.querySelector('form');

$nxtBtn.click(function() {
    $reqInfo.addClass('slide');
    $addInfo.addClass('slide');
})

$backBtn.click(function() {
    $reqInfo.removeClass('slide');
    $addInfo.removeClass('slide');
})


