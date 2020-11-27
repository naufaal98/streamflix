import Header from 'components/Layout/Header';
import React from 'react';
import styles from './Layout.module.scss';

const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.Layout}>
      <Header />
      <div className={styles.Content}>{children}</div>
    </div>
  );
};

export default Layout;
