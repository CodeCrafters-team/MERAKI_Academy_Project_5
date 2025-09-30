
"use client"

import { Providers } from './provider';
import Navbar from './components/Navbar/Navigation';
import UserDialog from './components/userDialog/userDialog';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import 'animate.css/animate.min.css';
import SimpleFooter from './components/footer/page';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>

  <Navbar/>

        <div style={{ marginTop: '4em' }}>
        {children}
        </div>
        <SimpleFooter/>
        </Providers>


      </body>
    </html>
  );
}