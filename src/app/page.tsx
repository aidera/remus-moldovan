'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import Link from 'next/link';

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const headersRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [headersStyles, setHeadersStyles] = useState({});
  const [videoAnimationKey1, setVideoAnimationKey1] =
    useState<boolean>(false);
  const [videoAnimationKey2, setVideoAnimationKey2] =
    useState<boolean>(false);

  const handleTimeUpdate = () => {
    if (
      videoRef.current &&
      videoRef.current.currentTime >= 1 &&
      !videoAnimationKey1
    ) {
      setVideoAnimationKey1(true);
    }

    if (
      videoRef.current &&
      videoRef.current.currentTime >= 6 &&
      !videoAnimationKey2
    ) {
      setVideoAnimationKey2(true);
    }
  };

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
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        className={styles.bgVideo}
        autoPlay
        muted
        poster="/Video-sequence-first.jpg"
      >
        <source src="/Video-background.mp4" type="video/mp4" />
      </video>

      <div
        className={
          styles.initialContent +
          (!videoAnimationKey1 ? ' ' + styles.initialContent__active : '')
        }
      >
        <div className={styles.initialContent_background}></div>
        <div className={styles.initialContent_contentWrapper}>
          <img src="/logo-2.png" />
          <span>It's How I See</span>
        </div>
      </div>

      <div
        className={
          styles.mainContent +
          (videoAnimationKey2 ? ' ' + styles.mainContent__active : '')
        }
      >
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
