
/* BloodConnect Alert - Role-Based Navigation */

(function () {
    const navigation = {
        donor: [
            { label: "Dashboard", href: "#dashboard", icon: "dashboard" },
            { label: "My Profile", href: "#profile", icon: "user" },
            { label: "Availability", href: "#availability", icon: "heart" },
            { label: "Invitations", href: "#invitations", icon: "bell" },
            { label: "Response History", href: "#history", icon: "clock" }
        ],

        requester: [
            { label: "Dashboard", href: "#dashboard", icon: "dashboard" },
            { label: "Submit Request", href: "#submit-request", icon: "heart" },
            { label: "My Requests", href: "#my-requests", icon: "clock" },
            { label: "Notifications", href: "#notifications", icon: "bell" }
        ],

        verifier: [
            { label: "Dashboard", href: "#dashboard", icon: "dashboard" },
            { label: "Pending Requests", href: "#pending", icon: "clock" },
            { label: "Facility Verification", href: "#facilities", icon: "check" },
            { label: "Donor Matching", href: "#matching", icon: "heart" }
        ],

        hospital: [
            { label: "Dashboard", href: "#dashboard", icon: "dashboard" },
            { label: "Facility Profile", href: "#profile", icon: "user" },
            { label: "Blood Bank Search", href: "#blood-banks", icon: "search" },
            { label: "My Inquiries", href: "#inquiries", icon: "clock" }
        ],

        blood_bank: [
            { label: "Dashboard", href: "#dashboard", icon: "dashboard" },
            { label: "Facility Profile", href: "#profile", icon: "user" },
            { label: "Availability", href: "#availability", icon: "heart" },
            { label: "Hospital Inquiries", href: "#inquiries", icon: "bell" }
        ],

        admin: [
            { label: "Overview", href: "#overview", icon: "dashboard" },
            { label: "Users", href: "#users", icon: "user" },
            { label: "Facilities", href: "#facilities", icon: "home" },
            { label: "Requests", href: "#requests", icon: "heart" },
            { label: "Audit Logs", href: "#audit-logs", icon: "clock" },
            { label: "Reports", href: "#reports", icon: "check" },
            { label: "Maintenance", href: "#maintenance", icon: "settings" }
        ]
    };

    window.BC = window.BC || {};

    window.BC.getNavigation = function (role) {
        return navigation[role] || [];
    };

    window.BC.buildNavigation = function (role, containerId) {
        const container = document.getElementById(containerId);

        if (!container) return;

        const links = navigation[role] || [];

        container.innerHTML = links.map(link => `
            <a href="${link.href}" class="nav-link">
                ${window.BC.icon(link.icon)}
                <span>${link.label}</span>
            </a>
        `).join("");
    };
})();
