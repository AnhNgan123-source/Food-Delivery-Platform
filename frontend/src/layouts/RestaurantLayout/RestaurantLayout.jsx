import { Outlet } from 'react-router-dom';

const RestaurantLayout = () => {
  return (
    <div className="layout-restaurant">
      <nav> {/* Sidebar của bạn */} </nav>
      <main>
        <Outlet /> {/* BẮT BUỘC PHẢI CÓ DÒNG NÀY */}
      </main>
    </div>
  );
};
export default RestaurantLayout;