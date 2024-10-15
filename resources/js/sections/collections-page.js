document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.collections-list-swiper').forEach((node)=>{
        const coll_swiper = new window.swiper(node, {
            slidesPerView: 1.5,
            spaceBetween: 15,
            breakpoints: {
                768: {
                slidesPerView: 2,
                },
                1028: {
                slidesPerView: 3,
                },
            },
        })
    })
})