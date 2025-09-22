import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function SimpleFooter() {
  return (
    <footer
      className="text pt-5"
      style={{
        backgroundColor: "#77B0E4",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100%"
      }}
    >
      {/* <div className="col-md-3 mb-4" style={{ "marginLeft": "130px" }}>
         <div className="col">
          <p className=
            "row text-center text-md-start col-60 col-md- d-flex gap-3  " style={{ "width": "1150px" }} >We are a passionate group of developers and designers who worked together to bring this project to life.
            Each member contributed with unique skills and creativity to build a platform that makes learning easier and more enjoyable.</p>
        </div> 
       {/*  <h6 className="mb-3">Developer Team</h6>
        <ul className="list-unstyled small">
          <li><strong>Issa Azzez</strong> – Full-Stack Developer</li>
          <li><strong>Aseel Qabbaha</strong> – Full-Stack Developer</li>
          <li><strong>Omar Najar</strong> – Full-Stack Developer</li>
          <li><strong>Waleed Alzebin</strong> – Full-Stack Developer</li>
        </ul>
      </div>
 */} 

      <div className="container">
        <div className="row gy-7">
          <div className="col-md-4">
            <div className="mb-3 d-flex align-items-center">
              <Image src="" alt="" width={40} height={0} />
              <span className=" ms-2 h5 mb-0 "><strong>Smart Path Application</strong></span>
            </div>
            <p className="small">
              Learn anytime, anywhere. Our platform helps you grow your skills
              step by step.
            </p>
          </div>

          <div className="col-6 col-md-2">
            <h6>Quick Links</h6>
            <ul className="list-unstyled small">
              <li><Link href="/" className="text-decoration-none text-light">Home</Link></li>
              <li><Link href="/courses" className="text-decoration-none text-light">Courses</Link></li>
              <li><Link href="/category" className="text-decoration-none text-light">Category</Link></li>
              <li><Link href="/about" className="text-decoration-none text-light">About Us</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6>Resources</h6>
            <ul className="list-unstyled small">
              <li><Link href="/faq" className="text-decoration-none text-light">FAQ</Link></li>
              <li><Link href="/privacy" className="text-decoration-none text-light">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-decoration-none text-light">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6>Follow Us</h6>
            <div className="d-flex gap-3">
             <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-light text-decoration-none">
                  <FaFacebook className="text-blue-600" />Facebook</a>
              
               <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-light text-decoration-none">
                <FaTwitter className="text-sky-400" />Twitter</a>


              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-light text-decoration-none"> 
                <FaLinkedin className="text-blue-700" /> LinkedIn</a>
            </div>
          </div>
        </div>

        <hr className="border-light mt-4" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pb-3" >
          <small className="text-light">
            © {new Date().getFullYear()} Smart Path. All rights reserved.
          </small>
          <small className="text-light">Made with ❤️ for learners</small>
        </div>
      </div>
    </footer>
  );
}