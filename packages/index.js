import Button from './button';
import Loading from './loading';
import LoadMore from './loadMore';
import TreeSelect from './treeSelect';

const components = [
  Button,
  LoadMore,
  Loading,
  TreeSelect
];

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install, // 全量引入
  Button,
  LoadMore,
  Loading,
  TreeSelect
};
