<template>
  <div class="projects-view">
    <div class="page-header">
      <h2>项目管理</h2>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        新建项目
      </el-button>
    </div>

    <el-table :data="projectStore.projects" style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="项目名称" width="200">
        <template #default="{ row }">
          <div class="project-name">
            <el-icon><Folder /></el-icon>
            <span>{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="gitUrl" label="Git 仓库" min-width="250">
        <template #default="{ row }">
          <el-link :href="row.gitUrl" target="_blank" type="primary">
            {{ row.gitUrl }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="branch" label="分支" width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ row.branch }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="buildStatus" label="构建状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.buildStatus)" size="small">
            {{ getStatusText(row.buildStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastBuild" label="最后构建" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="triggerBuild(row)">
            触发构建
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Add Project Dialog -->
    <el-dialog
      v-model="showAddDialog"
      title="新建项目"
      width="600px"
    >
      <el-form :model="newProject" label-width="100px">
        <el-form-item label="项目名称" required>
          <el-input v-model="newProject.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input
            v-model="newProject.description"
            type="textarea"
            :rows="3"
            placeholder="请输入项目描述"
          />
        </el-form-item>
        <el-form-item label="Git 仓库" required>
          <el-input v-model="newProject.gitUrl" placeholder="https://github.com/username/repo.git" />
        </el-form-item>
        <el-form-item label="默认分支">
          <el-input v-model="newProject.branch" placeholder="main" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddProject">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useProjectStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Folder } from '@element-plus/icons-vue'

const projectStore = useProjectStore()
const loading = ref(false)
const showAddDialog = ref(false)

const newProject = reactive({
  name: '',
  description: '',
  gitUrl: '',
  branch: 'main'
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

const triggerBuild = (project) => {
  ElMessage.success(`已触发 ${project.name} 的构建`)
}

const handleDelete = (project) => {
  ElMessageBox.confirm(
    `确定要删除项目 "${project.name}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    projectStore.removeProject(project.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleAddProject = () => {
  if (!newProject.name || !newProject.gitUrl) {
    ElMessage.warning('请填写必填项')
    return
  }
  
  projectStore.addProject({ ...newProject })
  ElMessage.success('项目创建成功')
  showAddDialog.value = false
  
  // Reset form
  newProject.name = ''
  newProject.description = ''
  newProject.gitUrl = ''
  newProject.branch = 'main'
}
</script>

<style scoped>
.projects-view {
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

.project-name {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
