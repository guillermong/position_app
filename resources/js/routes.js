const Home = ()=> import('./components/Home.vue')

export const routes  = [
    {
        name: 'home',
        path:'/home',
        Component: Home
    }
]