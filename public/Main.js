ShowSubMenu();

function DisplaySideNav() {
    var sideNav = document.getElementById("NavMenu");
    sideNav.classList.toggle('DisplaySideNav');
}

function ShowSubMenu() {
    let buttons = document.querySelectorAll('.NavBtn');
    buttons.forEach(element => {
        element.addEventListener("click", function() {
            if (element.querySelectorAll('.Sub').length > 0) {
                element.querySelectorAll('.Sub')[0].classList.toggle("Show-Sub");
            }
            HideSub(element.querySelectorAll('.Sub')[0]);
        });
    });
}

function HideSub(exeptedClass) {
    let listSub = document.querySelectorAll('.Sub');
    listSub.forEach(element => {
        if (element !== exeptedClass) {
            element.classList.remove('Show-Sub');
        }
    });
}


document.onclick = function(e) {
    var inputSearch = document.getElementById("InputSearchText");
    var sideNav = document.getElementById("NavMenu");
    if (inputSearch.classList.contains('DisplayInputSearch')) {
        if (!e.target.closest('#BtnSearch') && e.target.id !== 'InputSearchText') {
            inputSearch.classList.remove("DisplayInputSearch");
        }
    } else if (sideNav.classList.contains('DisplaySideNav')) {
        if (!e.target.closest('#NavMenu') && e.target.id !== 'Hamburger') {
            sideNav.classList.remove("DisplaySideNav");
            HideSub();
        }
    }
};