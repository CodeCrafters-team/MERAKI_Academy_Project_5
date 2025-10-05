"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import AnimateInView from "../AnimateInView";

export default function InstructorsSection() {
  const THEME = { primary: "#77B0E4" };

  const instructors = [
    {
      name: "Davis Miller",
      title: "UI/UX Designer",
      img: "https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAyL21vdGFybzdfcG9ydHJhaXRfb2ZfY29uZmlkZW50X2NhdWNhc2lhbl9tYWxlX3RlYWNoZXJfaW5fY2xhc3Nyb19iZDVkNmI2Ny0wMDk1LTQxMTQtYmYxMy0zZjI5NjEzODE3ODdfMS5qcGc.jpg",
    },
    {
      name: "Ahmed Ali",
      title: "Cybersecurity Specialist",
      img: "https://www.shutterstock.com/image-photo/portrait-young-teacher-near-whiteboard-260nw-1656704701.jpg",
    },
    {
      name: "Lisa Brown",
      title: "Marketing Strategist",
      img: "https://www.ziprecruiter.com/svc/fotomat/public-ziprecruiter/cms/609701210OnlineInstructor.jpg=ws1280x960",
    },
    {
      name: "Sarah Johnson",
      title: "Web Development Instructor",
      img: "https://png.pngtree.com/thumb_back/fw800/background/20220314/pngtree-professional-portrait-of-female-teachers-image_1048455.jpg",
    },
  ];


  return (
    <section className="container py-5">
                        <AnimateInView animation="animate__fadeInUp animate__slow">
      
      <div className="text-center mb-5">
        <h1 className="fw-bold" >
          Meet Our Instructors
        </h1>

      </div>
                        </AnimateInView>

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
            <AnimateInView animation="animate__fadeInUp  animate__slow ">
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
                </AnimateInView>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
