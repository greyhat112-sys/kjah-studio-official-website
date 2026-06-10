'use client';
import { useEffect, useState } from 'react';
import styles from './Grain.module.css';

export default function Grain() {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = 90 + ((Math.random() * 100) | 0);
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    setUrl(canvas.toDataURL('image/png'));
  }, []);

  if (!url) return null;

  return (
    <div
      className={styles.grain}
      style={{ backgroundImage: `url(${url})` }}
      aria-hidden="true"
    />
  );
}
