<template>
  <div id="app" :class="isCollapse ? 'collapse-app' : ''">
    <div class="menu-box">
      <div class="menu-header">
        <el-button
          type="primary"
          icon="el-icon-menu"
          circle
        ></el-button>
      </div>
      <el-menu
        class="claim-menu"
        background-color="#00132b"
        text-color="#fff"
        router
        :default-active="activeIndex"
        :collapse="isCollapse">
        <el-submenu index="/access">
          <template slot="title">
            <div><i class="el-icon-monitor"></i>权限管理</div>
          </template>
          <el-menu-item index="/access/user">用户管理</el-menu-item>
          <el-menu-item index="/access/role">角色管理</el-menu-item>
        </el-submenu>
        <!-- <el-submenu index="1">
          <template slot="title">
            <div><i class="el-icon-monitor"></i>工作台</div>
          </template>
          <el-menu-item index="1-1">子菜单1-1</el-menu-item>
          <el-menu-item index="1-2">子菜单1-2</el-menu-item>
        </el-submenu> -->
      </el-menu>
      <div class="menu-footer">
        <el-popover
          placement="right"
          width="100"
          :visible-arrow="false"
          trigger="hover"
          popper-class="menu-footer-pop">
          <ul class="menu-footer-pop-content">
            <li @click="handleLogout">退出登录</li>
          </ul>
          <i class="el-icon-user" slot="reference"></i>
        </el-popover>
        <div class="name-box">{{userName}}</div>
      </div>
    </div>
    <div class="content-box">
      <!-- <div class="claim-header" style="border-bottom: 1px solid #ccc;">header</div> -->
      <div class="claim-content">
        <router-view class="main-route"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { createNamespacedHelpers } from 'vuex';

export default Vue.extend({
  data() {
    return {
      isCollapse: true,
      activeIndex: '/',
      userName: 'test',
    };
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (this.activeIndex !== val) {
            this.activeIndex = val;
          }
        });
      },
    },
  },
  computed: {
  },
  mounted() {
    this.$nextTick(() => {
      this.$nextTick(() => {
        this.activeIndex = this.$route.path;
      });
    });
  },
  methods: {
    handleLogout() {},
  },
});
</script>
