document.addEventListener('DOMContentLoaded', function() {

    // Load more products

    const load_btn = document.querySelector(".custom-filter-load-more");

    let products_on_page = document.querySelector('.collection-grid');

    let url = products_on_page.getAttribute('data-next-url');

    const spinner = document.querySelector('.load-more-spinner');

    if (load_btn) {
        if (url === '') {
            load_btn.style.display = 'none';
        }

        load_btn.addEventListener("click", () => {
            var total_showing = document.querySelector(".update_product_count").innerHTML;
            var paginate_size = document.querySelector(".collection_paginate_size").innerHTML;

            spinner.classList.add("show");

            fetch(url)
                .then(function(response) {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .then(function(data) {
                    const html = document.createElement('div');
                    html.innerHTML = data;

                    let links = html.querySelector('.pagination-links').innerHTML;
                    document.querySelector('.pagination-links').innerHTML = links;

                    let new_grid = html.querySelector('.collection-grid');
                    url = new_grid.getAttribute('data-next-url');
                    if (url === '') {
                        load_btn.style.display = 'none';
                    }
                    //let new_products = new_grid.querySelectorAll(".product-card, #collection-grid-cta, #collection-grid-cta-2");
                    let new_products = new_grid.querySelectorAll(".product-card");

                    new_products.forEach(new_prod => {
                        products_on_page.append(new_prod);
                    });
                    spinner.classList.remove("show");
                    //alert('test');
                    document.querySelector(".update_product_count").innerHTML = Number(total_showing) + Number(paginate_size);
                })
                .catch(function(error) {
                    window.log(error);
                });

        })
    }

    const rangeInput = document.querySelectorAll(".range-input input");
    if (rangeInput) {
        const priceInput = document.querySelectorAll(".price-input-show");
        const range = document.querySelector(".slider .progress");
        const minFilterInput = document.querySelector('.min-price-filter');
        const maxFilterInput = document.querySelector('.max-price-filter');
        let priceGap = 1;

        if (maxFilterInput) {
            range.style.left = ((minFilterInput.value / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxFilterInput.value / rangeInput[1].max) * 100 + "%";
            rangeInput[0].value = minFilterInput.value;
            rangeInput[1].value = maxFilterInput.value;
            priceInput[0].innerHTML = minFilterInput.value;
            priceInput[1].innerHTML = maxFilterInput.value;
        }

        priceInput.forEach(input => {
            input.addEventListener("input", e => {
                let minPrice = parseInt(priceInput[0].innerHTML);
                let maxPrice = parseInt(priceInput[1].innerHTML);

                if ((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max) {
                    if (e.target.className === "input-min") {
                        rangeInput[0].value = minPrice;
                        rangeInput[0].setAttribute("data-term", minPrice);
                        range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
                    } else {
                        rangeInput[1].value = maxPrice;
                        maxFilterInput.value = maxVal;
                        range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
                    }
                }
            });
        });

        rangeInput.forEach(input => {
            input.addEventListener("input", e => {
                let minVal = parseInt(rangeInput[0].value),
                    maxVal = parseInt(rangeInput[1].value);

                if ((maxVal - minVal) < priceGap) {
                    if (e.target.className === "range-min") {
                        rangeInput[0].value = maxVal - priceGap
                    } else {
                        rangeInput[1].value = minVal + priceGap;
                    }
                } else {
                    priceInput[0].innerHTML = minVal;
                    priceInput[1].innerHTML = maxVal;
                    range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
                    range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
                    minFilterInput.value = minVal;
                    maxFilterInput.value = maxVal;
                }
            });
        });
    }


    let custom_filters = document.querySelectorAll(".custom-filter")

    custom_filters.forEach((el) => {

        let control = el.querySelector(".filter-heading")
        let body = el.querySelector(".filter-body")

        if (control && body) {

            control.addEventListener('click', () => {

                if (el.classList.contains("open")) {
                    el.classList.remove("open")
                } else {
                    el.classList.add("open")
                }

            })
        }
    })

    let mobile_control = document.querySelector(".mobile-filter-heading");
    let filter_body = document.querySelector(".custom-filter-wrapper");

    if (mobile_control && filter_body) {
        mobile_control.addEventListener('click', () => {
            //console.log("CLICK");
            //document.querySelector(".mobile-filter-heading").style.content = "Hello";
            document.querySelector(".mobile-filter-heading h2").innerHTML = "Hide Filters & Sort";
            var source = document.querySelector(".filters_contents");
            document.querySelector(".collection-grid-wrapper").prepend(source);
            document.querySelector(".cta1").classList.add("adjust_cta1");
            document.querySelector(".collection-grid-wrapper").classList.add("plp_open_filter");
            document.querySelector(".filter-container-wrapper").classList.add("filter_open");
            document.querySelector(".filter-container-wrapper").classList.remove("plp_filter_start");
            document.querySelector(".collection-grid").classList.add("shift_right");

            //document.getElementById("collection-grid-cta").style.display = "none";
            // rotate svg
            if (mobile_control.classList.contains("open")) {
                mobile_control.classList.remove("open")
            } else {
                mobile_control.classList.add("open");
                //console.log("OPEN");
            }

            // open filters
            if (filter_body.classList.contains("open")) {
                filter_body.classList.remove("open");
                //console.log("CLOSED");
                document.querySelector(".mobile-filter-heading h2").innerHTML = "Show Filters & Sort";
                document.querySelector(".collection-grid-wrapper").classList.remove("plp_open_filter");
                document.querySelector(".filter-container-wrapper").classList.remove("filter_open");
                document.querySelector(".filter-container-wrapper").classList.add("plp_filter_start");
                document.querySelector(".cta1").classList.remove("adjust_cta1");
                //document.querySelector(".filter-container-wrapper").style.display = "red";
            } else {
                filter_body.classList.add("open")
            }
        })
    }

    // Hide reset filters when no filters active
    const reset_filters = document.querySelector('.reset-filter-wrapper');
    const selected_filters_html = document.querySelectorAll('.selected-filter-wrapper *');

    if (selected_filters_html.length > 0) {
        reset_filters.style.display = 'block';
    }

    selected_filters_html.forEach(selected => {
        selected.addEventListener('click', () => {
            collection_grid.classList.add("loading")
        })
    })

    // Submit form on input change

    // const filter_inputs = document.querySelectorAll('.filter-container-wrapper select, .filter-container-wrapper input');
    // const filter_form = document.querySelector('.filter-container');
    // const reset_filter = document.querySelector('#reset-filters');
    // const collection_grid = document.querySelector('.collection-grid');

    // filter_inputs.forEach(input => {
    //     input.addEventListener('change', () => {
    //         ///collection_grid.classList.add("loading")
    //         //filter_form.submit()
    //     })
    // })

    // reset_filter.addEventListener('click', () => {
    //     collection_grid.classList.add("loading")
    // })

    // const filter_submit_btn = document.querySelectorAll('#submit_filters');
    // const reset_filter_btn = document.querySelector('#clear_filters');

    // filter_submit_btn.addEventListener('click', () => {
    //     collection_grid.classList.add("loading")
    //     filter_form.submit()
    // })

    // reset_filter_btn.addEventListener('click', () => {
    //     collection_grid.classList.add("loading")
    // })

    const filter_inputs = document.querySelectorAll('#submit_filters');
    const filter_reset_inputs = document.querySelectorAll('.reset-filters');
    const filter_form = document.querySelector('.filter-container');
    const reset_filter = document.querySelector('#reset-filters');
    const collection_grid = document.querySelector('.collection-grid');

    filter_inputs.forEach(input => {
        input.addEventListener('click', () => {
            collection_grid.classList.add("loading")
            filter_form.submit()
        })
    })

    // filter_reset_inputs.forEach(input => {
    //     input.addEventListener('click', () => {
    //         collection_grid.classList.add("loading")
    //     })
    // })

    // reset_filter.addEventListener('click', () => {
    //     collection_grid.classList.add("loading")
    // })

    filter_reset_inputs.forEach(input => {
        input.addEventListener('click', () => {
            collection_grid.classList.add("loading")
            filter_form.submit()
        })
    })

    //console.log("test...");
    // alert("test...");

    // var el = document.querySelector('.filter-container-wrapper');
    // el.parentNode.removeChild(el);

})