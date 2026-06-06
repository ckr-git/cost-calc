import { create } from 'zustand'

export interface Engineering {
  id: number
  project_id: number
  parent_id: number | null
  name: string
  specialty: string
  unit_price_file: string
  fee_rate_file: string
  sort_order: number
  created_at: string
  children: Engineering[]
  // 计算字段
  total_cost?: number
  subdivision_total?: number
  measure_total?: number
  other_total?: number
  regulation_fee?: number
}

export interface Project {
  id: number
  name: string
  description: string
  quota_version: string
  created_at: string
  updated_at: string
  children: Engineering[]
}

interface ProjectStore {
  projects: Project[]
  selectedId: number | null
  loading: boolean
  setProjects: (projects: Project[]) => void
  setSelectedId: (id: number | null) => void
  setLoading: (loading: boolean) => void
  fetchProjects: () => Promise<void>
  createProject: (name: string) => Promise<void>
  deleteProject: (id: number) => Promise<void>
  createEngineering: (data: Partial<Engineering>) => Promise<void>
  deleteEngineering: (id: number) => Promise<void>
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  selectedId: null,
  loading: false,

  setProjects: (projects) => set({ projects }),
  setSelectedId: (id) => set({ selectedId: id }),
  setLoading: (loading) => set({ loading }),

  fetchProjects: async () => {
    set({ loading: true })
    try {
      const projects = await window.api.project.getAll()
      set({ projects })
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    } finally {
      set({ loading: false })
    }
  },

  createProject: async (name: string) => {
    await window.api.project.create({ name })
    await get().fetchProjects()
  },

  deleteProject: async (id: number) => {
    await window.api.project.delete(id)
    set({ selectedId: null })
    await get().fetchProjects()
  },

  createEngineering: async (data: Partial<Engineering>) => {
    await window.api.engineering.create(data)
    await get().fetchProjects()
  },

  deleteEngineering: async (id: number) => {
    await window.api.engineering.delete(id)
    await get().fetchProjects()
  }
}))
