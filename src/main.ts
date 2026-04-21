// Import Element Plus styles (must be before main.css to allow overrides)
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
// Import project styles (after Element Plus to override its dark mode variables)
import './assets/main.css'
// Import Element Plus dark mode overrides (must be last to ensure override)
import './assets/element-plus-dark.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
// Import Pinnia
import { createPinia } from 'pinia'
const pinia = createPinia()
app.use(pinia)

app.mount('#app')
