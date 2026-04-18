import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
    <div className="layout-customer">
      <nav> {/* Sidebar của bạn */} </nav>
      <main>
        <Outlet /> {/* BẮT BUỘC PHẢI CÓ DÒNG NÀY */}
      </main>
    </div>
  );
};
export default CustomerLayout;