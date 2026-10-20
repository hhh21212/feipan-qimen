import { useState } from 'react'
import { BottomTabs, type TabKey } from './components/BottomTabs'
import { SettingsProvider } from './core/storage/settings'
import { PanPage } from './pages/PanPage'
import { RecordsPage } from './pages/RecordsPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  const [tab, setTab] = useState<TabKey>('pan')

  return (
    <SettingsProvider>
      <div className="min-h-full text-moon">
        {tab === 'pan' && <PanPage />}
        {tab === 'records' && <RecordsPage />}
        {tab === 'settings' && <SettingsPage />}
        <BottomTabs active={tab} onChange={setTab} />
      </div>
    </SettingsProvider>
  )
}
