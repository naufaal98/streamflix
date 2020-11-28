import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function PurchasedIcon() {
  return (
    <FontAwesomeIcon
      icon={faCheckCircle}
      style={{ fontSize: 'var(--fontSize-2)', color: 'green' }}
    />
  );
}
