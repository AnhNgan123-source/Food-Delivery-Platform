import React from 'react';
import styles from './RestaurantInfoForm.module.css';

const RestaurantInfoForm = ({ 
    restaurant, isEditing, setIsEditing, loading, 
    formData, setFormData, onSave, onFileUpload 
}) => {
    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'><rect width='250' height='250' fill='%23f4f7fe'/></svg>";

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i key={i} className="fas fa-star" style={{ 
                color: i < Math.round(rating) ? '#FFB800' : '#E0E5F2', 
                fontSize: '14px', 
                marginRight: '4px' 
            }}></i>
        ));
    };

    if (loading) return <div className={styles.container}>Đang tải...</div>;
    if (!restaurant) return <div className={styles.container}>Dữ liệu không tồn tại.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.profileLayout}>
                {/* TRÁI: AVATAR */}
                <div className={styles.avatarSection}>
                    <div className={styles.imageWrapper}>
                        <img 
                            src={formData.resImage ? (formData.resImage.includes('http') ? formData.resImage : `http://localhost:8080/uploads/${formData.resImage}`) : noLogo} 
                            alt="Logo" className={styles.resImage}
                            onError={(e) => { e.target.src = noLogo; }}
                        />
                        <label className={styles.cameraBtn}>
                            <i className="fas fa-camera"></i>
                            <input type="file" hidden onChange={onFileUpload} />
                        </label>
                    </div>
                    <div className={styles.statusBadge} style={{ 
                        background: restaurant.isActive === 1 ? '#E2FBE7' : '#FFF5F5',
                        color: restaurant.isActive === 1 ? '#05CD99' : '#EE5D50'
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor' }}></div>
                        {restaurant.isActive === 1 ? 'Hoạt động' : 'Đang duyệt'}
                    </div>
                </div>

                {/* PHẢI: INFO */}
                <div className={styles.infoSection}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>{isEditing ? "Cập nhật hồ sơ" : "Thông tin nhà hàng"}</h2>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className={styles.actionBtn} title="Chỉnh sửa">
                                <i className="fi fi-rr-edit"></i> {/* Hoặc dùng <i className="fas fa-pen"></i> */}
                                <i className="fas fa-pen" style={{fontSize: '16px'}}></i>
                            </button>
                        ) : (
                            <div style={{ display: 'flex' }}>
                                <button onClick={() => setIsEditing(false)} className={styles.cancelBtn}>Hủy</button>
                                <button onClick={onSave} className={styles.saveBtn}>
                                    <i className="fas fa-check"></i> Lưu lại
                                </button>
                            </div>
                        )}
                    </div>

                    <div className={styles.ratingBox}>
                        <span className={styles.label}>Đánh giá từ khách hàng</span>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '5px' }}>
                            <span style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>{restaurant.ratingAvg?.toFixed(1) || "0.0"}</span>
                            <div style={{ marginBottom: '4px' }}>{renderStars(restaurant.ratingAvg || 0)}</div>
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <span className={styles.label}>Tên thương hiệu</span>
                        {isEditing ? (
                            <input 
                                className={styles.inputField} 
                                value={formData.resName} 
                                onChange={(e) => setFormData({...formData, resName: e.target.value})} 
                                placeholder="Nhập tên nhà hàng..."
                            />
                        ) : (
                            <div className={styles.displayRow}>
                                <span className={styles.valueText}>{restaurant.resName}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.fieldGroup}>
                        <span className={styles.label}>Địa chỉ trụ sở</span>
                        {isEditing ? (
                            <input 
                                className={styles.inputField} 
                                value={formData.resAddress} 
                                onChange={(e) => setFormData({...formData, resAddress: e.target.value})} 
                                placeholder="Nhập địa chỉ..."
                            />
                        ) : (
                            <div className={styles.displayRow}>
                                <span className={styles.valueText}>{restaurant.resAddress}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantInfoForm;