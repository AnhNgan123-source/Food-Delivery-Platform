import React, { useEffect } from 'react';
import styles from './BaseModal.module.css';

const BaseModal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    // Khóa cuộn trang khi Modal đang mở
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div 
                className={`${styles.modalContent} ${styles[size]}`} 
                onClick={(e) => e.stopPropagation()} // Ngăn click bên trong làm đóng modal
            >
                <div className={styles.modalHeader}>
                    <h3>{title}</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BaseModal;