import Navbar from './components/Navbar/Navigation';
import { Providers } from './provider';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';
import './globals.css';


export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" >
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
