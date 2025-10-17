import React from 'react';
import Navbar from '@theme-original/Navbar';
import { useLocation } from '@docusaurus/router';

export default function NavbarWrapper(props) {
  const location = useLocation();
  const isHomepage = location.pathname === '/' || location.pathname === '/intro';
  
  console.log('Navbar location:', location.pathname);
  console.log('Is homepage:', isHomepage);
  console.log('Original navbar props:', props);
  
  if (isHomepage) {
    // Create modified props without ANY navbar items
    const modifiedProps = {
      ...props,
      items: [], // Force empty items array
    };
    console.log('Modified navbar props for homepage:', modifiedProps);
    return <Navbar {...modifiedProps} />;
  }
  
  return <Navbar {...props} />;
}