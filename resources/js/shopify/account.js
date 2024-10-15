const container = document.querySelector('tbody');
const button = document.querySelector('.orders-load-more');
const totalOrders = container.children;
const total = totalOrders.length;
let loadMore = 5;
const orders = container.querySelectorAll('.d-none');

for (i = 0; i < orders.length; i++) {
    if (i  >= loadMore) {
        break;
    }

    orders[i].classList.remove('d-none');
}

if (container.querySelectorAll('.d-none').length === 0) {
    button.style.display = 'none';
}

button.addEventListener('click', function () {
    const orders = container.querySelectorAll('.d-none');

    let counter = 0;
    for (i = 0; i < orders.length; i++) {
        if (i < loadMore) {
            orders[i].classList.remove('d-none');
        }
    }

    counter += loadMore;

    if (orders.length <= loadMore) {
        button.style.display = 'none';
    }
});