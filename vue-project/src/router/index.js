import { createRouter, createWebHistory } from 'vue-router'
import Iphones from '../views/Iphones.vue'
import IphoneDetails from '../views/IphoneDetails.vue'
import ComponentDetails from '../views/ComponentDetails.vue'

const routes = [
  { path: '/', component: Iphones },
  { path: '/iphone/:id', component: IphoneDetails },
  { path: '/component/:id', component: ComponentDetails }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
