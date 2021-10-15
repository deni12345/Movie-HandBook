function ExpandSearchInput() {
    var inputSearch = document.getElementById("input-search-text");
    if (!inputSearch.classList.contains("display-input-search")) {
        inputSearch.classList.add("display-input-search");
        inputSearch.focus();
    }
}

document.querySelector('#btn-search').addEventListener('click', (e) => {
    ExpandSearchInput()
})

document.querySelector('#btn-search').addEventListener('click', (e) => {
    const inputSearch = document.getElementById("input-search-text");
    const searchMovie = document.getElementById("form-search");
    if (inputSearch.value != '') {
        console.log(searchMovie)
        searchMovie.submit()
    }
})