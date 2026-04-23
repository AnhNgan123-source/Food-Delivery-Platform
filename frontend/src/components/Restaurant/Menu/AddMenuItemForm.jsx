import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import restaurantApi from '../../../api/restaurantApi';
import styles from '../Menu/MenuManagement.module.css';

const AddMenuItemForm = ({ onCancel, onSuccess, initialData }) => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const location = useLocation(); // Hook để lấy dữ liệu truyền từ navigate
    
    const [formData, setFormData] = useState({
        item_name: '',
        price: '',
        description: '',
        cat_id: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    // 1. Load danh mục
    useEffect(() => {
        restaurantApi.getCategories()
            .then(res => {
                const data = Array.isArray(res) ? res : res.data;
                if (data && Array.isArray(data)) setCategories(data);
            })
            .catch(err => console.error("Lỗi load category:", err));
    }, []);

    // 2. Logic đổ dữ liệu cũ (Ưu tiên State -> Props -> API)
    useEffect(() => {
        const fillData = (item) => {
            if (!item) return;
            setFormData({
                item_name: item.item_name || item.itemName || '',
                price: item.price ? (item.price > 10000 ? item.price / 1000 : item.price) : '',
                description: item.description || '',
                cat_id: String(item.cat_id || item.catId || '') 
            });

            if (item.item_image || item.itemImage) {
                const imgName = item.item_image || item.itemImage;
                setPreviewUrl(`http://localhost:8080/uploads/${imgName}`);
            }
            setIsEditMode(true);
        };

        if (location.state?.foodData) {
            // Lấy từ state truyền qua navigate (Cách này nhanh nhất)
            fillData(location.state.foodData);
        } else if (initialData) {
            // Lấy từ Props
            fillData(initialData);
        } else if (id) {
            // Nếu F5 trang, gọi API (yêu cầu Backend đã thêm GetMapping /{id})
            restaurantApi.getMenuItemById(id)
                .then(res => fillData(res.data || res))
                .catch(err => console.error("Lỗi lấy chi tiết món:", err));
        }
    }, [initialData, id, location.state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const resId = localStorage.getItem('resId');
        
        const data = new FormData();
        data.append("item_name", formData.item_name);
        data.append("price", Math.round(parseFloat(formData.price) * 1000));
        data.append("description", formData.description || "");
        data.append("cat_id", parseInt(formData.cat_id));

        if (imageFile) {
            data.append("file", imageFile);
        }

        try {
            const currentId = id || (initialData?.item_id || initialData?.itemId);
            
            if (currentId) {
                await restaurantApi.updateMenuItem(currentId, data);
                alert("Cập nhật thành công!");
            } else {
                data.append("res_id", parseInt(resId));
                data.append("is_available", 1); 
                await restaurantApi.addMenuItem(data);
                alert("Thêm món mới thành công!");
            }

            if (typeof onSuccess === 'function') onSuccess();
            else navigate('/restaurant/menu-management');

        } catch (err) {
            console.error("Lỗi API khi lưu:", err);
            alert("Không thể lưu món ăn!");
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>
                {isEditMode ? "Cập nhật món ăn" : "Thêm món ăn mới"}
            </h2>
            
            <form onSubmit={handleSubmit} className={styles.mainForm}>
                <div className={styles.formGroup}>
                    <label>Tên món ăn</label>
                    <input name="item_name" type="text" value={formData.item_name} onChange={handleChange} required />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Giá (x1.000 VNĐ)</label>
                        <input name="price" type="number" value={formData.price} onChange={handleChange} required />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Danh mục</label>
                        <select name="cat_id" value={formData.cat_id} onChange={handleChange} required>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => {
                                const cId = String(cat.cat_id || cat.catId || cat.id);
                                const cName = cat.cat_name || cat.catName || cat.name;
                                return <option key={cId} value={cId}>{cName}</option>;
                            })}
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Mô tả chi tiết</label>
                    <textarea name="description" rows={3} value={formData.description} onChange={handleChange} />
                </div>

                <div className={styles.formGroup}>
                    <label>Hình ảnh món ăn</label>
                    <div className={styles.uploadBox}>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {previewUrl && (
                            <div className={styles.previewWrapper}>
                                <img src={previewUrl} alt="Preview" className={styles.imgThumb} />
                                <button type="button" className={styles.btnRemove} onClick={() => {setPreviewUrl(null); setImageFile(null);}}>Xóa ảnh</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.btnCancel} onClick={() => navigate(-1)}>Hủy</button>
                    <button type="submit" className={styles.btnSubmit}>
                        {isEditMode ? "Cập nhật ngay" : "Lưu món ăn"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMenuItemForm;