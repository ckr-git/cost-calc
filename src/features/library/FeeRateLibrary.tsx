import { useEffect, useState } from 'react'
import { Table, Tag, List, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface FeeRateFile {
  id: number
  name: string
  description: string
}

interface FeeRule {
  id: number
  name: string
  calc_base: string
  rate: number
  category: string
  sort_order: number
}

const CALC_BASE_LABEL: Record<string, string> = {
  subdivision: '分部分项费',
  subdivision_labor: '分部分项人工费',
  labor: '人工费',
  pretax_total: '税前合计',
}

const CATEGORY_LABEL: Record<string, { text: string; color: string }> = {
  measure: { text: '措施费', color: 'orange' },
  regulation: { text: '规费', color: 'purple' },
  tax: { text: '税金', color: 'red' },
  other: { text: '其他', color: 'default' },
}

export function FeeRateLibrary() {
  const [files, setFiles] = useState<FeeRateFile[]>([])
  const [activeFile, setActiveFile] = useState<number | null>(null)
  const [rules, setRules] = useState<FeeRule[]>([])

  useEffect(() => {
    window.api.library.feeRateFiles().then((fs) => {
      setFiles(fs)
      if (fs.length > 0) setActiveFile(fs[0].id)
    })
  }, [])

  useEffect(() => {
    if (activeFile) {
      window.api.library.feeRules(activeFile).then(setRules)
    }
  }, [activeFile])

  const columns: ColumnsType<FeeRule> = [
    { title: '费用名称', dataIndex: 'name', key: 'name', width: 200 },
    {
      title: '类别', dataIndex: 'category', key: 'category', width: 100,
      render: (v) => {
        const c = CATEGORY_LABEL[v] || CATEGORY_LABEL.other
        return <Tag color={c.color}>{c.text}</Tag>
      }
    },
    { title: '取费基数', dataIndex: 'calc_base', key: 'calc_base', width: 160, render: (v) => CALC_BASE_LABEL[v] || v },
    { title: '费率(%)', dataIndex: 'rate', key: 'rate', width: 100, align: 'right', render: (v) => <b>{v.toFixed(2)}</b> },
  ]

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div style={{ width: 240, borderRight: '1px solid #e8e8e8', overflow: 'auto', background: '#fafafa' }}>
        <div style={{ padding: '12px 16px', fontWeight: 600, borderBottom: '1px solid #e8e8e8' }}>费率文件</div>
        <List
          dataSource={files}
          renderItem={(file) => (
            <List.Item
              onClick={() => setActiveFile(file.id)}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                background: activeFile === file.id ? '#e6f4ff' : 'transparent',
                borderLeft: activeFile === file.id ? '3px solid #1890ff' : '3px solid transparent'
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{file.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{file.description}</div>
              </div>
            </List.Item>
          )}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8e8e8', fontWeight: 600 }}>
          费率规则明细
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '0 16px' }}>
          <Table
            columns={columns}
            dataSource={rules}
            rowKey="id"
            size="small"
            pagination={false}
            locale={{ emptyText: <Empty description="请选择费率文件" /> }}
            bordered
          />
        </div>
      </div>
    </div>
  )
}
