import React, { useState, useEffect } from 'react';

const RestaurantInfoForm = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ resName: '', resAddress: '', resImage: '' });

    const token = localStorage.getItem('token');
    const ownerId = localStorage.getItem('userId') || localStorage.getItem('id'); 

    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'><rect width='250' height='250' fill='%232d313d'/><text x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23888888' text-anchor='middle' dy='.3em'>No Image</text></svg>";

    useEffect(() => {
        fetchRestaurantData();
    }, []);

    const fetchRestaurantData = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/restaurant/owner/${ownerId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRestaurant(data);
                setFormData({ 
                    resName: data.resName, 
                    resAddress: data.resAddress, 
                    resImage: data.resImage 
                });
            }
        } catch (error) {
            console.error("Lỗi fetch:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await fetch(`http://localhost:8080/api/v1/restaurant/upload`, {
                method: 'POST',
                headers: { "Authorization": `Bearer ${token}` },
                body: uploadData
            });

            if (response.ok) {
                const imageUrl = await response.text(); 
                setFormData(prev => ({ ...prev, resImage: imageUrl }));
                alert("Đã cập nhật ảnh mới! Nhấn 'Lưu' để hoàn tất nhé Ngân.");
            }
        } catch (error) {
            console.error("Error upload:", error);
        }
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/restaurant/${restaurant.resId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsEditing(false);
                fetchRestaurantData();
                alert("Đã lưu thông tin mới thành công! ✨");
            }
        } catch (error) {
            alert("Lỗi khi lưu dữ liệu");
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className="fas fa-star" style={{ color: i <= rating ? '#2ecc71' : '#3d4251', marginRight: '4px', fontSize: '18px' }}></i>
            );
        }
        return stars;
    };

    if (loading) return <div style={{padding: '30px', color: '#fff'}}>Đang tải dữ liệu quán...</div>;

    return (
        <div className="res-info-card" style={styles.card}>
            <div style={styles.flexLayout}>
                
                {/* CỘT TRÁI: ẢNH & TRẠNG THÁI */}
                <div style={styles.leftColumn}>
                    <div style={styles.imageContainer}>
                        <img 
                            src={formData.resImage ? (formData.resImage.includes('http') ? formData.resImage : `http://localhost:8080/uploads/${formData.resImage}?t=${Date.now()}`) : noLogo} 
                            alt="logo" 
                            style={styles.logoImg} 
                            onError={(e) => { e.target.src = noLogo; }}
                        />
                        
                        {!isEditing && (
                            <div onClick={() => setIsEditing(true)} style={styles.cameraBtn}>
                                <i className="fas fa-camera"></i>
                            </div>
                        )}

                        {isEditing && (
                             <div style={styles.uploadBox}>
                                <label style={styles.uploadLabel}>Thay đổi ảnh đại diện:</label>
                                <input type="file" accept="image/*" onChange={handleFileUpload} style={styles.fileInput} />
                             </div>
                        )}
                    </div>

                    <div style={{
                        ...styles.statusBadge,
                        backgroundColor: restaurant.isActive === 1 ? 'rgba(46, 204, 113, 0.1)' : 'rgba(230, 126, 34, 0.1)',
                        border: `1px solid ${restaurant.isActive === 1 ? 'rgba(46, 204, 113, 0.3)' : 'rgba(230, 126, 34, 0.3)'}`
                    }}>
                        <i className={`fas ${restaurant.isActive === 1 ? 'fa-check-circle' : 'fa-clock'}`} 
                           style={{ color: restaurant.isActive === 1 ? '#2ecc71' : '#e67e22', marginRight: '8px' }}></i>
                        <span style={{ color: restaurant.isActive === 1 ? '#2ecc71' : '#e67e22', fontWeight: 'bold' }}>
                            {restaurant.isActive === 1 ? 'ĐANG HOẠT ĐỘNG' : 'CHỜ DUYỆT'}
                        </span>
                    </div>
                </div>

                {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
                <div style={styles.rightColumn}>
                    <div style={styles.headerRow}>
                        <h2 style={styles.title}>{isEditing ? "Chỉnh sửa hồ sơ" : "Thông tin quán"}</h2>
                        {isEditing && (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleSave} style={styles.saveBtn}>Lưu</button>
                                <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Hủy</button>
                            </div>
                        )}
                    </div>

                    <div style={styles.ratingSection}>
                        <p style={styles.fieldLabel}>Đánh giá từ khách hàng</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div>{renderStars(Math.round(restaurant.ratingAvg || 0))}</div>
                            <span style={styles.ratingNumber}>
                                {restaurant.ratingAvg > 0 ? restaurant.ratingAvg.toFixed(1) : "0.0"}
                            </span>
                        </div>
                    </div>

                    {/* TÊN NHÀ HÀNG */}
                    <div style={styles.infoField}>
                        <p style={styles.fieldLabel}>Tên nhà hàng</p>
                        {isEditing ? (
                            <input style={styles.input} value={formData.resName} onChange={(e) => setFormData({...formData, resName: e.target.value})} />
                        ) : (
                            <div style={styles.displayRow}>
                                <div style={styles.iconValue}>
                                    <i className="fas fa-store" style={{ color: '#2ecc71' }}></i>
                                    <span style={styles.valueText}>{restaurant.resName}</span>
                                </div>
                                <i className="fas fa-edit" style={styles.editIcon} onClick={() => setIsEditing(true)}></i>
                            </div>
                        )}
                    </div>

                    {/* ĐỊA CHỈ */}
                    <div style={styles.infoField}>
                        <p style={styles.fieldLabel}>Địa chỉ liên hệ</p>
                        {isEditing ? (
                            <input style={styles.input} value={formData.resAddress} onChange={(e) => setFormData({...formData, resAddress: e.target.value})} />
                        ) : (
                            <div style={styles.displayRow}>
                                <div style={styles.iconValue}>
                                    <i className="fas fa-map-marker-alt" style={{ color: '#e74c3c' }}></i>
                                    <span style={styles.valueText}>{restaurant.resAddress}</span>
                                </div>
                                <i className="fas fa-edit" style={styles.editIcon} onClick={() => setIsEditing(true)}></i>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: '#1c1e26',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        border: '1px solid #2d313d',
        margin: '20px'
    },
    flexLayout: { display: 'flex', gap: '50px', alignItems: 'flex-start' },
    leftColumn: { textAlign: 'center', minWidth: '250px' },
    imageContainer: { position: 'relative', marginBottom: '25px' },
    logoImg: { width: '250px', height: '250px', borderRadius: '20px', objectFit: 'cover', border: '2px solid #2d313d' },
    cameraBtn: {
        position: 'absolute', bottom: '15px', right: '15px', backgroundColor: '#0056b3',
        width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
    },
    uploadBox: { marginTop: '15px', textAlign: 'left' },
    uploadLabel: { fontSize: '12px', color: '#888', marginBottom: '8px', display: 'block' },
    fileInput: { backgroundColor: '#2d313d', color: '#fff', padding: '8px', borderRadius: '8px', width: '100%', border: 'none' },
    statusBadge: { padding: '12px', borderRadius: '12px', textAlign: 'center', fontSize: '13px' },
    rightColumn: { flex: 1 },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #2d313d', paddingBottom: '15px' },
    title: { color: '#fff', fontSize: '26px', margin: 0 },
    saveBtn: { backgroundColor: '#0056b3', color: '#fff', padding: '10px 25px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
    cancelBtn: { backgroundColor: 'transparent', color: '#888', padding: '10px 25px', borderRadius: '10px', border: '1px solid #3d4251', cursor: 'pointer' },
    ratingSection: { marginBottom: '35px' },
    fieldLabel: { color: '#5c6273', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
    ratingNumber: { fontSize: '32px', fontWeight: 'bold', color: '#fff' },
    infoField: { marginBottom: '30px' },
    input: { width: '100%', backgroundColor: '#2d313d', border: '1px solid #3d4251', borderRadius: '12px', padding: '15px', color: '#fff', fontSize: '16px' },
    displayRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    iconValue: { display: 'flex', alignItems: 'center', gap: '15px' },
    valueText: { color: '#fff', fontSize: '18px', fontWeight: '500' },
    editIcon: { color: '#0056b3', cursor: 'pointer', opacity: '0.6', fontSize: '14px' }
};

export default RestaurantInfoForm;