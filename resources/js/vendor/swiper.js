// // import Swiper bundle with all modules installed
// import Swiper from "swiper/bundle";
// // import styles bundle
// import "swiper/css/bundle";

// window.swiper = Swiper;


// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination, Controller, Thumbs, Autoplay, FreeMode } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/controller';
import 'swiper/css/thumbs';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';


Swiper.use([Navigation, Pagination, Controller, Thumbs, Autoplay, FreeMode ])
window.swiper = Swiper
