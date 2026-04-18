import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="layout-admin">
      <nav> {/* Sidebar của bạn */} </nav>
      <main>
        <Outlet /> {/* BẮT BUỘC PHẢI CÓ DÒNG NÀY */}
      </main>
    </div>
  );
};
export default AdminLayout; 