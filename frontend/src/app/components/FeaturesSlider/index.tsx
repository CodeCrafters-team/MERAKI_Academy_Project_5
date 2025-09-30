"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import AnimateInView from "../AnimateInView";

export default function FeaturesSlider() {
const features = [
  {
    icon: "bi-mortarboard-fill",
    title: "Skilled Instructors",
    desc: "Learn from certified experts with real industry knowledge.",
  },
  {
    icon: "bi-globe",
    title: "Online Classes",
    desc: "Join live or recorded sessions and study anywhere at any time daily.",
  },
  {
    icon: "bi-house-door-fill",
    title: "Home Projects",
    desc: "Build skills through hands-on projects from home and improve daily.",
  },
  {
    icon: "bi-chat-dots-fill",
    title: "Chat Service",
    desc: "Get instant help from our support team whenever needed by all.",
  },
  {
    icon: "bi-phone-fill",
    title: "Mobile Friendly",
    desc: "Access courses and materials on any device anywhere with ease.",
  },
  {
    icon: "bi-patch-check-fill",
    title: "Certificates",
    desc: "Earn certificates to showcase your skills and boost your career.",
  },
  {
    icon: "bi-clock-fill",
    title: "Flexible Learning",
    desc: "Study at your pace and fit learning into your schedule easily.",
  },
  {
    icon: "bi-cash-stack",
    title: "Affordable Pricing",
    desc: "Enjoy high quality learning experiences at fair prices daily.",
  },
];
  return (
    <section
      className="container py-5"
    >
                  <AnimateInView animation="animate__fadeInUp animate__slow">
      
    <div className="text-center">
          <h1 className="mb-5 fw-bold">Platform Features</h1>
        </div>
                  </AnimateInView>


      <Swiper
        modules={[Autoplay, Pagination, Navigation, A11y]}
        spaceBetween={24}
        slidesPerView={4}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {features.map((f, i) => (
          
          <SwiperSlide key={i}>
            <AnimateInView animation="animate__fadeInUp  animate__slow ">
            <div>
            <div className="text-center p-5 h-100 bg-white rounded-3 shadow-sm hover-grow border ">
              <div className="mb-3 fs-1" style={{ color: "#77B0E4" }}>
                <i className={`bi ${f.icon}`}></i>
              </div>
              <h5 className="fw-bold mb-3">{f.title}</h5>
              <p className="text-muted mb-0">{f.desc}</p>
            </div></div>
                  </AnimateInView>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
}
