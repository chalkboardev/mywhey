require("./qf/predictiveSearch");
require("./qf/LocalizationForm");

import { CartQf } from './qf/cart';
import { GlobalListeners } from './qf/global_listeners';
import { WishlistObjectQf } from './qf/wishlistAsObject';
import { ModalController } from './qf/ModalController';
import { LoadMore } from './qf/loadMore';
import { QfForm } from './qf/formSubmission';


window.cart = new CartQf();
window.globalListeners = new GlobalListeners();
window.wishlist = new WishlistObjectQf();
window.modalController = new ModalController()
window.LoadMore = LoadMore;
window.QfForm = QfForm;