ShowSubMenu();
setting();

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

document.querySelectorAll('.message a').forEach(Element => {
    Element.addEventListener('click', () => {
        document.querySelector('.register-form').classList.toggle('form-appear')
        document.querySelector('.login-form').classList.toggle('form-appear')
    })
})

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