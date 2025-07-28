import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../context/useAuth"

const Layout = () => {
  const { isAuthenticating } = useAuth()

  if(isAuthenticating) return <div>Loading...</div>

  return (
    <div className='min-h-screen flex flex-col'>
      <div className='fixed top-0 left-0 right-0 z-50'>
        <Navbar />
      </div>
      <main className='pt-16 flex-1 w-full px-2 sm:px-4 md:px-6 lg:px-8'>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
