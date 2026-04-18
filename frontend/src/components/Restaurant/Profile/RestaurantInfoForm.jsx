import React, { useState, useEffect } from 'react';

const RestaurantInfoForm = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({ resName: '', resAddress: '', resImage: '' });

    const token = localStorage.getItem('token');
    const ownerId = localStorage.getItem('userId') || localStorage.getItem('id'); 

    // Ảnh SVG dự phòng cực nhẹ, không cần internet
    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'><rect width='250' height='250' fill='%23eeeeee'/><text x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23aaaaaa' text-anchor='middle' dy='.3em'>No Image</text></svg>";

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
                    resImage: data.resImage // Giữ lại tên ảnh cũ từ DB
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
                // ✅ Cập nhật formData với tên file mới từ server
                setFormData(prev => ({ ...prev, resImage: imageUrl }));
                alert("Tải ảnh lên thành công!");
            } else {
                alert("Lỗi khi upload ảnh");
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
                body: JSON.stringify(formData) // Gửi toàn bộ formData, bao gồm cả resImage (dù cũ hay mới)
            });
            if (response.ok) {
                setIsEditing(false);
                fetchRestaurantData();
                alert("Cập nhật thông tin thành công!");
            }
        } catch (error) {
            alert("Lỗi khi lưu dữ liệu");
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className="fas fa-star" style={{ color: i <= rating ? '#ffc107' : '#e4e5e9', marginRight: '2px' }}></i>
            );
        }
        return stars;
    };

    if (loading) return <div style={{padding: '20px'}}> đang tải dữ liệu nhà hàng...</div>;
    if (!restaurant) return <div style={{padding: '20px', color: 'red'}}>Không tìm thấy dữ liệu nhà hàng cho ID: {ownerId}</div>;

    return (
        <div className="res-info-container" style={{ padding: '30px', width: 'auto', maxWidth: '100%', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', margin: '10px' }}>
            <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start' }}>
                
                <div style={{ textAlign: 'center', minWidth: '250px' }}>
                    <div className="res-image-wrapper" style={{ position: 'relative' }}>
                        {/* ✅ SỬA LOGIC: Kiểm tra ảnh và thêm Timestamp để tránh cache trình duyệt */}
                        <img 
                            src={formData.resImage ? (formData.resImage.includes('http') ? formData.resImage : `http://localhost:8080/uploads/${formData.resImage}?t=${Date.now()}`) : noLogo} 
                            alt="logo" 
                            style={{ width: '250px', height: '250px', borderRadius: '15px', objectFit: 'cover', border: '1px solid #eee' }} 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = noLogo;
                            }}
                        />
                        
                        {!isEditing && (
                            <div onClick={() => setIsEditing(true)} style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                <i className="fas fa-camera" style={{ color: '#007bff' }}></i>
                            </div>
                        )}

                        {isEditing && (
                             <div style={{marginTop: '15px'}}>
                                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Chọn ảnh từ máy tính:</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleFileUpload}
                                />
                             </div>
                        )}
                    </div>

                    <div style={{ marginTop: '20px', padding: '12px', borderRadius: '10px', background: restaurant.isActive === 1 ? '#e8f5e9' : '#fff3e0' }}>
                        {restaurant.isActive === 1 ? (
                            <span style={{ color: '#2e7d32', fontWeight: 'bold' }}><i className="fas fa-check-circle"></i> Đang hoạt động</span>
                        ) : (
                            <span style={{ color: '#ef6c00', fontWeight: 'bold' }}><i className="fas fa-clock"></i> Chưa được duyệt</span>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2 style={{ margin: 0, color: '#333', fontSize: '24px' }}>{isEditing ? "Chỉnh sửa hồ sơ" : "Thông tin quán"}</h2>
                        {isEditing && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 25px', borderRadius: '8px' }}>Lưu thay đổi</button>
                                <button onClick={() => setIsEditing(false)} className="btn-logout" style={{ padding: '8px 25px', borderRadius: '8px', background: '#f0f0f0', color: '#333' }}>Hủy</button>
                            </div>
                        )}
                    </div>

                    <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '30px' }} />

                    <div style={{ marginBottom: '30px' }}>
                        <p style={{ color: '#888', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Đánh giá trung bình</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ fontSize: '22px' }}>
                                {renderStars(Math.round(restaurant.ratingAvg || 0))}
                            </div>
                            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
                                {restaurant.ratingAvg > 0 ? restaurant.ratingAvg.toFixed(1) : "0.0"}
                            </span>
                            {restaurant.ratingAvg === 0 && <span style={{ color: '#aaa', fontStyle: 'italic', fontSize: '15px' }}>(Chưa có đánh giá từ khách hàng)</span>}
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <p style={{ color: '#888', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tên nhà hàng</p>
                        {isEditing ? (
                            <input className="form-control" style={{ fontSize: '16px', padding: '12px' }} value={formData.resName} onChange={(e) => setFormData({...formData, resName: e.target.value})} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f1f1', paddingBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <i className="fas fa-store" style={{ color: '#28a745', fontSize: '20px' }}></i>
                                    <strong style={{ fontSize: '20px', color: '#222' }}>{restaurant.resName}</strong>
                                </div>
                                <i className="fas fa-pencil-alt" style={{ color: '#007bff', cursor: 'pointer', opacity: '0.6' }} onClick={() => setIsEditing(true)}></i>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <p style={{ color: '#888', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Địa chỉ liên hệ</p>
                        {isEditing ? (
                            <input className="form-control" style={{ fontSize: '16px', padding: '12px' }} value={formData.resAddress} onChange={(e) => setFormData({...formData, resAddress: e.target.value})} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f1f1', paddingBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <i className="fas fa-map-marker-alt" style={{ color: '#dc3545', fontSize: '20px' }}></i>
                                    <span style={{ color: '#444', fontSize: '16px', lineHeight: '1.6' }}>{restaurant.resAddress}</span>
                                </div>
                                <i className="fas fa-pencil-alt" style={{ color: '#007bff', cursor: 'pointer', opacity: '0.6' }} onClick={() => setIsEditing(true)}></i>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';

const RestaurantInfoForm = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({ resName: '', resAddress: '', resImage: '' });

    const token = localStorage.getItem('token');
    const ownerId = localStorage.getItem('userId') || localStorage.getItem('id'); 

    // Ảnh SVG dự phòng cực nhẹ, không cần internet
    const noLogo = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='250' viewBox='0 0 250 250'><rect width='250' height='250' fill='%23eeeeee'/><text x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23aaaaaa' text-anchor='middle' dy='.3em'>No Image</text></svg>";

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
                    resImage: data.resImage // Giữ lại tên ảnh cũ từ DB
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
                // ✅ Cập nhật formData với tên file mới từ server
                setFormData(prev => ({ ...prev, resImage: imageUrl }));
                alert("Tải ảnh lên thành công!");
            } else {
                alert("Lỗi khi upload ảnh");
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
                body: JSON.stringify(formData) // Gửi toàn bộ formData, bao gồm cả resImage (dù cũ hay mới)
            });
            if (response.ok) {
                setIsEditing(false);
                fetchRestaurantData();
                alert("Cập nhật thông tin thành công!");
            }
        } catch (error) {
            alert("Lỗi khi lưu dữ liệu");
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i key={i} className="fas fa-star" style={{ color: i <= rating ? '#ffc107' : '#e4e5e9', marginRight: '2px' }}></i>
            );
        }
        return stars;
    };

    if (loading) return <div style={{padding: '20px'}}> đang tải dữ liệu nhà hàng...</div>;
    if (!restaurant) return <div style={{padding: '20px', color: 'red'}}>Không tìm thấy dữ liệu nhà hàng cho ID: {ownerId}</div>;

    return (
        <div className="res-info-container" style={{ padding: '30px', width: 'auto', maxWidth: '100%', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', margin: '10px' }}>
            <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start' }}>
                
                <div style={{ textAlign: 'center', minWidth: '250px' }}>
                    <div className="res-image-wrapper" style={{ position: 'relative' }}>
                        {/* ✅ SỬA LOGIC: Kiểm tra ảnh và thêm Timestamp để tránh cache trình duyệt */}
                        <img 
                            src={formData.resImage ? (formData.resImage.includes('http') ? formData.resImage : `http://localhost:8080/uploads/${formData.resImage}?t=${Date.now()}`) : noLogo} 
                            alt="logo" 
                            style={{ width: '250px', height: '250px', borderRadius: '15px', objectFit: 'cover', border: '1px solid #eee' }} 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = noLogo;
                            }}
                        />
                        
                        {!isEditing && (
                            <div onClick={() => setIsEditing(true)} style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#fff', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                                <i className="fas fa-camera" style={{ color: '#007bff' }}></i>
                            </div>
                        )}

                        {isEditing && (
                             <div style={{marginTop: '15px'}}>
                                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Chọn ảnh từ máy tính:</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleFileUpload}
                                />
                             </div>
                        )}
                    </div>

                    <div style={{ marginTop: '20px', padding: '12px', borderRadius: '10px', background: restaurant.isActive === 1 ? '#e8f5e9' : '#fff3e0' }}>
                        {restaurant.isActive === 1 ? (
                            <span style={{ color: '#2e7d32', fontWeight: 'bold' }}><i className="fas fa-check-circle"></i> Đang hoạt động</span>
                        ) : (
                            <span style={{ color: '#ef6c00', fontWeight: 'bold' }}><i className="fas fa-clock"></i> Chưa được duyệt</span>
                        )}
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h2 style={{ margin: 0, color: '#333', fontSize: '24px' }}>{isEditing ? "Chỉnh sửa hồ sơ" : "Thông tin quán"}</h2>
                        {isEditing && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 25px', borderRadius: '8px' }}>Lưu thay đổi</button>
                                <button onClick={() => setIsEditing(false)} className="btn-logout" style={{ padding: '8px 25px', borderRadius: '8px', background: '#f0f0f0', color: '#333' }}>Hủy</button>
                            </div>
                        )}
                    </div>

                    <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '30px' }} />

                    <div style={{ marginBottom: '30px' }}>
                        <p style={{ color: '#888', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Đánh giá trung bình</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ fontSize: '22px' }}>
                                {renderStars(Math.round(restaurant.ratingAvg || 0))}
                            </div>
                            <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
                                {restaurant.ratingAvg > 0 ? restaurant.ratingAvg.toFixed(1) : "0.0"}
                            </span>
                            {restaurant.ratingAvg === 0 && <span style={{ color: '#aaa', fontStyle: 'italic', fontSize: '15px' }}>(Chưa có đánh giá từ khách hàng)</span>}
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <p style={{ color: '#888', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Tên nhà hàng</p>
                        {isEditing ? (
                            <input className="form-control" style={{ fontSize: '16px', padding: '12px' }} value={formData.resName} onChange={(e) => setFormData({...formData, resName: e.target.value})} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f1f1', paddingBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <i className="fas fa-store" style={{ color: '#28a745', fontSize: '20px' }}></i>
                                    <strong style={{ fontSize: '20px', color: '#222' }}>{restaurant.resName}</strong>
                                </div>
                                <i className="fas fa-pencil-alt" style={{ color: '#007bff', cursor: 'pointer', opacity: '0.6' }} onClick={() => setIsEditing(true)}></i>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <p style={{ color: '#888', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Địa chỉ liên hệ</p>
                        {isEditing ? (
                            <input className="form-control" style={{ fontSize: '16px', padding: '12px' }} value={formData.resAddress} onChange={(e) => setFormData({...formData, resAddress: e.target.value})} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f1f1', paddingBottom: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <i className="fas fa-map-marker-alt" style={{ color: '#dc3545', fontSize: '20px' }}></i>
                                    <span style={{ color: '#444', fontSize: '16px', lineHeight: '1.6' }}>{restaurant.resAddress}</span>
                                </div>
                                <i className="fas fa-pencil-alt" style={{ color: '#007bff', cursor: 'pointer', opacity: '0.6' }} onClick={() => setIsEditing(true)}></i>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantInfoForm;