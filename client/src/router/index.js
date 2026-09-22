import { createRouter, createWebHistory } from 'vue-router'

//导入页面组件
import HomeView from '../views/HomeView.vue'
import BokeView from '../views/BokeView.vue'
import TouchView from '../views/TouchView.vue'
import SearchView from '../views/SearchView.vue'
import LoginView from '../views/LoginView.vue'  
import EditorView from '../views/EditorView.vue' 

//定义路由规则（URL → 组件）
const routes = [
  {
    path: '/',          
    name: 'home',       // 路由名称
    component: HomeView // 显示 HomeView 组件
  },

  {
    path: '/boke',      
    name: 'boke',
    component: BokeView
  },

  {
    path: '/touch',     
    name: 'touch',
    component: TouchView
  },

  {
    path: '/search',    
    name: 'search',
    component: SearchView
  },

  { path: '/login', 
    name: 'login',
    component: LoginView 
  },

  { path: '/editor', 
    name: 'editor', 
    component: EditorView } 

]
// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})
// 导出路由，供 main.js 使用
export default router