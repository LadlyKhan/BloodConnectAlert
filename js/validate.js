
/* BloodConnect Alert - Form Validation */

(function () {
    window.BC = window.BC || {};

    function getError(input) {
        const value = input.value.trim();

        if (input.required && !value) {
            return "This field is required.";
        }

        if (input.type === "email" && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(value)) {
                return "Please enter a valid email address.";
            }
        }

        if (input.type === "tel" && value) {
            const phonePattern = /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/;

            if (!phonePattern.test(value)) {
                return "Please enter a valid Bangladesh phone number.";
            }
        }

        if (!input.checkValidity()) {
            return input.validationMessage;
        }

        return "";
    }

    function showError(input, message) {
        clearError(input);

        if (!message) return;

        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");

        const error = document.createElement("div");
        error.className = "field-error";
        error.innerHTML = `
            ${window.BC.icon ? window.BC.icon("alert", 16) : ""}
            <span></span>
        `;

        error.querySelector("span").textContent = message;

        input.insertAdjacentElement("afterend", error);
    }

    function clearError(input) {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");

        const next = input.nextElementSibling;

        if (next && next.classList.contains("field-error")) {
            next.remove();
        }
    }

    window.BC.validateForm = function (form) {
        if (typeof form === "string") {
            form = document.querySelector(form);
        }

        if (!form) return false;

        const fields = Array.from(
            form.querySelectorAll("input, select, textarea")
        ).filter(input => !input.disabled && input.type !== "hidden");

        const invalidFields = [];

        fields.forEach(input => {
            const message = getError(input);

            showError(input, message);

            if (message) {
                invalidFields.push(input);
            }
        });

        let summary = form.querySelector(".form-summary");

        if (!summary) {
            summary = document.createElement("div");
            summary.className = "form-summary";
            summary.setAttribute("role", "alert");
            form.prepend(summary);
        }

        if (invalidFields.length > 0) {
            summary.textContent =
                `Please correct ${invalidFields.length} field(s) before continuing.`;

            invalidFields[0].focus();

            return false;
        }

        summary.remove();

        return true;
    };

    window.BC.initValidation = function (form) {
        if (typeof form === "string") {
            form = document.querySelector(form);
        }

        if (!form) return;

        const fields = form.querySelectorAll(
            "input, select, textarea"
        );

        fields.forEach(input => {
            input.addEventListener("blur", function () {
                showError(input, getError(input));
            });

            input.addEventListener("input", function () {
                if (input.classList.contains("is-invalid")) {
                    showError(input, getError(input));
                }
            });
        });

        form.addEventListener("submit", function (event) {
            if (!window.BC.validateForm(form)) {
                event.preventDefault();
            }
        });
    };
})();
