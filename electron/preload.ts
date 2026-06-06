import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // 项目管理
  project: {
    getAll: () => ipcRenderer.invoke('project:getAll'),
    create: (data: any) => ipcRenderer.invoke('project:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('project:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('project:delete', id),
  },
  // 工程管理
  engineering: {
    getByProject: (projectId: number) => ipcRenderer.invoke('engineering:getByProject', projectId),
    create: (data: any) => ipcRenderer.invoke('engineering:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('engineering:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('engineering:delete', id),
  },
  // 系统数据库（定额/清单/费率）
  library: {
    quotas: (params?: any) => ipcRenderer.invoke('library:quotas', params),
    quotaChapters: () => ipcRenderer.invoke('library:quotaChapters'),
    billCodes: (params?: any) => ipcRenderer.invoke('library:billCodes', params),
    billChapters: () => ipcRenderer.invoke('library:billChapters'),
    feeRateFiles: () => ipcRenderer.invoke('library:feeRateFiles'),
    feeRules: (fileId: number) => ipcRenderer.invoke('library:feeRules', fileId),
  },
  // 清单编制（计价核心）
  bill: {
    getByEngineering: (engId: number) => ipcRenderer.invoke('bill:getByEngineering', engId),
    create: (data: any) => ipcRenderer.invoke('bill:create', data),
    update: (id: number, data: any) => ipcRenderer.invoke('bill:update', id, data),
    delete: (id: number) => ipcRenderer.invoke('bill:delete', id),
    addQuota: (billItemId: number, quotaLibraryId: number, quantity: number) =>
      ipcRenderer.invoke('bill:addQuota', billItemId, quotaLibraryId, quantity),
    updateQuota: (id: number, data: any) => ipcRenderer.invoke('bill:updateQuota', id, data),
    deleteQuota: (id: number) => ipcRenderer.invoke('bill:deleteQuota', id),
  },
  // 费用汇总
  summary: {
    calculate: (engineeringId: number, feeRateFileId?: number) =>
      ipcRenderer.invoke('summary:calculate', engineeringId, feeRateFileId),
    projectTotal: (projectId: number) => ipcRenderer.invoke('summary:projectTotal', projectId),
    engineeringTotals: (engineeringId: number) => ipcRenderer.invoke('summary:engineeringTotals', engineeringId),
    batchTotals: (engineeringIds: number[]) => ipcRenderer.invoke('summary:batchTotals', engineeringIds),
  },
  // 单价文件
  unitprice: {
    list: () => ipcRenderer.invoke('unitprice:list'),
    create: (data: any) => ipcRenderer.invoke('unitprice:create', data),
    delete: (id: number) => ipcRenderer.invoke('unitprice:delete', id),
    materials: (fileId: number, keyword?: string) => ipcRenderer.invoke('unitprice:materials', fileId, keyword),
    addMaterial: (data: any) => ipcRenderer.invoke('unitprice:addMaterial', data),
    updateMaterial: (id: number, data: any) => ipcRenderer.invoke('unitprice:updateMaterial', id, data),
    deleteMaterial: (id: number) => ipcRenderer.invoke('unitprice:deleteMaterial', id),
    seedDefaults: (fileId: number) => ipcRenderer.invoke('unitprice:seedDefaults', fileId),
  },
  // 导出
  export: {
    summary: (engineeringId: number) => ipcRenderer.invoke('export:summary', engineeringId),
  }
}

contextBridge.exposeInMainWorld('api', api)
