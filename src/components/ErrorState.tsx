'use client';

import { useEffect } from 'react';
import { logger } from '../lib/logger';
import styles from './error.module.css';
import { Button } from './ui/Button';; 

export default function ErrorState({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error.message); 
  }, [error]);

  return (
    <div>
      <h2 className={styles.heading}>Something went wrong!</h2>
      <p>We encountered an unexpected issue while trying to load this section.</p>
      
      {/* Addresses Comment 2 */}
      <Button onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}