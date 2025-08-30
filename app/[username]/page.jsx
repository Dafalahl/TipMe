// DonationDetail.jsx
'use client';
import {useParams} from 'next/navigation';
import { useState } from 'react';
import { donationData } from '../DonationData'; 
import styles from './donationDetail.module.css'; 
import TransferForm from '@/app/Transfer Usdc/TransferForm';
import CheckBalance from './TotalDonation';
import { useChainId } from 'wagmi';

export default function DonationDetail(){
    const chainId = useChainId();
    const{username} = useParams();
    const [isPopupOpen, setIsPopupOpen] = useState(false); 

    const currentDonation = donationData.find(item => item.username === username);
    
    if(!currentDonation){
        return <div>Donasi tidak ditemukan</div>;

    }
    const handleOpenPopup = () => {
      setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
      setIsPopupOpen(false);
    };

    return(
        <div className={styles.container}>
            <div className={styles.twoColumnLayout}>
                {/* Kolom Kiri: Detail Kreator */}
                <div className={styles.leftColumn}>
                  <img 
                        src={currentDonation.profilePic} 
                        alt={`Foto profil ${currentDonation.username}`}
                        className={styles.profpic} 
                    />
                    <h2 className={styles.creatorName}>{currentDonation.username}</h2> 
                    <div className={styles.totalDonate}>
                        <CheckBalance 
                            targetAddress={currentDonation.address} 
                            chainId={chainId} 
                            maxAmount={20}  // Anda bisa mengubah nilai maksimum jika diperlukan
                        />
                        <button onClick={handleOpenPopup} className={styles.donateButton}>
                            Donate!!
                        </button>
                        </div>
                    
                </div>

                {/* Kolom Kanan: Detail & Form Donasi */}
                <div className={styles.rightColumn}>
                    <img src={currentDonation.image} alt={currentDonation.title} className={styles.donationImage}/>
                    <h1 className={styles.donationTitle}>{currentDonation.title}</h1>
                    <p className={styles.donationDescription}>Deskripsi donasi di sini...</p>
                    
                </div>
            </div>
             {isPopupOpen && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupContent}>
                      <button className={styles.closeButton} onClick={handleClosePopup}>X</button>
                      <h3>Donate {currentDonation.username}!</h3>
                      <TransferForm targetAddress={currentDonation.address} />
                    </div>
                </div>
            )}
        </div>
    );
}