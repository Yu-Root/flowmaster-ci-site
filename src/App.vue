<template>
  <el-container class="app-container">
    <el-aside width="240px" class="sidebar">
      <div class="logo">
        <h2>🚀 FlowMaster</h2>
        <p>CI/CD Platform</p>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/projects">
          <el-icon><Folder /></el-icon>
          <span>项目管理</span>
        </el-menu-item>
        <el-menu-item index="/pipelines">
          <el-icon><Connection /></el-icon>
          <span>流水线管理</span>
        </el-menu-item>
        <el-menu-item index="/builds">
          <el-icon><List /></el-icon>
          <span>构建历史</span>
        </el-menu-item>
        <el-menu-item index="/kubernetes">
          <el-icon><Platform /></el-icon>
          <span>K8s 部署</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <h3>{{ pageTitle }}</h3>
        </div>
        <div class="header-right">
          <el-badge :value="3" class="notification-badge">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>
          <el-avatar :size="36" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <span class="username">开发者</span>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled, Folder, Connection, List, Platform, Bell } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => route.path)

const pageTitle = computed(() => {
  const titles = {
    '/': 'FlowMaster CI/CD Platform',
    '/projects': '项目管理',
    '/pipelines': '流水线管理',
    '/builds': '构建历史',
    '/kubernetes': 'Kubernetes 部署管理'
  }
  return titles[route.path] || 'FlowMaster CI/CD Platform'
})
</script>

<style scoped>
.app-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  color: white;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #3d4a5c;
}

.logo h2 {
  margin: 0;
  font-size: 24px;
  color: #fff;
}

.logo p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #bfcbd9;
}

.el-menu {
  border-right: none;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left h3 {
  margin: 0;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-badge {
  cursor: pointer;
}

.username {
  color: #606266;
  font-size: 14px;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
