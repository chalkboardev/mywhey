export class QfForm {
    constructor(formId, apiEndpoint, type, successCallback, errorCallback) {
        this.form = document.getElementById(formId);
        this.apiEndpoint = apiEndpoint;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.type = type;
        this.page = window.location.href;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(this.form);

        let data = {
            type: this.type,
            page: this.page,
            fields: {}
        };

        for (const [key, value] of formData.entries()) {
            data.fields[key] = value;
        }

        if (this.form.querySelector('[name="email"]')) {
            data.email = this.form.querySelector('[name="email"]').value;
        }

        if (this.form.querySelector('[name="customer"]')) {
            data.customer = this.form.querySelector('[name="customer"]').value;
        }

        if (this.form.querySelector('[name="products"]')) {
            let prodVal = this.form.querySelector('[name="products"]').value;
            data.product_variants = prodVal?.split(',')
            .map((x) => {
              return { shopify_id: x };
            })
        }

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            this.successCallback(responseData);
        } catch (error) {
            this.errorCallback(error);
        }
    }
}

// window.QfForm = QfForm;

/* Example usage

function onSuccess(data) {
    console.log('Success:', data);
    // show success message
}

function onError(error) {
    console.log('Error:', error);
    // show error messages for form
}

const form = new QfForm(
    'myFormId',
    window.QF.url + "/api/saveForm",
    'formType',
    onSuccess,
    onError
);
*/
