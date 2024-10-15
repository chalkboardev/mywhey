const recommeneded_section = document.querySelector('.product-recommendations');
const recommendations_local = localStorage.getItem("recommendations"); 
const options = {
  rootMargin: '400px'
}

const observer = new IntersectionObserver(entry => {

  if (entry[0].isIntersecting == true) {

    observer.unobserve(recommeneded_section);

    const productRecommendationsSection = document.querySelector('.product-recommendations');
    const url = productRecommendationsSection.dataset.url;
    if(recommendations_local) {
      const recommendations = recommendations_local;
      if (recommendations && recommendations.trim().length) {
        productRecommendationsSection.innerHTML = recommendations;
        const swiper_recommended = new window.swiper('.recommendations-slider', {
          slidesPerView: 1.5,
          spaceBetween: 10,
          breakpoints: {
            768: {
              slidesPerView: 3
            },
            992: {
              slidesPerView: 4
            },
            1200: {
              slidesPerView: 5
            }
          },
          lazy: {
            enabled: true,
            checkInView: false,
            loadOnTransitionStart: true,
            loadPrevNext: true,
            loadPrevNextAmount: 1
          },
        });
      }
    } else {
      fetch(url)
      .then(response => {
        if (!response.ok) {
          console.error("response was not ok");
          return null;
        }
        return response.text();
      })
      .then(text => {
        const html = document.createElement('div');
        html.innerHTML = text;
        const recommendations = html.querySelector('.product-recommendations');
        localStorage.setItem("recommendations", recommendations.innerHTML);
        if (recommendations && recommendations.innerHTML.trim().length) {
          productRecommendationsSection.innerHTML = recommendations.innerHTML;
          const swiper_recommended = new window.swiper('.recommendations-slider', {
            slidesPerView: 1.5,
            spaceBetween: 10,
            breakpoints: {
              768: {
                slidesPerView: 3
              },
              992: {
                slidesPerView: 4
              },
              1200: {
                slidesPerView: 5
              }
            },
            lazy: {
              enabled: true,
              checkInView: false,
              loadOnTransitionStart: true,
              loadPrevNext: true,
              loadPrevNextAmount: 1
            },
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
  }

}, options);

observer.observe(recommeneded_section);
