function ExpandSearchInput() {
    var inputSearch = document.getElementById("InputSearchText");
    if (!inputSearch.classList.contains("DisplayInputSearch")) {
        inputSearch.classList.add("DisplayInputSearch");
        inputSearch.focus();
    }
}

document.querySelector('#BtnSearch').addEventListener('click', (e) => {
    ExpandSearchInput()
})

document.querySelector('#BtnSearch').addEventListener('click', (e) => {
    const inputSearch = document.getElementById("InputSearchText");
    const searchMovie = document.getElementById("form-search");
    if (inputSearch.value != '') {
        console.log(searchMovie)
        searchMovie.submit()
    }
})