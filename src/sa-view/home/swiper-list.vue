<style scoped>
.td-img {
  width: 160px;
  height: 60px;
  cursor: pointer;
  vertical-align: middle;
}
.c-panel-add .td-img {
  width: 60px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: #d9d9d9;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: #d9d9d9;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 160px;
  height: 60px;
  display: block;
}
</style>

<template>
  <div class="vue-box">
    <div class="c-panel">
      <!-- 数据栏 -->
      <div class="c-title">分类列表</div>
      <el-table :data="dataList" size="mini">
        <el-table-column label="编号" width="70px">
          <template slot-scope="props">
            {{ props.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="图片" width="200px">
          <template slot-scope="s">
            <img :src="s.row.imgPath" class="td-img" title="点击预览" />
          </template>
        </el-table-column>
        <el-table-column label="内容" width="200px">
          <template slot-scope="s">
            {{ s.row.content }}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="60px">
          1
        </el-table-column>
        <el-table-column label="_id">
          <template slot-scope="s">
            {{ s.row._id }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150px">
          <template slot-scope="s">{{
            sa.forDate(s.row.createTime, 2)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150px">
          <template slot-scope="s">
            <el-badge
              class="item"
              :is-dot="s.row.is_update"
              style="margin: 5px 0;"
            >
              <el-button
                class="c-btn"
                type="primary"
                icon="el-icon-edit"
                @click="update(s.row)"
                >修改</el-button
              >
            </el-badge>
            <el-badge class="item" :is-dot="false" style="margin: 5px 0;">
              <el-button
                class="c-btn"
                type="danger"
                icon="el-icon-delete"
                @click="del(s.row)"
                >删除</el-button
              >
            </el-badge>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
    </div>
    <!-- 添加一个 -->
    <div class="c-panel c-panel-add">
      <h4 class="c-title">添加一个</h4>
      <el-form size="mini" v-if="m">
        <el-form-item label="图片：">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/img"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            list-type="picture"
          >
            <img v-if="m.imgPath" :src="m.imgPath" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="m.content" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <span class="c-label"></span>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="add"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { request } from '@/network/request';
export default {
  data() {
    return {
      dataList: [], // 数据集合
      m: {
        // 添加信息
        content: '',
        imgPath: '',
      },
      curr_m: null, // 当前操作的 m
    };
  },
  methods: {
    // 刷新
    f5: function() {
      request({
        url: '/api/manage/notice',
        method: 'get',
      }).then((res) => {
        this.dataList = res.data.data; // 数据
      });
    },
    // 保存
    add: function() {
      request({
        url: '/api/manage/notice',
        method: 'post',
        data: this.m,
      })
        .then((res) => {
          let newdata = res.data.data;
          console.log(newdata);
          this.sa.alert(
            '添加成功',
            function() {
              this.dataList.push(newdata);
              this.m.kindName = '';
              this.m.imgPath = '';
            }.bind(this)
          );
        })
        .catch((err) => {
          this.sa.error(err.msg);
        });
    },
    // 修改
    update: function() {
      this.$notify.error({
        title: '很抱歉',
        message: '我们还未开发此接口',
      });
    },
    // 删除
    del: function(data) {
      this.sa.confirm(
        '是否删除，此操作不可撤销',
        function() {
          request({
            url: '/api/manage/notice/' + data._id,
            method: 'delete',
          })
            .then(() => {
              this.sa.arrayDelete(this.dataList, data);
              this.sa.ok('删除成功');
            })
            .catch((err) => {
              this.sa.error(err.msg);
            });
        }.bind(this)
      );
    },
    handleAvatarSuccess(res) {
      let surl =
        'https://static-resource-1256396014.cos.ap-nanjing.myqcloud.com/img/public/';
      this.m.imgPath = surl + res.data.src;
    },
  },
  created() {
    this.f5();
  },
};
</script>
