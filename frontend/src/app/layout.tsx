
"use client"

import { Providers } from './provider';
import ThemeToggle from './components/ThemeToggle/themeToggle';
import Navbar from './components/Navbar/Navigation';
import SimpleFooter from './footer/page';
import UserDialog from './components/userDialog/userDialog';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import 'animate.css/animate.min.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>

  <Navbar/>

        <div style={{ marginTop: '4em' }}>
        {children}
        </div>
        </Providers>


      </body>
    </html>
  );
}