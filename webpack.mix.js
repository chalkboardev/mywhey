// webpack.mix.js
let mix = require("laravel-mix");
mix.sourceMaps()
mix.disableNotifications();


// JS ---
mix.js("resources/js/critical.js", "assets/critical.min.js");
mix.js("resources/js/vendor/swiper.js", "assets/swiper.min.js");
mix.js("resources/js/vendor/fslightbox.min.js", "assets/fslightbox.min.js");
mix.js("resources/js/qf/v3-gdpr-consent.js", "assets/v3-gdpr-consent.min.js");

// v3 Toasty
mix.js("resources/js/qf/v3-toasty.js", "assets/v3-toasty.min.js");

// Section js
mix.js("resources/js/sections/recommended-products.js", "assets/recommended-products.min.js");
mix.js("resources/js/sections/recently-viewed.js", "assets/recently-viewed.min.js");
mix.js("resources/js/sections/v3-collection-grid.js", "assets/v3-collection-grid.min.js");
mix.js("resources/js/sections/collections-page.js", "assets/collections-page.min.js");

// Page js
mix.js("resources/js/shopify/addresses.js", "assets/addresses.min.js");
mix.js("resources/js/shopify/account.js", "assets/account.min.js");

// STYLES ---
mix.sass("resources/scss/global.scss", "assets/global.min.css");

// Snippet styles
mix.sass("resources/scss/snippet.scss", "assets/snippet.min.css");

// Page styles
mix.sass("resources/scss/modules/pages/404.scss", "assets/page-404.min.css");
mix.sass("resources/scss/modules/pages/basket.scss", "assets/page-basket.min.css");
mix.sass("resources/scss/modules/pages/policies.scss", "assets/page-policies.min.css");
mix.sass("resources/scss/modules/pages/content.scss", "assets/page-content.min.css");

mix.sass("resources/scss/modules/pages/activate-account.scss", "assets/page-activate-account.min.css");
mix.sass("resources/scss/modules/pages/login.scss", "assets/page-login.min.css");
mix.sass("resources/scss/modules/pages/register.scss", "assets/page-register.min.css");
mix.sass("resources/scss/modules/pages/reset-password.scss", "assets/page-reset-password.min.css");

mix.sass("resources/scss/modules/pages/account.scss", "assets/page-account.min.css");
mix.sass("resources/scss/modules/pages/addresses.scss", "assets/page-addresses.min.css");

// Section styles
mix.sass("resources/scss/modules/sections/main-search.scss", "assets/section-main-search.min.css");
mix.sass("resources/scss/modules/sections/contact.scss", "assets/section-contact.min.css");
mix.sass("resources/scss/modules/sections/v2-wishlist.scss", "assets/section-v2-wishlist.min.css");

