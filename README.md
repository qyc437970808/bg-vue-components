# bg-vue-components

> 前端组件库

## 打包步骤

npm run build--prod

## 本地开发，调试

npm run dev

## 引入bg-vue-components

#### 完整引入
在 main.js 中写入以下内容：

```
import bgVueComponents from 'bg-vue-components'
import 'bg-vue-components/thmeme/index.css';

Vue.use(bgVueComponents);
```

#### 按需引入

借助babel-plugin-component，我们可以只引入需要的组件，以达到减小项目体积的目的。

首先，安装babel-plugin-component:
npm install babel-plugin-component -D

然后，将.babelrc里的plugins数组增加:
```
{
  "preset": [
    ["es2015", { "modules": false }]
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "bg-vue-components",
        "camel2Dash": false,
        "styleLibrary": {
          "base": false,
          "name": "theme"
        }
      }
    ]
  ]
}
```

#### 代码规范
packages文件夹下index.js用于做**全量引入**的入口。每个子文件夹内的index.js作为**按需引入**的入口。

- 组件文件夹命名：**驼峰**，例如：package/button
- 组件.vue文件内的name命名：前缀“**Bg**” + 「**首字母大写驼峰的组件名**」，例如： BgButton，使用的时候则是bg-button
- 引用公共资源时，为避免重复打包，请都是用import '**bg-vue-components**/xx/xx',例如：

  正确的用法： import {t} from 'bg-vue-components/src/locale'.
  错误的用法： import {t} from '@/locale';
- 当增加新的公共资源**文件夹**时，需要在build/build-config里增加文件名，否则打包出来后按需引入会有问题

## 国际化

使用vue-i18n：

npm install vue-i18n -S

main.vue上添加以下代码：
```
import VueI18n from 'vue-i18n';
import * as bgLocale from 'bg-vue-components/lib/locale'
import enLocale from 'bg-vue-components/lib/en'
import zhLocale from 'bg-vue-components/lib/zh'

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',    // 语言标识
  messages: {
    en: {
      message: {
        hello: 'hello world'
      },
      ...enLocale
    },
    zh: {
      message: {
        hello: '你好世界',
      },
      ...zhLocale
    }
  }
});

Vue.use(Loading)
bgLocale.i18n((key, value) => i18n.t(key, value));

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  // ...
})
```