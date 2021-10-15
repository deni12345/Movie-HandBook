ShowSubMenu();
setting();

function DisplaySideNav() {
    var sideNav = document.getElementById("nav-menu");
    sideNav.classList.toggle('display-side-nav');
    HideSub();
}

function ShowSubMenu() {
    let buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(element => {
        element.addEventListener("click", function() {
            if (element.querySelectorAll('.sub').length > 0) {
                element.querySelectorAll('.sub')[0].classList.toggle("show-sub");
            }
            HideSub(element.querySelectorAll('.sub')[0]);
        });
    });
}

function HideSub(exeptedClass) {
    let listSub = document.querySelectorAll('.sub');
    listSub.forEach(element => {
        if (element !== exeptedClass) {
            element.classList.remove('show-sub');
        }
    });
}


document.onclick = function(e) {
    var inputSearch = document.getElementById("input-search-text");
    var sideNav = document.getElementById("nav-menu");
    if (inputSearch.classList.contains('display-input-search')) {
        if (!e.target.closest('#btn-search') && e.target.id !== 'input-search-text') {
            inputSearch.classList.remove("display-input-search");
        }
    } else if (sideNav.classList.contains('display-side-nav')) {
        if (!e.target.closest('#nav-menu') && e.target.id !== 'hamburger') {
            sideNav.classList.remove("display-side-nav");
            HideSub();
        }
    }
};

//Setting the filepond
function setting() {
    FilePond.registerPlugin(
        FilePondPluginFileEncode,
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginImageTransform);

    let coverPond, posterPond
    const fileInputs = document.querySelectorAll('input[type="file"]')

    if (fileInputs.length > 0) {
        coverPond = FilePond.create(fileInputs[0])
        coverPond.setOptions({
            stylePanelAspectRatio: 400 / 1000,
            imageResizeTargetWidth: 1000,
            imageResizeTargetHeight: 400
        })
        posterPond = FilePond.create(fileInputs[1])
        posterPond.setOptions({
            stylePanelAspectRatio: 350 / 200,
            imageResizeTargetWidth: 200,
            imageResizeTargetHeight: 350
        })
    }
}