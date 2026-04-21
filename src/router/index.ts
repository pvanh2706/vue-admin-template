import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { left: 0, top: 0 }
    },
    routes: [
        {
            path: '/',
            redirect: '/config-store',
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
    ],
})

export default router

router.beforeEach((to, from, next) => {
    document.title = `CodeOn POS ${to.meta.title}`
    next()
})
