import React from 'react';
import styles from './PurchasedIcon.module.scss';

export default function PurchasedIcon() {
  return (
    <span className={styles.PurchasedIcon} aria-label="purchased">
      ✓
    </span>
  );
}
