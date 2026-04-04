import React, { useState, useEffect } from 'react';

const ManageVoucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newVoucher, setNewVoucher] = useState({
        code: '', description: '', discountType: 'fixed_amount',
        discountValue: 0, maxDiscountAmount: 0, minOrderValue: 0,
        usageLimit: 100, endDate: '', isActive: 1
    });

    const fetchVouchers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/v1/admin/vouchers');
            const data = await res.json();
            if (data.status === "success") setVouchers(data.data);
        } catch (error) { console.error("Lỗi lấy voucher:", error); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchVouchers(); }, []);

    // --- FIX: Xử lý dữ liệu sạch trước khi gửi ---
    const handleCreate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Chuẩn hóa payload: LocalDateTime cần format T00:00:00, các số không được là NaN
        const payload = {
            ...newVoucher,
            discountValue: Number(newVoucher.discountValue) || 0,
            usageLimit: Number(newVoucher.usageLimit) || 0,
            maxDiscountAmount: Number(newVoucher.maxDiscountAmount) || 0,
            minOrderValue: Number(newVoucher.minOrderValue) || 0,
            // Thêm giờ vào date để Spring Boot LocalDateTime không bắt bẻ
            endDate: newVoucher.endDate ? `${newVoucher.endDate}T23:59:59` : null
        };

        try {
            const res = await fetch('http://localhost:8080/api/v1/admin/vouchers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                alert("Kích hoạt chiến dịch thành công! 🚀");
                setShowModal(false);
                fetchVouchers();
                setNewVoucher({ code: '', description: '', discountType: 'fixed_amount', discountValue: 0, maxDiscountAmount: 0, minOrderValue: 0, usageLimit: 100, endDate: '', isActive: 1 });
            } else {
                const errData = await res.text();
                alert("Lỗi server: " + errData);
            }
        } catch (error) {
            alert("Lỗi kết nối API!");
        } finally {
            setIsLoading(false);
        }
    };

    const getProgress = (used, limit) => Math.min((used / limit) * 100, 100);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* 1. TOP STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={statCardStyle('#eff6ff', '#3b82f6')}>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>Tổng Voucher</div>
                    <div style={{ fontSize: '28px', fontWeight: '800' }}>{vouchers.length}</div>
                </div>
                <div style={statCardStyle('#f0fdf4', '#22c55e')}>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>Đang hoạt động</div>
                    <div style={{ fontSize: '28px', fontWeight: '800' }}>{vouchers.filter(v => v.isActive).length}</div>
                </div>
                <div style={statCardStyle('#fff1f2', '#e11d48')}>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>Lượt đã dùng</div>
                    <div style={{ fontSize: '28px', fontWeight: '800' }}>{vouchers.reduce((acc, v) => acc + (v.usedCount || 0), 0)}</div>
                </div>
            </div>

            {/* 2. MAIN TABLE SECTION */}
            <div style={{ background: '#fff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>Chương trình ưu đãi</h3>
                        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Tạo và quản lý các mã giảm giá hệ thống</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={fetchVouchers} style={iconButtonStyle} title="Làm mới"><i className="fas fa-sync-alt"></i></button>
                        <button onClick={() => setShowModal(true)} style={btnPrimaryStyle}>
                            <i className="fas fa-plus-circle"></i> Tạo Chiến Dịch
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 15px' }}>
                        <thead>
                            <tr style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ textAlign: 'left', padding: '0 20px' }}>Mã Giảm Giá</th>
                                <th style={{ textAlign: 'left', padding: '0 20px' }}>Loại & Giá trị</th>
                                <th style={{ textAlign: 'left', padding: '0 20px' }}>Tình trạng sử dụng</th>
                                <th style={{ textAlign: 'center', padding: '0 20px' }}>Hết hạn</th>
                                <th style={{ textAlign: 'right', padding: '0 20px' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map(v => (
                                <tr key={v.voucherId} style={{ background: '#fff' }}>
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', borderLeft: '1px solid #f1f5f9', borderRadius: '16px 0 0 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={ticketIconStyle}><i className="fas fa-ticket-alt"></i></div>
                                            <div>
                                                <div style={{ fontWeight: '800', color: '#1e293b', fontSize: '15px', letterSpacing: '0.5px' }}>{v.code}</div>
                                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID: #{v.voucherId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ fontWeight: '700', color: '#0f172a' }}>
                                            {v.discountValue?.toLocaleString()}{v.discountType === 'percentage' ? '%' : 'đ'}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>{v.discountType === 'percentage' ? 'Giảm theo %' : 'Giảm trực tiếp'}</div>
                                    </td>
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: '600' }}>{v.usedCount || 0} đã dùng</span>
                                            <span style={{ color: '#94a3b8' }}>Tối đa {v.usageLimit}</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                            <div style={{ width: `${getProgress(v.usedCount || 0, v.usageLimit)}%`, height: '100%', background: getProgress(v.usedCount || 0, v.usageLimit) > 80 ? '#ef4444' : '#3b82f6', borderRadius: '10px' }}></div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>{v.endDate ? new Date(v.endDate).toLocaleDateString('vi-VN') : '∞'}</div>
                                    </td>
                                    <td style={{ padding: '15px 20px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', borderRadius: '0 16px 16px 0', textAlign: 'right' }}>
                                        <button style={{ ...iconButtonStyle, color: '#ef4444' }} title="Ngừng chiến dịch"><i className="fas fa-stop-circle"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. MODAL */}
            {showModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                            <h3 style={{ margin: 0, fontWeight: '800' }}>Cấu hình Voucher mới</h3>
                            <i className="fas fa-times" style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setShowModal(false)}></i>
                        </div>
                        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '15px' }}>
                            <div>
                                <label style={labelStyle}>Mã định danh (Code)</label>
                                <input 
                                    style={inputStyle} 
                                    placeholder="Ví dụ: SUMMER2024" 
                                    value={newVoucher.code}
                                    onChange={e => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                                    required 
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Loại giảm giá</label>
                                    <select style={inputStyle} value={newVoucher.discountType} onChange={e => setNewVoucher({...newVoucher, discountType: e.target.value})}>
                                        <option value="fixed_amount">Tiền mặt (đ)</option>
                                        <option value="percentage">Phần trăm (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Giá trị</label>
                                    <input 
                                        type="number" 
                                        style={inputStyle} 
                                        value={isNaN(newVoucher.discountValue) ? "" : newVoucher.discountValue} 
                                        onChange={e => setNewVoucher({...newVoucher, discountValue: e.target.value === "" ? 0 : parseInt(e.target.value)})} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>Số lượng</label>
                                    <input 
                                        type="number" 
                                        style={inputStyle} 
                                        value={isNaN(newVoucher.usageLimit) ? "" : newVoucher.usageLimit} 
                                        onChange={e => setNewVoucher({...newVoucher, usageLimit: e.target.value === "" ? 0 : parseInt(e.target.value)})} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Hạn sử dụng</label>
                                    <input type="date" style={inputStyle} value={newVoucher.endDate} onChange={e => setNewVoucher({...newVoucher, endDate: e.target.value})} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={btnCancelStyle}>Đóng</button>
                                <button type="submit" disabled={isLoading} style={btnSaveStyle}>
                                    {isLoading ? 'Đang kích hoạt...' : 'Kích hoạt ngay'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- STYLE GIỮ NGUYÊN ---
const statCardStyle = (bg, color) => ({ background: bg, color: color, padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '5px' });
const ticketIconStyle = { width: '40px', height: '40px', background: '#eff6ff', color: '#3b82f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' };
const iconButtonStyle = { width: '38px', height: '38px', borderRadius: '10px', border: '1px solid #f1f5f9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' };
const btnPrimaryStyle = { background: '#1e293b', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, backdropFilter: 'blur(8px)' };
const modalContentStyle = { background: '#fff', padding: '35px', borderRadius: '30px', width: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };
const labelStyle = { fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', display: 'block' };
const inputStyle = { width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', background: '#f8fafc' };
const btnSaveStyle = { flex: 2, padding: '14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' };
const btnCancelStyle = { flex: 1, padding: '14px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '14px', fontWeight: '600', cursor: 'pointer' };

export default ManageVoucher;