"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "./courseSlider.css";
import Link from "next/link";
import AnimateInView from "../AnimateInView/index";

interface Course {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  price: number;
}
const fmtMoney = (v: number | string | null) => {
  if (v == null || v === "" || v === 0) return "Free";
  const n = typeof v === "string" ? Number(v) : v;
  if (Number.isNaN(n)) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
};

export function CourseSlider({
  title,
  endpoint,
}: {
  title: string;
  endpoint: string;
}) {
  const THEME = { primary: "#77b0e4", secondary: "#f6a531" };
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(endpoint)
      .then((res) => {
        console.log("res" , res);
        const data = Array.isArray(res.data)
          ? res.data
          : res.data && Array.isArray(res.data.data)
          ? res.data.data
          : [];
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
                        <AnimateInView animation="animate__fadeInUp animate__slow">
      
    <div className="text-center">
          <h1 className="mb-5 fw-bold">Popular Courses</h1>
        </div>

                        </AnimateInView>      
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : !Array.isArray(courses) || courses.length === 0 ? (
        <p className="text-center text-muted">No courses found.</p>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y]}
          slidesPerView={4}
          spaceBetween={24}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
            {courses.map((course ,idx) => (
              <SwiperSlide
                key={idx}
                className="col-sm-6 col-md-4 col-xl-3"
              >
                            <AnimateInView animation="animate__fadeInUp  animate__slow ">
                
                <div
                  className="card h-100 border-0 shadow-sm"
                  style={{ borderRadius: 16 }}
                >
                  <div
                    style={{
                      background: THEME.primary,
                      height: 140,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {course.cover_url && (
                      <img
                        src={course.cover_url}
                        alt={course.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
,
                        }}
                      />
                    )}
                  </div>
                  <div className="card-body">
                    <h6 className="mb-1 fw-bold">{course.title}</h6>
                    <p
                      className="text-muted small mb-3"
                      style={{ minHeight: 40 }}
                    >
                      {course.description
                        ? course.description.slice(0, 40) +
                          (course.description.length > 40 ? "..." : "")
                        : "No description."}
                    </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-bold" style={{ color: "green" }}>
                        {fmtMoney(course.price)}
                      </span>

                      <Link
                        href={`/courses/${course.id}`}
                        className="btn btn-primary btn-sm border-0"
                        style={{ color: "#fff", borderRadius: 10 }}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
                            </AnimateInView>
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </div>
  );
}

// export default function CourseSliders() {
//   return (
//     <>
//       <CourseSlider title="Our Courses" endpoint="http://localhost:5000/courses" />
//       <CourseSlider title="Trending Now" endpoint="http://localhost:5000/courses/trending" />
//       <CourseSlider title="Most Selling" endpoint="http://localhost:5000/courses/most-selling" />
//     </>
//   );
// }
