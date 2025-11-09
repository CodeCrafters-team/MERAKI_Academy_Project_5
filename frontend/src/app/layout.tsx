"use client"
import dynamic from "next/dynamic";

import { Providers } from './provider';
const Navbar = dynamic(() => import("./components/Navbar/Navigation"), { ssr: false });
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import 'animate.css/animate.min.css';
const SimpleFooter = dynamic(() => import("./components/footer/page"), { ssr: false });
const ChatWidget = dynamic(() => import("./components/AiChat"), { ssr: false });

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