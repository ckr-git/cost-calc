import { useEffect, useState } from 'react'
import { Input, Menu, Table, Tag, Empty } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface QuotaItem {
  id: number
  chapter: string
  code: string
  name: string
  unit: string
  base_price: number
  labor_cost: number
  material_cost: number
  machine_cost: number
  labor_hours: number
}

export function QuotaLibrary() {
  const [chapters, setChapters] = useState<string[]>([])
  const [activeChapter, setActiveChapter] = useState<string>('')
  const [keyword, setKeyword] = useState('')
  const [quotas, setQuotas] = useState<QuotaItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.api.library.quotaChapters().then((chs) => {
      setChapters(chs)
      if (chs.length > 0) setActiveChapter(chs[0])
    })
  }, [])

  useEffect(() => {
    loadQuotas()
  }, [activeChapter, keyword])

  const loadQuotas = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (keyword.trim()) {
        params.keyword = keyword.trim()
      } else if (activeChapter) {
        params.chapter = activeChapter
      }
      const data = await window.api.library.quotas(params)
      setQuotas(data)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<QuotaItem> = [
    { title: '定额编号', dataIndex: 'code', key: 'code', width: 90, render: (v) => <Tag color="blue">{v}</Tag> },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 280 },
    { title: '单位', dataIndex: 'unit', key: 'unit', width: 70, align: 'center' },
    { title: '基价', dataIndex: 'base_price', key: 'base_price', width: 100, align: 'right', render: (v) => <b>{v.toFixed(2)}</b> },
    { title: '人工费', dataIndex: 'labor_cost', key: 'labor_cost', width: 90, align: 'right', render: (v) => v.toFixed(2) },
    { title: '材料费', dataIndex: 'material_cost', key: 'material_cost', width: 90, align: 'right', render: (v) => v.toFixed(2) },
    { title: '机械费', dataIndex: 'machine_cost', key: 'machine_cost', width: 90, align: 'right', render: (v) => v.toFixed(2) },
    { title: '人工工日', dataIndex: 'labor_hours', key: 'labor_hours', width: 80, align: 'right', render: (v) => v.toFixed(2) },
  ]

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* 左侧章节导航 */}
      <div style={{ width: 200, borderRight: '1px solid #e8e8e8', overflow: 'auto', background: '#fafafa' }}>
        <div style={{ padding: '12px 16px', fontWeight: 600, borderBottom: '1px solid #e8e8e8' }}>定额章节</div>
        <Menu
          mode="inline"
          selectedKeys={keyword ? [] : [activeChapter]}
          style={{ border: 'none', background: 'transparent' }}
          items={chapters.map((ch) => ({ key: ch, label: ch }))}
          onClick={({ key }) => {
            setKeyword('')
            setActiveChapter(key)
          }}
        />
      </div>

      {/* 右侧定额列表 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索定额编号或名称（搜索时忽略章节筛选）"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            style={{ maxWidth: 400 }}
          />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
          <Table
            columns={columns}
            dataSource={quotas}
            rowKey="id"
            size="small"
            loading={loading}
            pagination={false}
            locale={{ emptyText: <Empty description="无数据" /> }}
            bordered
          />
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #e8e8e8', color: '#999', fontSize: 12 }}>
          共 {quotas.length} 条定额
        </div>
      </div>
    </div>
  )
}
