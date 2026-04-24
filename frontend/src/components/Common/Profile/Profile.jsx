import React, { useState, useEffect } from 'react';
// Import styles từ file Admin.module.css để dùng chung theme
import styles from './Profile.module.css'; 
import userApi from '../../../api/userApi'; 

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

    // AxiosClient đã tự động lấy token từ localStorage, không cần khai báo biến token ở đây nữa

    useEffect(() => {
        fetchProfileData();
    }, []);

    // --- PHẦN THAY ĐỔI: SỬ DỤNG AXIOS QUA USERAPI ---
    const fetchProfileData = async () => {
        try {
            // Thay thế fetch bằng userApi
            const data = await userApi.getProfile();
            
            // Vì axiosClient đã bóc tách (unwrap) res.data, data ở đây là object User
            setUser(data);
            setEditData({
                fullName: data.fullName || '',
                email: data.email || '',
                phone: data.phone || ''
            });
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            // Nếu lỗi 401, axiosClient sẽ tự động đưa về trang login nhờ Interceptor
        }
    };

    // --- PHẦN THAY ĐỔI: SỬ DỤNG AXIOS QUA USERAPI ---
    const saveProfile = async () => {
        try {
            // Thay thế fetch PUT bằng userApi
            await userApi.updateProfile(editData);

            alert("Cập nhật thành công!!!");
            setUser({ ...user, ...editData });
            setIsEditing(false);
        } catch (err) {
            console.error("Lỗi kết nối:", err);
            const msg = err.response?.data?.message || "Có lỗi xảy ra khi lưu!";
            alert(msg);
        }
    };

    // --- PHẦN GIỮ NGUYÊN HOÀN TOÀN ---
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