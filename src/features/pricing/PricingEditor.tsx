import { useEffect, useState, useCallback } from 'react'
import { Table, Button, Space, Input, InputNumber, Modal, message, Popconfirm, Tag, Empty, Tabs } from 'antd'
import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined, SearchOutlined, CalculatorOutlined, UnorderedListOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { CostSummary } from './CostSummary'

interface BillItem {
  id: number
  engineering_id: number
  code: string
  name: string
  unit: string
  quantity: number
  quantity_formula: string
  unit_price: number
  total_price: number
  quotas: QuotaItem[]
}

interface QuotaItem {
  id: number
  bill_item_id: number
  quota_code: string
  name: string
  unit: string
  quantity: number
  labor_cost: number
  material_cost: number
  machine_cost: number
  base_price: number
}

interface Props {
  engineeringId: number
  engineeringName: string
  onBack: () => void
}

export function PricingEditor({ engineeringId, engineeringName, onBack }: Props) {
  const [bills, setBills] = useState<BillItem[]>([])
  const [selectedBill, setSelectedBill] = useState<BillItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [showBillCodePicker, setShowBillCodePicker] = useState(false)
  const [showQuotaPicker, setShowQuotaPicker] = useState(false)
  const [activeTab, setActiveTab] = useState<'bill' | 'summary'>('bill')

  const loadBills = useCallback(async () => {
    setLoading(true)
    try {
      const data = await window.api.bill.getByEngineering(engineeringId)
      setBills(data)
      // 刷新选中项
      if (selectedBill) {
        const updated = data.find((b: BillItem) => b.id === selectedBill.id)
        setSelectedBill(updated || null)
      }
    } finally {
      setLoading(false)
    }
  }, [engineeringId, selectedBill?.id])

  useEffect(() => {
    loadBills()
  }, [engineeringId])

  // 手动添加清单项
  const handleAddBillManual = async () => {
    await window.api.bill.create({
      engineering_id: engineeringId,
      code: '',
      name: '新建清单项',
      unit: '',
      quantity: 0,
      quantity_formula: ''
    })
    await loadBills()
  }

  // 从清单库添加
  const handleAddBillFromLib = async (item: any) => {
    await window.api.bill.create({
      engineering_id: engineeringId,
      code: item.code,
      name: item.name,
      unit: item.unit,
      quantity: 0,
      quantity_formula: ''
    })
    setShowBillCodePicker(false)
    await loadBills()
    message.success(`已添加: ${item.name}`)
  }

  // 更新清单项字段
  const handleBillUpdate = async (id: number, field: string, value: any) => {
    await window.api.bill.update(id, { [field]: value })
    await loadBills()
  }

  // 删除清单项
  const handleBillDelete = async (id: number) => {
    await window.api.bill.delete(id)
    if (selectedBill?.id === id) setSelectedBill(null)
    await loadBills()
  }

  // 从定额库添加定额子目到选中清单项
  const handleAddQuota = async (quotaLibId: number) => {
    if (!selectedBill) return
    await window.api.bill.addQuota(selectedBill.id, quotaLibId, 1)
    setShowQuotaPicker(false)
    await loadBills()
    message.success('定额已套入')
  }

  // 更新定额工程量
  const handleQuotaQuantityChange = async (quotaId: number, quantity: number) => {
    await window.api.bill.updateQuota(quotaId, { quantity })
    await loadBills()
  }

  // 删除定额子目
  const handleQuotaDelete = async (quotaId: number) => {
    await window.api.bill.deleteQuota(quotaId)
    await loadBills()
  }

  // 上部清单列表列定义
  const billColumns: ColumnsType<BillItem> = [
    { title: '序号', width: 50, align: 'center', render: (_, __, i) => i + 1 },
    {
      title: '项目编码', dataIndex: 'code', width: 120,
      render: (v, record) => (
        <Input size="small" value={v} style={{ border: 'none', background: 'transparent' }}
          onBlur={(e) => handleBillUpdate(record.id, 'code', e.target.value)}
          onChange={(e) => {
            setBills((prev) => prev.map((b) => b.id === record.id ? { ...b, code: e.target.value } : b))
          }}
        />
      )
    },
    {
      title: '项目名称', dataIndex: 'name', width: 200,
      render: (v, record) => (
        <Input size="small" value={v} style={{ border: 'none', background: 'transparent' }}
          onBlur={(e) => handleBillUpdate(record.id, 'name', e.target.value)}
          onChange={(e) => {
            setBills((prev) => prev.map((b) => b.id === record.id ? { ...b, name: e.target.value } : b))
          }}
        />
      )
    },
    {
      title: '单位', dataIndex: 'unit', width: 70, align: 'center',
      render: (v, record) => (
        <Input size="small" value={v} style={{ border: 'none', background: 'transparent', width: 50, textAlign: 'center' }}
          onBlur={(e) => handleBillUpdate(record.id, 'unit', e.target.value)}
          onChange={(e) => {
            setBills((prev) => prev.map((b) => b.id === record.id ? { ...b, unit: e.target.value } : b))
          }}
        />
      )
    },
    {
      title: '工程量', dataIndex: 'quantity', width: 100, align: 'right',
      render: (v, record) => (
        <InputNumber size="small" value={v} min={0} step={0.01}
          style={{ width: '100%', border: 'none' }}
          onBlur={(e) => handleBillUpdate(record.id, 'quantity', parseFloat(e.target.value) || 0)}
          onChange={(val) => {
            setBills((prev) => prev.map((b) => b.id === record.id ? { ...b, quantity: val || 0 } : b))
          }}
        />
      )
    },
    { title: '综合单价', dataIndex: 'unit_price', width: 110, align: 'right', render: (v) => v > 0 ? v.toFixed(2) : '-' },
    { title: '合价', dataIndex: 'total_price', width: 120, align: 'right', render: (v) => v > 0 ? <b>{v.toFixed(2)}</b> : '-' },
    {
      title: '操作', width: 60, align: 'center',
      render: (_, record) => (
        <Popconfirm title="删除此清单项？" onConfirm={() => handleBillDelete(record.id)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ]

  // 下部定额子目列
  const quotaColumns: ColumnsType<QuotaItem> = [
    { title: '定额编号', dataIndex: 'quota_code', width: 90, render: (v) => <Tag color="blue">{v}</Tag> },
    { title: '名称', dataIndex: 'name', width: 220 },
    { title: '单位', dataIndex: 'unit', width: 60, align: 'center' },
    {
      title: '工程量', dataIndex: 'quantity', width: 90, align: 'right',
      render: (v, record) => (
        <InputNumber size="small" value={v} min={0} step={0.01} style={{ width: 80 }}
          onChange={(val) => handleQuotaQuantityChange(record.id, val || 0)}
        />
      )
    },
    { title: '基价', dataIndex: 'base_price', width: 90, align: 'right', render: (v) => v.toFixed(2) },
    { title: '人工', dataIndex: 'labor_cost', width: 80, align: 'right', render: (v) => v.toFixed(2) },
    { title: '材料', dataIndex: 'material_cost', width: 80, align: 'right', render: (v) => v.toFixed(2) },
    { title: '机械', dataIndex: 'machine_cost', width: 80, align: 'right', render: (v) => v.toFixed(2) },
    { title: '小计', width: 100, align: 'right', render: (_, r) => <b>{(r.base_price * r.quantity).toFixed(2)}</b> },
    {
      title: '', width: 40,
      render: (_, record) => (
        <Popconfirm title="删除?" onConfirm={() => handleQuotaDelete(record.id)}>
          <Button type="text" size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ]

  // 汇总
  const totalAmount = bills.reduce((s, b) => s + b.total_price, 0)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* 顶部工具栏 */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} size="small">返回</Button>
        <span style={{ fontWeight: 600, fontSize: 14 }}>{engineeringName}</span>
        <div style={{ marginLeft: 16, display: 'flex', gap: 4 }}>
          <Button type={activeTab === 'bill' ? 'primary' : 'default'} size="small"
            icon={<UnorderedListOutlined />} onClick={() => setActiveTab('bill')}>清单计价</Button>
          <Button type={activeTab === 'summary' ? 'primary' : 'default'} size="small"
            icon={<CalculatorOutlined />} onClick={() => setActiveTab('summary')}>造价汇总</Button>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontWeight: 600, color: '#c00' }}>分部分项: ¥{totalAmount.toFixed(2)}</span>
      </div>

      {activeTab === 'bill' ? (
        <>
          {/* 上半：清单列表 */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderBottom: '3px solid #e8e8e8' }}>
            <div style={{ padding: '6px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>分部分项工程量清单</span>
              <Button size="small" icon={<PlusOutlined />} onClick={handleAddBillManual}>手动添加</Button>
              <Button size="small" icon={<SearchOutlined />} onClick={() => setShowBillCodePicker(true)}>从清单库选</Button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <Table
                columns={billColumns}
                dataSource={bills}
                rowKey="id"
                size="small"
                pagination={false}
                loading={loading}
                bordered
                rowClassName={(record) => record.id === selectedBill?.id ? 'row-selected' : ''}
                onRow={(record) => ({ onClick: () => setSelectedBill(record) })}
              />
            </div>
          </div>

          {/* 下半：定额子目 */}
          <div style={{ height: 280, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '6px 16px', display: 'flex', gap: 8, alignItems: 'center', background: '#f5f5f5' }}>
              <span style={{ fontWeight: 500 }}>
                定额组价 {selectedBill ? `— ${selectedBill.name}` : '（请选择清单项）'}
              </span>
              <Button size="small" icon={<PlusOutlined />} disabled={!selectedBill}
                onClick={() => setShowQuotaPicker(true)}>套定额</Button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {selectedBill ? (
                <Table
                  columns={quotaColumns}
                  dataSource={selectedBill.quotas || []}
                  rowKey="id"
                  size="small"
                  pagination={false}
                  bordered
                  locale={{ emptyText: <Empty description="尚未套定额，点击「套定额」从定额库选择" image={Empty.PRESENTED_IMAGE_SIMPLE} /> }}
                />
              ) : (
                <Empty description="请先在上方选择一条清单项" style={{ marginTop: 40 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </div>
        </>
      ) : (
        <CostSummary engineeringId={engineeringId} />
      )}

      {/* 清单库选择弹窗 */}
      <BillCodePickerModal
        open={showBillCodePicker}
        onClose={() => setShowBillCodePicker(false)}
        onSelect={handleAddBillFromLib}
      />

      {/* 定额库选择弹窗 */}
      <QuotaPickerModal
        open={showQuotaPicker}
        onClose={() => setShowQuotaPicker(false)}
        onSelect={handleAddQuota}
      />

      <style>{`
        .row-selected td { background: #fffde6 !important; }
      `}</style>
    </div>
  )
}

// ========== 清单库选择弹窗 ==========
function BillCodePickerModal({ open, onClose, onSelect }: {
  open: boolean; onClose: () => void; onSelect: (item: any) => void
}) {
  const [keyword, setKeyword] = useState('')
  const [codes, setCodes] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      window.api.library.billCodes({ keyword: keyword || undefined }).then(setCodes)
    }
  }, [open, keyword])

  return (
    <Modal title="从清单库选择" open={open} onCancel={onClose} footer={null} width={700}>
      <Input placeholder="搜索清单编码或名称" prefix={<SearchOutlined />}
        value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ marginBottom: 12 }} />
      <Table
        dataSource={codes} rowKey="id" size="small" pagination={{ pageSize: 8 }} bordered
        columns={[
          { title: '编码', dataIndex: 'code', width: 120 },
          { title: '名称', dataIndex: 'name', width: 180 },
          { title: '单位', dataIndex: 'unit', width: 60 },
          { title: '工程内容', dataIndex: 'description', ellipsis: true },
          { title: '', width: 60, render: (_, r) => <Button size="small" type="link" onClick={() => onSelect(r)}>选用</Button> },
        ]}
      />
    </Modal>
  )
}

// ========== 定额库选择弹窗 ==========
function QuotaPickerModal({ open, onClose, onSelect }: {
  open: boolean; onClose: () => void; onSelect: (quotaLibId: number) => void
}) {
  const [keyword, setKeyword] = useState('')
  const [quotas, setQuotas] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      window.api.library.quotas({ keyword: keyword || undefined }).then(setQuotas)
    }
  }, [open, keyword])

  return (
    <Modal title="从定额库选择（套定额）" open={open} onCancel={onClose} footer={null} width={800}>
      <Input placeholder="搜索定额编号或名称" prefix={<SearchOutlined />}
        value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ marginBottom: 12 }} />
      <Table
        dataSource={quotas} rowKey="id" size="small" pagination={{ pageSize: 8 }} bordered
        columns={[
          { title: '编号', dataIndex: 'code', width: 80, render: (v) => <Tag color="blue">{v}</Tag> },
          { title: '名称', dataIndex: 'name', width: 220 },
          { title: '单位', dataIndex: 'unit', width: 60 },
          { title: '基价', dataIndex: 'base_price', width: 90, align: 'right', render: (v) => v.toFixed(2) },
          { title: '人工', dataIndex: 'labor_cost', width: 80, align: 'right', render: (v) => v.toFixed(2) },
          { title: '材料', dataIndex: 'material_cost', width: 80, align: 'right', render: (v) => v.toFixed(2) },
          { title: '', width: 60, render: (_, r) => <Button size="small" type="link" onClick={() => onSelect(r.id)}>套用</Button> },
        ]}
      />
    </Modal>
  )
}
