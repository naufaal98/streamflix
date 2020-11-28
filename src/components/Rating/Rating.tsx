import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import styles from './Rating.module.scss';

export default function Rating({ score }: { score: number }) {
  return (
    <div className={styles.Rating}>
      <div className={styles.RatingIcon}>
        <FontAwesomeIcon icon={faStar} />
      </div>
      <div className={styles.RatingScore}>{score}</div>
    </div>
  );
}