mix.sass("resources/scss/modules/sections/v2-main-article.scss", "assets/section-v2-main-article.min.css");
mix.sass("resources/scss/modules/sections/v2-main-list-collections.scss", "assets/section-v2-main-list-collections.min.css");
mix.sass("resources/scss/modules/sections/gb-header.scss", "assets/section-gb-header.min.css");
mix.sass("resources/scss/modules/sections/v2-cta-banner.scss", "assets/section-v2-cta-banner.min.css");
mix.sass("resources/scss/modules/sections/v2-full-width-image.scss", "assets/section-v2-full-width-image.min.css");
mix.sass("resources/scss/modules/sections/v2-article-grid.scss", "assets/section-v2-article-grid.min.css");
mix.sass("resources/scss/modules/sections/v2-page-header-text-image.scss", "assets/section-v2-page-header-text-image.min.css");
mix.sass("resources/scss/modules/sections/gb-main-product.scss", "assets/section-gb-main-product.min.css");
mix.sass("resources/scss/modules/sections/v2-usp-banner.scss", "assets/section-usp-banner.min.css");
mix.sass("resources/scss/modules/sections/v2-hero-slider.scss", "assets/section-v2-hero-slider.min.css");
mix.sass("resources/scss/modules/sections/gb-footer.scss", "assets/section-gb-footer.min.css");
mix.sass("resources/scss/modules/sections/v2-collection-grid.scss", "assets/section-v2-collection-grid.min.css");
mix.sass("resources/scss/modules/sections/v2-featured-collections.scss", "assets/section-v2-featured-collections.min.css");
mix.sass("resources/scss/modules/sections/v2-text-image.scss", "assets/section-v2-text-image.min.css");
mix.sass("resources/scss/modules/sections/v2-text.scss", "assets/section-v2-text.min.css");
mix.sass("resources/scss/modules/sections/gb-announcement-bar.scss", "assets/section-gb-announcement-bar.min.css");
mix.sass("resources/scss/modules/sections/v2-article-slider.scss", "assets/section-v2-article-slider.min.css");
mix.sass("resources/scss/modules/sections/v2-contact-form.scss", "assets/section-v2-contact-form.min.css");
mix.sass("resources/scss/modules/sections/v2-testimonials.scss", "assets/section-v2-testimonials.min.css");
mix.sass("resources/scss/modules/sections/v2-reviews.scss", "assets/section-v2-reviews.min.css");
mix.sass("resources/scss/modules/sections/gb-newsletter.scss", "assets/section-gb-newsletter.min.css");
mix.sass("resources/scss/modules/sections/v2-instagram-gallery.scss", "assets/section-v2-instagram-gallery.min.css");
mix.sass("resources/scss/modules/sections/v2-grouped-collections.scss", "assets/section-v2-grouped-collections.min.css");
mix.sass("resources/scss/modules/sections/v2-recommended-products.scss", "assets/section-v2-recommended-products.min.css");
mix.sass("resources/scss/modules/sections/v2-featured-products.scss", "assets/section-v2-featured-products.min.css");
mix.sass("resources/scss/modules/sections/v2-page-header.scss", "assets/section-v2-page-header.min.css");
mix.sass("resources/scss/modules/sections/v2-product-information.scss", "assets/section-v2-product-information.min.css");
mix.sass("resources/scss/modules/sections/v2-main-search.scss", "assets/section-v2-main-search.min.css");
mix.sass("resources/scss/modules/sections/v2-cart.scss", "assets/section-v2-cart.min.css");
mix.sass("resources/scss/modules/sections/v2-meet-the-team.scss", "assets/section-v2-meet-the-team.min.css");
mix.sass("resources/scss/modules/sections/v2-hero-collection-slider.scss", "assets/section-v2-hero-collection-slider.min.css");
mix.sass("resources/scss/modules/sections/v2-faq-grid.scss", "assets/section-v2-faq-grid.min.css");
mix.sass("resources/scss/modules/sections/v2-faqs.scss", "assets/section-v2-faqs.min.css");
mix.sass("resources/scss/modules/sections/gb-predictive-search.scss", "assets/section-gb-predictive-search.min.css");
mix.sass("resources/scss/modules/sections/gb-size-guide-table.scss", "assets/section-gb-size-guide-table.min.css");
mix.sass("resources/scss/modules/sections/v2-recently-viewed.scss", "assets/section-v2-recently-viewed.min.css");
mix.sass("resources/scss/modules/sections/v2-collection-slider.scss", "assets/section-v2-collection-slider.min.css");
mix.sass("resources/scss/modules/sections/v2-video.scss", "assets/section-v2-video.min.css");

// New sections
mix.sass("resources/scss/modules/sections/v3-collection-grid.scss", "assets/section-v3-collection-grid.min.css");
mix.sass("resources/scss/modules/sections/v3-full-width-text-image.scss", "assets/section-v3-full-width-text-image.min.css");
mix.sass("resources/scss/modules/sections/v3-usp-banner.scss", "assets/section-v3-usp-banner.min.css");