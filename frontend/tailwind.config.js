/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Neural network colors
        neural: {
          primary: "#8B5CF6",
          secondary: "#A855F7", 
          accent: "#C084FC",
          glow: "#DDD6FE",
          dark: "#4C1D95",
        },
        glass: {
          primary: "rgba(139, 92, 246, 0.1)",
          secondary: "rgba(168, 85, 247, 0.1)",
          accent: "rgba(192, 132, 252, 0.1)",
          dark: "rgba(76, 29, 149, 0.1)",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neural': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
        'neural-lg': '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)',
        'neural-xl': '0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)',
        'glass': '0 8px 32px rgba(139, 92, 246, 0.1)',
        'glass-lg': '0 16px 64px rgba(139, 92, 246, 0.15)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "neural-pulse": {
          "0%, 100%": { 
            opacity: "0.8",
            transform: "scale(1)",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)"
          },
          "50%": { 
            opacity: "1",
            transform: "scale(1.02)",
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.5)"
          },
        },
        "neural-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)"
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.2)"
          },
        },
        "neural-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "neural-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "neural-scale": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "neural-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "neural-wave": {
          "0%, 100%": { transform: "translateX(0) translateY(0)" },
          "25%": { transform: "translateX(5px) translateY(-5px)" },
          "50%": { transform: "translateX(0) translateY(-10px)" },
          "75%": { transform: "translateX(-5px) translateY(-5px)" },
        },
        "neural-connect": {
          "0%": { 
            opacity: "0",
            transform: "scale(0.8)",
            boxShadow: "0 0 0px rgba(139, 92, 246, 0)"
          },
          "50%": { 
            opacity: "1",
            transform: "scale(1.1)",
            boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)"
          },
          "100%": { 
            opacity: "0.8",
            transform: "scale(1)",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)"
          },
        },
        "neural-data": {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px) scale(0.9)"
          },
          "50%": { 
            opacity: "1",
            transform: "translateY(0) scale(1.02)"
          },
          "100%": { 
            opacity: "0.9",
            transform: "translateY(-5px) scale(1)"
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neural-pulse": "neural-pulse 2s ease-in-out infinite",
        "neural-glow": "neural-glow 3s ease-in-out infinite",
        "neural-float": "neural-float 6s ease-in-out infinite",
        "neural-rotate": "neural-rotate 20s linear infinite",
        "neural-scale": "neural-scale 4s ease-in-out infinite",
        "neural-shimmer": "neural-shimmer 2s linear infinite",
        "neural-wave": "neural-wave 8s ease-in-out infinite",
        "neural-connect": "neural-connect 1.5s ease-in-out infinite",
        "neural-data": "neural-data 0.6s ease-out",
      },
      backgroundImage: {
        'neural-gradient': 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(192, 132, 252, 0.1) 100%)',
        'neural-radial': 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
        'neural-mesh': 'linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 25%, rgba(192, 132, 252, 0.1) 50%, rgba(139, 92, 246, 0.1) 75%, rgba(168, 85, 247, 0.1) 100%)',
        'neural-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.2) 50%, transparent 100%)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}
