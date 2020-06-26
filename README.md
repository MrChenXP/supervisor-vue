# kwvue
> 这是督导vue技术版本

## 运行
> npm run dev || npm run start
> rc/lib/kwz.vue.js   KwVue.dev true 是开发模式
> 本地开发需要 config/index.js 查看跨域有没有开启

## 安装开发环境
> webpack 不能是4.0及以上 若下载某些包，依赖webpack4.0，请降低该包版本

## 部署服务器
1. 把src/lib/kwz.vue.js   KWVue.dev:true  改成false
2. 将页面上的账号密码清除
3. 企业微信注意不同地区差别===interfQyWx.vue
4. 查看src/router/menu.js的id 是不是要部署服务的id
5. 打包后 将index.html放入WebContent/content_m 。static放入WebContent.

## 修改过的插件
###富文本编辑器
  1. 打包 修改源文件后使用rollup -c打包。再放入VUE项目的node_modules目录中去。使用打包工具rollup时需要再editor目录下安装 rollup-plugin-progress包，打包完后可以删除安装的node-modules。Vue只需要dist文件
  2. 修改了：
     整个插件的层级问题
     图片选择方式
     文字：保留标题，字体大小两个功能

## Pc端创建手机评估标准 规则
```
<rate-yo class="pgbz-data" name="xm2"/>
<rate-yo class="pgbz-data" name="xm2"/>
<rate-yo type="avg" rel="xm1-xm2 " class="pgbz-data" name="FenZhi"/>
```
   > 1. 想要变成星星的input标签写成ratge-yo
   > 2. 所有的ratge-yo都要加class='pgbz-data'和name=”字母+数字”。 
   > 3. 计算分值ratge-yo框name值一定写死FenZhi,不然保存有问题 type="计算方式"
   > 4. 暂只能计算平均分，平均分ratge-yo加rel=”xx-xx” xx是需要计算的之前ratge-yo的Name值。
   > 5. 属性要按照顺序写，且不能加其他属性如：value，title等
   > 6. pc端新建标准 不能用table 建议所有文字放同一行 星星单独占一行
