<template>
  <div class="kubernetes-view">
    <div class="page-header">
      <h2>Kubernetes 部署管理</h2>
      <el-button type="primary" @click="showDeployDialog = true">
        <el-icon><Upload /></el-icon>
        部署应用
      </el-button>
    </div>

    <!-- Cluster Stats -->
    <el-row :gutter="20" class="stats-section">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#409EFF"><Monitor /></el-icon>
            <div class="stat-info">
              <div class="stat-value">3</div>
              <div class="stat-label">集群数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#67C23A"><Box /></el-icon>
            <div class="stat-info">
              <div class="stat-value">24</div>
              <div class="stat-label">运行 Pod</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#E6A23C"><Connection /></el-icon>
            <div class="stat-info">
              <div class="stat-value">12</div>
              <div class="stat-label">服务数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon :size="40" color="#F56C6C"><Cpu /></el-icon>
            <div class="stat-info">
              <div class="stat-value">68%</div>
              <div class="stat-label">CPU 使用率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Deployments Table -->
    <el-table :data="deployments" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="应用名称" width="200">
        <template #default="{ row }">
          <div class="app-name">
            <el-icon><Box /></el-icon>
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="namespace" label="命名空间" width="150">
        <template #default="{ row }">
          <el-tag size="small">{{ row.namespace }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="image" label="镜像" min-width="250">
        <template #default="{ row }">
          <span class="image-text">{{ row.image }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="replicas" label="副本数" width="120">
        <template #default="{ row }">
          <span>{{ row.replicas.current }}/{{ row.replicas.desired }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'Running' ? 'success' : 'warning'" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cpu" label="CPU" width="100" />
      <el-table-column prop="memory" label="内存" width="100" />
      <el-table-column prop="uptime" label="运行时间" width="150" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewLogs(row)">日志</el-button>
          <el-button size="small" type="primary" @click="scaleDeployment(row)">扩缩容</el-button>
          <el-button size="small" type="danger" @click="restartDeployment(row)">重启</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Deploy Dialog -->
    <el-dialog
      v-model="showDeployDialog"
      title="部署应用到 Kubernetes"
      width="700px"
    >
      <el-form label-width="120px">
        <el-form-item label="应用名称" required>
          <el-input placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="命名空间" required>
          <el-select placeholder="请选择命名空间" style="width: 100%">
            <el-option label="default" value="default" />
            <el-option label="production" value="production" />
            <el-option label="staging" value="staging" />
            <el-option label="development" value="development" />
          </el-select>
        </el-form-item>
        <el-form-item label="镜像地址" required>
          <el-input placeholder="registry.example.com/app:tag" />
        </el-form-item>
        <el-form-item label="副本数量">
          <el-input-number v-model="deployForm.replicas" :min="1" :max="10" />
        </el-form-item>
        <el-form-item label="CPU 限制">
          <el-input placeholder="500m" />
        </el-form-item>
        <el-form-item label="内存限制">
          <el-input placeholder="512Mi" />
        </el-form-item>
        <el-form-item label="部署策略">
          <el-radio-group>
            <el-radio label="rolling">滚动更新</el-radio>
            <el-radio label="recreate">重新创建</el-radio>
            <el-radio label="blue-green">蓝绿部署</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDeployDialog = false">取消</el-button>
        <el-button type="primary">开始部署</el-button>
      </template>
    </el-dialog>

    <!-- Scale Dialog -->
    <el-dialog
      v-model="showScaleDialog"
      title="扩缩容"
      width="500px"
    >
      <el-form v-if="selectedDeployment">
        <el-form-item label="当前副本数">
          <span>{{ selectedDeployment.replicas.current }}</span>
        </el-form-item>
        <el-form-item label="目标副本数">
          <el-input-number
            v-model="targetReplicas"
            :min="0"
            :max="20"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showScaleDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmScale">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, Monitor, Box, Connection, Cpu } from '@element-plus/icons-vue'

const loading = ref(false)
const showDeployDialog = ref(false)
const showScaleDialog = ref(false)
const selectedDeployment = ref(null)
const targetReplicas = ref(3)

const deployForm = reactive({
  replicas: 3
})

const deployments = ref([
  {
    name: 'flowmaster-backend',
    namespace: 'production',
    image: 'registry.example.com/flowmaster-backend:v1.2.3',
    replicas: { current: 3, desired: 3 },
    status: 'Running',
    cpu: '250m',
    memory: '256Mi',
    uptime: '5d 12h'
  },
  {
    name: 'flowmaster-frontend',
    namespace: 'production',
    image: 'registry.example.com/flowmaster-frontend:v1.2.3',
    replicas: { current: 2, desired: 2 },
    status: 'Running',
    cpu: '150m',
    memory: '128Mi',
    uptime: '5d 12h'
  },
  {
    name: 'auth-service',
    namespace: 'production',
    image: 'registry.example.com/auth-service:v2.0.1',
    replicas: { current: 2, desired: 3 },
    status: 'Running',
    cpu: '200m',
    memory: '192Mi',
    uptime: '3d 8h'
  },
  {
    name: 'api-gateway',
    namespace: 'production',
    image: 'registry.example.com/api-gateway:v1.5.0',
    replicas: { current: 3, desired: 3 },
    status: 'Running',
    cpu: '300m',
    memory: '384Mi',
    uptime: '7d 4h'
  }
])

const viewLogs = (deployment) => {
  ElMessage.info(`查看 ${deployment.name} 的日志`)
}

const scaleDeployment = (deployment) => {
  selectedDeployment.value = deployment
  targetReplicas.value = deployment.replicas.current
  showScaleDialog.value = true
}

const confirmScale = () => {
  if (selectedDeployment.value) {
    selectedDeployment.value.replicas.desired = targetReplicas.value
    ElMessage.success(`已将 ${selectedDeployment.value.name} 扩缩容到 ${targetReplicas.value} 个副本`)
    showScaleDialog.value = false
  }
}

const restartDeployment = (deployment) => {
  ElMessageBox.confirm(
    `确定要重启 ${deployment.name} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success(`正在重启 ${deployment.name}`)
  }).catch(() => {})
}
</script>

<style scoped>
.kubernetes-view {
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

.stats-section {
  margin-bottom: 30px;
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

.app-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-text {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #606266;
}
</style>
