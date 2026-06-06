import { useEffect, useState } from 'react'
import { Input, Menu, Table, Tag, Empty } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface BillCode {
  id: number
  code: string
  name: string
  unit: string
  chapter: string
  description: string
}

export function BillCodeLibrary() {
  const [chapters, setChapters] = useState<string[]>([])
  const [activeChapter, setActiveChapter] = useState<string>('')
  const [keyword, setKeyword] = useState('')
  const [codes, setCodes] = useState<BillCode[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.api.library.billChapters().then((chs) => {
      setChapters(chs)
      if (chs.length > 0) setActiveChapter(chs[0])
    })
  }, [])

  useEffect(() => {
    loadCodes()
  }, [activeChapter, keyword])

  const loadCodes = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (keyword.trim()) {
        params.keyword = keyword.trim()
      } else if (activeChapter) {
        params.chapter = activeChapter
      }
      const data = await window.api.library.billCodes(params)
      setCodes(data)
    } finally {
      setLoading(false)
    }
  }

  const columns: ColumnsType<BillCode> = [
    { title: '项目编码', dataIndex: 'code', key: 'code', width: 120, render: (v) => <Tag color="green">{v}</Tag> },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '计量单位', dataIndex: 'unit', key: 'unit', width: 80, align: 'center' },
    { title: '工程内容', dataIndex: 'description', key: 'description', ellipsis: true },
  ]

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ width: 220, borderRight: '1px solid #e8e8e8', overflow: 'auto', background: '#fafafa' }}>
        <div style={{ padding: '12px 16px', fontWeight: 600, borderBottom: '1px solid #e8e8e8' }}>清单分类</div>
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

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8' }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索清单编码或名称"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            allowClear
            style={{ maxWidth: 400 }}
          />
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
          <Table
            columns={columns}
            dataSource={codes}
            rowKey="id"
            size="small"
            loading={loading}
            pagination={false}
            locale={{ emptyText: <Empty description="无数据" /> }}
            bordered
          />
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #e8e8e8', color: '#999', fontSize: 12 }}>
          共 {codes.length} 条清单项
        </div>
      </div>
    </div>
  )
}
