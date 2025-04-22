// app/admin/layout.tsx
import { ReactNode } from "react";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[280px_1fr] grid-rows-[60px_1fr] min-h-screen bg-gray-100">
      <aside className="row-span-2 fixed h-screen w-[280px] bg-white border-r border-gray-200 z-50">
        <Sidebar />
      </aside>
      <header className="col-start-2 fixed w-[calc(100%-280px)] right-0 z-40 h-[60px] border-b border-gray-200 bg-white px-4 flex items-center justify-between">
        <Header />
      </header>
      <main className="col-start-2 mt-[60px] p-6">{children}</main>
    </div>
  );
}
