import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

export default function Card({ title, description, href }) {
  return (
    <div className={clsx(styles.card)}>
      <h3 className={styles.cardTitle}>
        <a href={href} className={styles.cardTitleLink}>{title}</a>
      </h3>
      <p className={styles.cardDescription}>{description}</p>
    </div>
  );
}
