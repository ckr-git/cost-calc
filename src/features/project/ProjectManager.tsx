import { useEffect, useState } from 'react'
import { Button, Table, Space, Modal, Input, Select, message, Popconfirm, Tooltip } from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  FolderOutlined,
  FileOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import { useProjectStore, Project, Engineering } from '../../store/projectStore'
import type { ColumnsType } from 'antd/es/table'

const SPECIALTIES = [
  { value: '工业建筑工程', label: '工业建筑工程' },
  { value: '民用建筑工程', label: '民用建筑工程' },
  { value: '装饰工程', label: '装饰工程' },
  { value: '排水工程', label: '排水工程' },
  { value: '给水工程', label: '给水工程' },
  { value: '电气工程', label: '电气工程' },
  { value: '市政工程', label: '市政工程' },
]

interface TreeRow {
  key: string
  id: number
  type: 'project' | 'engineering'
  name: string
  specialty: string
  unitPriceFile: string
  feeRateFile: string
  createdAt: string
  totalCost: number
  subdivisionTotal: number
  measureTotal: number
  otherTotal: number
  regulationFee: number
  children?: TreeRow[]
}

interface ProjectManagerProps {
  onOpenEngineering?: (engineeringId: number, engineeringName: string) => void
}

export function ProjectManager({ onOpenEngineering }: ProjectManagerProps) {
  const { projects, loading, fetchProjects, createProject, deleteProject, createEngineering, deleteEngineering } = useProjectStore()
  const [newProjectName, setNewProjectName] = useState('')
  const [showNewProject, setShowNewProject] = useState(false)
  const [showNewEng, setShowNewEng] = useState(false)
  const [newEngData, setNewEngData] = useState({ name: '', specialty: '', projectId: 0, parentId: null as number | null })
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null)
  const [totals, setTotals] = useState<Record<number, any>>({})

  useEffect(() => {
    fetchProjects()
  }, [])

  // 加载汇总数据
  useEffect(() => {
    if (projects.length > 0) {
      const engIds = collectEngIds(projects)
      if (engIds.length > 0) {
        window.api.summary.batchTotals(engIds).then(setTotals)
      }
    }
  }, [projects])

  const treeData = buildTreeData(projects, totals)

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      message.warning('请输入项目名称')
      return
    }
    await createProject(newProjectName.trim())
    setNewProjectName('')
    setShowNewProject(false)
    message.success('项目创建成功')
  }

  const handleCreateEngineering = async () => {
    if (!newEngData.name.trim()) {
      message.warning('请输入工程名称')
      return
    }
    await createEngineering({
      project_id: newEngData.projectId,
      parent_id: newEngData.parentId,
      name: newEngData.name.trim(),
      specialty: newEngData.specialty
    })
    setNewEngData({ name: '', specialty: '', projectId: 0, parentId: null })
    setShowNewEng(false)
    message.success('工程创建成功')
  }

  const handleNewClick = () => {
    if (!selectedRowKey) {
      setShowNewProject(true)
      return
    }
    const [type, idStr] = selectedRowKey.split('-')
    const id = parseInt(idStr)
    if (type === 'project') {
      setNewEngData({ name: '', specialty: '', projectId: id, parentId: null })
      setShowNewEng(true)
    } else {
      const eng = findEngineering(projects, id)
      if (eng) {
        setNewEngData({ name: '', specialty: '', projectId: eng.project_id, parentId: eng.id })
        setShowNewEng(true)
      }
    }
  }

  const handleDelete = async () => {
    if (!selectedRowKey) return
    const [type, idStr] = selectedRowKey.split('-')
    const id = parseInt(idStr)
    if (type === 'project') {
      await deleteProject(id)
    } else {
      await deleteEngineering(id)
    }
    setSelectedRowKey(null)
    message.success('删除成功')
  }

  const columns: ColumnsType<TreeRow> = [
    {
      title: '工程列表',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: (text, record) => (
        <span>
          {record.type === 'project' ? <FolderOutlined style={{ color: '#1890ff', marginRight: 6 }} /> : <FileOutlined style={{ marginRight: 6 }} />}
          {text}
        </span>
      )
    },
    { title: '工程造价', dataIndex: 'totalCost', key: 'totalCost', width: 120, align: 'right', render: (v) => v > 0 ? v.toFixed(2) : '' },
    { title: '工程专业', dataIndex: 'specialty', key: 'specialty', width: 120 },
    { title: '单价文件', dataIndex: 'unitPriceFile', key: 'unitPriceFile', width: 120 },
    { title: '费率文件', dataIndex: 'feeRateFile', key: 'feeRateFile', width: 120 },
    { title: '创建日期', dataIndex: 'createdAt', key: 'createdAt', width: 110 },
    { title: '分部分项合计', dataIndex: 'subdivisionTotal', key: 'subdivisionTotal', width: 120, align: 'right', render: (v) => v > 0 ? v.toFixed(2) : '' },
    { title: '措施项合计', dataIndex: 'measureTotal', key: 'measureTotal', width: 110, align: 'right', render: (v) => v > 0 ? v.toFixed(2) : '' },
    { title: '其他项合计', dataIndex: 'otherTotal', key: 'otherTotal', width: 110, align: 'right', render: (v) => v > 0 ? v.toFixed(2) : '' },
    { title: '规费', dataIndex: 'regulationFee', key: 'regulationFee', width: 100, align: 'right', render: (v) => v > 0 ? v.toFixed(2) : '' },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* 工具栏 */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa' }}>
        <span style={{ fontSize: 16, fontWeight: 600 }}>项目管理</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNewClick}>新建</Button>
        <Tooltip title="上移"><Button icon={<ArrowUpOutlined />} size="small" /></Tooltip>
        <Tooltip title="下移"><Button icon={<ArrowDownOutlined />} size="small" /></Tooltip>
        <div style={{ flex: 1 }} />
        <Popconfirm title="确定删除?" onConfirm={handleDelete} disabled={!selectedRowKey}>
          <Button danger icon={<DeleteOutlined />} disabled={!selectedRowKey}>删除</Button>
        </Popconfirm>
      </div>

      {/* 树形表格 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
        <Table
          columns={columns}
          dataSource={treeData}
          loading={loading}
          size="small"
          pagination={false}
          scroll={{ x: 1400 }}
          rowClassName={(record) => record.key === selectedRowKey ? 'row-selected' : ''}
          onRow={(record) => ({
            onClick: () => setSelectedRowKey(record.key),
            onDoubleClick: () => {
              if (record.type === 'engineering' && onOpenEngineering) {
                onOpenEngineering(record.id, record.name)
              }
            }
          })}
          expandable={{ defaultExpandAllRows: true }}
          bordered
        />
      </div>

      {/* 新建项目对话框 */}
      <Modal
        title="新建项目"
        open={showNewProject}
        onOk={handleCreateProject}
        onCancel={() => setShowNewProject(false)}
        okText="确定"
        cancelText="取消"
      >
        <Input
          placeholder="项目名称"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          onPressEnter={handleCreateProject}
          autoFocus
        />
      </Modal>

      {/* 新建工程对话框 */}
      <Modal
        title="新建工程"
        open={showNewEng}
        onOk={handleCreateEngineering}
        onCancel={() => setShowNewEng(false)}
        okText="确定"
        cancelText="取消"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            placeholder="工程名称"
            value={newEngData.name}
            onChange={(e) => setNewEngData({ ...newEngData, name: e.target.value })}
            autoFocus
          />
          <Select
            placeholder="选择专业"
            style={{ width: '100%' }}
            options={SPECIALTIES}
            value={newEngData.specialty || undefined}
            onChange={(val) => setNewEngData({ ...newEngData, specialty: val })}
            allowClear
          />
        </Space>
      </Modal>

      <style>{`
        .row-selected td {
          background: #fffde6 !important;
        }
        .ant-table-row:hover td {
          background: #f0f7ff !important;
        }
      `}</style>
    </div>
  )
}

