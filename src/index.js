import loading from './components/loading/loading'
import loadMore from './components/loadMore/loadMore'

export default {

    install:function(Vue,options){
        Vue.component('bg-loading',loading);
        Vue.component('bg-loadMore',loadMore);
    }
};
