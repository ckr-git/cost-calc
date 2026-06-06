import { useEffect, useState } from 'react'
import { Button, Table, Input, InputNumber, List, Modal, Select, Tag, message, Popconfirm, Empty } from 'antd'
import { PlusOutlined, DeleteOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface UnitPriceFile {
  id: number
  name: string
  description: string
}

interface MaterialPrice {
  id: number
  unit_price_file_id: number
  code: string
  name: string
  unit: string
  market_price: number
  quota_price: number
  category: string
}

const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  labor: { label: '人工', color: 'blue' },
  material: { label: '材料', color: 'green' },
  machine: { label: '机械', color: 'orange' },
}

export function UnitPriceManager() {
  const [files, setFiles] = useState<UnitPriceFile[]>([])
  const [activeFile, setActiveFile] = useState<UnitPriceFile | null>(null)
  const [materials, setMaterials] = useState<MaterialPrice[]>([])
  const [keyword, setKeyword] = useState('')
  const [showNewFile, setShowNewFile] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [showAddMaterial, setShowAddMaterial] = useState(false)
  const [newMaterial, setNewMaterial] = useState({ code: '', name: '', unit: '', market_price: 0, quota_price: 0, category: 'material' })

  useEffect(() => {
    loadFiles()
  }, [])

  useEffect(() => {
    if (activeFile) loadMaterials()
  }, [activeFile, keyword])

  const loadFiles = async () => {
    const data = await window.api.unitprice.list()
    setFiles(data)
    if (data.length > 0 && !activeFile) setActiveFile(data[0])
  }

  const loadMaterials = async () => {
    if (!activeFile) return
    const data = await window.api.unitprice.materials(activeFile.id, keyword || undefined)
    setMaterials(data)
  }

  const handleCreateFile = async () => {
    if (!newFileName.trim()) return
    const result = await window.api.unitprice.create({ name: newFileName.trim() })
    // 自动导入默认人材机
    await window.api.unitprice.seedDefaults(result.id)
    setNewFileName('')
    setShowNewFile(false)
    await loadFiles()
    message.success('单价文件已创建（含默认人材机）')
  }

  const handleDeleteFile = async (id: number) => {
    await window.api.unitprice.delete(id)
    if (activeFile?.id === id) setActiveFile(null)
    await loadFiles()
  }

  const handleUpdatePrice = async (id: number, field: string, value: number) => {
    await window.api.unitprice.updateMaterial(id, { [field]: value })
    await loadMaterials()
  }

  const handleAddMaterial = async () => {
    if (!activeFile || !newMaterial.name.trim()) return
    await window.api.unitprice.addMaterial({ ...newMaterial, unit_price_file_id: activeFile.id })
    setShowAddMaterial(false)
    setNewMaterial({ code: '', name: '', unit: '', market_price: 0, quota_price: 0, category: 'material' })
    await loadMaterials()
    message.success('已添加')
  }

  const handleDeleteMaterial = async (id: number) => {
    await window.api.unitprice.deleteMaterial(id)
    await loadMaterials()
  }

  const columns: ColumnsType<MaterialPrice> = [
    { title: '编号', dataIndex: 'code', width: 70 },
    {
      title: '类别', dataIndex: 'category', width: 60, align: 'center',
      render: (v) => { const c = CATEGORY_MAP[v]; return c ? <Tag color={c.color}>{c.label}</Tag> : v }
    },
    { title: '名称', dataIndex: 'name', width: 200 },
    { title: '单位', dataIndex: 'unit', width: 60, align: 'center' },
    {
      title: '定额价', dataIndex: 'quota_price', width: 100, align: 'right',
      render: (v) => v.toFixed(2)
    },
    {
      title: '市场价', dataIndex: 'market_price', width: 110, align: 'right',
      render: (v, record) => (
        <InputNumber size="small" value={v} min={0} step={0.01} style={{ width: 90 }}
          onChange={(val) => val !== null && handleUpdatePrice(record.id, 'market_price', val)} />
      )
    },
    {
      title: '价差', width: 90, align: 'right',
      render: (_, r) => {
        const diff = r.market_price - r.quota_price
        return <span style={{ color: diff > 0 ? '#c00' : diff < 0 ? '#090' : '#999' }}>{diff > 0 ? '+' : ''}{diff.toFixed(2)}</span>
      }
    },
    {
      title: '', width: 40,
      render: (_, record) => (
        <Popconfirm title="删除?" onConfirm={() => handleDeleteMaterial(record.id)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ]

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* 左侧：文件列表 */}
      <div style={{ width: 240, borderRight: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600 }}>单价文件</span>
          <Button size="small" icon={<PlusOutlined />} onClick={() => setShowNewFile(true)} />
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <List
            dataSource={files}
            renderItem={(file) => (
              <List.Item
                onClick={() => setActiveFile(file)}
                style={{
                  padding: '10px 16px', cursor: 'pointer',
                  background: activeFile?.id === file.id ? '#e6f4ff' : 'transparent',
                  borderLeft: activeFile?.id === file.id ? '3px solid #1890ff' : '3px solid transparent'
                }}
                actions={[
                  <Popconfirm title="删除此文件？" onConfirm={() => handleDeleteFile(file.id)}>
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                ]}
              >
                <span>{file.name}</span>
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* 右侧：材料价格列表 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', gap: 8, alignItems: 'center' }}>
          <Input prefix={<SearchOutlined />} placeholder="搜索编号或名称" value={keyword}
            onChange={(e) => setKeyword(e.target.value)} allowClear style={{ maxWidth: 250 }} />
          <Button size="small" icon={<PlusOutlined />} disabled={!activeFile}
            onClick={() => setShowAddMaterial(true)}>添加</Button>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeFile ? (
            <Table columns={columns} dataSource={materials} rowKey="id" size="small" pagination={false} bordered />
          ) : (
            <Empty description="请选择或创建单价文件" style={{ marginTop: 60 }} />
          )}
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #e8e8e8', color: '#999', fontSize: 12 }}>
          共 {materials.length} 条 · 市场价可直接编辑
        </div>
      </div>

      {/* 新建文件弹窗 */}
      <Modal title="新建单价文件" open={showNewFile} onOk={handleCreateFile}
        onCancel={() => setShowNewFile(false)} okText="创建" cancelText="取消">
        <Input placeholder="单价文件名称" value={newFileName} onChange={(e) => setNewFileName(e.target.value)}
          onPressEnter={handleCreateFile} autoFocus />
      </Modal>

      {/* 添加材料弹窗 */}
      <Modal title="添加人材机" open={showAddMaterial} onOk={handleAddMaterial}
        onCancel={() => setShowAddMaterial(false)} okText="添加" cancelText="取消">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Select options={[
            { value: 'labor', label: '人工' },
            { value: 'material', label: '材料' },
            { value: 'machine', label: '机械' },
          ]} value={newMaterial.category} onChange={(v) => setNewMaterial({ ...newMaterial, category: v })} />
          <Input placeholder="编号" value={newMaterial.code} onChange={(e) => setNewMaterial({ ...newMaterial, code: e.target.value })} />
          <Input placeholder="名称" value={newMaterial.name} onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })} />
          <Input placeholder="单位" value={newMaterial.unit} onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })} />
          <InputNumber placeholder="定额价" style={{ width: '100%' }} value={newMaterial.quota_price}
            onChange={(v) => setNewMaterial({ ...newMaterial, quota_price: v || 0 })} />
          <InputNumber placeholder="市场价" style={{ width: '100%' }} value={newMaterial.market_price}
            onChange={(v) => setNewMaterial({ ...newMaterial, market_price: v || 0 })} />
        </div>
      </Modal>
    </div>
  )
}
