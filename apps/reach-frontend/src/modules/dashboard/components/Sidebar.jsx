import React from 'react';

const SidebarIcon = ({ icon, active }) => (
  <div className={`w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer ${active ? 'bg-gray-200' : ''}`}>
    {icon}
  </div>
);

function Sidebar() {
  return (
    <div className="w-16 bg-white h-screen border-r flex flex-col items-center py-4">
      <div className="mb-8">
        <div className="w-8 h-8 text-white flex items-center justify-center font-bold">
          <img src='/images/logo2.png' alt='logo' />
        </div>
      </div>
      <SidebarIcon icon="🏠" />
      <SidebarIcon icon="🗂️" />
      <SidebarIcon icon="🕒" />
      <SidebarIcon icon="💬" active={true} />
      <SidebarIcon icon="👤" />
    </div>
  );
}

export default Sidebar;