// explore.jsx
'use client'

import styles from './explore.module.css'
import Link from 'next/link';
import { useState } from 'react';
import { donationData} from '../DonationData';

export default function Explore() {
  const [donations, setDonations] = useState(donationData);

  return (
    <div className={styles.exploreContainer}>
      <div className={styles.cardList}>
        {donations.map((donation) => (
          <Link href={`/${donation.username}`} key={donation.id} className={styles.noUnderline}> 
            <div className={styles.card}>
              {/* 👈 Ini adalah struktur baru */}
              <div className={styles.backgroundOverlay} style={{ backgroundImage: `url(${donation.image})` }}></div>
              <div className={styles.profilePicWrapper}>
                <img src={donation.profilePic} alt={`Profil ${donation.username}`} className={styles.profilePic} />
              </div>
              <div className={styles.cardContent}>
                <h2 className={styles.username}>{donation.username}</h2>
                <p className={styles.bio}>{donation.bio}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}