import React, { useState, useEffect } from 'react';

// ✅ Thêm initialData vào props
const AddMenuItemForm = ({ onCancel, onSuccess, initialData }) => {
    const [formData, setFormData] = useState({
        item_name: '',
        price: '',
        description: '',
        cat_id: ''
    });

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); 
    const [categories, setCategories] = useState([]);

    // 1. Load danh mục từ API (Giữ nguyên)
    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Lỗi load category:", err));
    }, []);

    // ✅ MỚI: Đổ dữ liệu cũ vào form khi có initialData
    useEffect(() => {
        if (initialData) {
            setFormData({
                item_name: initialData.item_name || '',
                // Chia 1000 vì input bạn nhập 50 (cho 50.000)
                price: initialData.price ? initialData.price / 1000 : '',
                description: initialData.description || '',
                cat_id: initialData.cat_id || ''
            });
            
            // ✅ SỬA TẠI ĐÂY: Gọi trực tiếp qua WebConfig đường dẫn /uploads/
            if (initialData.item_image) {
                // Không dùng /api/menu/image/ nữa mà dùng thẳng /uploads/
                setPreviewUrl(`http://localhost:8080/uploads/${initialData.item_image}`);
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resId = localStorage.getItem('resId');
        const token = localStorage.getItem('token'); // ✅ Lấy token để sửa lỗi 403

        if (!formData.item_name || !formData.price || !formData.cat_id) {
            alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
            return;
        }

        try {
            const data = new FormData();
            data.append("item_name", formData.item_name);
            data.append("price", parseInt(formData.price) * 1000);
            data.append("description", formData.description);
            data.append("cat_id", formData.cat_id);
            data.append("res_id", resId);
            data.append("is_available", 1);

            if (imageFile) {
                data.append("file", imageFile);
            }

            // ✅ Tự động chọn POST hoặc PUT dựa trên initialData
            const method = initialData ? "PUT" : "POST";
            const url = initialData 
                ? `http://localhost:8080/api/menu/${initialData.item_id || initialData.itemId}` 
                : "http://localhost:8080/api/menu";

            const response = await fetch(url, {
                method: method,
                headers: {
                    // ✅ Gửi Token lên để Backend không chặn (hết lỗi 403)
                    "Authorization": `Bearer ${token}`
                },
                body: data 
            });

            if (response.ok) {
                alert(initialData ? "Cập nhật thành công!" : "Thêm món thành công!");
                onSuccess();
            } else {
                alert("Có lỗi xảy ra: " + response.status);
            }
        } catch (err) {
            console.error("Lỗi khi gửi form:", err);
            alert("Không thể kết nối đến máy chủ.");
        }
    };

    return (
        <div className="wf-form-container">
            <h2 className="form-title">{initialData ? "Cập nhật món ăn" : "Thêm món ăn mới"}</h2>
            
            <form onSubmit={handleSubmit} className="wf-main-form">
                <div className="form-group">
                    <label>Tên món ăn</label>
                    <input
                        name="item_name"
                        type="text"
                        placeholder="Ví dụ: Cơm tấm sườn"
                        value={formData.item_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row-flex">
                    <div className="form-group">
                        <label>Giá bán (x1.000 VNĐ)</label>
                        <input
                            name="price"
                            type="number"
                            placeholder="Ví dụ: 50 (50.000đ)"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Danh mục</label>
                        <select 
                            name="cat_id" 
                            value={formData.cat_id} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map((cat) => (
                                <option key={cat.cat_id} value={cat.cat_id}>
                                    {cat.cat_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Mô tả chi tiết</label>
                    <textarea
                        name="description"
                        placeholder="Nhập mô tả món ăn..."
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Hình ảnh món ăn</label>
                    <div className="image-upload-section">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            className="file-input"
                        />
                        
                        {previewUrl && (
                            <div className="preview-container">
                                <img src={previewUrl} alt="Món ăn preview" className="img-preview-thumb" />
                                <button type="button" onClick={() => {setPreviewUrl(null); setImageFile(null);}} className="btn-remove-img">
                                    Xóa ảnh
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="wf-modal-actions">
                    <button type="button" className="wf-btn-secondary" onClick={onCancel}>
                        Hủy bỏ
                    </button>
                    <button type="submit" className="wf-btn-primary">
                        {initialData ? "Lưu thay đổi" : "Lưu món ăn"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMenuItemForm;