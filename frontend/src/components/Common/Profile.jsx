import React, { useState, useEffect } from 'react';
// Import styles từ file Admin.module.css để dùng chung theme
import styles from '../../components/Common/Profile.module.css'; 

const Profile = () => {
    const [user, setUser] = useState({
        userName: '...',
        fullName: 'Đang tải...',
        email: '...',
        phone: '...',
        role: 'ROLE'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    const token = localStorage.getItem('token');

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
                setEditData({
                    fullName: data.fullName || '',
                    email: data.email || '',
                    phone: data.phone || ''
                });
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        }
    };

    const toggleEdit = () => {
        if (!isEditing) {
            setEditData({
                fullName: user.fullName,
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
                alert("Cập nhật thành công!!!");
                setUser({ ...user, ...editData });
                setIsEditing(false);
            } else {
                alert("Có lỗi xảy ra khi lưu!");
            }
        } catch (err) {
            console.error("Lỗi kết nối:", err);
        }
    };

    return (
        /* Sử dụng styles['tên-class'] vì tên class có dấu gạch ngang */
        <div className={styles['profile-card']}>
            <div className={styles['profile-header']}>
                <div className={styles['avatar-wrapper']}>
                    <div className={styles['avatar-circle']}>
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className={styles['status-indicator']}></div>
                </div>
                <h2 className={styles['main-name']}>{user.fullName}</h2>
                <span className={styles['role-badge']}>{user.role}</span>
            </div>

            <hr className={styles.divider} />

            <div className={styles['profile-body']}>
                <div className={styles['info-row']}>
                    <div className={styles['info-icon']}><i className="fas fa-user-circle"></i></div>
                    <div className={styles['info-content']}>
                        <label>Tên đăng nhập: </label>
                        <span className={styles['info-data']}>{user.userName}</span>
                    </div>
                </div>

                <div className={styles['info-row']}>
                    <div className={styles['info-icon']}><i className="fas fa-id-card"></i></div>
                    <div className={styles['info-content']}>
                        <label>Họ và tên</label>
                        {!isEditing ? (
                            <span className={styles['info-data']}>{user.fullName}</span>
                        ) : (
                            <input 
                                type="text" 
                                name="fullName"
                                className={styles['edit-input']} 
                                value={editData.fullName}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                </div>

                <div className={styles['info-row']}>
                    <div className={styles['info-icon']}><i className="fas fa-envelope"></i></div>
                    <div className={styles['info-content']}>
                        <label>Email</label>
                        {!isEditing ? (
                            <span className={styles['info-data']}>{user.email}</span>
                        ) : (
                            <input 
                                type="email" 
                                name="email"
                                className={styles['edit-input']} 
                                value={editData.email}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                </div>

                <div className={styles['info-row']}>
                    <div className={styles['info-icon']}><i className="fas fa-phone-alt"></i></div>
                    <div className={styles['info-content']}>
                        <label>Số điện thoại</label>
                        {!isEditing ? (
                            <span className={styles['info-data']}>{user.phone || 'Chưa cập nhật'}</span>
                        ) : (
                            <input 
                                type="text" 
                                name="phone"
                                className={styles['edit-input']} 
                                value={editData.phone}
                                onChange={handleInputChange}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className={styles['profile-actions']}>
                {!isEditing ? (
                    <button className={styles['btn-edit']} onClick={toggleEdit}>
                        <i className="fas fa-edit"></i> Chỉnh sửa thông tin
                    </button>
                ) : (
                    <div className={styles['edit-mode-buttons']}>
                        <button className={styles['btn-save']} onClick={saveProfile}>
                            <i className="fas fa-check"></i> Lưu thay đổi
                        </button>
                        <button className={styles['btn-cancel']} onClick={toggleEdit}>
                            <i className="fas fa-times"></i> Hủy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;