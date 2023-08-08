import Sidebar from '../components/Sidebar'
import SidebarTitle from '../components/SidebarTitle'

export default function MainLayout({ children }: any) {
  return (
    <>
      <div className={'MainLayout'} data-testid="layout">
        <Sidebar title={<SidebarTitle />} data-testid="sidebar" />
        <main className={'Main'} data-testid="main">
          {children}
        </main>
      </div>
    </>
  )
}
