
/* BloodConnect Alert - Internationalization */

(function () {
    const dictionary = {
        // General
        app_name: "BloodConnect Alert",
        dashboard: "Dashboard",
        home: "Home",
        profile: "Profile",
        settings: "Settings",
        logout: "Log Out",
        notifications: "Notifications",
        search: "Search",
        save: "Save",
        cancel: "Cancel",
        submit: "Submit",
        loading: "Loading...",

        // Navigation
        donor: "Donor",
        requester: "Requester",
        verifier: "Verifier",
        hospital: "Hospital",
        blood_bank: "Blood Bank",
        admin: "Administrator",

        // Common messages
        success: "Operation completed successfully.",
        error: "Something went wrong.",
        required: "This field is required.",
        invalid_email: "Please enter a valid email address.",
        invalid_phone: "Please enter a valid Bangladesh phone number.",
        no_data: "No data available.",

        // Blood requests
        blood_requests: "Blood Requests",
        emergency_request: "Emergency Request",
        available_blood: "Available Blood",
        request_status: "Request Status",
        accept: "Accept",
        reject: "Reject",

        // Demo
        demo_banner: "Demo data – This application is currently running in demonstration mode."
    };

    window.BC = window.BC || {};

    window.BC.t = function (key, params = {}) {
        let message = dictionary[key] || key;

        Object.keys(params).forEach(function (param) {
            message = message.replaceAll(
                `{{${param}}}`,
                params[param]
            );
        });

        return message;
    };
})();
