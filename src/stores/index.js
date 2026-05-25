import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([
    {
      id: 1,
      name: 'flowmaster-backend',
      description: 'FlowMaster 后端服务',
      gitUrl: 'https://github.com/flowmaster/backend.git',
      branch: 'main',
      status: 'active',
      lastBuild: '2024-01-15 10:30:00',
      buildStatus: 'success'
    },
    {
      id: 2,
      name: 'flowmaster-frontend',
      description: 'FlowMaster 前端应用',
      gitUrl: 'https://github.com/flowmaster/frontend.git',
      branch: 'develop',
      status: 'active',
      lastBuild: '2024-01-15 09:15:00',
      buildStatus: 'running'
    },
    {
      id: 3,
      name: 'microservice-auth',
      description: '认证微服务',
      gitUrl: 'https://github.com/flowmaster/auth-service.git',
      branch: 'main',
      status: 'active',
      lastBuild: '2024-01-14 16:45:00',
      buildStatus: 'failed'
    }
  ])

  const addProject = (project) => {
    project.id = projects.value.length + 1
    project.status = 'active'
    project.lastBuild = new Date().toLocaleString()
    project.buildStatus = 'pending'
    projects.value.push(project)
  }

  const removeProject = (id) => {
    const index = projects.value.findIndex(p => p.id === id)
    if (index > -1) {
      projects.value.splice(index, 1)
    }
  }

  return {
    projects,
    addProject,
    removeProject
  }
})

export const usePipelineStore = defineStore('pipeline', () => {
  const pipelines = ref([
    {
      id: 1,
      name: 'Backend CI/CD Pipeline',
      projectId: 1,
      stages: ['checkout', 'build', 'test', 'deploy'],
      status: 'success',
      duration: '5m 32s',
      lastRun: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      name: 'Frontend Build Pipeline',
      projectId: 2,
      stages: ['checkout', 'install', 'build', 'test'],
      status: 'running',
      duration: '2m 15s',
      lastRun: '2024-01-15 09:15:00'
    },
    {
      id: 3,
      name: 'Auth Service Pipeline',
      projectId: 3,
      stages: ['checkout', 'build', 'test', 'deploy-k8s'],
      status: 'failed',
      duration: '3m 45s',
      lastRun: '2024-01-14 16:45:00'
    }
  ])

  const triggerPipeline = (id) => {
    const pipeline = pipelines.value.find(p => p.id === id)
    if (pipeline) {
      pipeline.status = 'running'
      pipeline.lastRun = new Date().toLocaleString()
    }
  }

  return {
    pipelines,
    triggerPipeline
  }
})

export const useBuildStore = defineStore('build', () => {
  const builds = ref([
    {
      id: 1,
      projectName: 'flowmaster-backend',
      pipelineName: 'Backend CI/CD Pipeline',
      commit: 'a1b2c3d',
      commitMessage: 'Fix authentication bug',
      author: '张三',
      status: 'success',
      duration: '5m 32s',
      timestamp: '2024-01-15 10:30:00'
    },
    {
      id: 2,
      projectName: 'flowmaster-frontend',
      pipelineName: 'Frontend Build Pipeline',
      commit: 'e4f5g6h',
      commitMessage: 'Update UI components',
      author: '李四',
      status: 'running',
      duration: '2m 15s',
      timestamp: '2024-01-15 09:15:00'
    },
    {
      id: 3,
      projectName: 'microservice-auth',
      pipelineName: 'Auth Service Pipeline',
      commit: 'i7j8k9l',
      commitMessage: 'Add OAuth2 support',
      author: '王五',
      status: 'failed',
      duration: '3m 45s',
      timestamp: '2024-01-14 16:45:00'
    }
  ])

  return {
    builds
  }
})
