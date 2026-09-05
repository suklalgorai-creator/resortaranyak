export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50"><div className="flex"><aside className="w-64 bg-white border-r min-h-screen p-4"><h2 className="text-xl font-bold text-green-700 mb-6">Admin Panel</h2><p className="text-sm text-gray-500">Sidebar coming in Phase 7</p></aside><main className="flex-1 p-8">{children}</main></div></div>;
}
