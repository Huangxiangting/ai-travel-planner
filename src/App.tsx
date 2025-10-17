import { Link, Outlet, useLocation } from 'react-router-dom'

export default function App() {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="font-semibold">AI Travel Planner</div>
          <nav className="flex items-center gap-3 text-sm">
            <Link className={pathname==='/' ? 'font-semibold' : ''} to="/">规划</Link>
            <Link className={pathname.startsWith('/expenses') ? 'font-semibold' : ''} to="/expenses">费用</Link>
            <Link className={pathname.startsWith('/settings') ? 'font-semibold' : ''} to="/settings">设置</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
