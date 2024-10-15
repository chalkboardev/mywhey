export class CartQf {
  constructor() {
    this.cart = window.QF.cart;

    this.endpoints = {
      add: {
        url: 'cart/add.js',
        method: 'post'
      },
      get: {
        url: 'cart.js',
        method: 'get'
      },
      update: {
        url: 'cart/update.js',
        method: 'post'
      },
      change: {
        url: 'cart/change.js',
        method: 'post'
      },
      clear: {
        url: 'cart/clear.js',
        method: 'post'
      }
    };

    this.selectors = {
      cartDrawerContainer: '[cart-drawer-container]',
      cartTabs: '[side-cart-tab]',
      cartContent: '[side-cart-form]',
      savedCartTab: '[saved-cart-tab]',
      forYouTab: '[for-you-tab]',

      quickViewContainer: '[quick-view-container]',

      sideCartRecommendations: '[side-cart-recommendations]',
      sideCartRecommendationsSection: '[side-cart-recommendations-section]',
      sideCartRecommendationsContainer: '[side-cart-recommended-container]',

      cartRecommendations: '[cart-recommendations]',
      cartRecommendationsSlider: '[cart-recommendations-slider]',
      cartItemsContainer: '[cart-items-container]',

      cartCount: '[cart-count]',
      openSideCartTrigger: '[open-side-cart]',
      sideCartInner: '[side-cart-inner]',
      cartContainer: '[cart-container]',
      freeDeliveryStatus: '[free-delivery-status]',
      sideCartTotal: '[side-cart-total]',
    };
  }

  dispatchEvent(event_name, includeCart) {
    let contents = null;
    if (includeCart) {
      contents = {
        detail: {
          cart: this.cart,
        },
      };
    }
    window.dispatchEvent(new CustomEvent(event_name, contents));
  }

  async add(data) {
    try {
      const responseData = await this.request('add', data);
      this.mergeWithCurrentCart(responseData);
      this.dispatchEvent("cart_changed", true);
      this.dispatchEvent("item_added", true);
      return this.cart;
    } catch (error) {
      throw error;
    }
  }

  async get() {
    try {
      const response = await this.request('get');
      this.cart = response.data;
      return this.cart;
    } catch (error) {
      throw error;
    }
  }

  async update(data) {
    try {
      const responseData = await this.request('update', data);
      this.cart = responseData;
      this.dispatchEvent("cart_changed", true);
      return this.cart;
    } catch (error) {
      throw error;
    }
  }

  async change(data) {
    try {
      const responseData = await this.request('change', data);
      this.cart = responseData;
      this.dispatchEvent("cart_changed", true);
      return this.cart;
    } catch (error) {
      throw error;
    }
  }

  async remove(variant_id) {
    try {
      const updates = {
        updates: {
          [variant_id]: 0,
        }
      };
      const { data: responseData } = await this.request('update', updates);
      this.cart = responseData;
      this.dispatchEvent("cart_changed", true);
      this.dispatchEvent("item_removed", true);
      return this.cart;
    } catch (error) {
      throw error;
    }
  }

  async clear() {
    try {
      const { data: responseData } = await this.request('clear');
      this.cart = responseData;
      this.dispatchEvent("cart_changed", true);
      this.dispatchEvent("cart_cleared", true);
      return this.cart;
    } catch (error) {
      throw error;
    }
  }

  async request(key, data) {
    try {
      const url = window.Shopify.routes.root + this.endpoints[key].url;
      const method = this.endpoints[key].method;
      const headers = {
        'Content-Type': 'application/json'
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data)
      });


      if (response.ok) {
        return response.json();
      } else {
        throw await response.json();
      }
    } catch (error) {

      // Generate Toasty Message
      let options = {
        title: error.message,
        message: error.description,
        delay: 5000
      }
      // window.toasty.addToast(options);
      console.log('🚀🚀🚀 ERROR: ', error);
      console.log('🚀🚀🚀 DATA: ', data);

      throw error;
    }
  }

  mergeWithCurrentCart(data) {
    if (data.items) {
      data.items.forEach((item) => {
        let index = this.cart.items.findIndex(e => e.id === item.id);
        if (index > -1) {
          this.cart.items[index] = item;
        } else {
          this.cart.items.push(item);
        }
      });
    }
  }

  freeDeliveryProgress(el) {
    let free_delivery_amount = el.dataset.freeDelivery;
    const free_delivery_amount_market = el.dataset.freeDeliveryMarket;
    if (free_delivery_amount != '') {
      free_delivery_amount = parseFloat(free_delivery_amount);
    } else if (free_delivery_amount_market != '') {
      free_delivery_amount = JSON.parse(free_delivery_amount_market)['amount'];
    }
    if (free_delivery_amount != '') {
      const free_delivery_currency = el.dataset.currencySymbol;
      const cart_total = document.querySelector(this.selectors.sideCartTotal).dataset.subTotal / 100;
      const progress_text = el.dataset.freeProgressText;
      const reached_text = el.dataset.reachedFreeText;

      if (cart_total < free_delivery_amount) {
        const spend_more = (free_delivery_amount - cart_total).toFixed(2);
        const spend_more_formatted = Shopify.formatMoney(spend_more, free_delivery_currency);
        el.innerHTML = `${spend_more_formatted} ${progress_text}`;
      } else {
        el.innerHTML = reached_text;
      }
    }
  }

  openSideCart() {
    this.reRenderSideCart(() => {
      const cart_tabs = document.querySelectorAll(this.selectors.cartTabs);
      const cart_content = document.querySelector(this.selectors.cartContent);
      const saved_content = document.querySelector(this.selectors.savedCartTab);
      const forYou_content = document.querySelector(this.selectors.forYouTab);
      const quickview = document.querySelector(this.selectors.quickViewContainer);

      if (quickview) {
        quickview.classList.remove('active');
      }

      cart_content.style.display = 'flex';
      saved_content.style.display = 'none';

      if (forYou_content) {
        forYou_content.style.display = 'none';
      }


      cart_tabs[0].classList.add('active');
      cart_tabs[1].classList.remove('active');
      if (forYou_content) {
        cart_tabs[2].classList.remove('active');
      }

      let sideCartContainer = document.querySelector(this.selectors.cartDrawerContainer);
      if (sideCartContainer) {
        sideCartContainer.classList.add("open");
        document.body.classList.add("fixed");
        sideCartContainer.style.height = window.innerHeight + "px";
        window.addEventListener("resize", () => {
          sideCartContainer.style.height = window.innerHeight + "px";
        });

        let sideCartRecommendations = sideCartContainer.querySelector(this.selectors.sideCartRecommendations);
        if (sideCartRecommendations) {
          sideCartContainer.querySelector(this.selectors.sideCartRecommendations).classList.add('open');
          this.dispatchEvent("side_cart_opened", false);
        }


      }


      const fauxTabs = document.querySelectorAll('.cart-tab--forYou');
      fauxTabs.forEach(fauxTab => {
        if (fauxTabs) {
          fauxTab.addEventListener('click', (e) => {
            e.preventDefault();
            const forYouTab = document.querySelector('.cart-tab--you');
            forYouTab.click();
          });
        }
      });

    });
  }

  closeSideCart() {
    let sideCartContainer = document.querySelector(this.selectors.cartDrawerContainer);
    if (sideCartContainer) {
      sideCartContainer.querySelector(this.selectors.sideCartRecommendations).classList.remove('open');
      sideCartContainer.classList.remove("open");
      document.body.classList.remove("fixed");
      this.dispatchEvent("side_cart_closed", false);
    }
  }

  async reRenderSideCart(successCallback = null) {
    // UPDATE CART COUNT
    const updateCartCount = () => {
      const cart = document.querySelector([this.selectors.cartItemsContainer]);
      let cart_count = cart.getAttribute('data-items-count');
      const cartCountEl = document.querySelectorAll(this.selectors.cartCount);
      const cartBtnEl = document.querySelector([this.selectors.openSideCartTrigger]);

      if (cartBtnEl && cartCountEl && cart && cart_count) {

        cartCountEl.forEach(count_el => {
          if (cart_count == 0) {
            count_el.classList.add('empty-cart');
            cartBtnEl.classList.add('empty-cart');
          } else {
            count_el.classList.remove('empty-cart');
            cartBtnEl.classList.remove('empty-cart');
          }
          count_el.innerHTML = cart_count;
        });
      }
    }

    const specificRecommendedProducts = document.querySelector('.cart-recommendations-slider');
    if (specificRecommendedProducts) {
      new window.swiper(".cart-recommendations-slider", {
        slidesPerView: 2,
        spaceBetween: 20,
        navigation: {
          nextEl: ".swiper-button-next.cart-rec",
          prevEl: ".swiper-button-prev.cart-rec",
        },
        lazy: {
          enabled: true,
          checkInView: false,
          loadOnTransitionStart: true,
          loadPrevNext: true,
          loadPrevNextAmount: 1
        },
        breakpoints: {
          1134: {
            slidesPerView: 3,
          },
        },
      });
    }

    try {
      const response = await fetch(window.Shopify.routes.root + "cart?sections=gb-side-cart");
      if (!response.ok) {
        throw new Error("Error: " + response.status);
      }
      const data = await response.json();
      const html = data["gb-side-cart"];

      const side_cart_inner = document.querySelector(this.selectors.sideCartInner);
      if (side_cart_inner && html) {
        side_cart_inner.innerHTML = html;
        const free_delivery_el = document.querySelector(this.selectors.freeDeliveryStatus);
        if (free_delivery_el) {
          this.freeDeliveryProgress(free_delivery_el);
        }
        updateCartCount();

        let first_cart_item = side_cart_inner.querySelector('.item');
        if (first_cart_item) {
          first_cart_item = first_cart_item.dataset.productId;
        }

        if (first_cart_item) {

          const productRecommendationsSection = document.querySelector(this.selectors.sideCartRecommendationsSection);
          const sectionURL = productRecommendationsSection.dataset.url;
          const url = sectionURL.replace("product_id=", "product_id=" + first_cart_item);

          const sectionResponse = await fetch(url);
          if (sectionResponse.ok) {

            const sectionText = await sectionResponse.text();
            const parser = new DOMParser();
            const responceHTML = parser.parseFromString(sectionText, 'text/html');

            const recommendedForYou = responceHTML.querySelector('.side-cart-product-recommendations--foryou').innerHTML;
            const recommendedSwiper = responceHTML.querySelector('.side-cart-product-recommendations--swiper').innerHTML;

            const sectionHtml = document.querySelector(this.selectors.sideCartRecommendationsContainer);

            if (sectionHtml) {

              sectionHtml.innerHTML = recommendedSwiper;

              new window.swiper('.side-cart-recommendations-slider', {
                slidesPerView: 2,
                spaceBetween: 20,
                navigation: {
                  nextEl: ".swiper-button-next.cart-rec",
                  prevEl: ".swiper-button-prev.cart-rec",
                },
                lazy: {
                  enabled: true,
                  checkInView: false,
                  loadOnTransitionStart: true,
                  loadPrevNext: true,
                  loadPrevNextAmount: 1
                },
                breakpoints: {
                  1134: {
                    slidesPerView: 3
                  }
                },
              });
            }

            const recommendedHTML = document.querySelector('.side-for-you-grid--recommended');

            if (recommendedHTML) {
              document.querySelector('.side-for-you-grid--fallback').style.display = 'none';
              recommendedHTML.innerHTML = recommendedForYou;
            }


          } else {
            throw new Error("Error: " + sectionResponse.status);
          }
        } else {
          new window.swiper(".cart-recommendations-slider", {
            slidesPerView: 2,
            spaceBetween: 20,
            navigation: {
              nextEl: ".swiper-button-next.cart-rec",
              prevEl: ".swiper-button-prev.cart-rec",
            },
            lazy: {
              enabled: true,
              checkInView: false,
              loadOnTransitionStart: true,
              loadPrevNext: true,
              loadPrevNextAmount: 1
            },
            breakpoints: {
              1134: {
                slidesPerView: 3
              }
            },
          });
        }

        this.cartRenderedEvent(response, html);

        if (successCallback) {
          successCallback();
        }
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  reRenderCart() {
    fetch(window.Shopify.routes.root + "cart?sections=v2-cart")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        let html = data["v2-cart"];
        let cart_inner = document.querySelector(this.selectors.cartContainer);
        if (cart_inner && html) {
          cart_inner.innerHTML = html;
          this.cartRenderedEvent(html);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  cartRenderedEvent(response, html) {
    const event = new CustomEvent("cart_rendered", {
      detail: {
        response,
        html,
      },
    });
    window.dispatchEvent(event);
  }
}

// export default new CartQf();
// window.CartQf = CartQf;
