import Dialog from './src/main';
import drag from 'bg-vue-components/src/directive/dialog-drag';

/* istanbul ignore next */
Dialog.install = function(Vue) {
  Vue.component(Dialog.name, Dialog);
  Vue.directive('dialog-drag', drag)
};

export default Dialog