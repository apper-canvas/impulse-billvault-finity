import Dashboard from '@/components/pages/Dashboard'
import Bills from '@/components/pages/Bills'
import Warranties from '@/components/pages/Warranties'
import Offers from '@/components/pages/Offers'
import Categories from '@/components/pages/Categories'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  bills: {
    id: 'bills',
    label: 'Bills',
    path: '/bills',
    icon: 'Receipt',
    component: Bills
  },
  warranties: {
    id: 'warranties',
    label: 'Warranties',
    path: '/warranties',
    icon: 'Shield',
    component: Warranties
  },
  offers: {
    id: 'offers',
    label: 'Offers',
    path: '/offers',
    icon: 'Gift',
    component: Offers
  },
  categories: {
    id: 'categories',
    label: 'Categories',
    path: '/categories',
    icon: 'Tag',
    component: Categories
  }
}

export const routeArray = Object.values(routes)
export default routes