// Tailwind theme, copied from the reference design. Load AFTER the Tailwind CDN script.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f3', 100: '#fcebed', 200: '#f9d2d7', 300: '#f4aab3', 400: '#eb7785',
          500: '#de4b5f', 600: '#c82c43', 700: '#a72035', 800: '#8b1e2d', 900: '#751d2a', 950: '#420b13'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif']
      }
    }
  }
};