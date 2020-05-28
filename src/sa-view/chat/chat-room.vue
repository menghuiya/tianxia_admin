<template>
  <div class="vue-box">
    <div class="c-panel">
      <!-- 参数栏 -->
      <div class="c-title">用户列表</div>
      <el-form :inline="true" size="mini">
        <el-form-item label="用户昵称：">
          <el-input v-model="p.username" placeholder="模糊查询"></el-input>
        </el-form-item>
        <el-form-item label="注册日期：">
          <el-date-picker
            v-model="p.start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
          ></el-date-picker>
          -
          <el-date-picker
            v-model="p.end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="min-width: 0px;">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="
              p.pageNo = 1;
              f5();
            "
            >查询</el-button
          >
        </el-form-item>
        <br />
        <el-form-item label="综合排序：" class="s-radio-text">
          <el-radio-group v-model="p.sort_type">
            <el-radio :label="1">注册时间</el-radio>
            <el-radio :label="2">最近登录</el-radio>
            <el-radio :label="3">登陆次数</el-radio>
            <el-radio :label="4">最近签到</el-radio>
            <el-radio :label="5">签到次数</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- <div class="c-title">数据列表</div> -->
      <el-table :data="dataList" size="mini">
        <el-table-column label="编号" width="70px">
          <template slot-scope="props">
            {{ props.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="房间id" prop="roomId"></el-table-column>
        <el-table-column label="用户昵称1" prop="users[0].userName">
        </el-table-column>
        <el-table-column label="用户昵称2" prop="users[1].userName">
        </el-table-column>
        <el-table-column label="创建于" prop="createTime">
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
              type="success"
              icon="el-icon-view"
              @click="get(s.row)"
              >详情</el-button
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
  </div>
</template>

<script>
import { request } from '@/network/request';
export default {
  data() {
    return {
      p: {
        // 查询参数
        username: '',
        pageNo: 1,
        pageSize: 10,
      },
      dataCount: 1,
      dataList: [],
      isType: 1, //1代表是下一页 0代表上一页
    };
  },
  methods: {
    // 数据刷新
    f5: function() {
      request({
        url: '/api/manage/room/' + this.p.pageNo,
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
    // 删除
    del: function(data) {
      this.sa.confirm(
        '是否删除，此操作不可撤销',
        function() {
          request({
            url: '/api/manage/room/' + data._id,
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
    // 查看
    get: function(data) {
      var str = '<div>';
      str += '<p>编号：' + data._id + '</p>';
      str += '<p>昵称：' + data.userName + '</p>';
      str += '<p>性别：未知</p>';
      str +=
        '<p>当前状态：<b>' + (data.status == 1 ? '正常' : '禁用') + '</b></p>';
      str += '<p>注册方式：普通注册</p>';
      str += '<p>注册时间：' + data.createTime + '</p>';
      str += '</div>';
      this.sa.alert(str);
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
    // this.f5();
  },
  beforeMount() {
    this.f5();
  },
};
</script>

<style></style>
