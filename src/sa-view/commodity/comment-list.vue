<style scoped></style>

<template>
  <div class="vue-box">
    <div class="c-panel">
      <!-- 参数栏 -->
      <div class="c-title">检索参数</div>
      <el-form :inline="true" size="mini">
        <el-form-item label="评论编号：">
          <el-input v-model="p.id" type="number"></el-input>
        </el-form-item>
        <el-form-item label="标题：">
          <el-input v-model="p.title" placeholder="模糊查询"></el-input>
        </el-form-item>
        <el-form-item style="min-width: 10px;">
          <el-button type="primary" icon="el-icon-search" @click="f5"
            >查询</el-button
          >
        </el-form-item>
        <br />
        <el-form-item label="综合排序：">
          <el-radio-group v-model="p.sort_type">
            <el-radio :label="0">发表时间</el-radio>
            <el-radio :label="1">喜欢数</el-radio>
            <el-radio :label="2">点击数</el-radio>
            <el-radio :label="3">分享数</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 数据列表 -->
      <!-- <h4 class="c-title">列表</h4> -->
      <el-table class="data-table" :data="dataList" size="mini">
        <el-table-column label="编号" width="70px">
          <template slot-scope="props">
            {{ props.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="商品id" prop="commodityId._id">
        </el-table-column>
        <el-table-column
          label="评论内容"
          prop="comment"
          width="200px"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="发表人"
          prop="userId.userName"
        ></el-table-column>
        <el-table-column label="发表于" prop="createTime">
          <template slot-scope="s">
            {{ sa.forDate(s.row.createTime, 2) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          fixed="right"
          width="150px"
        >
          <template slot-scope="s">
            <el-button
              class="c-btn"
              type="primary"
              icon="el-icon-edit"
              @click="update(s.row)"
              >修改</el-button
            >
            <el-button
              class="c-btn"
              type="danger"
              icon="el-icon-delete"
              @click="del(s.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="page-box">
        <el-button-group>
          <el-button type="primary" icon="el-icon-arrow-left" @click="lastPage"
            >上一页</el-button
          >
          <el-button type="primary" @click="nextPage">
            下一页
            <i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 增改组件 -->
  </div>
</template>

<script>
import { request } from '@/network/request';
export default {
  data() {
    return {
      p: {
        // 查询参数
        id: '',
        title: '',
        sort_type: 0,
        pageNo: 1,
        pageSize: 10,
      },
      dataCount: 0, // 数据总数
      dataList: [], // 数据集合
      isType: 1, //1代表是下一页 0代表上一页
    };
  },
  methods: {
    // 数据刷新
    f5: function() {
      request({
        url: '/api/manage/comment/' + this.p.pageNo,
        method: 'get',
      })
        .then((res) => {
          this.dataList = res.data.data; // 数据
        })
        .catch((err) => {
          if (this.isType === 1) {
            this.$message({
              message: '亲爱的，这是告诉您,已经没有下一页了',
              type: 'warning',
            });
          } else if (this.isType === 0) {
            this.$message({
              message: '亲爱的，这是告诉您,已经没有上一页了',
              type: 'warning',
            });
          } else {
            this.sa.error(err.msg);
          }
        });
    },
    // 增加
    add: function() {
      // this.$refs['add-or-update'].open(0);
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
            url: '/api/manage/comment/' + data._id,
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
    nextPage() {
      this.isType = 1;
      let pageid = this.dataList[this.dataList.length - 1]._id;
      this.p.pageNo = pageid + '_true';
      this.f5();
    },
    lastPage() {
      this.isType = 0;
      let pageid = this.dataList[0]._id;
      this.p.pageNo = pageid + '_false';
      this.f5();
    },
  },
  created: function() {
    this.f5();
  },
};
</script>
