import Vue from "vue"
import Router from 'vue-router'

//路由懒加载
/* const Cart = () =>
    import ('../views/cart/Cart');
const Category = () =>
    import ('../views/category/Category');
const Home = () =>
    import ('../views/home/Home');
const Porfile = () =>
    import ('../views/profile/Profile');
const Detail = () =>
    import ('../views/detail/Detail'); */
const Login = () =>
    import ('./components/Login.vue')
const Home = () =>
    import ('./components/Home.vue')
const Welcome = () =>
    import ('./components/Welcome.vue')
const Users = () =>
    import ('./components/user/Users.vue')
const Rights = () =>
    import ('./components/power/Rights.vue')
const Roles = () =>
    import ('./components/power/Roles.vue')
const Cate = () =>
    import ('./components/goods/Cate.vue')
const Params = () =>
    import ('./components/goods/Params.vue')
const GoodsList = () =>
    import ('./components/goods/GoodsList.vue')
const Add = () =>
    import ("./components/goods/Add.vue")
const Order = () =>
    import ('./components/order/Order.vue')
const Report = () =>
    import ('./components/report/Report.vue')
Vue.use(Router);
const router = new Router({
    routes: [
        /* {书写方式
                path: '',
                redirect: "/home"
            }, {
                path: '/home',
                component: Home
            } */
        {
            path: '',
            redirect: "/login"
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [{
                path: '/welcome',
                component: Welcome
            }, {
                path: '/users',
                component: Users
            }, {
                path: '/rights',
                component: Rights
            }, {
                path: '/roles',
                component: Roles
            }, {
                path: '/categories',
                component: Cate
            }, {
                path: '/params',
                component: Params
            }, {
                path: '/goods',
                component: GoodsList
            }, {
                path: '/goods/add',
                component: Add
            }, {
                path: '/orders',
                component: Order
            }, {
                path: '/reports',
                component: Report
            }]
        }
    ],
    mode: "history",
});
router.beforeEach((to, from, next) => { //路由导航守卫
    //to：要访问的路径，from：从那个路径来，next：表示放行
    if (to.path === '/login') return next()
    let tokenStr = (sessionStorage.getItem('token'))
    if (!tokenStr) return next('/login');
    next()

})
export default router;