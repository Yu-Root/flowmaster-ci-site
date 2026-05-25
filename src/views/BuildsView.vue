<template>
  <div class="builds-view">
    <div class="page-header">
      <h2>构建历史</h2>
      <div class="filters">
        <el-select v-model="filterProject" placeholder="选择项目" clearable style="width: 200px; margin-right: 10px;">
          <el-option label="全部项目" value="" />
          <el-option
            v-for="project in projectStore.projects"
            :key="project.id"
            :label="project.name"
            :value="project.name"
          />
        </el-select>
        <el-select v-model="filterStatus" placeholder="构建状态" clearable style="width: 150px;">
          <el-option label="全部状态" value="" />
          <el-option label="成功" value="success" />
          <el-option label="失败" value="failed" />
          <el-option label="运行中" value="running" />
        </el-select>
      </div>
    </div>

    <el-table :data="filteredBuilds" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="projectName" label="项目名称" width="200">
        <template #default="{ row }">
          <el-icon><Folder /></el-icon>
          {{ row.projectName }}
        </template>
      </el-table-column>
      <el-table-column prop="pipelineName" label="流水线" min-width="200" />
      <el-table-column label="提交信息" min-width="250">
        <template #default="{ row }">
          <div class="commit-info">
            <el-tag size="small" type="info">{{ row.commit }}</el-tag>
            <span>{{ row.commitMessage }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)" size="small">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="持续时间" width="120" />
      <el-table-column prop="timestamp" label="构建时间" width="180" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewLogs(row)">
            查看日志
          </el-button>
          <el-button size="small" type="primary" @click="rebuild(row)">
            重新构建
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="filteredBuilds.length"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; justify-content: flex-end;"
    />

    <!-- Build Logs Dialog -->
    <el-dialog
      v-model="showLogsDialog"
      title="构建日志"
      width="800px"
    >
      <div class="logs-container" v-if="selectedBuild">
        <div class="log-header">
          <h4>{{ selectedBuild.projectName }} - {{ selectedBuild.pipelineName }}</h4>
          <el-tag :type="getStatusType(selectedBuild.status)">
            {{ getStatusText(selectedBuild.status) }}
          </el-tag>
        </div>
        <el-divider />
        <div class="log-content">
          <pre>{{ mockLogs }}</pre>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBuildStore, useProjectStore } from '../stores'
import { ElMessage } from 'element-plus'
import { Folder } from '@element-plus/icons-vue'

const buildStore = useBuildStore()
const projectStore = useProjectStore()
const loading = ref(false)
const filterProject = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showLogsDialog = ref(false)
const selectedBuild = ref(null)

const filteredBuilds = computed(() => {
  let builds = buildStore.builds
  
  if (filterProject.value) {
    builds = builds.filter(b => b.projectName === filterProject.value)
  }
  
  if (filterStatus.value) {
    builds = builds.filter(b => b.status === filterStatus.value)
  }
  
  return builds
})

const mockLogs = `[2024-01-15 10:30:00] Starting build...
[2024-01-15 10:30:01] Checking out code from repository...
[2024-01-15 10:30:05] Code checkout completed
[2024-01-15 10:30:06] Installing dependencies...
[2024-01-15 10:30:15] Dependencies installed successfully
[2024-01-15 10:30:16] Running build command...
[2024-01-15 10:32:30] Build completed successfully
[2024-01-15 10:32:31] Running tests...
[2024-01-15 10:34:45] All tests passed (156/156)
[2024-01-15 10:34:46] Building Docker image...
[2024-01-15 10:35:20] Docker image built: flowmaster-backend:latest
[2024-01-15 10:35:21] Pushing to registry...
[2024-01-15 10:35:30] Image pushed successfully
[2024-01-15 10:35:31] Deploying to Kubernetes cluster...
[2024-01-15 10:35:32] Build completed successfully! ✓`

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

const viewLogs = (build) => {
  selectedBuild.value = build
  showLogsDialog.value = true
}

const rebuild = (build) => {
  ElMessage.success(`已重新触发 ${build.projectName} 的构建`)
}
</script>

<style scoped>
.builds-view {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.filters {
  display: flex;
  gap: 10px;
}

.commit-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logs-container {
  max-height: 500px;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-header h4 {
  margin: 0;
}

.log-content {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 4px;
  overflow-y: auto;
  max-height: 400px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.log-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
