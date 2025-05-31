import { useDispatch } from "react-redux";
import { MessageCircle, Contact, BellPlus, LogOut } from "lucide-react";

import { logoutUser } from "@/store/slices/loginSlices";

const SidebarIcon = ({ icon, active, onClick }) => (
  <div className={`w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer ${active ? 'bg-gray-200' : ''}`} onClick={onClick}>
    {icon}
  </div>
);

function Sidebar(props) {
  const { activeTab, setActiveTab } = props || {};
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="w-16 bg-white h-screen border-r flex flex-col items-center py-4">
      <div className="mb-8">
        <div className="w-8 h-8 text-white flex items-center justify-center font-bold">
          <img src='/images/logo2.png' alt='logo' />
        </div>
      </div>
      <SidebarIcon icon={<MessageCircle />} active={(activeTab === 1)} onClick={() => setActiveTab(1)} />
      <SidebarIcon icon={<Contact />} active={(activeTab === 2)} onClick={() => setActiveTab(2)} />
      <SidebarIcon icon={<BellPlus />} active={(activeTab === 3)} onClick={() => setActiveTab(3)} />
      <SidebarIcon icon={<LogOut />} onClick={handleLogout} />
    </div>
  );
}

export default Sidebar;