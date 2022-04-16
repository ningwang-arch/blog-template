<template>
   <div class="about-main">
    <el-card>
      <div class="about-title">
        <h2>关于博客</h2>
      </div>
      <div class="about-content">
        <h4>博客简介</h4>
        <ul>
          <li>博客采用前后端分离，基于Vue通用框架开发</li>
          <li>
            前端技术栈：Vue + Vue-Router + Vue-cli3 + Axios + Sass + Element-ui
          </li>
          <li>
            后端技术栈：C++ + MySQL + Nginx
          </li>
          <li>
            服务器：CentOS7.6
          </li>
        </ul>
      </div>
      <div class="about-title">
        <h2>关于我</h2>
      </div>
      <div class="about-content">
        <h4>个人简介</h4>
        <ul>
          <li>姓名：eclipse</li>
          <li>职位：在校学生</li>
          <li>邮箱：ningwang778@gmail.com</li>
          <li>爱好：写bug, 涩图, 涩图, 还是涩图</li>
          <li>Blühn und verdorrn ist uns zugleich bewußt.</li>
        </ul>
      </div>
    </el-card>
  </div>
  <div class="other">
      <img src="https://thiscatdoesnotexist.com/" alt="">
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";
export default defineComponent({
    name: "About",
});
</script>

<style lang="less" scoped>
.about-main {
  background: #fff;
  .about-title {
    text-align: center;
    border-bottom: 1px dashed #e5e5e5;
  }
  .about-content {
    padding: 0 20px;
    ul {
      padding-left: 80px;
      li {
        color: #3d5064;
        line-height: 40px;
      }
    }
  }
}
.other {
  padding-left: 10px;
}
</style>