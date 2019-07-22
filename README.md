# bg-vue-components

> A Vue.js project

## Build Setup

npm run build--prod

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

- 组件文件夹命名：**首字母大写加驼峰**，例如：Button
- 组件.vue文件内的name命名：前缀“**Bg**” + 「**组件名**」，例如： BgButton，使用的时候则是bg-button