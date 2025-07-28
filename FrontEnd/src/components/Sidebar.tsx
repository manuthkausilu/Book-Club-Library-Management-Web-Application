import React, { useState, type JSX } from "react"
import { MdDashboard, MdPeople, MdInventory, MdShoppingCart, MdWarning, MdMenu, MdClose } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"

interface SidebarItem {
  id: string
  label: string
  icon: JSX.Element
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("dashboard")
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const { role } = useAuth();

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId)
    setOpen(false) // close sidebar on mobile after navigation
    if (itemId === "dashboard") navigate(`/dashboard`)
    else if (itemId === "overdue") navigate(`/dashboard/overdue`)
    else navigate(`/dashboard/${itemId}`)
  }

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <MdDashboard className='w-5 h-5' />,
    },
    // Only show Users for admin
    ...(role === "admin"
      ? [{
          id: "users",
          label: "Users",
          icon: <MdPeople className='w-5 h-5' />,
        }]
      : []),
    {
      id: "readers",
      label: "Readers",
      icon: <MdPeople className='w-5 h-5' />,
    },
    {
      id: "books",
      label: "Books",
      icon: <MdInventory className='w-5 h-5' />,
    },
    {
      id: "lending",
      label: "Lending",
      icon: <MdShoppingCart className='w-5 h-5' />,
    },
    {
      id: "overdue",
      label: "Overdue",
      icon: <MdWarning className='w-5 h-5' />,
    },
  ]

  return (
    <>
      {/* Toggler button for mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
      >
        {open ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
      </button>
      {/* Sidebar */}
      <aside
        className={`
          bg-gray-900 text-white fixed sm:static top-0 left-0 h-full z-40
          w-64 min-h-screen p-4 transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
        `}
        style={{ maxWidth: "100vw" }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center py-4">Admin Panel</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
                    activeItem === item.id
                      ? "bg-indigo-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
