
class Toaster {
    constructor() {
    
        this.init();
        this.toasts = [];
    }
    
    // Methods - - - - - - - - - - - - - - - - - - - - - - - - 
    
    // Initialisation 
    init() {
        this.createToastyContainer();
        this.stopScrolling();
        this.setToastPositions();
        console.log('🥪🥪 TOASTY INITIALIZED 🥪🥪');
    }
    
    // Create Container
    createToastyContainer() {
        if ( !document.querySelector('#toasty-zone') ) {
            let toasty_container = document.createElement('div');
            toasty_container.id = 'toasty-zone';
            document.querySelector('body').append( toasty_container );
            
            // Set Container Property
            this.container = toasty_container;
            
        } else {
            console.log('🥪 Toasty already exists...');
        }
    }   
    
    // Add Toast
    addToast(options) {
        console.log('options: ', options);
        this.toasts.push( new Toast(options) );
        this.setToastPositions();
    }
    
    // Set Toast Positions 
    setToastPositions() {
        const gap = 10;
        const toasts = this.container.querySelectorAll('output');
        const header = document.querySelector('.mega-menu');
        const announcement = document.querySelector('.announcement-bar-slider');
        
        // Get Distance from top of window
        let space = 0;
        if ( announcement && ( window.pageYOffset > announcement.offsetHeight ) ) space = window.innerHeight - ( window.innerHeight - header.offsetHeight );
        else if ( header ) space = window.innerHeight - ( window.innerHeight - ( header.offsetHeight + announcement.offsetHeight ));
        this.offset = space + 15;
        
        if ( toasts ) {
            toasts.forEach( ( toast, i ) => {
                let rect = toast.getBoundingClientRect();
                let height = rect.height;
                
                // Unless Dragging
                if ( !toast.classList.contains('dragging') ) {
                    toast.style.top = `${this.offset}px`;
                    
                    this.offset += height + gap;
                }
            });
            //console.log('🥪 toasts: ', toasts, '↔️ offset: ', this.offset + 'px');
        }
        
    }
    
    // Check for Scrolling, position toasts
    stopScrolling() {
        let scrollingTimeout;
        window.addEventListener('scroll', (e) => {
            window.clearTimeout( scrollingTimeout );
            this.scrolling = true;
            
            scrollingTimeout = setTimeout( () => {
                this.scrolling = false;
                //console.log('stopped scrolling...')
                this.setToastPositions();
            }, 150 )
        }, false);
    }
    
};


class Toast {
    constructor( options ) {
        this.container = document.getElementById('toasty-zone');
        
        this.id = this.createID();
        this.title = options.title;
        this.message = options.message;
        this.background = options.background;
        this.image = options.image;
        
        this.delay = options.delay ? options.delay : 50000;
        this.delay_in_seconds = this.delay / 1000;

        
        this.interacting = false;
        this.node = this.make();
        this.add();
        //console.log('🍞 CONTAINER: ', this.container, "🥪 NODE: ", this.node);
        
        // Init Additional Features 
        this.slideToDismiss();
        this.close();
    }
    
    // Helper Methods - - - - - - - - - - - - - - - - - - - - - - - - 

    // Generates Unique ID
    createID() {
        const randomNum = Math.floor( Math.random() * 100 );
        const dateNow = Date.now()
        const uuid = `toast-node__${dateNow + randomNum}`;
        return uuid;
    }

    // Delay - Returns a promise after a given amount of time (ms)
    wait(ms, cancellable = false) {
        return new Promise( (resolve, reject) => {
            const timeout = setTimeout( () => {
                resolve();
                //console.log('delay finished...');
            }, ms);

            if ( cancellable == true ) {
                const interval = setInterval( () => {
                    if ( this.interacting == true ) {
                        //console.log('cancelled slide out');
                        clearTimeout(timeout);
                        clearInterval(interval);
                    }
                }, 300);
            }
        });
    }

    // Toast Animations Handler
    animateToast(animation) {
        let keyframes; 
        let timing;
        
        switch (animation) {
            case 'slide-in':
                // Slide in animation
                keyframes = [
                    { translate: `calc(150% + var(--drag-offset)) 0 0` }, 
                    { translate: `calc(0% + var(--drag-offset)) 0 0` }, 
                ];
                
                timing = { duration: 300,  fill: 'forwards' };
                break;
                
            case 'slide-out':
                // Slide Out animation
                keyframes = [
                    { translate: `calc(0% + var(--drag-offset)) 0 0` }, 
                    { translate: `calc(150% + var(--drag-offset)) 0 0` }, 
                ];
                
                timing = { duration: 300,  fill: 'forwards' };
                break;
                
            case 'slide-loop':
            default: 
                // Loop Animation
                keyframes = [
                    { translate: `calc(0% + var(--drag-offset)) 0 0` } 
                ];
                
                timing = { duration: Infinity,  fill: 'forwards' };
                break;
        }
        
        this.node.animate( keyframes, timing );
        //console.log(`🔄 animating${' ' + animation}...`);
    }

