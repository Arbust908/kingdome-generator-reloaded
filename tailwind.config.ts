import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#58180D',
          dark: '#421209'
        },
        parchment: '#EEE5CE'
      },
      fontFamily: {
        medieval: ['Cinzel', 'serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
} satisfies Config
