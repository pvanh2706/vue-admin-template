import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { left: 0, top: 0 }
    },
    routes: [
        {
            path: '/',
            name: 'Ecommerce',
            component: () => import('../views/Ecommerce.vue'),
            meta: {
                title: 'eCommerce Dashboard',
            },
        },
        {
            path: '/calendar',
            name: 'Calendar',
            component: () => import('../views/Others/Calendar.vue'),
            meta: {
                title: 'Calendar',
            },
        },
        {
            path: '/profile',
            name: 'Profile',
            component: () => import('../views/Others/UserProfile.vue'),
            meta: {
                title: 'Profile',
            },
        },
        {
            path: '/form-elements',
            name: 'Form Elements',
            component: () => import('../views/Forms/FormElements.vue'),
            meta: {
                title: 'Form Elements',
            },
        },
        {
            path: '/basic-tables',
            name: 'Basic Tables',
            component: () => import('../views/Tables/BasicTables.vue'),
            meta: {
                title: 'Basic Tables',
            },
        },
        {
            path: '/line-chart',
            name: 'Line Chart',
            component: () => import('../views/Chart/LineChart/LineChart.vue'),
        },
        {
            path: '/bar-chart',
            name: 'Bar Chart',
            component: () => import('../views/Chart/BarChart/BarChart.vue'),
        },
        {
            path: '/alerts',
            name: 'Alerts',
            component: () => import('../views/UiElements/Alerts.vue'),
            meta: {
                title: 'Alerts',
            },
        },
        {
            path: '/avatars',
            name: 'Avatars',
            component: () => import('../views/UiElements/Avatars.vue'),
            meta: {
                title: 'Avatars',
            },
        },
        {
            path: '/badge',
            name: 'Badge',
            component: () => import('../views/UiElements/Badges.vue'),
            meta: {
                title: 'Badge',
            },
        },

        {
            path: '/buttons',
            name: 'Buttons',
            component: () => import('../views/UiElements/Buttons.vue'),
            meta: {
                title: 'Buttons',
            },
        },

        {
            path: '/images',
            name: 'Images',
            component: () => import('../views/UiElements/Images.vue'),
            meta: {
                title: 'Images',
            },
        },
        {
            path: '/videos',
            name: 'Videos',
            component: () => import('../views/UiElements/Videos.vue'),
            meta: {
                title: 'Videos',
            },
        },
        {
            path: '/blank',
            name: 'Blank',
            component: () => import('../views/Pages/BlankPage.vue'),
            meta: {
                title: 'Blank',
            },
        },

        {
            path: '/error-404',
            name: '404 Error',
            component: () => import('../views/Errors/FourZeroFour.vue'),
            meta: {
                title: '404 Error',
            },
        },

        {
            path: '/signin',
            name: 'Signin',
            component: () => import('../views/Auth/Signin.vue'),
            meta: {
                title: 'Signin',
            },
        },
        {
            path: '/signup',
            name: 'Signup',
            component: () => import('../views/Auth/Signup.vue'),
            meta: {
                title: 'Signup',
            },
        },
        {
            path: '/verify-email-notice',
            name: 'VerifyEmailNotice',
            component: () => import('../views/Auth/VerifyEmailNotice.vue'),
            meta: {
                title: 'Verify Email Notice',
            },
        },
        {
            path: '/config-store',
            name: 'ConfigStore',
            component: () => import('../views/Admin/ConfigStore/ConfigStore.vue'),
            meta: {
                title: 'Cấu hình Cửa hàng',
            },
        },
        {
            path: '/store-create',
            name: 'StoreFormAdd',
            component: () => import('../views/Admin/ConfigStore/StoreForm.vue'),
            meta: {
                title: 'Thêm Cửa hàng',
            },
        },
        {
            path: '/store/:id/edit',
            name: 'StoreFormEdit',
            component: () => import('../views/Admin/ConfigStore/StoreForm.vue'),
            meta: {
                title: 'Chỉnh sửa Cửa hàng',
            },
        },
        {
            path: '/admin/jira-config',
            name: 'JiraConfig',
            component: () => import('../views/Admin/JiraConfig/JiraConfig.vue'),
            meta: {
                title: 'Jira Configuration',
                requiresAuth: true,  // TODO: Enable when auth system is ready
                requiresRole: 'Admin',  // TODO: Enable when auth system is ready
            },
        },
        {
            path: '/products',
            name: 'Products',
            component: () => import('../views/Product/Product.vue'),
            meta: {
                title: 'Quản lý sản phẩm',
            },
        },
    ],
})

export default router

router.beforeEach((to, from, next) => {
    document.title = `CodeOn POS ${to.meta.title}`
    next()
})
