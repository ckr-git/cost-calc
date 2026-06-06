export {}

declare global {
  interface Window {
    api: {
      project: {
        getAll: () => Promise<any[]>
        create: (data: any) => Promise<any>
        update: (id: number, data: any) => Promise<any>
        delete: (id: number) => Promise<any>
      }
      engineering: {
        getByProject: (projectId: number) => Promise<any[]>
        create: (data: any) => Promise<any>
        update: (id: number, data: any) => Promise<any>
        delete: (id: number) => Promise<any>
      }
      library: {
        quotas: (params?: any) => Promise<any[]>
        quotaChapters: () => Promise<string[]>
        billCodes: (params?: any) => Promise<any[]>
        billChapters: () => Promise<string[]>
        feeRateFiles: () => Promise<any[]>
        feeRules: (fileId: number) => Promise<any[]>
      }
      bill: {
        getByEngineering: (engId: number) => Promise<any[]>
        create: (data: any) => Promise<any>
        update: (id: number, data: any) => Promise<any>
        delete: (id: number) => Promise<any>
        addQuota: (billItemId: number, quotaLibraryId: number, quantity: number) => Promise<any>
        updateQuota: (id: number, data: any) => Promise<any>
        deleteQuota: (id: number) => Promise<any>
      }
      summary: {
        calculate: (engineeringId: number, feeRateFileId?: number) => Promise<any>
        projectTotal: (projectId: number) => Promise<any>
        engineeringTotals: (engineeringId: number) => Promise<any>
        batchTotals: (engineeringIds: number[]) => Promise<Record<number, any>>
      }
      unitprice: {
        list: () => Promise<any[]>
        create: (data: any) => Promise<any>
        delete: (id: number) => Promise<any>
        materials: (fileId: number, keyword?: string) => Promise<any[]>
        addMaterial: (data: any) => Promise<any>
        updateMaterial: (id: number, data: any) => Promise<any>
        deleteMaterial: (id: number) => Promise<any>
        seedDefaults: (fileId: number) => Promise<any>
      }
      export: {
        summary: (engineeringId: number) => Promise<{ success: boolean; path?: string }>
      }
    }
  }
}
