<style scoped>
.vue-box {
  background-color: #eee;
  font-size: 14px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
.content-box {
  margin: 1em;
  padding: 1em;
  background-color: #fff;
  color: #666;
}
.el-tag {
  border-radius: 1px;
}
/*800之下*/
@media (max-width: 800px) {
  .kapian {
    width: 100% !important;
    margin-right: 0px !important;
  }
  .saoma {
    display: none;
  }
}
/* markdown格式 */
.md-contetn {
  padding-left: 1.5em;
  line-height: 26px;
}
</style>
<style>
/* 多个ul时，切换那个啥 */
.md-contetn h4 {
  margin-left: -0.5em;
}
.md-contetn ul,
.md-contetn ol {
  padding-left: 1em;
}
.md-contetn pre {
  padding: 5px;
  background-color: #eee;
  font-family: 'times new roman';
}
</style>

<template>
  <div class="vue-box">
    <!-- 欢迎 -->
    <div class="content-box">
      <div
        style="padding: 1em; border-left: 5px #2D8CF0 solid; background-color: #EEE;"
      >
        <big><big>Welcome to 甜虾管理后台 </big></big>
        <span style="display: inline-block; margin-left: 1em; color: #888;">
          —— 简便管理程序数据!</span
        >

        <span></span>
      </div>
    </div>
    <!-- 介绍 -->
    <div class="content-box">
      还未想好页面
      <div style="clear: both;"></div>
    </div>
    <!-- 功能介绍 -->
    <div class="content-box">
      还未想好页面
      <div style="clear: both;"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 功能介绍
    return {};
  },
  methods: {
    // 没了
    meile: function() {
      this.$message({
        message: '没了还点',
        type: 'warning',
      });
    },
    // 显示文档页面
    openDoc: function() {
      parent.sp.selectMenu(11);
    },
  },
  mounted() {},
};
</script>
