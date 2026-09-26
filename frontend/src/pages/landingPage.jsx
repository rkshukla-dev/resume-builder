import React, { useContext, useState } from 'react'
import { LayoutPanelTop, Menu, X } from 'lucide-react';
import { landingPageStyles } from '../assets/dummystyle'
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { ProfileInfoCard } from '../components/Cards';

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={landingPageStyles.container}>
        {/* HEADER */}
        <header className={landingPageStyles.header}>
            <div className={landingPageStyles.headerContainer}>
                <div className={landingPageStyles.logoContainer}>
                    <div className={landingPageStyles.logoIcon}>
                        <LayoutPanelTop className={landingPageStyles.logoIconInner} />
                    </div>
                    <span className={landingPageStyles.logoText}>
                        ResumeXpert
                    </span>
                </div>

                {/* MOBILE MENU BTN */}
                <button className={landingPageStyles.mobileMenuButton}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen 
                        ?  <X size={24} className={landingPageStyles.mobileMenuIcon} />
                        : <Menu size={24} className={landingPageStyles.mobileMenuIcon} />
                    }
                </button>

                {/* DESKTOP NAVIGATION */}
                <div className='hidden md:flex items-center'>
                    {user ? (
                        <ProfileInfoCard />
                    ) : (
                        <button className={landingPageStyles.desktopAuthButton} onClick={() => setOpenAuthModal(true)}>
                            <div className={landingPageStyles.desktopAuthButtonOverlay}></div>
                            <span className={landingPageStyles.desktopAuthButtonText}>Get Started</span>
                        </button>
                    )}
                </div>
            </div>

            {/* MOBILE MENU */}
            {mobileMenuOpen && (
                <div className={landingPageStyles.mobileMenu}>
                    <div className={landingPageStyles.mobileMenuContainer}>
                        {user ? (
                            <div className={landingPageStyles.mobileUserInfo}>
                                <div className={landingPageStyles.mobileUserWelcome}>
                                    Welcome Back
                                </div>
                                <button className={landingPageStyles.mobileDashboardButton} onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
                                    Go to Dashboard
                                </button>
                            </div>
                        ) : (
                            <button className={landingPageStyles.mobileAuthButton} onClick={() => { setOpenAuthModal(true); setMobileMenuOpen(false); }}>
                                Get Started
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>

        {/* MAIN CONTENT */}
    </div>
  )
}

export default LandingPage