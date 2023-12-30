import VueRouter, { RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ListView from '../views/ListView.vue';
import DetailView from '../views/DetailView.vue';

const routes: RouteConfig[] = [
    { path: '/', component: HomeView },
    { path: '/list', component: ListView },
    { path: '/detail/:id', component: DetailView }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router;
