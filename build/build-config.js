const path = require('path');
const fs = require('fs');
const getNodeExternals = require('webpack-node-externals');
const getComponentsPath = require('./getComponentPath');
const NAME = 'bg-vue-components'; // 组件库npm包的名字

const componentPath = getComponentsPath(path.resolve(__dirname, '../packages'));

let externals = {};
let entrys = {};
// 白名单
const nodeExternals = getNodeExternals({
  whitelist: [
    'lodash.debounce'
  ]
});

function getEntrysAndExternals(dirPath) {
  let entrys = {};
  let externals = {};

  const SRC_PATH = '../src';
  // console.log(path.join(__dirname, SRC_PATH, dirPath));
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

entrys = {
  ...entrys,
  ...componentPath
};
Object.keys(componentPath).forEach(file => {
  externals[`${NAME}/packages/${file}`] = `${NAME}/lib/${file}`;
});
// utilsList.forEach(file => {
//   entrys[`utils/${file}`] = `${path.resolve(__dirname, '../src/utils')}/file`;
//   file = path.basename(file, '.js');
//   externals[`${NAME}/src/utils/${file}`] = `${NAME}/lib/utils/${file}`;
// })
// mixinsList.forEach(file => {
//   file = path.basename(file, '.js');
//   externals[`${NAME}/src/mixins/${file}`] = `${NAME}/lib/mixins/${file}`;
// })
// localeList.forEach(file => {
//   file = path.basename(file, '.js');
//   console.log('file:', file);
//   externals[`${NAME}/src/locale/${file}`] = `${NAME}/lib/locale/${file}`;
// })

externals = Object.assign({
  vue: 'vue'
}, externals)
// }, externals), nodeExternals];
module.exports.externals = externals;
module.exports.entrys = entrys;