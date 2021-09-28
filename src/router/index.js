import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/sign-in',
    component: () => import('@/views/auth/sign-in'),
    hidden: true
  },
  {
    path: '/sign-up',
    component: () => import('@/views/auth/sign-up'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/auth/auth-redirect'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/coupons/index',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    name: '商品管理',
    meta: {
      title: '商品管理',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/product/index'),
        name: 'Product',
        meta: { title: '商品列表', icon: 'list' }
      },
      {
        path: 'create',
        component: () => import('@/views/product/create'),
        name: 'ProductCreate',
        meta: { title: '添加商品', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/product/edit'),
        name: 'ProductForm',
        meta: { title: '编辑商品', activeMenu: '/product/index' },
        hidden: true
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/index',
    name: 'Activity',
    meta: {
      title: '卡券管理',
      icon: 'shopping'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/activity/index'),
        name: 'ActivityIndex',
        meta: { title: '卡券列表', icon: 'list', noCache: true }
      },
      {
        path: 'create',
        component: () => import('@/views/activity/create'),
        name: 'ActivityCreate',
        meta: { title: '添加卡券', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/activity/edit'),
        name: 'ActivityEdit',
        meta: { title: '编辑卡券', activeMenu: '/activity/index' },
        hidden: true
      }
    ]
  },
  {
    path: '/coupons',
    component: Layout,
    redirect: '/coupons/index',
    name: '卡券管理',
    hidden: true,
    meta: {
      title: '卡券管理',
      icon: 'shopping'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/coupons/index'),
        name: 'Coupon',
        meta: { title: '卡密管理', icon: 'list', noCache: true },
        hidden: true
      },
      {
        path: 'item/:id(\\d+)',
        component: () => import('@/views/coupons/item'),
        name: 'Coupon items',
        meta: { title: '查看兑换码', noCache: true, activeMenu: '/activity/index' },
        hidden: true
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/coupons/edit'),
        name: 'CouponEdit',
        meta: { title: '编辑卡券', activeMenu: '/coupons/index' },
        hidden: true
      }
    ]
  },
  {
    path: '/shop-order',
    component: Layout,
    redirect: '/shop-order/index',
    name: '购卡订单',
    meta: {
      title: '购卡订单',
      icon: 'list'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/shopOrder/index'),
        name: 'ShopOrder',
        meta: { title: '购卡订单' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    name: '提货管理',
    meta: {
      title: '提货管理',
      icon: 'list'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: 'Order',
        meta: { title: '提货列表' }
      },
      {
        path: 'shipped',
        component: () => import('@/views/order/shipped'),
        name: 'Shipped',
        meta: { title: '已发货列表' }
      },
      {
        path: 'not-shipped',
        component: () => import('@/views/order/not-shipped'),
        name: 'NotShipped',
        meta: { title: '未发货列表' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '资料', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export default router
