import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <img
              src="/brandsdigger_logo.webp"
              alt="Brands Digger Logo"
              className={styles.footerLogo}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <h3 className={styles.footerBrandName}>Brands Digger</h3>
          </div>

          <nav className={styles.footerLinks}>
            <a href="/about" className={styles.footerLink}>
              About
            </a>
            <a href="/features" className={styles.footerLink}>
              Features
            </a>
            <a href="/pricing" className={styles.footerLink}>
              Pricing
            </a>
            <a href="/contact" className={styles.footerLink}>
              Contact
            </a>
            <a href="/privacy" className={styles.footerLink}>
              Privacy Policy
            </a>
            <a href="/terms" className={styles.footerLink}>
              Terms of Service
            </a>
          </nav>

          <div className={styles.socialLinks}>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Twitter"
              title="Follow us on Twitter"
            >
              X
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Facebook"
              title="Follow us on Facebook"
            >
              f
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
              title="Connect on LinkedIn"
            >
              in
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
              title="Follow us on Instagram"
            >
              IG
            </a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} Brands Digger. All rights reserved. Made with{' '}
            <span className={styles.heartIcon}>♥</span> for entrepreneurs.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;