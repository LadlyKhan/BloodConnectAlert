
/* BloodConnect Alert - Formatting Helpers */

(function () {
    window.BC = window.BC || {};

    const timezone = "Asia/Dhaka";

    window.BC.formatDate = function (date) {
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: timezone
        }).format(new Date(date));
    };

    window.BC.formatTime = function (date) {
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: timezone
        }).format(new Date(date));
    };

    window.BC.formatDateTime = function (date) {
        return `${window.BC.formatDate(date)}, ${window.BC.formatTime(date)}`;
    };

    window.BC.timeAgo = function (date) {
        const timestamp = new Date(date).getTime();
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (!Number.isFinite(timestamp)) return "Unknown";

        const intervals = [
            { seconds: 31536000, label: "year" },
            { seconds: 2592000, label: "month" },
            { seconds: 604800, label: "week" },
            { seconds: 86400, label: "day" },
            { seconds: 3600, label: "hour" },
            { seconds: 60, label: "minute" }
        ];

        if (seconds < 60) return "Just now";

        for (const interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);

            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
            }
        }

        return "Just now";
    };

    window.BC.isValidBDPhone = function (phone) {
        return /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/.test(
            phone.trim()
        );
    };

    window.BC.formatBDPhone = function (phone) {
        const value = phone.trim();

        if (/^01[3-9]\d{8}$/.test(value)) {
            return value.replace(
                /^(01\d{3})(\d{3})(\d{3})$/,
                "$1-$2-$3"
            );
        }

        if (/^\+8801[3-9]\d{8}$/.test(value)) {
            return value.replace(
                /^(\+8801\d{2})(\d{3})(\d{3})$/,
                "$1-$2-$3"
            );
        }

        return value;
    };

})();
