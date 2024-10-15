export class GlobalListeners {
  constructor() {
    this.selectors = {
      quickAdds: '[quick-add-qf]',
      productForm: `[action="${window.Shopify.routes.root}cart/add"]:not(.ctl-product-form [action="${window.Shopify.routes.root}cart/add"])`,
      openSideCart: '.openSideCart',
      closeSideCart: '.closeSideCart',
      removeButtons: '.cart .items-wrapper .item .remove-item',
      quantitySelectorPlus: '.cart .items-wrapper .item .quantity-wrapper .plus',
      quantitySelectorMinus: '.cart .items-wrapper .item .quantity-wrapper .minus',
      cartCount: '.cart-count',
      accordion: 'accordion',
      product_description: '[read-more-container]',
      quickview: '[open-quick-view]',
      quickviewModal: '.quick-view-container',
      quickviewClose: '.quick-view-container .close',
    };

    this.init();
  }

  init() {
    window.log("Initializing global QF listeners");
    document.body.addEventListener('click', this.handleEvent.bind(this));
    document.body.addEventListener('submit', this.handleFormSubmit.bind(this));
    this.cartRelated();
  }

  handleFormSubmit(e) {
    this.productForm(e);
  }

  handleEvent(e) {
    this.headerSearch(e);
    this.productQuickAdd(e);
    this.siteCart(e);
    this.quantityButtons(e);
    this.removeCartItem(e);
    this.accordions(e);
    this.productDescriptions(e);
    this.sideCartTabs(e);
    this.mobileMenu(e);
    this.mobileSubMenu(e);
    this.openQuickView(e);
    this.closeQuickView(e);
  }

  productQuickAdd(e) {
    // PRODUCT QUICK ADD
    const quickAdd = e.target.closest(this.selectors.quickAdds);
    if (quickAdd) {
      e.preventDefault();
      const quantity = parseInt(quickAdd.dataset.quantity);
      if (quickAdd.dataset.id && quantity > 0) {
        window.cart.add({ items: [{ "id": quickAdd.dataset.id, "quantity": quantity }] });
      }
    }
  }

  productForm(e) {
    // PRODUCT FORM LISTENER
    // const productForms = document.querySelectorAll(this.selectors.productForms);
    const productForm = e.target.closest(this.selectors.productForm);
    if (productForm) {
      e.preventDefault();
      const quantity = productForm.querySelector("input.quantity-selector").value;
      const id = productForm.querySelector("#product-id").value;

      let properties = {};
      const propertyFields = productForm.querySelectorAll('.property');

      if (propertyFields) {
        propertyFields.forEach(field => {
          const key = field.getAttribute('name');
          const value = field.value;
          if (key && value) {
            properties[key] = value;
          }
        });
        console.log("Properties: ", properties)
      }


      if (quantity && id) {
        window.cart.add({ items: [{ "id": id, "quantity": quantity, "properties": properties }] });
      }
    }
  }

  siteCart(e) {
    // SITE CART OPEN AND CLOSE
    if (!window.QF.settings.sideCart) return;

    const openSideCart = e.target.closest(this.selectors.openSideCart);
    if (openSideCart) {
      e.preventDefault();
      window.cart.openSideCart();
    }

    const closeSideCart = e.target.closest(this.selectors.closeSideCart);
    if (closeSideCart) {
      e.preventDefault();
      window.cart.closeSideCart();
    }

    if (e.target.classList.contains('cart-drawer-container')) {
      window.cart.closeSideCart();
    }
  }

  quantityButtons(e) {
    // QUANTITY PLUS CART
    const quantityPlus = e.target.closest(this.selectors.quantitySelectorPlus);
    if (quantityPlus) {
      if (quantityPlus.getAttribute("data-pending") === "true") return;
      quantityPlus.setAttribute("data-pending", true);

      const quantityElement = quantityPlus.parentNode.querySelector(".quantity span");
      const stock = quantityElement.getAttribute("data-stock");
      const current = parseInt(quantityElement.innerHTML);
      const variant_key = quantityElement.closest('.item').getAttribute("data-variant-key");
      const inv_policy = quantityElement.getAttribute("data-inventory-policy");
      if (inv_policy === "continue" || stock > 0) {
        // if in stock or continue selling when out of stock, update cart
        const updated = current + 1;
        window.cart.change({ "id": variant_key, "quantity": updated });
      }
    }

    // QUANTITY MINUS CART
    const quantityMinus = e.target.closest(this.selectors.quantitySelectorMinus);
    if (quantityMinus) {
      if (quantityMinus.getAttribute("data-pending") === "true") return;
      quantityMinus.setAttribute("data-pending", true);

      const quantity = quantityMinus.parentNode.querySelector(".quantity span");
      const current = parseInt(quantity.innerHTML);
      const variant_key = quantity.closest('.item').getAttribute("data-variant-key");

      if (current > 0) {
        const updated = current - 1;
        window.cart.change({ "id": variant_key, "quantity": updated });
      }
    }
  }

  removeCartItem(e) {
    // REMOVE ITEM CART
    const removeButtons = e.target.closest(this.selectors.removeButtons);
    if (removeButtons) {
      const variant_key = removeButtons.closest('.item').getAttribute("data-variant-key");
      window.cart.change({ "id": variant_key, "quantity": 0 });
    }
  }

  cartRelated() {
    // update side cart/cart after change
    const renderCarts = () => {
      if (window.template === "cart") {
        window.cart.reRenderCart();
      } else {
        if (window.QF.settings.ajax_open_side_cart) {
          window.cart.openSideCart();
        } else if (window.QF.settings.ajax_toast) {
          window.cart.reRenderSideCart();
        }
      }
    };
    window.addEventListener("cart_changed", renderCarts);
    window.addEventListener("item_removed", renderCarts);

    // CART COUNT
    window.addEventListener("cart_changed", e => {
      if (e.detail.cart) {
        const cartCount = document.querySelectorAll(".cart-count");
        cartCount.forEach(count => {
          count.innerHTML = e.detail.cart.item_count;
        });
      }
    });
  }

  headerSearch(e) {
    const search = document.querySelector('.mega-menu .mega-menu-controls .header-search-bar-wrapper');
    const searchTrigger = document.querySelector('.mega-menu .mega-menu-controls [data-open-search]');
    const searchInput = document.querySelector('.mega-menu .mega-menu-controls .header-search-bar-wrapper .search-bar-qf input');

    if (search) {
      const target = e.target;

      if (target === searchTrigger || target.closest('[data-open-search]')) {
        if (!searchTrigger.classList.contains('active')) {
          searchTrigger.classList.add('active');
          search.classList.add('active');
          searchInput.focus();
        } else {
          searchTrigger.classList.remove('active');
          search.classList.remove('active');
          searchInput.value = '';
          let closeButton = document.querySelector('.predictive-search-modal .close');
          closeButton.click();

        }
      } else if (target === searchInput) {
        // Do nothing if the search input is clicked
        return;
      } else {
        // searchTrigger.classList.remove('active');
        // search.classList.remove('active');
      }

      if (e.key === 'Escape') {
        if (searchTrigger.classList.contains('active')) {
          searchTrigger.classList.remove('active');
          search.classList.remove('active');
          searchInput.value = '';
          let closeButton = document.querySelector('.predictive-search-modal .close');
          closeButton.click();
        }
      }
    }
  }

  mobileMenu(e) {
    const menu = document.querySelector('.mobile-menu-outer-wrapper');
    const menuTrigger = document.querySelector('#open-mobile-menu');
    const body = document.body;

    if (menuTrigger && e.target.closest('#open-mobile-menu')) {
      if (menuTrigger.classList.contains('active')) {
        menu.classList.remove('active');
        menuTrigger.classList.remove('active');
        body.classList.remove('fixed');
      } else {
        menu.classList.add('active');
        menuTrigger.classList.add('active');
        body.classList.add('fixed');
      }
    }

    if (e.target === menu) {
      menu.classList.remove('active');
      menuTrigger.classList.remove('active');
      body.classList.remove('fixed');
    }
  }

  mobileSubMenu(e) {

    const subMenuTrigger = document.querySelectorAll('.mobile-group__title');

    subMenuTrigger.forEach(trigger => {

      if (e.target.closest('.mobile-group__title') === trigger) {
        let parent = trigger.closest('.mobile-group');
        if (parent.classList.contains('active')) {
          parent.classList.remove('active');
        } else {
          parent.classList.add('active');
        }

      }

    });

  }

  sideCartTabs(e) {
    if (e.target && e.target.closest) {

      const cartTab = e.target.closest('.cart-tab');

      if (cartTab && !cartTab.classList.contains('active')) {

        const cartTabs = document.querySelectorAll('.cart-tab');

        cartTabs.forEach(tab => {
          tab.classList.remove('active');
        });

        let tabSelected = cartTab;
        tabSelected.classList.add('active');
        let tabData = tabSelected.getAttribute('data-tab');
        let cartContents = document.querySelectorAll('.cart-content');

        cartContents.forEach(cartContent => {
          cartContent.style.display = 'none';
        });

        document.querySelector('.' + tabData).style.display = 'flex';

        if (tabData === 'saved-cart') {
          if (window.wishlist && window.wishlist.needsUpdate) {
            window.wishlist.initSideCartGrid();
            window.wishlist.needsUpdate = false;
          } else {
            window.wishlist.initSideCartGrid();
          }
        }
      }
    }


  }
  accordions(e) {
    if (e.target.classList.contains(this.selectors.accordion)) {
      e.preventDefault();

      const accordion = e.target;
      const parent = accordion.parentElement;
      const sibling_accordions = parent.getElementsByClassName(this.selectors.accordion);
      const panel = accordion.nextElementSibling;


      if (sibling_accordions) {
        Array.from(sibling_accordions).forEach((acc) => {
          if (acc != accordion || accordion.classList.contains('active')) {
            acc.nextElementSibling.style.maxHeight = null;
            acc.classList.remove("active");

          } else {
            accordion.classList.add("active");
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        });
      }

    }
  }

  productDescriptions(e) {
    if (e.target.classList.contains('read-more')) {
      let el = e.target;

      if (el.classList.contains("active")) {
        el.classList.remove("active");
        el.closest(this.selectors.product_description).classList.remove("active");
        if (el.dataset.readMoreText != "") {
          el.innerHTML = el.dataset.readMoreText;
        }
      } else {
        el.classList.add("active");
        el.closest(this.selectors.product_description).classList.add("active");
        if (el.dataset.readLessText != "") {
          el.innerHTML = el.dataset.readLessText;
        }
      }

    }

  }

  openQuickView(e) {
    // OPEN QUICK VIEW
    const quickView = e.target.closest(this.selectors.quickview);
    if (quickView) {
      e.preventDefault();
      let pageHasRecomendations = document.querySelector(".product-recommendations") || false;
      let timeout = pageHasRecomendations ? 2000 : 0;

      setTimeout(async () => {
        let quickViewModal = document.querySelector(this.selectors.quickviewModal);

        if (quickViewModal) {
          let quickViewModalInner = quickViewModal.querySelector(".inner");

          let sectionName = "v2-main-product";

          let handle = quickView.getAttribute("data-product-handle");
          if (handle) {
            try {
              const response = await fetch(window.Shopify.routes.root + `products/${handle}?sections=${sectionName}`);
              if (response.ok) {
                const data = await response.json();
                let html = data[`${sectionName}`];

                const scripts_to_run = html.match(/<script qv-run>([\s\S]*?)<\/script>/gm);
                const scripts = [];
                if (scripts_to_run) {
                  scripts_to_run.forEach(script => {
                    script = script.replace("</script>", "").replace("<script qv-run>", "");
                    script = script.replace('document.addEventListener("DOMContentLoaded", () => {', "");

                    let closingBraceLocation = script.lastIndexOf("});");
                    script = script.substring(0, closingBraceLocation);

                    scripts.push(script);
                  });
                }

                if (quickViewModalInner && html) {
                  quickViewModalInner.innerHTML = html;

                  scripts.forEach(script_to_eval => {
                    new Function(script_to_eval)();
                  });

                  let qvLightboxButtons = quickViewModalInner.querySelectorAll('.lightbox-trigger');
                  qvLightboxButtons.forEach(lightbox => {
                    let lightboxHandle = `${handle}-qv-lightbox`;
                    lightbox.setAttribute('data-fslightbox', lightboxHandle);
                  });

                  // Refresh FsLightbox
                  refreshFsLightbox();


                  // init sliders
                  let gallery_thumbs_swiper = new window.swiper(".inner .thumb-swiper", {
                    spaceBetween: 15,
                    slidesPerView: 4,
                    freeMode: true,
                    watchSlidesProgress: true,
                    breakpoints: {
                      992: {
                        slidesPerView: 4,
                        direction: "vertical",
                      },
                    },
                  });

                  let gallery_swiper = new window.swiper(".inner .main-swiper", {
                    spaceBetween: 20,
                    navigation: {
                      nextEl: ".inner .swiper-button-next",
                      prevEl: ".inner .swiper-button-prev",
                    },
                    thumbs: {
                      swiper: gallery_thumbs_swiper,
                    },
                    on: {
                      init: function () {
                        let check_width = setInterval(() => {
                          setThumbHeight();
                        }, 200);

                        function setThumbHeight() {
                          let main_swiper_slide = document.querySelector('.inner .main-swiper-slide');
                          let thumb_swiper = document.querySelector('.inner .thumb-swiper');

                          let main_swiper_width = main_swiper_slide.offsetWidth;

                          main_swiper_slide.style.height = main_swiper_width + 'px';

                          if (main_swiper_width > 0) {
                            clearInterval(check_width);

                            thumb_swiper.style.cssText = "position: relative;opacity:1";

                            if (window.innerWidth > 991.98) {
                              thumb_swiper.style.height = main_swiper_width + 'px';
                            }
                          }
                        }

                        document.querySelector('.inner .gallery-container').style.opacity = 1;

                        window.addEventListener('resize', () => {
                          let main_swiper_slide = document.querySelector('.inner .main-swiper');
                          let thumb_swiper = document.querySelector('.inner .thumb-swiper');

                          let main_swiper_width = main_swiper_slide.offsetWidth;

                          main_swiper_slide.style.height = main_swiper_width + 'px';

                          if (window.innerWidth > 991.98) {
                            thumb_swiper.style.height = main_swiper_width + 'px';
                          }
                        });
                      },
                    },
                  });

                  // Show quick view modal
                  quickViewModal.classList.add("active");
                }
              } else {
                throw new Error('Error: ' + response.status);
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
      }, timeout);
    }
  }

  closeQuickView(e) {
    // CLOSE QUICK VIEW
    const quickViewClose = e.target.closest(this.selectors.quickviewClose);
    if (quickViewClose) {
      e.preventDefault();
      const quickViewModal = document.querySelector(this.selectors.quickviewModal);
      if (quickViewModal) {
        quickViewModal.classList.remove("active");

        // Refresh FsLightbox
        refreshFsLightbox();
      }
    }
  }

}

// window.GlobalListeners = GlobalListeners;
