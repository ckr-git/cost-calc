import { useState } from 'react'
import { ConfigProvider, Tabs } from 'antd'
import {
  ProjectOutlined,
  DatabaseOutlined,
  ProfileOutlined,
  PercentageOutlined,
  DollarOutlined
} from '@ant-design/icons'
import zhCN from 'antd/locale/zh_CN'
import { ProjectManager } from './features/project/ProjectManager'
import { QuotaLibrary } from './features/library/QuotaLibrary'
import { BillCodeLibrary } from './features/library/BillCodeLibrary'
import { FeeRateLibrary } from './features/library/FeeRateLibrary'
import { UnitPriceManager } from './features/unitprice/UnitPriceManager'
import { PricingEditor } from './features/pricing/PricingEditor'

type View = 'project' | 'library' | 'pricing'

interface PricingTarget {
  engineeringId: number
  engineeringName: string
}

function App() {
  const [view, setView] = useState<View>('project')
  const [pricingTarget, setPricingTarget] = useState<PricingTarget | null>(null)

  const openPricing = (engineeringId: number, engineeringName: string) => {
    setPricingTarget({ engineeringId, engineeringName })
    setView('pricing')
  }

  const closePricing = () => {
    setPricingTarget(null)
    setView('project')
  }

  return (
    <ConfigProvider locale={zhCN} theme={{ token: { fontSize: 13, colorPrimary: '#2563eb' } }}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header view={view} onViewChange={(v) => { if (v !== 'pricing') setView(v) }} />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {view === 'project' && <ProjectManager onOpenEngineering={openPricing} />}
          {view === 'library' && <LibraryView />}
          {view === 'pricing' && pricingTarget && (
            <PricingEditor
              engineeringId={pricingTarget.engineeringId}
              engineeringName={pricingTarget.engineeringName}
              onBack={closePricing}
            />
          )}
        </div>
      </div>
    </ConfigProvider>
  )
}

function Header({ view, onViewChange }: { view: View; onViewChange: (v: View) => void }) {
  const navItem = (key: View, icon: React.ReactNode, label: string) => (
    <div
      onClick={() => onViewChange(key)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 20px',
        height: '100%',
        cursor: 'pointer',
        borderBottom: view === key ? '3px solid #fff' : '3px solid transparent',
        color: view === key ? '#fff' : 'rgba(255,255,255,0.7)',
        fontWeight: view === key ? 600 : 400,
        fontSize: 14,
        transition: 'all 0.2s'
      }}
    >
      {icon}{label}
    </div>
  )

  return (
    <div style={{
      height: 52,
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 32 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>智筑造价</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 3 }}>安徽2020</span>
      </div>
      <div style={{ display: 'flex', height: '100%' }}>
        {navItem('project', <ProjectOutlined />, '项目管理')}
        {navItem('library', <DatabaseOutlined />, '系统数据库')}
      </div>
    </div>
  )
}

function LibraryView() {
  return (
    <Tabs
      defaultActiveKey="quota"
      tabPosition="top"
      style={{ height: '100%', padding: '0 16px' }}
      items={[
        {
          key: 'quota',
          label: <span><DatabaseOutlined /> 定额库</span>,
          children: <div style={{ height: 'calc(100vh - 160px)' }}><QuotaLibrary /></div>
        },
        {
          key: 'bill',
          label: <span><ProfileOutlined /> 清单编码库</span>,
          children: <div style={{ height: 'calc(100vh - 160px)' }}><BillCodeLibrary /></div>
        },
        {
          key: 'fee',
          label: <span><PercentageOutlined /> 费率文件</span>,
          children: <div style={{ height: 'calc(100vh - 160px)' }}><FeeRateLibrary /></div>
        },
        {
          key: 'unitprice',
          label: <span><DollarOutlined /> 单价文件</span>,
          children: <div style={{ height: 'calc(100vh - 160px)' }}><UnitPriceManager /></div>
        }
      ]}
    />
  )
}

export default App
