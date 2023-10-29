'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.scss';
import Link from 'next/link';
import { BG_PAINTINGS } from './background-paintings';

export default function Home() {
  const mainRef = useRef<HTMLDivElement>(null);
  const headersRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [videoAnimationKey, setVideoAnimationKey] = useState<number>(0);
  const currentPainting =
    BG_PAINTINGS.find((el) => el.id === videoAnimationKey) || null;

  const handleTimeUpdate = () => {
    if (!videoRef.current) {
      return;
    }

    for (const painting of BG_PAINTINGS) {
      if (videoRef.current.currentTime >= painting.time) {
        setVideoAnimationKey(painting.id);
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
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
        loop
        muted
        poster="/Video-sequence-first.jpg"
      >
        <source src="/Sequence 01_1.mp4" type="video/mp4" />
      </video>

      <div className={styles.mainContent}>
        <div ref={headersRef} className={styles.headers}>
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

      {currentPainting && (
        <div className={styles.paintingLinkContainer}>
          <span>On the background: </span>
          <Link className={styles.paintingLink} href={currentPainting.link}>
            {currentPainting.title}
          </Link>
        </div>
      )}
    </main>
  );
}
