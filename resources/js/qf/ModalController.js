export class ModalController {
  constructor(options = {}) {
    //options
    this.triggerAttr = options.triggerAttr || "data-modal-trigger";
    this.showClass = options.showClass || "active";

    // gets all triggers on a page load'
    this.triggers = document.querySelectorAll("[data-modal-trigger]");
    this.modals = Array.from(document.querySelectorAll("[data-modal]"));

  
    this.addEventListeners();
    this.header = "modal-header";
  }

  addEventListeners() {

    //binds event listener to document
    document.addEventListener('click', e => {
      this.handleClick(e);
    });

  }

  handleClick(e) {

    const el = e.target;

    // OPEN //
    //if a trigger element is clicked set the modal to open
    if (el.hasAttribute(this.triggerAttr)) {
      e.preventDefault()

      //  get the id of the corresponding modal from attr value
      const triggerId = el.getAttribute("data-modal-trigger");
      triggerId && this.presentModal(triggerId);
    }

    //CLOSE
    // if event has a clsoe attribute close the specific modal
    if (el.hasAttribute("data-modal-close")) {
      e.preventDefault()

      // Get id of modal to close
      const closeId = el.getAttribute("data-modal-close");
      closeId && this.hideModal(closeId);
    }
  }

  presentModal(id, timeOut = 0, onConfirmCallback) {

  // find the modal in the dom
  const modal = document.querySelector(`[data-modal="${id}"]`);

  if(!modal){
    console.error("modal with " + id + "  doesn't exist")
    return
  }

  this.activeModal = modal; 

  if(onConfirmCallback){
    modal.addEventListener('click', (e)=>this.handleConfirm(e, id, onConfirmCallback), {once: true} )
  }

  // show the modal with active class
  modal.classList.add("active");

  // set Timeout to handle animation class adding.
  setTimeout(() => {
    modal.firstElementChild.classList.add("slide-in-active");
  }, timeOut);
  }

  hideModal(id) {
    const modal = document.querySelector(`[data-modal="${id}"]`);
    if(!modal){
      console.error("modal with " + id + "  doesn't exist");
      return false
    }
    this.activeModal = null; 

          
    modal.removeEventListener('click', (e)=>this.handleConfirm(e))

    // OPTIONAL: Remove animation class
    modal.firstElementChild.classList.remove("slide-in-active");

    // Hides modal - delayed for animation
    setTimeout(() => {
      if (modal.classList.contains("active")) modal.classList.remove("active");
    }, 200);

    const event = new CustomEvent(`${id}-modal-closed`, {detail: {
      modal: id, 
    }})
    window.dispatchEvent(event)

    return true
  }

  handleConfirm(e, id, onConfirmCallback){
    const button = e.target.closest('[data-modal-confirm]')
    if(button && onConfirmCallback){
      onConfirmCallback();
    }
  }

  getActiveModal(){
    return this.activeModal
  }
}

// window.ModalController = ModalController