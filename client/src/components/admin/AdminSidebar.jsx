import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import { assets } from '../../assets/assets'



const AdminSidebar = () => {
  const user = {
    firstName: 'Century',
    lastName: 'Admin',
    imgUrl: assets.profile,
  }

  const adminNavlinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
    
    { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
    { name: 'List Bookings', path: '/admin/list-booking', icon: ListCollapseIcon },
  ]

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm">
      <img className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto" src={user.imgUrl} alt="profile" />
      <p className="mt-2 text-base max-md:hidden">
        {user.firstName} {user.lastName}
      </p>

      <div className="w-full">
        {adminNavlinks.map((item, index) => (
         <NavLink key={index} to={item.path} end>
  {({ isActive }) => {
    const Icon = item.icon;
    return (
      <div
        className={`relative flex items-center max-md:justify-center gap-2 w-full py-2.5 md:pl-10 first:mt-6 ${
          isActive ? "text-white bg-gray-800" : "text-gray-400 hover:text-white hover:bg-gray-700/30"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="max-md:hidden">{item.name}</span>
        <span
          className={`w-1.5 h-10 rounded-1 right-0 absolute ${
            isActive ? "bg-primary" : ""
          }`}
        />
      </div>
    );
  }}
</NavLink>

        ))}
      </div>
    </div>
  )
}

export default AdminSidebar
