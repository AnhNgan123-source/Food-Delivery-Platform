package com.nhom8.backend.dto; // Sửa lại cho đúng package của Ngân nhé

public class ResponseData {
    private String status; // Chứa chữ "success" hoặc "error"
    private Object data;   // Chứa mảng Orders, User, hoặc thông tin món ăn

    // Constructor 
    public ResponseData(String status, Object data) {
        this.status = status;
        this.data = data;
    }

    // Getter và Setter (Bắt buộc phải có để Spring biến nó thành JSON)
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}