// eventTracker.js

class AbstractEventTracker {
  trackEvent(eventName, eventCategory, eventAction, eventLabel, eventValue) {
    throw new Error('trackEvent method must be implemented in the provider class.');
  }
}
  
// GtagProvider.js
class GtagProvider extends AbstractEventTracker {
  // Assuming gtag is already loaded externally
  trackEvent(eventName, eventCategory, eventAction, eventLabel, eventValue) {
    gtag('event', eventName, {
      event_category: eventCategory,
      event_action: eventAction,
      event_label: eventLabel,
      value: eventValue,
    });
  }
}

// KlaviyoProvider.js
class KlaviyoProvider extends AbstractEventTracker {
  // Implement Klaviyo event tracking here
  trackEvent(eventName, eventCategory, eventAction, eventLabel, eventValue) {
    // Implement Klaviyo event tracking code here
    console.log('Klaviyo event tracking:', eventName, eventCategory, eventAction, eventLabel, eventValue);
    klaviyo.track(eventName, {
      eventCategory, eventAction, eventLabel, eventValue
    });
  }
}
  
// Export the desired event tracking provider (e.g., GtagProvider) as the default export
export default GtagProvider;