import loading from './components/loading/loading'
import loadMore from './components/loadMore/loadMore'

module.exports={
    install:function(Vue,options){
        Vue.component('bg-loading',loading);
        Vue.component('bg-loadMore',loadMore);
    }
};