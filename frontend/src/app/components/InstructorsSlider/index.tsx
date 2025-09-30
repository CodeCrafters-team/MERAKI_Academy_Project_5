"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InstructorsSection() {
  const THEME = { primary: "#77B0E4" };

  const instructors = [
    {
      name: "Emily Davis",
      title: "UI/UX Designer",
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&h=600&fit=crop",
    },
    {
      name: "Ahmed Ali",
      title: "Cybersecurity Specialist",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
    },
    {
      name: "Lisa Brown",
      title: "Marketing Strategist",
      img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop",
    },
    {
      name: "Sarah Johnson",
      title: "Web Development Instructor",
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=600&fit=crop",
    },
  ];


  return (
    <section className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold" >
          Meet Our Instructors
        </h1>

      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        slidesPerView={1}
        spaceBetween={24}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        breakpoints={{
          768: { slidesPerView: 2 },
          1200: { slidesPerView: 3 },
        }}
        style={{ paddingBottom: 32 }}
        className="pb-4"
      >
        {instructors.map((inst, i) => (
          <SwiperSlide key={i}>
            <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
              <div className="position-relative" style={{ height: 280 }}>
                <img
                  src={inst.img}
                  alt={inst.name}
                  loading="lazy"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />

                <div
                  className="position-absolute start-50 translate-middle-x d-flex gap-2"
                  style={{ bottom: -22 }}
                >
                  {[
                    { icon: "bi-facebook", href: "#" },
                    { icon: "bi-linkedin", href: "#" },
                    { icon: "bi-instagram", href: "#" },
                  ].map((s, k) => (
                    <a
                      key={k}
                      href={s.href}
                      className="d-inline-flex align-items-center justify-content-center rounded-2 hover-grow"
                      style={{
                        width: 42,
                        height: 42,
                        background: THEME.primary,
                        color: "#fff",
                        textDecoration: "none",
                        boxShadow: "0 4px 10px rgba(0,0,0,.15)",
                      }}
                    >
                      <i className={`bi ${s.icon}`}></i>
                    </a>
                  ))}
                </div>
              </div>
              <div className="text-center bg-light pt-5 pb-4 px-3">
                <h5 className="fw-bold mb-2">{inst.name}</h5>
                <p className="text-muted mb-0 small">{inst.title}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
