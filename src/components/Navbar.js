// components/Navbar.js
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Navbar.module.css" // Import the CSS module here

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.navbar}>
      <button className={styles.hamburger} onClick={toggleMenu}>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>
      {isOpen && (
        <div className={styles.navMenu}>
          <div className={styles.navLogo}>
            <Link href="/">
              <Image
                src="/your-logo.png"
                alt="Your Logo"
                width={40}
                height={40}
              />
            </Link>
          </div>
          <Link href="/">
            <span className={styles.navLink}>Home</span>
          </Link>
          <Link href="/about">
            <span className={styles.navLink}>About</span>
          </Link>
          <Link href="/services">
            <span className={styles.navLink}>Services</span>
          </Link>
          <Link href="/contact">
            <span className={styles.navLink}>Contact</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
