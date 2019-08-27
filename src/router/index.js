import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import demo1 from '../../example/demo1';
import treeDemo from '../../example/treeDemo';
import cascader from '../../example/cascader';
import dialog from '../../example/dialog';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/demo1',
      name: 'demo1',
      component: demo1
    },
    {
      path: '/treeDemo',
      name: 'treeDemo',
      component: treeDemo
    },
    {
      path: '/cascader',
      name: 'cascader',
      component: cascader
    },
    {
      path: '/dialog',
      name: 'dialog',
      component: dialog
    }
  ]
})
