"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { useEffect } from "react";
import CourseSliders from "./components/CourseSlider/courseSlider";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const token = useSelector((state: any) => state.auth.token);
  console.log(token);

  return (
    <>
      <section
        className="d-flex align-items-center "
        style={{
          height: "100vh",
          background:
            "url(https://i.postimg.cc/1zbJdRZd/back.png) no-repeat center center / cover",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-4 text-start animate__fadeInTopLeft animate__animated animate__slow">
              <h1 style={{ color: "#f59d01" }} className="fw-bold ">
                Online Learning
              </h1>
              <p className="lead text-dark">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                diam nonummy nibh euismod tincidunt ut laoreet dolore magna.
              </p>
              <a className="btn  btn-primary btn-lg border-0">Read More</a>
            </div>

            <div className="col-md-8  animate__fadeInTopRight animate__animated animate__slow">
              <img
              style={{ width: "90%" }}
                src="/assets/section1.svg"
                alt="Learning Illustration"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <CourseSliders/>
      </section>
    </>
  );
}
