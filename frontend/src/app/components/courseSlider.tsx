'use client';
import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigation } from 'swiper/modules';
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
    description: "English course for beginners",
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
    description: "Learn history easily",
    cover_url: "https://marketplace.canva.com/ympVo/MAEFC6ympVo/1/tl/canva-books-MAEFC6ympVo.jpg",
    price: 40,
  }
];

export default function CourseSlider() {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      setTimeout(() => {
        if (card) card.classList.add('visible');
      }, i * 200); // يظهر كل كارت بفاصل 200ms
    });
  }, []);

  return (
    <div className="container my-5">
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        navigation={true}
        loop={false}
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {courses.map((course, i) => (
          <SwiperSlide key={i}>
            <div
              ref={(el) => (cardsRef.current[i] = el)}
              className="card course-card h-100"
            >
              <img src={course.cover_url} className="card-img-top" alt={course.title} />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <button className="btn btn-primary btn-buy mt-auto">لمعرفة المزيد اضغط</button>
              </div>
              <div className="card-footer">
                <strong>Price: ${course.price}</strong>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}