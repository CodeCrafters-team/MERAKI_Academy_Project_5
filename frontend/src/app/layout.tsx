
"use client"

import { Providers } from './provider';
import Navbar from './components/Navbar/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import 'animate.css/animate.min.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#f8f9fa" }}>
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