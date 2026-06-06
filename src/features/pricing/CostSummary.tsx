import { useEffect, useState } from 'react'
import { Table, Spin, Divider, Button, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface FeeLineItem {
  name: string
  calcBase: string
  rate: number
  baseAmount: number
  amount: number
}

interface SummaryData {
  subdivision: number
  subdivisionLabor: number
  measureItems: FeeLineItem[]
  measureTotal: number
  otherTotal: number
  regulationItems: FeeLineItem[]
  regulationTotal: number
  pretaxTotal: number
  taxItems: FeeLineItem[]
  taxTotal: number
  grandTotal: number
}

const CALC_BASE_LABEL: Record<string, string> = {
  subdivision: '分部分项费',
  subdivision_labor: '分部分项人工费',
  labor: '人工费',
  pretax_total: '税前合计',
}

interface Props {
  engineeringId: number
}

export function CostSummary({ engineeringId }: Props) {
  const [data, setData] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSummary()
  }, [engineeringId])

  const loadSummary = async () => {
    setLoading(true)
    try {
      const result = await window.api.summary.calculate(engineeringId)
      setData(result)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !data) return <Spin style={{ margin: 40 }} />

  const feeColumns: ColumnsType<FeeLineItem> = [
    { title: '费用名称', dataIndex: 'name', width: 200 },
    { title: '取费基数', dataIndex: 'calcBase', width: 140, render: (v) => CALC_BASE_LABEL[v] || v },
    { title: '费率(%)', dataIndex: 'rate', width: 90, align: 'right', render: (v) => v.toFixed(2) },
    { title: '基数金额', dataIndex: 'baseAmount', width: 130, align: 'right', render: (v) => v.toFixed(2) },
    { title: '金额(元)', dataIndex: 'amount', width: 130, align: 'right', render: (v) => <b>{v.toFixed(2)}</b> },
  ]

  // 汇总行数据
  const summaryRows = [
    { key: '1', label: '一、分部分项费', amount: data.subdivision, highlight: false },
    { key: '2', label: '  其中：人工费', amount: data.subdivisionLabor, highlight: false },
    { key: '3', label: '二、措施项目费', amount: data.measureTotal, highlight: false },
    { key: '4', label: '三、其他项目费', amount: data.otherTotal, highlight: false },
    { key: '5', label: '四、规费', amount: data.regulationTotal, highlight: false },
    { key: '6', label: '五、税前合计', amount: data.pretaxTotal, highlight: true },
    { key: '7', label: '六、税金', amount: data.taxTotal, highlight: false },
    { key: '8', label: '七、工程造价', amount: data.grandTotal, highlight: true },
  ]

  const handleExport = async () => {
    const result = await window.api.export.summary(engineeringId)
    if (result.success) {
      message.success(`已导出: ${result.path}`)
    }
  }

  return (
    <div style={{ padding: '16px 24px', overflow: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>工程造价汇总</h3>
        <Button icon={<DownloadOutlined />} style={{ marginLeft: 16 }} onClick={handleExport}>导出Excel</Button>
      </div>

      {/* 造价总览 */}
      <Table
        dataSource={summaryRows}
        rowKey="key"
        size="small"
        pagination={false}
        bordered
        showHeader={false}
        columns={[
          {
            title: '项目', dataIndex: 'label', width: 300,
            render: (v, r) => <span style={{ fontWeight: r.highlight ? 700 : 400 }}>{v}</span>
          },
          {
            title: '金额', dataIndex: 'amount', align: 'right', width: 200,
            render: (v, r) => (
              <span style={{ fontWeight: r.highlight ? 700 : 400, color: r.highlight ? '#c00' : undefined, fontSize: r.highlight ? 15 : 13 }}>
                ¥{v.toFixed(2)}
              </span>
            )
          },
        ]}
        style={{ maxWidth: 550, marginBottom: 24 }}
      />

      {/* 措施费明细 */}
      {data.measureItems.length > 0 && (
        <>
          <Divider orientation="left" plain>措施项目费明细</Divider>
          <Table columns={feeColumns} dataSource={data.measureItems} rowKey="name"
            size="small" pagination={false} bordered style={{ maxWidth: 750, marginBottom: 16 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}><b>措施费合计</b></Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right"><b>{data.measureTotal.toFixed(2)}</b></Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </>
      )}

      {/* 规费明细 */}
      {data.regulationItems.length > 0 && (
        <>
          <Divider orientation="left" plain>规费明细</Divider>
          <Table columns={feeColumns} dataSource={data.regulationItems} rowKey="name"
            size="small" pagination={false} bordered style={{ maxWidth: 750, marginBottom: 16 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}><b>规费合计</b></Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right"><b>{data.regulationTotal.toFixed(2)}</b></Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </>
      )}

      {/* 税金明细 */}
      {data.taxItems.length > 0 && (
        <>
          <Divider orientation="left" plain>税金明细</Divider>
          <Table columns={feeColumns} dataSource={data.taxItems} rowKey="name"
            size="small" pagination={false} bordered style={{ maxWidth: 750 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}><b>税金合计</b></Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right"><b>{data.taxTotal.toFixed(2)}</b></Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </>
      )}
    </div>
  )
}
