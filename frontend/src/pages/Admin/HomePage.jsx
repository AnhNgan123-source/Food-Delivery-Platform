import React from 'react';
import styles from './HomePage.module.css';

const Admin = () => {
    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.welcomeContent}>
                <h2 className={styles.animatedText}>
                    Chào mừng QUẢN TRỊ VIÊN trở lại! <span className={styles.wave}>👋</span>
                </h2>
                <div className={styles.underline}></div>
            </div>
        </div>
    );
};

export default Admin;