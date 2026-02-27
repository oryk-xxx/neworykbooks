import React from "react";
import Link from "next/link";

export default function AdminLayout(props: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-medium tracking-oryk-wide text-white uppercase">
            Control Panel
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-accent shadow-[0_0_8px_rgba(43,255,136,0.5)]" />
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em]">
              Sessão de Administração ØRYK
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-8">
          {[
            { label: "Obras", href: "/admin/books" },
            { label: "Audiência", href: "/admin/users" },
            { label: "Registros", href: "/admin/logs" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[10px] uppercase tracking-[0.3em] text-text-meta hover:text-accent transition-colors duration-300 relative group"
            >
              {item.label}
              <span className="absolute -bottom-8 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </Link>
          ))}
        </nav>
      </header>

      <main className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {props.children}
      </main>
    </div>
  );
}

