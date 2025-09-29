"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import Loading from "./loading";

const THEME = { primary: "#77b0e4", secondary: "#f6a531" };

type Review = { id:number; user_id:number; rating:number; comment:string|null; created_at:string; first_name?:string; last_name?:string; avatar_url?:string|null; };
type CourseWithReviews = { course_id:number; course_title:string; cover_url:string|null; price:number|string; is_published:boolean; student_count:number; review_count:number; avg_rating:number|string; reviews:Review[]; };
type ApiResponse<T> = { success:boolean; message:string; data:T };

function Stars({ value }: { value: number }) {
  return (
    <div className="animate__animated animate__fadeIn" style={{ display: "flex", gap: 4, cursor: "Default" }}>
      {[1,2,3,4,5].map(s=>(
        <span key={s} className="animate__animated animate__zoomIn" style={{ fontSize:20, color: s<=value? THEME.secondary:"#ccc", lineHeight:1 }}>★</span>
      ))}
    </div>
  );
}
const formatNumberK = (n:number)=> n>=1000 ? (n/1000).toFixed(1)+"K" : String(n);

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithReviews[]>([]);
  const [error, setError] = useState<string|null>(null);
  const auth = useSelector((s:RootState)=>s.auth);

  useEffect(()=>{
    if(!auth.userId) return;
    setLoading(true); setError(null);
    axios.get<ApiResponse<CourseWithReviews[]>>(`http://localhost:5000/reviews/instructors/${auth.userId}`)
      .then(res=>{
        const sorted = res.data.data.sort((a,b)=> (Number(b.price)*b.student_count) - (Number(a.price)*a.student_count));
        setCourses(sorted);
      })
      .catch(err=> setError(err?.message || "Failed to fetch instructor reviews"))
      .finally(()=> setLoading(false));
  },[]);

  const totalStudents = courses.reduce((s,c)=> s + Number(c.student_count), 0);
  const avgRating = courses.length ? courses.reduce((s,c)=> s + (Number(c.avg_rating)||0),0) / courses.length : 0;
  const totalEarnings = courses.reduce((s,c)=> s + Number(c.price)*c.student_count, 0);

  if (loading) return <Loading/>;

  return (
    <>
      <div className="bg-light min-vh-100 d-flex">
        <section className="flex-grow-1 p-4 animate__animated animate__fadeIn">
          <div className="card border-0 shadow-sm mb-4 animate__animated animate__fadeInDown animate__fast">
            <div className="card-body p-4 d-flex justify-content-between align-items-center">
              <div className="pe-3" style={{ maxWidth: 680 }}>
                <h1 className="h4 fw-bold mb-2">Welcome back, Issa Azeez</h1>
                <p className="text-muted mb-0">Keep inspiring minds and growing your impact every day.</p>
              </div>
              <div className="position-relative animate__animated animate__zoomIn animate__delay-1s">
                <div className="rounded-4" style={{ width:220, height:120, background:"linear-gradient(220deg, #f69d01, #4ab0ff, #f69d01" }} />
                <div className="position-absolute top-50 start-50 translate-middle bg-white rounded-3 border shadow animate__animated animate__zoomIn animate__delay-2s" style={{ width:86, height:86, display:"grid", placeItems:"center" }}>
                  <img className="rounded-3 shadow" src={`${auth.avatarUrl}`} alt="avatar" style={{ width:82, height:82 }} />
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="h6 mb-1">Overview</h2>
              <small className="text-muted">Here’s your overview today!</small>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm animate__animated animate__fadeInUp">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="rounded-3 bg-danger-subtle text-danger d-inline-grid justify-content-center" style={{ width:46, height:46 }}>
                    <span className="bi bi-journal-text align-self-center" />
                  </div>
                  <div>
                    <div className="text-muted small">Total Course</div>
                    <div className="fs-4 fw-bold">{courses.length}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm animate__animated animate__fadeInUp animate__delay-1s">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="rounded-3 bg-primary-subtle text-primary d-inline-grid justify-content-center" style={{ width:46, height:46 }}>
                    <span className="bi bi-people align-self-center " />
                  </div>
                  <div>
                    <div className="text-muted small">Total Students</div>
                    <div className="fs-4 fw-bold">{totalStudents}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm animate__animated animate__fadeInUp animate__delay-2s">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="rounded-3 bg-warning-subtle text-warning d-inline-grid justify-content-center" style={{ width:46, height:46 }}>
                    <span className="bi bi-star-fill align-self-center" />
                  </div>
                  <div>
                    <div className="text-muted small">Av. Ratings</div>
                    <div className="fs-4 fw-bold">{avgRating.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm animate__animated animate__fadeInUp animate__delay-3s">
                <div className="card-body d-flex align-items-center gap-3">
                  <div className="rounded-3 bg-success-subtle text-success d-inline-grid justify-content-center" style={{ width:46, height:46 }}>
                    <span className="bi bi-wallet2 align-self-center" />
                  </div>
                  <div>
                    <div className="text-muted small">Total Earnings</div>
                    <div className="fs-4 fw-bold">{formatNumberK(totalEarnings)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Statistics table */}
          <div className="card border-0 shadow-sm animate__animated animate__fadeInUp animate__delay-1s">
            <div className="card-body ">
              <h5 className="m-2">Courses Statistics</h5>
              <div className="table-responsive overflow-auto" style={{ maxHeight:"48vh" }}>
                <table className="table align-middle mb-0">
                  <thead>
                    <tr className="text-muted small">
                      <th className="sticky-top bg-body">Rank</th>
                      <th className="sticky-top bg-body">Course Name</th>
                      <th className="sticky-top bg-body">Students</th>
                      <th className="sticky-top bg-body">Rating</th>
                      <th className="sticky-top bg-body">Earning</th>
                    </tr>
                  </thead>
                  <tbody className="animate__animated animate__fadeIn">
                    {courses.map((row,i)=>(
                      <tr key={i} className="animate__animated animate__fadeInUp animate__faster">
                        <td className="fw-semibold">{i+1}</td>
                        <td>{row.course_title}</td>
                        <td>{row.student_count}</td>
                        <td><Stars value={Number(row.avg_rating)} /></td>
                        <td className="fw-semibold" style={{ color:"green" }}>${(Number(row.price)*row.student_count).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
