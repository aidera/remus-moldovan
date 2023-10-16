'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import Link from 'next/link';

export default function Home() {
  const [headersStyles, setHeadersStyles] = useState({});
  const mainRef = useRef<HTMLDivElement>(null);
  const headersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mainBounds = mainRef.current?.getBoundingClientRect();
      const mouseX = event.clientX - (mainBounds?.left || 0);
      const mouseY = event.clientY - (mainBounds?.top || 0);
      const midpointY = mainBounds!.height / 2;

      const perspective = 1000;
      const rotationX =
        mouseY < midpointY
          ? (mouseY / midpointY - 1) * -15 // Positive rotation for the top half
          : (1 - mouseY / midpointY) * 15; // Negative rotation for the bottom half
      const rotationY = (mouseX / mainBounds!.width - 0.5) * 15;

      const dynamicStyles = {
        transform: `perspective(${perspective}px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
      };

      setHeadersStyles(dynamicStyles);
    };

    if (mainRef.current) {
      mainRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (mainRef.current) {
        mainRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <main ref={mainRef} className={styles.main}>
      <video
        className={styles.bgVideo}
        autoPlay
        loop
        muted
        poster="https://assets.codepen.io/6093409/river.jpg"
      >
        <source src="/home-background-video.mp4" type="video/mp4" />
      </video>

      <div className={styles.content}>
        <div ref={headersRef} className={styles.headers} style={headersStyles}>
          <h1>Remus Moldovan</h1>

          <div className={styles.quoteContainer}>
            <q>...to get on top of the hill you need to dig deep</q>
          </div>
        </div>

        <nav>
          <Link className={styles.accentLink} href="/art">
            Explore the art
          </Link>
          <Link href="/about">About the artist</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </main>
  );
}
