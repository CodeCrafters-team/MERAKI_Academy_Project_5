"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./courseSlider.css";

interface Course {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  price: number;
}

function CourseSlider({ title, endpoint }: { title: string; endpoint: string }) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(endpoint)
      .then((res) => {
        const data =
          Array.isArray(res.data) ? res.data : (res.data && Array.isArray(res.data.data) ? res.data.data : []);
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setCourses([]);
        setLoading(false);
      });
  }, [endpoint]);

  useEffect(() => {
    if (!loading) {
      cardsRef.current.forEach((card, i) => {
        setTimeout(() => {
          if (card) card.classList.add("visible");
        }, i * 200);
      });
    }
  }, [loading]);

  return (
    <div className="container my-5">
      <h2
        className="fw-bold mb-4 text-center animate__animated animate__fadeInUp"
        style={{ color: "#77B0E4" }}
      >
        {title}
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : !Array.isArray(courses) || courses.length === 0 ? (
        <p className="text-center text-muted">No courses found.</p>
      ) : (
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
            <SwiperSlide key={course.id}>
              <div
                ref={(el) => (cardsRef.current[i] = el)}
                className="card course-card h-100 d-flex flex-column shadow-sm"
              >
                <img src={course.cover_url} className="card-img-top" alt={course.title} />
                <div className="card-body d-flex flex-column flex-grow-1">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text flex-grow-1">{course.description}</p>
                  <button className="btn btn-primary btn-buy mt-auto border-0" style={{ backgroundColor: "#77B0E4" }}>
                    لمعرفة المزيد اضغط
                  </button>
                </div>
                <div className="card-footer text-center fw-semibold" style={{ color: "#F6A531" }}>
                  Price: ${course.price}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export default function CourseSliders() {
  return (
    <>
      <CourseSlider title="Our Courses" endpoint="http://localhost:5000/courses" />
      <CourseSlider title="Trending Now" endpoint="http://localhost:5000/courses/trending" />
      <CourseSlider title="Most Selling" endpoint="http://localhost:5000/courses/most-selling" />
    </>
  );
}