function buildTreeData(projects: Project[], totals: Record<number, any>): TreeRow[] {
  return projects.map((p) => {
    const children = p.children?.map((e) => engineeringToRow(e, totals)) || []
    // 项目的造价 = 各子工程合计
    const totalCost = children.reduce((s, c) => s + c.totalCost, 0)
    const subdivisionTotal = children.reduce((s, c) => s + c.subdivisionTotal, 0)
    const measureTotal = children.reduce((s, c) => s + c.measureTotal, 0)
    const otherTotal = children.reduce((s, c) => s + c.otherTotal, 0)
    const regulationFee = children.reduce((s, c) => s + c.regulationFee, 0)
    return {
      key: `project-${p.id}`,
      id: p.id,
      type: 'project' as const,
      name: p.name,
      specialty: '',
      unitPriceFile: '',
      feeRateFile: '',
      createdAt: p.created_at?.split('T')[0] || p.created_at?.split(' ')[0] || '',
      totalCost,
      subdivisionTotal,
      measureTotal,
      otherTotal,
      regulationFee,
      children
    }
  })
}

function engineeringToRow(eng: Engineering, totals: Record<number, any>): TreeRow {
  const t = totals[eng.id] || {}
  const children = eng.children?.length ? eng.children.map((c) => engineeringToRow(c, totals)) : undefined
  // 如果有子工程，造价取子工程合计；否则取自身
  const totalCost = children?.length ? children.reduce((s, c) => s + c.totalCost, 0) : (t.totalCost || 0)
  const subdivisionTotal = children?.length ? children.reduce((s, c) => s + c.subdivisionTotal, 0) : (t.subdivisionTotal || 0)
  const measureTotal = children?.length ? children.reduce((s, c) => s + c.measureTotal, 0) : (t.measureTotal || 0)
  const otherTotal = children?.length ? children.reduce((s, c) => s + c.otherTotal, 0) : (t.otherTotal || 0)
  const regulationFee = children?.length ? children.reduce((s, c) => s + c.regulationFee, 0) : (t.regulationFee || 0)
  return {
    key: `engineering-${eng.id}`,
    id: eng.id,
    type: 'engineering',
    name: eng.name,
    specialty: eng.specialty,
    unitPriceFile: eng.unit_price_file,
    feeRateFile: eng.fee_rate_file,
    createdAt: eng.created_at?.split('T')[0] || eng.created_at?.split(' ')[0] || '',
    totalCost,
    subdivisionTotal,
    measureTotal,
    otherTotal,
    regulationFee,
    children
  }
}

function collectEngIds(projects: Project[]): number[] {
  const ids: number[] = []
  for (const p of projects) {
    collectFromTree(p.children || [], ids)
  }
  return ids
}

function collectFromTree(items: Engineering[], ids: number[]): void {
  for (const item of items) {
    ids.push(item.id)
    if (item.children?.length) collectFromTree(item.children, ids)
  }
}

function findEngineering(projects: Project[], id: number): Engineering | null {
  for (const p of projects) {
    const found = findInTree(p.children || [], id)
    if (found) return found
  }
  return null
}

function findInTree(items: Engineering[], id: number): Engineering | null {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children?.length) {
      const found = findInTree(item.children, id)
      if (found) return found
    }
  }
  return null
}
