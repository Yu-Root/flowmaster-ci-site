<template>
  <div class="home-view">
    <!-- Hero Section -->
    <div class="hero-section">
      <h1>🚀 FlowMaster CI/CD Platform</h1>
      <p class="subtitle">流水线大师持续交付平台</p>
      <p class="description">
        一款面向开发者的自动化运维平台，集成代码管理、自动化构建、测试与容器化部署（Kubernetes），
        实现从代码提交到生产环境的全链路自动化。
      </p>
      <div class="cta-buttons">
        <el-button type="primary" size="large" @click="$router.push('/projects')">
          开始使用
        </el-button>
        <el-button size="large" @click="scrollToFeatures">
          了解更多
        </el-button>
      </div>
    </div>

    <!-- Statistics Cards -->
    <el-row :gutter="20" class="stats-section">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#409EFF"><Folder /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ projectStore.projects.length }}</div>
              <div class="stat-label">项目总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#67C23A"><Connection /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ pipelineStore.pipelines.length }}</div>
              <div class="stat-label">活跃流水线</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#E6A23C"><List /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ buildStore.builds.length }}</div>
              <div class="stat-label">今日构建</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#F56C6C"><Platform /></el-icon>
            <div class="stat-info">
              <div class="stat-value">12</div>
              <div class="stat-label">K8s 集群</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Features Section -->
    <div id="features" class="features-section">
      <h2>核心功能</h2>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="feature-card">
            <el-icon :size="50" color="#409EFF"><Document /></el-icon>
            <h3>代码管理</h3>
            <p>支持 Git 仓库集成，自动检测代码变更，触发自动化流程</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card">
            <el-icon :size="50" color="#67C23A"><Cpu /></el-icon>
            <h3>自动化构建</h3>
            <p>多语言支持，并行构建，缓存优化，快速反馈构建结果</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card">
            <el-icon :size="50" color="#E6A23C"><CircleCheck /></el-icon>
            <h3>自动化测试</h3>
            <p>单元测试、集成测试、性能测试全覆盖，确保代码质量</p>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="8">
          <el-card class="feature-card">
            <el-icon :size="50" color="#F56C6C"><Box /></el-icon>
            <h3>容器化部署</h3>
            <p>Docker 镜像构建，Kubernetes 编排，蓝绿部署，滚动更新</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card">
            <el-icon :size="50" color="#909399"><Monitor /></el-icon>
            <h3>实时监控</h3>
            <p>构建状态实时推送，日志在线查看，性能指标监控</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="feature-card">
            <el-icon :size="50" color="#409EFF"><Setting /></el-icon>
            <h3>灵活配置</h3>
            <p>可视化流水线编辑，YAML 配置支持，插件生态扩展</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- Recent Activity -->
    <div class="activity-section">
      <h2>最近活动</h2>
      <el-timeline>
        <el-timeline-item
          v-for="(build, index) in recentBuilds"
          :key="index"
          :timestamp="build.timestamp"
          placement="top"
        >
          <el-card>
            <h4>{{ build.projectName }}</h4>
            <p>{{ build.commitMessage }}</p>
            <el-tag :type="getStatusType(build.status)" size="small">
              {{ getStatusText(build.status) }}
            </el-tag>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore, usePipelineStore, useBuildStore } from '../stores'
import { Folder, Connection, List, Platform, Document, Cpu, CircleCheck, Box, Monitor, Setting } from '@element-plus/icons-vue'

const projectStore = useProjectStore()
const pipelineStore = usePipelineStore()
const buildStore = useBuildStore()

const recentBuilds = computed(() => {
  return buildStore.builds.slice(0, 5)
})

const getStatusType = (status) => {
  const types = {
    success: 'success',
    failed: 'danger',
    running: 'warning',
    pending: 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = {
    success: '成功',
    failed: '失败',
    running: '运行中',
    pending: '等待中'
  }
  return texts[status] || status
}

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.home-view {
  max-width: 1400px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
  margin-bottom: 30px;
}

.hero-section h1 {
  font-size: 48px;
  margin: 0 0 10px;
}

.subtitle {
  font-size: 24px;
  margin: 0 0 20px;
  opacity: 0.9;
}

.description {
  font-size: 16px;
  max-width: 800px;
  margin: 0 auto 30px;
  line-height: 1.6;
  opacity: 0.85;
}

.cta-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.stats-section {
  margin-bottom: 40px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.features-section {
  margin-bottom: 40px;
}

.features-section h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.feature-card {
  text-align: center;
  padding: 20px;
  height: 100%;
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  margin: 15px 0 10px;
  color: #303133;
}

.feature-card p {
  color: #606266;
  line-height: 1.6;
}

.activity-section h2 {
  margin-bottom: 20px;
  color: #303133;
}
</style>
