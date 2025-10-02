
"use client"

import { Providers } from './provider';
import Navbar from './components/Navbar/Navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import 'animate.css/animate.min.css';
import SimpleFooter from './components/footer/page';
import ChatWidget from './components/AiChat';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#f8f9fa" }}>
        <Providers>

  <Navbar/>

    <ChatWidget />
        <div style={{ marginTop: '4em' }}>
        {children}
        </div>
        <SimpleFooter/>
        </Providers>


      </body>
      
    </html>
  );
}