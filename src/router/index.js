import {createRouter, createWebHistory} from 'vue-router'

const routes =  [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',

        component: () => import('../views/Home.vue'),

    },

    {
        path: '/home2',
        name: 'Home2',
        component: () => import('../views/home2.vue'),
        meta:{
            shovalues: true
        }
    },
    {
        path: '/sign_in',
        name: 'sign_in',
        component: () => import('../views/Sign_in.vue'),
        meta:{
            shovalues: true
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/register.vue'),
        meta:{
            shovalues: true
        }
    },

    {
        path: '/hello',
        name: 'hello',
        component: () => import('../views/home2.vue'),
        meta:{
            shovalues: true
        }
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../views/index.vue'),
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

