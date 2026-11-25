
/* BloodConnect Alert - UI Notifications */

(function () {
    window.BC = window.BC || {};

    window.BC.toast = function (message, type = "info") {
        let container = document.getElementById("bc-toast-container");

        if (!container) {
            container = document.createElement("div");
            container.id = "bc-toast-container";
            container.className = "toast-container";
            container.setAttribute("aria-live", "polite");
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;

        const icon = {
            success: "check",
            error: "alert",
            warning: "alert",
            info: "bell"
        };

        const iconHTML = window.BC.icon
            ? window.BC.icon(icon[type] || "bell")
            : "";

        const text = document.createElement("span");
        text.textContent = message;

        const close = document.createElement("button");
        close.type = "button";
        close.className = "toast-close";
        close.setAttribute("aria-label", "Dismiss notification");
        close.innerHTML = window.BC.icon
            ? window.BC.icon("close", 16)
            : "×";

        close.addEventListener("click", function () {
            toast.remove();
        });

        const iconWrapper = document.createElement("span");
        iconWrapper.className = "toast-icon";
        iconWrapper.innerHTML = iconHTML;

        toast.append(iconWrapper, text, close);
        container.appendChild(toast);

        if (type !== "error") {
            setTimeout(function () {
                toast.remove();
            }, 4000);
        }
    };
})();
