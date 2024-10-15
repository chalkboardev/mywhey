const recently_viewed_section = document.querySelector('.recently-viewed');

const options = {
  rootMargin: '100px'
}

const observer = new IntersectionObserver(entry => {

  if (entry[0].isIntersecting == true) {

    observer.unobserve(recently_viewed_section)

    let rec_prods = localStorage.getItem('recentlyViewedProductHandles');
    if (rec_prods) {
      rec_prods_arr = rec_prods.replace("[", "").replace("]", "").split(',');

      let recently_viewed = document.querySelector('.recently-viewed-slider');

      rec_prods_arr.forEach(rec_prod => {
        let handle = rec_prod.replace(/"/g, '');

        fetch(window.Shopify.routes.root + `products/${handle}?view=card&section_id=gb-product-card`)
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error("Error: " + response.status);
            }
          })
          .then(data => {
            const htmlDocument = new DOMParser().parseFromString(data, "text/html");
            const productCard = htmlDocument.documentElement.querySelector("[product-card]");
            const productExists = productCard.dataset.productId;
            console.log("🚀 ~ observer ~ productExists:", productExists)
            if (productExists == "") {
              return;
            }
            let url = window.location.href + "#";
            let swiper_slide = document.createElement("div");
            swiper_slide.classList.add('swiper-slide');
            swiper_slide.insertAdjacentHTML('afterbegin', productCard.outerHTML);

            if (productCard !== url) {
              recently_viewed.insertAdjacentHTML('afterbegin', swiper_slide.outerHTML);
            }

            const recent_swiper = new window.swiper('.recently-swiper', {
              slidesPerView: 1.5,
              spaceBetween: 15,
              breakpoints: {
                768: {
                  slidesPerView: 2,
                },
                1028: {
                  slidesPerView: 3,
                },
                1280: {
                  slidesPerView: 4,
                },
              },
            });
          })
          .catch(error => {
            console.error(error);
          });

      });

    } else {
      document.querySelector('.recently-viewed #tab2').checked = true;
      document.querySelector('.recently-viewed #tab1 + label').style.display = 'none';
      document.querySelector('.recently-viewed .content1').style.display = 'none';
      document.querySelector('.recently-viewed #select-recently-viewed').style.display = 'none';
      document.querySelector('.recently-viewed .select-chevron').style.display = 'none';
      document.querySelector('.recently-viewed .custom-select').style.pointerEvents = 'none';
      document.querySelector('.recently-viewed .custom-select select').style.border = 'none';
      document.querySelector('.recently-viewed #select-bestsellers').selected = 'selected';
      document.querySelector('.recently-viewed .pipe').style.display = 'none';
      document.querySelector('.recently-viewed input:checked + label').style.border = 'none';
    }

    // Init section settings collection swiper
    const coll_swiper = new window.swiper('.best-sellers-swiper', {
      slidesPerView: 1.5,
      spaceBetween: 15,
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1028: {
          slidesPerView: 3,
        },
        1280: {
          slidesPerView: 4,
        },
      },
    });
  }


}, options)

observer.observe(recently_viewed_section)