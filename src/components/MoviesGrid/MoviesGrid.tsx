import React from 'react';
import styles from './MoviesGrid.module.scss';

const MoviesGrid: React.FC = ({ children }) => {
  return <div className={styles.MoviesGrid}>{children}</div>;
};

export default MoviesGrid;
