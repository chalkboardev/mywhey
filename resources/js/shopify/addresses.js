// ADD NEW ADDRESS JS FUNCTIONALITY ---------------------------------------

const body = document.querySelector(" body ");
const addTrigger = document.querySelector(" .add-address-btn ");
const addForm = document.querySelector(" #AddAddress.add-address-wrapper");
const cancelTrigger = document.querySelector(" .cancel-add-address ");

// console.log(addTrigger);
// console.log(addForm);
if (addTrigger && addForm) {
  // Open New Address Form
  addTrigger.addEventListener("click", (e) => {
    if (addForm.classList.contains("active")) {
      return;
    } else {
      addForm.classList.add("active");
      addTrigger.classList.add("active");
    }
  });
}

if (cancelTrigger && addForm && addTrigger) {
  // Close New Address Form
  cancelTrigger.addEventListener("click", (e) => {
    if (addForm.classList.contains("active")) {
      addForm.classList.remove("active");
      addTrigger.classList.remove("active");
    } else {
      return;
    }
  });
}

//-------------------------------------------------------------------------

// EDIT ADDRESS JS FUNCTIONALITY ------------------------------------------

const editTrigger = document.querySelectorAll(" .edit-address-trigger ");

if (editTrigger) {
  // Close Edit Address Form
  editTrigger.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // console.log( 'Edit Button', btn.closest('.address-card').querySelector('.edit-mask') );
      // console.log( 'Edit Button Closest: ', btn.closest('.address-card') );
      body.classList.add("locked");
      btn
        .closest(".address-card")
        .querySelector(".edit-mask")
        .classList.add("active");
    });
  });
}

const cancelEdit = document.querySelectorAll(" .cancel-edit-btn ");

if (cancelEdit) {
  // Close Edit Address Form
  cancelEdit.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // console.log('Cancel Button Clicked:', btn.closest('.edit-mask') )
      body.classList.remove("locked");
      btn.closest(".edit-mask").classList.remove("active");
    });
  });
}

function InitDeleteAddress() {
  const addressWrapper = document.querySelector('.address-wrapper');

  if(!addressWrapper) return;

  addressWrapper.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.address-delete-form');

    if (deleteBtn) {
      e.preventDefault();

      const onComplete = () => {
        const url = deleteBtn.getAttribute('action');
        const data = new FormData();
        data.set('_method', 'delete');
        fetch(url, {
          method: 'POST',
          body: data,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text(); // You can change this to response.json() if the response is in JSON format
          })
          .then(() => {
            location.reload();
          })
          .catch((error) => {
            console.error('Fetch error:', error);
          });
      };

      window.modalController.presentModal('delete-address', 0, onComplete);
    }
  });

}

InitDeleteAddress()