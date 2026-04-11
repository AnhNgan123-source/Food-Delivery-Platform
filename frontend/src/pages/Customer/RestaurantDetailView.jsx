import React from 'react';
//import { styles } from './CustomerStyles';

const RestaurantDetailView = ({ 
    currentView, filteredRestaurants, viewRestaurantMenu, selectedResInfo, 
    activeMenuTab, setActiveMenuTab, menuItems, restaurantReviews, fetchReviews, addToCart, searchKeyword, handleSearch 
}) => {
    if (currentView === 'restaurants') {
        return (
            <>
                <section className="promo-banner">
                    <h1>Giảm ngay 50% cho đơn hàng đầu tiên!</h1>
                    <p>Đặt ngay những món ăn nóng hổi từ Yummy Hub</p>
                </section>
                <section className="food-section">
                    <h3 className="section-title">Nhà hàng dành cho bạn</h3>
                    <div className="grid-container">
                        {filteredRestaurants.map(res => (
                            <div key={res.res_id || res.resId} className="restaurant-card" onClick={() => viewRestaurantMenu(res.res_id || res.resId)}>
                                <img src={res.resImage ? `http://localhost:8080/uploads/${res.resImage}` : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'} alt={res.resName} />
                                <div className="card-body">
                                    <div className="res-name">{res.resName}</div>
                                    <p className="res-address">{res.resAddress}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </>
        );
    }

    if (currentView === 'menu' && selectedResInfo) {
        return (
            <div className="restaurant-detail-view">
                <button className="btn-back-link" onClick={() => setActiveMenuTab('items')}>
                    <i className="fas fa-chevron-left"></i> Quay lại
                </button>
                <section className="res-hero-banner" style={{ backgroundImage: `url(http://localhost:8080/uploads/${selectedResInfo.resImage})` }}>
                    <div className="res-hero-content"><h1>{selectedResInfo.resName}</h1></div>
                </section>
                
                <div style={styles.tabContainerStyle}>
                    <div style={activeMenuTab === 'items' ? styles.activeTabStyle : styles.tabItemStyle} onClick={() => setActiveMenuTab('items')}>Thực đơn</div>
                    <div style={activeMenuTab === 'reviews' ? styles.activeTabStyle : styles.tabItemStyle} onClick={() => { setActiveMenuTab('reviews'); fetchReviews(selectedResInfo.resId); }}>Đánh giá</div>
                </div>

                <section className="menu-section">
                    {activeMenuTab === 'items' ? (
                        <div className="menu-grid">
                            {menuItems.map(item => (
                                <div key={item.itemId} className="food-item-card">
                                    <h5>{item.itemName}</h5>
                                    <button onClick={() => addToCart(item)}>Thêm</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={styles.reviewListStyle}>
                            {restaurantReviews.map(r => (
                                <div key={r.reviewId} style={styles.reviewCardStyle}>
                                    <div style={{color: '#f1c40f'}}>{"★".repeat(r.rating)}</div>
                                    <p>{r.comment}</p>
                                    <small>Món đã đặt: {r.itemNameList}</small>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        );
    }
    return null;
};
export default RestaurantDetailView;