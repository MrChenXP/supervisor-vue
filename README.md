# kwvue
> 这是督导vue技术版本

## 运行
> npm run dev || npm run start

## 安装开发环境
> webpack 不能是4.0及以上 若下载某些包，依赖webpack4.0，请降低该包版本

## 部署服务器
1. 把src/lib/kwz.vue.js   KWVue.dev:true  改成false
2. 将页面上的账号密码清除
3. 注意不同地区差别===interfQyWx.vue
4. 打包后 将index.html放入WebContent/content_m 。static放入WebContent.

## 修改过的插件
###富文本编辑器
  1. 打包 修改源文件后使用rollup -c打包。再放入VUE项目的node_modules目录中去。使用打包工具rollup时需要再editor目录下安装 rollup-plugin-progress包，打包完后可以删除安装的node-modules。Vue只需要dist文件
  2. 修改了：
     整个插件的层级问题
     图片选择方式
     文字：保留标题，字体大小两个功能

## Pc端创建手机评估标准 规则
<input type="text" class="pgbz-data" name="xm2"/>
<input type="text" class="pgbz-data" name="xm2"/>
<input type="text" data-cal="avg-xm1-xm2 " class="pgbz-data" name="FZ"/>
	所有的input都要加class=” pgbz-data”和name=”字母+数字”。 计算分值input框name值一定写死FenZhi
	暂只能计算平均分，平均分input加data-cal=”avg-xx-xx” xx是需要计算的input Name值。属性要按照顺序写，且不能加其他属性如：value，title等
