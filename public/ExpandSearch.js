function ExpandSearchInput() {
    var inputSearch = document.getElementById("InputSearchText");
    if (!inputSearch.classList.contains("DisplayInputSearch")) {
        inputSearch.classList.add("DisplayInputSearch");
        inputSearch.focus();
    }
}