    // Core Methods - - - - - - - - - - - - - - - - - - - - - - - - 

    // Creates Toast Element
    make() {
        // Toast Container
        const node = document.createElement('output');
        node.classList.add('toasty');
        node.setAttribute('role', 'status');
        node.setAttribute('aria-live', 'polite');
        node.setAttribute('data-toasty-id', this.id );
        
        // Set Top Offset
        node.style.top = window.toasty.offset + 'px';
        
        // CSS Properties
        node.style.setProperty( '--animation-delay', this.delay_in_seconds + 's' );
        node.style.setProperty( '--drag-offset', 0 + 'px' );

        if ( this.background ) {
            node.classList.add('bg');
            node.style.setProperty( '--background', this.background );
        }

        // Icon / Image Element
        if ( this.image ) {
            node.classList.add('img');
            
            const img_node = document.createElement('img');
            img_node.classList.add('toasty-image')
            img_node.setAttribute('src', this.image ); 
            img_node.setAttribute('alt', this.title ); 
            node.append(img_node);
        }
        
        // Title Element
        if ( this.title ) {
            const title_node = document.createElement('div');
            title_node.classList.add('toasty-title');
            title_node.innerHTML = this.title;
            node.append(title_node);
        }
        
        // Body Element
        if ( this.message ) {
            const body_node = document.createElement('div');
            body_node.classList.add('toasty-body');
            body_node.innerHTML = this.message;
            node.append(body_node);
        }
        
        // Close Button 
        const svg = `
            <svg width="20.042" height="20.042" viewBox="0 0 20.042 20.042">
                <path data-name="toasty-close" d="M27.542,9.519,25.523,7.5l-8,8-8-8L7.5,9.519l8,8-8,8,2.019,2.019,8-8,8,8,2.019-2.019-8-8Z" transform="translate(-7.5 -7.5)" fill="currentColor"></path>
            </svg>
        `;
        const close_btn = document.createElement('div');
        close_btn.classList.add('toasty-close');
        close_btn.innerHTML = svg;
        node.append(close_btn);
        //console.log('🥪 ADDED TOAST...', node );
        
        return node;
    }

    // Add Toast Element to the DOM
    async add() {
        this.container.append(this.node);
        this.animateToast('slide-in');
        
        // Check Positions
        window.toasty.setToastPositions();
        
            // Await Delay + Slide Out
            await this.wait(this.delay + 300, true)
            if ( this.interacting == false ) {
                this.animateToast('slide-out');
                
                // Await Slide Out + Remove Toast
                await this.wait(300)
                this.node.remove();
                this.removeToastFromArray();
                
                // Check Positions
                window.toasty.setToastPositions();
                //console.log( 'this.interacting', this.interacting );
            }
        
    };

    /*
    // Destroy/Remove Element from DOM
    destroy() {
        this.node.remove();
        this.removeToastFromArray();
        console.log('💀 removed');
    }
    */

    // Reset Delay then remove
    async resetDelay() {
        // Wait for Delay ( again )
        await this.wait(this.delay, true)
        
        // Check Interaction
        if ( this.interacting == false ) {
            
            // Play Slide Out Animation
            this.animateToast('slide-out');
            
            // Await Slide Out + Remove Toast
            await this.wait(300)
            this.node.remove();
            this.removeToastFromArray();
            
            // Check Positions
            window.toasty.setToastPositions();
            //console.log( '⏱️ Reset Delay Finished... ⏱️ ', 'interacting', this.interacting );
        }
    }

    // Remove Toast from Toaster Array
    removeToastFromArray() {
        let toasty_arr = window.toasty.toasts;
        let toasty_ids_arr = toasty_arr.map( ( toast ) => toast.id ); 
        let this_index = toasty_ids_arr.findIndex( (id) => id == this.id);
        //console.log('toast ids', toasty_ids_arr, 'my toast index: ', this_index );
        toasty_arr.splice( this_index, 1 );
        //console.log( 'Toasty Array AFTER', toasty_arr );
    }

    close() {
        this.node.querySelector('.toasty-close').addEventListener('click', async () => {
            //console.log('clicked close...');
            
            this.animateToast('slide-out');
            await this.wait(310)
                this.node.remove();
                this.removeToastFromArray();
            
                // Check Positions
                window.toasty.setToastPositions();
        });
    }

