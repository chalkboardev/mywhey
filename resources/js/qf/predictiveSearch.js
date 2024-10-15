document.addEventListener('DOMContentLoaded', () => {
    let searchBars = document.querySelectorAll('.search-trigger');
    let body = document.body;
    let resultsWrapper = document.querySelector('.predictive-search-container')
    let resultsContainer = resultsWrapper.querySelector('.inner');

    searchBars.forEach(searchBar => {

        // Site search using predictive search api
        const predictiveSearchCallBack = () => {
            const section_name = 'gb-predictive-search';

            if (searchBar.value.length > 2) {

                var requestResponse;
                fetch(`/search/suggest?q=${searchBar.value}&resources[type]=product,collection,article,page&section_id=${section_name}`)
                    .then((response) => {
                        requestResponse = response;
                        return response.text();
                    })
                    .then((text) => {
                        if (!requestResponse.ok) {
                            throw new Error(`${requestResponse.status}: ${text}`);
                        }
                        resultsWrapper.classList.add('active');
                        body.classList.add('fixed');

                        const resultsMarkup = new DOMParser()
                            .parseFromString(text, 'text/html')
                            .querySelector(`#shopify-section-${section_name}`).innerHTML;

                        resultsContainer.innerHTML = resultsMarkup;
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                resultsContainer.innerHTML = '';
                resultsWrapper.classList.remove('active');
                body.classList.remove('fixed');
            }
        }

        let searchMethod = predictiveSearchCallBack;

        if (searchBar && resultsContainer) {
            searchBar.addEventListener('keyup', searchMethod)
            let closeButton = resultsWrapper.querySelector('.close');
            let searchTrigger = document.querySelector('.mega-menu .mega-menu-controls [data-open-search]');
            let search = document.querySelector('.mega-menu .mega-menu-controls .header-search-bar-wrapper');
            let searchInput = document.querySelector('.mega-menu .mega-menu-controls .header-search-bar-wrapper .search-bar-qf input');
            closeButton.addEventListener('click', () => {
                resultsWrapper.classList.remove('active');
                body.classList.remove('fixed');
                searchInput.value = '';
                if (searchTrigger.classList.contains('active')) {
                    searchTrigger.classList.remove('active');
                    search.classList.remove('active');

                }

            })
        }
    })

})