<template>
  <div class="pipelines-view">
    <div class="page-header">
      <h2>流水线管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        新建流水线
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col :span="8" v-for="pipeline in pipelineStore.pipelines" :key="pipeline.id">
        <el-card class="pipeline-card">
          <div class="pipeline-header">
            <h3>{{ pipeline.name }}</h3>
            <el-tag :type="getStatusType(pipeline.status)" size="large">
              {{ getStatusText(pipeline.status) }}
            </el-tag>
          </div>
          
          <div class="pipeline-info">
            <p><strong>项目 ID:</strong> {{ pipeline.projectId }}</p>
            <p><strong>最后运行:</strong> {{ pipeline.lastRun }}</p>
            <p><strong>持续时间:</strong> {{ pipeline.duration }}</p>
          </div>

          <div class="pipeline-stages">
            <h4>流水线阶段</h4>
            <el-steps :active="getActiveStage(pipeline.status)" align-center>
              <el-step
                v-for="(stage, index) in pipeline.stages"
                :key="index"
                :title="stage"
                :status="getStageStatus(pipeline.status, index)"
              />
            </el-steps>
          </div>

          <div class="pipeline-actions">
            <el-button
              type="primary"
              @click="handleTriggerPipeline(pipeline.id)"
              :loading="pipeline.status === 'running'"
            >
              <el-icon><VideoPlay /></el-icon>
              触发执行
            </el-button>
            <el-button @click="viewDetails(pipeline)">
              查看详情
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Add Pipeline Dialog -->
    <el-dialog
      v-model="showAddDialog"
      title="新建流水线"
      width="600px"
    >
      <el-form label-width="120px">
        <el-form-item label="流水线名称" required>
          <el-input placeholder="请输入流水线名称" />
        </el-form-item>
        <el-form-item label="关联项目" required>
          <el-select placeholder="请选择项目" style="width: 100%">
            <el-option
              v-for="project in projectStore.projects"
              :key="project.id"
              :label="project.name"
              :value="project.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流水线阶段">
          <el-checkbox-group>
            <el-checkbox label="checkout">代码检出</el-checkbox>
            <el-checkbox label="build">构建</el-checkbox>
            <el-checkbox label="test">测试</el-checkbox>
            <el-checkbox label="deploy">部署</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePipelineStore, useProjectStore } from '../stores'
import { ElMessage } from 'element-plus'
import { Plus, VideoPlay } from '@element-plus/icons-vue'

const pipelineStore = usePipelineStore()
const projectStore = useProjectStore()
const showAddDialog = ref(false)

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

const getActiveStage = (status) => {
  if (status === 'success') return 4
  if (status === 'running') return 2
  if (status === 'failed') return 3
  return 0
}

const getStageStatus = (pipelineStatus, stageIndex) => {
  if (pipelineStatus === 'success') return 'success'
  if (pipelineStatus === 'failed' && stageIndex === 2) return 'error'
  if (pipelineStatus === 'running') return 'process'
  return 'wait'
}

const handleTriggerPipeline = (id) => {
  pipelineStore.triggerPipeline(id)
  ElMessage.success('流水线已触发')
}

const viewDetails = (pipeline) => {
  ElMessage.info(`查看流水线 ${pipeline.name} 的详情`)
}
</script>

<style scoped>
.pipelines-view {
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

.pipeline-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.pipeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.pipeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.pipeline-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.pipeline-info {
  margin-bottom: 20px;
}

.pipeline-info p {
  margin: 8px 0;
  color: #606266;
  font-size: 14px;
}

.pipeline-stages {
  margin: 20px 0;
}

.pipeline-stages h4 {
  margin-bottom: 15px;
  color: #303133;
}

.pipeline-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e6e6e6;
}
</style>
