import React, { useState, useEffect } from 'react';

const Profile = () => {
    // === STATE QUẢN LÝ DỮ LIỆU NGƯỜI DÙNG ===
    const [user, setUser] = useState({
        username: '...',
        full_name: 'Đang tải...',
        email: '...',
        phone: '...',
        role: 'ROLE'
    });

    // === STATE QUẢN LÝ CHẾ ĐỘ CHỈNH SỬA ===
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        full_name: '',
        email: '',
        phone: ''
    });

    const token = localStorage.getItem('token');

    // === 1. LOAD DỮ LIỆU LẦN ĐẦU ===
    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/profile', {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data);
                // Đồng bộ dữ liệu vào form sửa luôn
                setEditData({
                    full_name: data.full_name || '',
                    email: data.email || '',
                    phone: data.phone || ''
                });
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        }
    };

    // === 2. XỬ LÝ BẬT/TẮT CHẾ ĐỘ SỬA ===
    const toggleEdit = () => {
        if (!isEditing) {
            // Khi bắt đầu sửa, copy lại dữ liệu từ user hiện tại vào form
            setEditData({
                full_name: user.full_name,
                email: user.email,
                phone: user.phone || ''
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    // === 3. LƯU DỮ LIỆU XUỐNG BACKEND ===
    const saveProfile = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/user/profile/update', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editData)
            });

            if (response.ok) {
                alert("Cập nhật thành công Ngân ơi! 🎉");
                // Cập nhật lại state hiển thị chính
                setUser({
                    ...user,
                    ...editData
                });
                setIsEditing(false); // Thoát chế độ sửa
            } else {
                alert("Có lỗi xảy ra khi lưu!");
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
        }
    };

    return (
        <div className="profile-card">
            {/* HEADER */}
            <div className="profile-header">
                <div className="avatar-wrapper">
                    <div className="avatar-circle" id="user-avatar">
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="status-indicator"></div>
                </div>
                <h2 className="main-name">{user.full_name}</h2>
                <span className="role-badge">{user.role}</span>
            </div>

            <hr className="divider" />

            {/* BODY */}
            <div className="profile-body">
                {/* Dòng Username (Không cho sửa) */}
                <div className="info-row">
                    <div className="info-icon"><i className="fas fa-user-circle"></i></div>
                    <div className="info-content">
                        <label>Tên đăng nhập: </label>
                        <span className="info-data">{user.username}</span>
                    </div>
                </div>

                {/* Dòng Họ và tên */}
                <div className="info-row">
                    <div className="info-icon"><i className="fas fa-id-card"></i></div>
                    <div className="info-content">
                        <label>Họ và tên</label>
                        {!isEditing ? (
                            <span className="info-data">{user.full_name}</span>
                        ) : (
                            <input 
                                type="text" 
                                name="full_name"
                                className="edit-input" 
                                value={editData.full_name}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                </div>

                {/* Dòng Email */}
                <div className="info-row">
                    <div className="info-icon"><i className="fas fa-envelope"></i></div>
                    <div className="info-content">
                        <label>Email</label>
                        {!isEditing ? (
                            <span className="info-data">{user.email}</span>
                        ) : (
                            <input 
                                type="email" 
                                name="email"
                                className="edit-input" 
                                value={editData.email}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                </div>

                {/* Dòng Số điện thoại */}
                <div className="info-row">
                    <div className="info-icon"><i className="fas fa-phone-alt"></i></div>
                    <div className="info-content">
                        <label>Số điện thoại</label>
                        {!isEditing ? (
                            <span className="info-data">{user.phone || 'Chưa cập nhật'}</span>
                        ) : (
                            <input 
                                type="text" 
                                name="phone"
                                className="edit-input" 
                                value={editData.phone}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="profile-actions">
                {!isEditing ? (
                    <button className="btn-edit" onClick={toggleEdit}>
                        <i className="fas fa-edit"></i> Chỉnh sửa thông tin
                    </button>
                ) : (
                    <div className="edit-mode-buttons">
                        <button className="btn-save" onClick={saveProfile}>
                            <i className="fas fa-check"></i> Lưu thay đổi
                        </button>
                        <button className="btn-cancel" onClick={toggleEdit}>
                            <i className="fas fa-times"></i> Hủy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;