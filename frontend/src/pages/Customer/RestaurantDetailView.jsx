import React from 'react';

// Định nghĩa styles trực tiếp để tránh lỗi "styles is not defined"
const inlineStyles = {
    tabContainer: { display: 'flex', borderBottom: '1px solid #323644', marginBottom: '20px' },
    tabItem: { padding: '10px 20px', cursor: 'pointer', color: '#94a3b8' },
    activeTab: { padding: '10px 20px', cursor: 'pointer', color: '#fff', borderBottom: '2px solid #2ecc71', fontWeight: 'bold' },
    reviewCard: { background: '#1e2129', padding: '15px', borderRadius: '12px', marginBottom: '10px' }
};

const RestaurantDetailView = ({ 
    currentView, filteredRestaurants, viewRestaurantMenu, selectedResInfo, 
    activeMenuTab, setActiveMenuTab, menuItems, restaurantReviews, fetchReviews, addToCart 
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
                            <div key={res.resId} className="restaurant-card" onClick={() => viewRestaurantMenu(res.resId)}>
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
                <button className="btn-back-link" onClick={() => window.location.reload()}>
                    <i className="fas fa-chevron-left"></i> Quay lại
                </button>
                <section className="res-hero-banner" style={{ backgroundImage: `url(http://localhost:8080/uploads/${selectedResInfo.resImage})` }}>
                    <div className="res-hero-content"><h1>{selectedResInfo.resName}</h1></div>
                </section>
                
                <div style={inlineStyles.tabContainer}>
                    <div 
                        style={activeMenuTab === 'items' ? inlineStyles.activeTab : inlineStyles.tabItem} 
                        onClick={() => setActiveMenuTab('items')}
                    >Thực đơn</div>
                    <div 
                        style={activeMenuTab === 'reviews' ? inlineStyles.activeTab : inlineStyles.tabItem} 
                        onClick={() => { setActiveMenuTab('reviews'); fetchReviews(selectedResInfo.resId); }}
                    >Đánh giá</div>
                </div>

                <section className="menu-section">
                    {activeMenuTab === 'items' ? (
                        <div className="menu-grid">
                            {menuItems.map(item => (
                                <div key={item.itemId} className="food-item-card">
                                    <div className="item-info">
                                        <h5>{item.itemName}</h5>
                                        <p>{item.price?.toLocaleString()}đ</p>
                                    </div>
                                    <button className="btn-add-cart" onClick={() => addToCart(item)}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="review-list">
                            {restaurantReviews.length > 0 ? restaurantReviews.map(r => (
                                <div key={r.reviewId} style={inlineStyles.reviewCard}>
                                    <div style={{color: '#f1c40f'}}>{"★".repeat(r.rating)}</div>
                                    <p style={{margin: '10px 0'}}>{r.comment}</p>
                                    <small style={{color: '#64748b'}}>Đã đặt: {r.itemNameList}</small>
                                </div>
                            )) : <p>Chưa có đánh giá nào cho quán này.</p>}
                        </div>
                    )}
                </section>
            </div>
        );
    }
    return null;
};

export default RestaurantDetailView;