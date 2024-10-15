export class WishlistObjectQf {
  constructor() {
    this.LOCAL_STORAGE_CLIENT_NAME = window.Shopify.shop.replace(/.myshopify.com/g, '');
    this.LOCAL_STORAGE_WISHLIST_KEY = this.LOCAL_STORAGE_CLIENT_NAME + "-wishlist";
    this.BUTTON_ACTIVE_CLASS = "active-wishlist";
    this.GRID_LOADED_CLASS = "loaded";
    this.PRODUCT_CARD = "gb-product-card";

    this.selectors = {
      button: "[button-wishlist]",
      clearWishlist: ".clear-wishlist",
      grid: "[grid-wishlist]",
      gridContainer: ".wishlist-grid-container",
      sideCartGrid: "[side-cart-grid-wishlist]",
      productCard: ".product-card",
      wishlistCount: "wishlistCount",
      emptyWishlist: ".empty-wishlist"
    };

    this.init()
  }

  init() {
    this.wishlistCount();
    this.initButtons();
    this.initGrid().then(() => {
      this.buttonCheck();
    })
    this.addEventListeners()
  }

  buttonCheck() {
    const buttons = document.querySelectorAll(this.selectors.button);
    buttons.forEach((button) => {
      const productHandle = button.dataset.productHandle || false;
      if (this.wishlistContains(productHandle)) {
        button.classList.add(this.BUTTON_ACTIVE_CLASS);
      }
    });
  }

  initButtons = () => {
    document.body.addEventListener('click', (e) => {

      // Checks to see if the target that has been clicked contains wishlist data attribute
      const button = e.target.closest(this.selectors.button);
      if (button) {
        e.preventDefault();
        // Creates object from selected attributes
        const attributes = {};
        document.querySelectorAll("input[type='radio']").forEach(radioInput => {
          if (radioInput.checked) {
            attributes[radioInput.name] = radioInput.value;
          }
        });

        const product = {
          handle: button.dataset.productHandle || false,
          attributes,
        };

        // checks to see if the data attribute for product handle exists and outputs an error if not
        if (!product.handle) {
          return console.error(
            "[Shopify Wishlist] Missing `data-product-handle` attribute. Failed to update the wishlist."
          );
        } else {
          this.updateWishlist(product, e);
        }

        // Grabs all wishlist buttons and adds active state
        const allButtonsForHandle = document.querySelectorAll(
          `${this.selectors.button}[data-product-handle="${product.handle}"]`
        );
        allButtonsForHandle.forEach((buttonAddClass) => {
          buttonAddClass.classList.toggle(this.BUTTON_ACTIVE_CLASS);
        });

        this.wishlistCount();
      }

      // Checks to see if the target that has been clicked contains clear wishlist class
      const clearButton = e.target.closest(this.selectors.clearWishlist);
      if (clearButton) {
        this.resetWishlist();
        this.initGrid()
      }
    });

    document.dispatchEvent(new CustomEvent("shopify-wishlist:init-buttons", {
      detail: { wishlist: this.getWishlist() },
    }));
  };

  addEventListeners() {
    window.addEventListener("desktop-cart-recommendations-rendered", () => {
      setTimeout(() => {
        this.buttonCheck();
      }, 500);
    });
  }

  wishlistCount() {
    const wishlist = this.getWishlist();
    const wishlistCountElement = document.getElementById(this.selectors.wishlistCount);
    if (wishlist.length > 0) {
      wishlistCountElement.textContent = wishlist.length;
      wishlistCountElement.classList.remove("is-hidden");
    } else {
      wishlistCountElement.classList.add("is-hidden");
    }
  }

  wishlistContains = (handle) => {
    const wishlist = this.getWishlist();
    return wishlist.some((item) => item.handle === handle);
  };

  getWishlist = () => {
    const wishlist = localStorage.getItem(this.LOCAL_STORAGE_WISHLIST_KEY) || "[]";
    return JSON.parse(wishlist);
  };

  updateWishlist = (wishlistItem, e = null) => {
    const wishlist = this.getWishlist();
    const indexInWishlist = wishlist.findIndex((item) => item.handle === wishlistItem.handle);
    if (indexInWishlist === -1) {
      wishlist.push(wishlistItem);
    } else {
      wishlist.splice(indexInWishlist, 1);
    }

    this.setWishlist(wishlist, e);
  };

  setWishlist = (array, e) => {
    const wishlist = JSON.stringify(array);
    if (array.length) {
      localStorage.setItem(this.LOCAL_STORAGE_WISHLIST_KEY, wishlist);
      document.dispatchEvent(
        new CustomEvent("shopify-wishlist:updated", {
          detail: { wishlist: array },
        })
      );
    } else {
      localStorage.removeItem(this.LOCAL_STORAGE_WISHLIST_KEY);
      this.initGrid();
    }

    this.updateSideCartWishlist(e);
  };

  resetWishlist = () => {
    const allWishlistButtons = document.querySelectorAll(this.selectors.button);
    allWishlistButtons.forEach((button) => {
      button.classList.remove(this.BUTTON_ACTIVE_CLASS);
    });
    this.setWishlist([]);
  };

  async initGrid() {
    const grid = document.querySelector(this.selectors.grid);
    const gridContainer = document.querySelector(this.selectors.gridContainer);
    const urlParams = new URLSearchParams(window.location.search);
    const handlesParam = urlParams.get("handles");

    if (!grid || !gridContainer) {
      return;
    }

    const fallback = gridContainer.querySelector(this.selectors.emptyWishlist);

    if (handlesParam) {
      // If handles query parameter exists, decode the handles and load products
      const decodedHandles = this.decodeWishlistHandles(handlesParam);
      if (decodedHandles.length === 0) {
        grid.classList.add(this.GRID_LOADED_CLASS);
        if (fallback) {
          fallback.classList.add("show");
        }
        return;
      } else {
        if (fallback) {
          fallback.classList.remove("show");
        }
      }

      grid.classList.remove(this.GRID_LOADED_CLASS);

      await this.loadProducts(grid, decodedHandles);
    } else {
      // If no handles query parameter, load products from local storage
      const wishlist = this.getWishlist();
      if (wishlist.length === 0) {
        grid.classList.add(this.GRID_LOADED_CLASS);
        if (fallback) {
          fallback.classList.add("show");
        }
        return;
      } else {
        if (fallback) {
          fallback.classList.remove("show");
        }
      }

      grid.classList.remove(this.GRID_LOADED_CLASS);

      const handles = wishlist.map((item) => item.handle);
      await this.loadProducts(grid, handles);
    }
  }

  async loadProducts(grid, handles) {
    const products = await Promise.all(
      handles.map(async (productHandle) => {
        const productTileTemplateUrl =
          window.Shopify.routes.root +
          `products/${productHandle}?view=card&section_id=${this.PRODUCT_CARD}`;

        try {
          const response = await fetch(productTileTemplateUrl);
          if (!response.ok) {
            throw new Error("Error: " + response.status);
          }
          const data = await response.text();
          const htmlDocument = new DOMParser().parseFromString(data, "text/html");
          const productCard = htmlDocument.documentElement.querySelector(
            this.selectors.productCard
          );

          const wishlistButton = productCard.querySelector(".button-wishlist");
          if (wishlistButton) wishlistButton.classList.add(this.BUTTON_ACTIVE_CLASS);

          return productCard.outerHTML;
        } catch (error) {
          console.error(error);
          return null;
        }
      })
    );

    // Remove any null entries (failed fetches)
    const validProducts = products.filter((product) => product !== null);

    // Insert the products into the grid
    grid.innerHTML = validProducts.join("");

    grid.classList.add(this.GRID_LOADED_CLASS);
    document.dispatchEvent(
      new CustomEvent("shopify-wishlist:init-product-grid", {
        detail: { wishlist: handles },
      })
    );
  }


  initSideCartGrid() {
    const grid = document.querySelector(this.selectors.sideCartGrid);
    if (!grid) {
      return;
    }

    console.log('side cart wishlist')

    grid.innerHTML = "";

    const wishlist = this.getWishlist();

    if (wishlist.length === 0) {
      grid.classList.add(this.GRID_LOADED_CLASS);
      document.getElementById('empty-wishlist-side-cart').classList.add('active');
      return;
    } else {
      document.getElementById('empty-wishlist-side-cart').classList.remove('active');
    }

    grid.classList.remove(this.GRID_LOADED_CLASS);

    let counter = 0;

    for (let i = 0; i < wishlist.length; i++) {
      const wishlistItem = wishlist[i];

      const productTileTemplateUrl =
        window.Shopify.routes.root + `products/${wishlistItem.handle}?view=card&section_id=${this.PRODUCT_CARD}`;

      fetch(productTileTemplateUrl)
        .then((response) => {
          if (response.ok) {
            return response.text();
          } else {
            throw new Error("Error: " + response.status);
          }
        })
        .then((data) => {
          const htmlDocument = new DOMParser().parseFromString(data, "text/html");
          const productCard = htmlDocument.documentElement.querySelector(this.selectors.productCard);

          const wishlistButton = productCard.querySelector(".button-wishlist");
          if (wishlistButton) wishlistButton.classList.add(this.BUTTON_ACTIVE_CLASS);

          grid.insertAdjacentHTML("beforeend", productCard.outerHTML);

          // Handle fade in
          counter++;
          if (counter === 6) {
            grid.classList.add(this.GRID_LOADED_CLASS);
          }
          if (counter === wishlist.length) {
            grid.classList.add(this.GRID_LOADED_CLASS);
            document.dispatchEvent(
              new CustomEvent("shopify-wishlist:init-product-grid-side-cart", {
                detail: { wishlist: wishlist },
              })
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  updateSideCartWishlist(e) {
    const grid = e.target.closest(".side-cart-saved-grid.loaded");
    if (grid) {
      const productCard = e.target.closest(this.selectors.productCard);
      if (productCard) productCard.remove();
      this.initSideCartGrid();
    } else {
      this.initSideCartGrid();
    }
  }

  // Method to encode the wishlist handles to base64 and return the encoded string
  encodeWishlistHandles(handles) {
    const handlesString = handles.join(',');
    const base64Encoded = btoa(handlesString);
    return base64Encoded
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Method to decode the base64 encoded wishlist handles and return them as an array
  decodeWishlistHandles(encodedString) {
    try {
      const base64Decoded = atob(
        encodedString
          .replace(/-/g, '+')
          .replace(/_/g, '/')
          .padEnd(encodedString.length + (4 - (encodedString.length % 4)) % 4, '=')
      );
      const handles = base64Decoded.split(',');
      return handles;
    } catch (error) {
      console.error('Error decoding wishlist handles:', error.message);
      return [];
    }
  }

  // Method to get the wishlist handles as a comma-separated string
  getWishlistHandlesString() {
    const wishlist = this.getWishlist();
    const handles = wishlist.map((item) => item.handle);
    return handles.join(',');
  }

  // Method to handle sharing wishlist via URL
  shareWishlistViaURL() {
    const wishlistHandles = this.getWishlistHandlesString();
    const encodedHandles = this.encodeWishlistHandles(wishlistHandles);
    const sharedURL = window.location.href.split('?')[0] + `?handles=${encodedHandles}`;

    console.log('Shared URL:', sharedURL);
    // Do something with the sharedURL, like copying it to clipboard or displaying it for sharing.
  }

}

// window.WishlistObjectQf = WishlistObjectQf;
