
/*
    OVERVIEW: ————————————————————————————————————————————————————————————————————————————————————————————————————————————
        * This class was built to allow a simple implementation of a 'Load More' button instead of traditional pagination. 
    
    
    SETTINGS: —————————————————————————————————————————————————————————————————————————————————————————————————————————— 
        * Target: The target elements that should be loaded             ( required )
        * Container: The Parent Element surrounding your targets.       ( required )
        * loadBtn: The Load Button to trigger the load.                 ( optional | default: '.load' )
        * initLoadAmount: The amount of targets loaded on Page Load.    ( optional | default: 10 ) 
        * loadProgressAmount: The amount of targets loaded each time.   ( optional | default: 5 )
    
    
    HTML EXAMPLE: ————————————————————————————————————————————————————————————————————————————————————————————————————————
        
        <div class="container">
            <span class="target">1</span>
            <span class="target">2</span>
            <span class="target">3</span>
        </div>
        
        <button class="load">Load More</button>
        
        
    JS EXAMPLE: ——————————————————————————————————————————————————————————————————————————————————————————————————————————
        
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const artworkManagementLoad = new window.LoadMore({
                    target: '.artwork-card', 
                    container: '.artwork-grid'
                });
            })
            </script>
*/

export class LoadMore {
    constructor(options) {
      this.selectors = {
        target: options.target,
        container: options.container,
        loadBtn: options.loadBtn || '.load',
      };
      this.settings = {
        initLoadAmount: options.initLoadAmount || 10,
        loadProgressAmount: options.loadProgressAmount || 5,
      };
      this.init();
    }
  
    // Show Initial amount on Page Load
    onLoadProgress() {
      const container = document.querySelector(this.selectors.container);
      const targets = container.querySelectorAll(this.selectors.target);
      const button = container.parentElement.querySelector(this.selectors.loadBtn);
  
      // Show Default initLoadAmount on Page Load
      const itemsToShow = Math.min(this.settings.initLoadAmount, targets.length);
      for (let i = 0; i < itemsToShow; i++) {
        targets[i].setAttribute('aria-hidden', 'false');
      }
  
      // Hide Load Button if there are no Hidden Targets
      if (targets.length === 0 || targets.length < this.settings.initLoadAmount) {
        button.style.display = 'none';
      }
    }
  
    // Show More Items when Load Button is Clicked
    loadMoreItems() {
      const container = document.querySelector(this.selectors.container);
      const button = container.parentElement.querySelector(this.selectors.loadBtn);
  
      // When Load Button Is Clicked
      button.addEventListener('click', () => {
        const hiddenTargets = container.querySelectorAll(`${this.selectors.target}[aria-hidden="true"]`);
        let counter = 0; // Set Counter
  
        // Show Next artwork
        for (let i = 0; i < hiddenTargets.length; i++) {
          if (i < this.settings.loadProgressAmount) {
            hiddenTargets[i].setAttribute('aria-hidden', 'false');
          }
        }
        counter += this.settings.loadProgressAmount; // Add to Counter By Load More
        if (hiddenTargets.length <= this.settings.loadProgressAmount) {
          button.style.display = 'none'; // Hide Load Button
        }
      });
    }
  
    // Initialization
    init() {
      this.onLoadProgress();
      this.loadMoreItems();
    }
  }
  
  // window.LoadMore = LoadMore;
  