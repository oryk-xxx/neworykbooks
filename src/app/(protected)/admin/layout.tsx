export default function AdminLayout(props: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Painel Admin</h1>
        <nav className="flex gap-3 text-xs">
          <a href="/admin/books" className="text-accent">
            Livros
          </a>
          <a href="/admin/users" className="text-accent">
            Usuários
          </a>
          <a href="/admin/logs" className="text-accent">
            Logs
          </a>
        </nav>
      </div>
      {props.children}
    </div>
  );
}

