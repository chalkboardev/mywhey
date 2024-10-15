const initBanner = () => {
    const gdprBanner = document.getElementById("cookieNotice-v3");
    const saleOfDataFlexWrap = document.getElementById("saleOfData");
    const mainContent = document.getElementById("MainContent");
    const headerContent = document.getElementById("shopify-section-gb-header");
    const body = document.querySelector("body");
    const buttonRow = document.querySelector(".button-row");
    const gdprBannerInputs = Array.from(gdprBanner.querySelectorAll("input[type='checkbox']:not([name='necessary'])"));

    const customerPrivacy = window.Shopify.customerPrivacy;
    const saleOfDataRegion = customerPrivacy.saleOfDataRegion();
    let currentVisitorConsent = customerPrivacy.currentVisitorConsent();

    const callback = () => { }

    if (gdprBanner) {
        gdprBanner.style.display = 'flex';
        gdprBanner.classList.add('active');
    }

    document.body.style.pointerEvents = 'none';
    document.documentElement.style.cssText = `
        overflow: hidden;
        max-height: 100vh;
    `;

    if (!saleOfDataRegion) {
        saleOfDataFlexWrap.style.display = "none";
    }

    if (gdprBannerInputs) {
        gdprBannerInputs.forEach(checkbox => {
            checkbox.checked = currentVisitorConsent[checkbox.name] === 'yes';
        });
    }

    if (buttonRow) {
        buttonRow.addEventListener("click", function (e) {
            e.preventDefault();
            var submitType = e.target.getAttribute("data-submit-type");

            if (submitType) {
                var actions = {
                    'deny': function () {
                        gdprBannerInputs.forEach((checkbox) => {
                            checkbox.checked = false;
                        });
                        customerPrivacy.setTrackingConsent(
                            {
                                "analytics": false,
                                "marketing": false,
                                "preferences": false,
                                "sale_of_data": false
                            },
                            callback
                        );
                    },
                    'allow-selection': function () {
                        const checkedValues = gdprBannerInputs
                            .filter(checkbox => checkbox.checked)
                            .map(checkbox => checkbox.name);
                        customerPrivacy.setTrackingConsent(
                            {
                                "analytics": checkedValues.includes("analytics"),
                                "marketing": checkedValues.includes("marketing"),
                                "preferences": checkedValues.includes("preferences"),
                                "sale_of_data": checkedValues.includes("sale_of_data")
                            },
                            callback
                        );
                    },
                    'allow-all': function () {
                        gdprBannerInputs.forEach((checkbox) => {
                            checkbox.checked = true;
                        });
                        customerPrivacy.setTrackingConsent(
                            {
                                "analytics": true,
                                "marketing": true,
                                "preferences": true,
                                "sale_of_data": true
                            },
                            callback
                        );
                    }
                };
                if (actions[submitType]) {
                    actions[submitType]();
                }
            }

            setTimeout(() => {

                document.body.style.pointerEvents = 'all';
                document.documentElement.style.cssText = `
                    overflow: '';
                    max-height: '';
                `;

                if (gdprBanner) gdprBanner.classList.remove('active');
            }, 250);

            setTimeout(() => {
                if (gdprBanner) gdprBanner.style.display = "none";
            }, 1500);
        });
    }

    document.addEventListener("visitorConsentCollected", (event) => {
        const detail = event.detail;

        for (const key in detail) {
            if (detail.hasOwnProperty(key) && detail[key]) {
                switch (key) {
                    case "marketingAllowed":
                        // console.log('marketingAllowed');
                        break;

                    case "saleOfDataAllowed":
                        // console.log('saleOfDataAllowed');
                        break;

                    case "analyticsAllowed":
                        // console.log('analyticsAllowed');
                        break;

                    case "preferencesAllowed":
                        // console.log('preferencesAllowed');
                        break;

                    case "firstPartyMarketingAllowed":
                        // console.log('firstPartyMarketingAllowed');
                        break;

                    case "thirdPartyMarketingAllowed":
                        // console.log('thirdPartyMarketingAllowed');
                        break;
                }
            }
        }
    });

}

// Init
window.Shopify.loadFeatures(
    [
        {
            name: "consent-tracking-api",
            version: "0.1",
        },
    ],
    (error) => {
        if (error) {
            throw error;
        }
        if (window.Shopify.customerPrivacy.shouldShowGDPRBanner()) {
            initBanner();
        }
    }
);
document.getElementById("buttonUpdateCookies")?.addEventListener('click', () => {
    initBanner();
})