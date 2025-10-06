"use client";

import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import React from "react";
import Link from "next/link";
import {  usePathname } from "next/navigation";


export default function FancyWaveFooter() {
    const pathname = usePathname();   
      if (pathname && pathname.startsWith("/admin")) {
      return null;
    }
  return (
    <footer className="footer position-relative text-white pt-10 overflow-hidden text-shadow">
      <div className="waves">
        <svg
          className="waves-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="#77B0E4" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="#77B0E4" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="#51a2eeff" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#307fc9ff" />
          </g>
        </svg>
      </div>

      <div className="container px-3 px-md-5 position-relative">
        <div className="row gy-5">
          <div className="col-md-4">
            <div className="mb-3">
              <br />
              <img
                src="/assets/smartpath-logo.png"
                alt="Smart Path logo"
                width={140}
                className="bg-white rounded-pill p-2 shadow-lg"
              />
            </div>
            <p className="small opacity-90">
              Learn anytime, anywhere. Our platform helps you grow your skills
              step by step.
            </p>
          </div>

          <div className="col-6 col-md-2">
            <br />
            <h6 className="footer-title mb-3">Quick Links</h6>
            <ul className="list-unstyled small">
              <li>
                <Link href="/" className="text-light hover-link">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-light hover-link">
                  Category
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-light hover-link">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <br />
            <h6 className="footer-title mb-3">Resources</h6>
            <ul className="list-unstyled small">
              <li>
                <Link href="/faq" className="text-light hover-link">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-light hover-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-light hover-link">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3">
            <br />
            <h6 className="footer-title mb-3">Follow Us</h6>
            <div className="d-flex gap-3 fs-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-social"
                style={{ color: "white" }}
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-social"
                style={{ color: "white" }}
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-social"
                style={{ color: "white" }}
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <hr className="border-light mt-5 opacity-25" />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pb-3">
          <small className="opacity-90">
            © {new Date().getFullYear()} Smart Path. All rights reserved.
          </small>
          <small className="opacity-90">Made with ❤️ by Smart Path</small>
        </div>
      </div>

      <style jsx>{`
        footer {
          background: #7fbbf4ff;
        }

        .waves {
          position: absolute;
          width: 100%;
          height: 15vh;
          bottom: 0;
          left: 0;
          overflow: hidden;
          min-height: 100px;
          max-height: 150px;
        }

        .waves-svg {
          width: 100%;
          height: 100%;
        }

        .parallax > use {
          animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5)
            infinite;
        }

        .parallax > use:nth-child(1) {
          animation-delay: -2s;
          animation-duration: 7s;
        }
        .parallax > use:nth-child(2) {
          animation-delay: -3s;
          animation-duration: 10s;
        }
        .parallax > use:nth-child(3) {
          animation-delay: -4s;
          animation-duration: 13s;
        }
        .parallax > use:nth-child(4) {
          animation-delay: -5s;
          animation-duration: 20s;
        }

        @keyframes move-forever {
          0% {
            transform: translate3d(-90px, 0, 0);
          }
          100% {
            transform: translate3d(85px, 0, 0);
          }
        }

        .footer-title {
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .text-shadow {
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
        }

        .hover-link:hover {
          transition: color 0.3s ease;
          text-decoration: underline;
        }

        .hover-social:hover {
          transform: scale(1.25);
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .waves {
            height: 40px;
            min-height: 40px;
          }
        }
      `}</style>
    </footer>
  );
}
