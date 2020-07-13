export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list')
}

export const renderLoader = parent => {
    const loader = `
        <div class=loader>
            <i class="fas fa-spinner"></i>
        </div>
    `
    parent.insertAdjacentHTML('afterbegin', loader);
}