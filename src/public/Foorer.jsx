import React from 'react';

const Footer = () => {
  return (
      <footer className="border-top footer text-muted">
        <div className="container  text-center">
          &copy; {new Date().getFullYear()} - Vitalis
        </div>
      </footer>
  );
};

export default Footer;