    // Slide to Dismiss
    slideToDismiss() {
        let isDown = false;
        let startPosX = 0;
        let dragPosX = 0;
        let dragOffsetX = 0;
        
        let newPosX;
        let lastPosX;
        let dragDirection;
        let lastDirection;
        
        // Drag Options
        let resistance = 0.5;
        let maxNegativeDirection = -30; 
        

        // Event Listeners - - - - - - - - - - - - - - - - - - - 

        // Mouse Over 
        this.node.addEventListener('mouseover', (e) => {
            handleOver();
        });
        
        // Mouse Down / Touch Start
        this.node.addEventListener('mousedown', (e) => {
            handleDown(getEventAxis(e));
        });
        this.node.addEventListener('touchstart', (e) => {
            handleDown(getEventAxis(e));
        });
        
        // Mouse Up / Touch End or Leave
        this.node.addEventListener('mouseup', (e) => {
            handleUp();
        });
        this.node.addEventListener('touchend', (e) => {
            handleUp();
            handleLeave();
        });
        
        // Mouse Leave
        this.node.addEventListener('mouseleave', (e) => {
            handleLeave();
        });
        
        // Mouse Moving / Touch Move
        this.node.addEventListener('mousemove', (e) => {
            handleMove(getEventAxis(e));
        });
        this.node.addEventListener('touchmove', (e) => {
            handleMove(getEventAxis(e));
        });


        // Event Handlers - - - - - - - - - - - - - - - - - - -
        const handleOver = () => {
            this.interacting = true;
        }

        const handleDown = (x) => {
            isDown = true;
            this.interacting = true;
            
            startPosX = x;
            newPosX = x;
            //console.log('mousdown event:', startPosX);
            
            this.node.classList.add('dragging');
        } 

        const handleUp = async () => {
            isDown = false;
            
            // Reset Offset
            dragOffsetX = 0 + 'px';
            this.node.style.setProperty('--drag-offset', dragOffsetX);
            this.node.classList.remove('dragging');
            
            if ( dragDirection == 'right' ) {
                //console.log('slide toast out');
                this.node.animate( [{ translate: "0% 0 0" },{ translate: "150% 0 0" }], { fill: "forwards", duration: 300, iterations: 1 } );
                await this.wait(310)
                this.node.remove();
                this.removeToastFromArray();
                
                // Check Positions
                window.toasty.setToastPositions();
            }
            
            // Check Positions
            window.toasty.setToastPositions();
        }
        
        const handleLeave = () => {
            isDown = false;
            this.interacting = false;
            this.resetDelay();
            this.node.classList.remove('dragging');
            
            // Reset Offset
            dragOffsetX = 0 + 'px';
            this.node.style.setProperty('--drag-offset', dragOffsetX);
            
            // Check Positions
            window.toasty.setToastPositions();
        }
        
        const handleMove = (x) => {
            if ( isDown ) {
                this.interacting = true;
                dragPosX = x;
                
                // Get Direction
                newPosX = x;
                if (lastPosX > newPosX) dragDirection = 'left';
                else if ( newPosX > lastPosX ) dragDirection = 'right'; 
                
                
                // Direction Changed + reset Position
                if ( lastDirection != dragDirection ) {
                    startPosX = x;
                    //console.log('direction changed')
                }
                
                // Capture Last Position + Direction
                lastPosX = x;
                lastDirection = dragDirection;
                
                // Set Offset
                dragOffsetX = ( ( (startPosX - dragPosX) * -1 ) * resistance );
                
                if ( dragDirection == 'right' ) {
                    this.node.style.setProperty('--drag-offset', Math.max(dragOffsetX, maxNegativeDirection)  + 'px');
                } else if ( dragDirection == 'left' ) {
                    dragOffsetX = Math.max(dragOffsetX, maxNegativeDirection);
                    this.node.style.setProperty('--drag-offset', dragOffsetX  + 'px');
                }
                //console.log('dragOffsetX: ', dragOffsetX, 'drag direction: ', dragDirection);
            }
        }

        // Check Desktop/Mobile Interaction 
        function getEventAxis(e) {
            let eventType = e.type;
            let x;
            let y;
            if ( eventType == 'touchstart' || eventType == 'touchmove' || eventType == 'touchend' ) {
                let touchEvent = e.changedTouches[0];
                x = touchEvent.clientX;
                y = touchEvent.clientY;
            } else {
                let touchEvent = e;
                x = touchEvent.x;
                y = touchEvent.y;
            }
            if ( x ) {
                //console.log('eventType', eventType, `x: ${x} - y: ${y}`);
                return x;
            }
        }
    }
    
}

window.toasty = new Toaster();