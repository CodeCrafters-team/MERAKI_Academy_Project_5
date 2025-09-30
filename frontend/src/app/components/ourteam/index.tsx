'use client';
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const items = [
  {
    img: "https://themewagon.github.io/elearning/img/testimonial-1.jpg",
    name: "Sara Ahmed",
    role: "UI/UX Designer",
    quote:
      "The courses are clear and practical. I built a real portfolio and improved my confidence quickly.",
  },
  {
    img: "https://themewagon.github.io/elearning/img/testimonial-2.jpg",
    name: "Omar Ali",
    role: "Frontend Developer",
    quote:
      "Live sessions + recordings = perfect combo. Mentors were super helpful whenever I got stuck.",
  },
  {
    img: "https://themewagon.github.io/elearning/img/testimonial-3.jpg",
    name: "Lina Youssef",
    role: "Data Analyst",
    quote:
      "Structured content and hands-on projects made the learning journey smooth and enjoyable.",
  },
  {
    img: "https://themewagon.github.io/elearning/img/testimonial-4.jpg",
    name: "Khaled Samir",
    role: "Mobile Engineer",
    quote:
      "I upskilled fast and landed interviews. Highly recommend these courses to anyone serious about learning.",
  },
];

export default function TestimonialsSwiper() {
  return (
    <section className="container-xxl py-5">
      <div className="container">
        <div className="text-center">
          <h1 className="mb-5 fw-bold">Our Students Say!</h1>
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
        >
          {items.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white p-4 rounded-3 shadow-sm h-100 text-center">
                <img
                  src={t.img}
                  alt={t.name}
                  width={80}
                  height={80}
                  className="border rounded-circle p-2 mx-auto mb-3"
                  style={{ objectFit: "cover" }}
                />
                <h5 className="mb-0">{t.name}</h5>
                <p className="text-muted">{t.role}</p>
                <div className="bg-light p-4 rounded-3">
                  <p className="mb-0">{t.quote}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
