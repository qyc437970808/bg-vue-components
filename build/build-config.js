const path = require('path');
const fs = require('fs');
const getNodeExternals = require('webpack-node-externals');
const getComponentsPath = require('./getComponentPath');
const NAME = 'bg-vue-components'; // 组件库npm包的名字

const componentPath = getComponentsPath(path.resolve(__dirname, '../packages'));

// 避免依赖冗余：防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
let externals = {};
// 打包设置多入口，按需加载需要
let entrys = {};
// const nodeExternals = getNodeExternals({
//   whitelist: [
//     'lodash.debounce'
//   ]
// });

/**
 * 从传入的文件夹名里获取打包该文件夹所需要的entry[入口]和externals
 * @param {*} dirPath 
 */
function getEntrysAndExternals(dirPath) {
  let entrys = {};
  let externals = {};

  const SRC_PATH = '../src';
  const fileList = fs.readdirSync(path.join(__dirname, SRC_PATH, dirPath));
  fileList.forEach(file => {
    file = path.basename(file, '.js');
    // 如果是文件名index，还有两种写法： bg-vue-components/xxx/index 和 bg-vue-components/xxx
    if (file === 'index') {
      externals[`${NAME}/src/${dirPath}`] = `${NAME}/lib/${dirPath}/${file}`;
    }
    entrys[`${dirPath}/${file}`] = `${path.join(__dirname, SRC_PATH, dirPath)}/${file}`;
    externals[`${NAME}/src/${dirPath}/${file}`] = `${NAME}/lib/${dirPath}/${file}`;
  })
  return {
    entrys,
    externals
  };
}

// 这三个文件夹会设置打包入口
['utils', 'mixins', 'locale'].forEach(dirPath => {
  const res = getEntrysAndExternals(dirPath);
  entrys = {
    ...entrys,
    ...res.entrys
  };
  externals = {
    ...externals,
    ...res.externals
  }
});

// 加上packages下的组件打包entry和externals
Object.keys(componentPath).forEach(file => {
  // 驼峰转Dash命名
  dashFileName = file.replace(/[A-Z]/, word => '-' + word.toLowerCase());
  externals[`${NAME}/packages/${file}`] = `${NAME}/lib/${dashFileName}`;
  entrys[dashFileName] = componentPath[file];
});

// 假如固定externals：vue
externals = Object.assign({
  vue: 'vue'
}, externals)
module.exports.externals = externals;
module.exports.entrys = entrys;