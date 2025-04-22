// app/admin/components/Header.tsx
import {  MdAccountCircle } from "react-icons/md";
import { MdNotifications } from "react-icons/md";


export default function Header() {
  return (
    <>
      <input
        type="search"
        placeholder="Pesquisar..."
        className="px-4 py-2 rounded-md border border-gray-300 w-72 text-sm"
      />
      <div className="flex items-center gap-4">
        <div className="relative">
          <MdNotifications className="text-2xl text-gray-700" />
          <span className="absolute -top-1 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5">
            3
          </span>
        </div>
        <div className="w-10 h-10 rounded-full bg-marieth flex items-center justify-center text-white">
          <MdAccountCircle className="text-xl" />
        </div>
        <strong className="text-sm text-gray-700">Admin</strong>
      </div>
    </>
  );
}
