'use client';
import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigation } from 'swiper/modules';
import 'animate.css';
import './courseSlider.css';

const courses = [
  {
    title: "ARABIC",
    description: "تعلم اللغة العربية بسهولة وبطرق ممتعة",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 20,
  },
  {
    title: "ENGLISH",
    description: "English course for beginners with detailed lessons and interactive practice that helps you improve step by step",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 25,
  },
  {
    title: "MATH",
    description: "Learn math in a fun and interactive way",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 30,
  },
  {
    title: "SCIENCE",
    description: "Learn science in a fun way",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 35,
  },
  {
    title: "HISTORY",
    description: "Learn history easily with stories, visuals, and interactive examples that make it simple",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 40,
  }
];

function CourseSlider({ title }: { title: string }) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      setTimeout(() => {
        if (card) card.classList.add('visible');
      }, i * 200);
    });
  }, []);

  return (
    <div className="container my-5">
      <h2
        className="fw-bold mb-4 text-center animate__animated animate__fadeInUp"
        style={{ color: '#77B0E4' }}
      >
        {title}
      </h2>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        navigation={true}
        loop={false}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {courses.map((course, i) => (
          <SwiperSlide key={i}>
            <div
              ref={(el) => (cardsRef.current[i] = el)}
              className="card course-card h-100 d-flex flex-column shadow-sm"
            >
              <img
                src={course.cover_url}
                className="card-img-top"
                alt={course.title}
              />
              <div className="card-body d-flex flex-column flex-grow-1">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text flex-grow-1">{course.description}</p>
                <button
                  className="btn btn-primary btn-buy mt-auto border-0"
                  style={{ backgroundColor: '#77B0E4' }}
                >
                  لمعرفة المزيد اضغط
                </button>
              </div>
              <div
                className="card-footer text-center fw-semibold"
                style={{ color: '#F6A531' }}
              >
                Price: ${course.price}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default function CourseSliders() {
  return (
    <>
      <CourseSlider title="Our Courses" />
      <CourseSlider title="Most Selling" />
      <CourseSlider title="Trending Now" />
    </>
  );
}
