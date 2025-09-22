
"use client"

import { Providers } from './provider';
import ThemeToggle from './components/ThemeToggle/themeToggle';
import Navbar from './components/Navbar/Navigation';
import SimpleFooter from './footer/page';
import UserDialog from './components/userDialog/userDialog';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
         
            <Navbar />
            <ThemeToggle />
            {children}
            <UserDialog />
            <SimpleFooter />
          
        </Providers>
      </body>
    </html>
  );
}