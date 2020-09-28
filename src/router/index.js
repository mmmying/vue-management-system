import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import Home from '@/components/Home';
import Welcome from '@/components/Welcome';
import Users from '@/components/Users';
import Roles from '@/components/Roles';
import Rights from '@/components/Rights';
import Goods from '@/components/Goods';
import AddGoods from '@/components/AddGoods';
import Params from '@/components/Params';
import Categories from '@/components/Categories';
import Orders from '@/components/Orders';
import Reports from '@/components/Reports';
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          name: 'Welcome',
          component: Welcome
        },
        {
          path: '/users',
          name: 'Users',
          component: Users
        },
        {
          path: '/roles',
          name: 'Roles',
          component: Roles
        },
        {
          path: '/rights',
          name: 'Rights',
          component: Rights
        },
        {
          path: '/goods',
          name: 'Goods',
          component: Goods
        },
        {
          path: '/goods/add',
          name: 'AddGoods',
          component: AddGoods
        },
        {
          path: '/params',
          name: 'Params',
          component: Params
        },
        {
          path: '/categories',
          name: 'Categories',
          component: Categories
        },
        {
          path: '/orders',
          name: 'Orders',
          component: Orders
        },
        {
          path: '/reports',
          name: 'Reports',
          component: Reports
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    if (window.sessionStorage.getItem('token')) {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
