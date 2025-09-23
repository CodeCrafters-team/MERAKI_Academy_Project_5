"use client";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import "animate.css/animate.min.css";

const THEME = { primary: "#77b0e4", secondary: "#f6a531" };

const API_BASE = "http://localhost:5000";

interface Category {
  id: number;
  name: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
}
interface Course {
  id: number;               
  category_id: number;
  title: string;
  description: string | null;
  cover_url: string | null;
  price: number | null;     
  is_published?: boolean;
  avatar_url?: string | null;
  first_name: string;
  last_name: string | null;
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
export default function CategoryPage() {
  const { id } = useParams() as { id?: string };
  const pathname = usePathname();

  const rawId = id ?? "all";
  const isAll = rawId === "all";
  const activeCategoryId = isAll ? null : Number(rawId);

  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [catsError, setCatsError] = useState<string | null>(null);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCats(true);
        setCatsError(null);
        const res = await axios.get<{ success?: boolean; data?: Category[] }>(
          `${API_BASE}/categories`
        );
        const data = (res.data as any)?.data ?? res.data;
        if (!mounted) return;
        setCategories(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        setCatsError(e?.message || "Failed to load categories");
      } finally {
        if (mounted) setLoadingCats(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCourses(true);
        setCoursesError(null);

        const url = isAll
          ? `${API_BASE}/courses`
          : `${API_BASE}/courses/categories/${activeCategoryId}`;

        const res = await axios.get<{ success?: boolean; data?: Course[] }>(url);
        const raw = (res.data as any)?.data ?? res.data;

        const data: Course[] = (Array.isArray(raw) ? raw : []).map((c: any) => ({
          id: Number(c.id), 
          category_id: Number(c.category_id),
          title: String(c.title ?? ""),
          description: c.description ?? null,
          cover_url: c.cover_url ?? null,
          price:
            c.price === null || c.price === undefined
              ? null
              : Number(c.price),
          is_published: Boolean(c.is_published),
          avatar_url: c.avatar_url ?? null,
          first_name: c.first_name ?? "",
          last_name: c.last_name ?? null,
        }));

        if (!mounted) return;
        setCourses(data);
      } catch (e: any) {
        if (!mounted) return;
        setCourses([]);
        setCoursesError(e?.message || "Failed to load courses");
      } finally {
        if (mounted) setLoadingCourses(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isAll, activeCategoryId]);

  const filtered = useMemo(() => courses, [courses]);

  const isAllActive =
    pathname === "/categories/all" || pathname === "/categories";
  const isCatActive = (cid: number) => pathname === `/categories/${cid}`;

  return (
    <div
      className="container-fluid "
      style={{ minHeight: "100vh", background: "#f8f9fb" }}
    >
      <section className="bg-light position-relative">
        <figure className="position-absolute bottom-0 start-0 d-none d-lg-block">
          <svg width="822.2px" height="301.9px" viewBox="0 0 822.2 301.9">
            <path
              className="fill-warning opacity-5"
              d="M752.5,51.9c-4.5,3.9-8.9,7.8-13.4,11.8c-51.5,45.3-104.8,92.2-171.7,101.4c-39.9,5.5-80.2-3.4-119.2-12.1 c-32.3-7.2-65.6-14.6-98.9-13.9c-66.5,1.3-128.9,35.2-175.7,64.6c-11.9,7.5-23.9,15.3-35.5,22.8c-40.5,26.4-82.5,53.8-128.4,70.7 c-2.1,0.8-4.2,1.5-6.2,2.2L0,301.9c3.3-1.1,6.7-2.3,10.2-3.5c46.1-17,88.1-44.4,128.7-70.9c11.6-7.6,23.6-15.4,35.4-22.8 c46.7-29.3,108.9-63.1,175.1-64.4c33.1-0.6,66.4,6.8,98.6,13.9c39.1,8.7,79.6,17.7,119.7,12.1C634.8,157,688.3,110,740,64.6 c4.5-3.9,9-7.9,13.4-11.8C773.8,35,797,16.4,822.2,1l-0.7-1C796.2,15.4,773,34,752.5,51.9z"
            ></path>
          </svg>
        </figure>

        <div className="container position-relative">
          <div className="row">
            <div className="col-12">
              <div className="row align-items-center">
                <div className="col-6 col-md-3 text-center order-1">
                  <img src="/assets/cate2.svg" alt="" />
                </div>
                <div className="col-md-6 px-md-5 text-center position-relative order-md-2 mb-5 mb-md-0">
                  <h1 className="mb-3 ">What do you want to learn?</h1>
                  <p className="mb-3 ">
                    Grow your skill with the most reliable online courses and
                    certifications
                  </p>
                </div>
                <div className="col-6 col-md-3 text-center order-3 ">
                  <img src="/assets/cate1.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="row border shadow mt-2 rounded">
        <aside
          className="col-12 col-md-3 col-lg-2 border-end"
          style={{ background: "white" }}
        >
          <div className="p-3 position-sticky" style={{ top: 0 }}>
            <h6
              className="text-uppercase text-muted mb-3"
              style={{ letterSpacing: 1 }}
            >
              Categories
            </h6>

            {loadingCats ? (
              <div className="d-flex align-items-center gap-2 text-muted">
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-label="Loading categories"
                />
                <span>Loading…</span>
              </div>
            ) : catsError ? (
              <div className="alert alert-danger py-2 px-3">{catsError}</div>
            ) : (
              <div className="list-group">
                <Link
                  href="/categories/all"
                  className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                  style={{
                    border: "none",
                    marginBottom: 8,
                    borderRadius: 12,
                    background: isAllActive ? THEME.secondary : "#f5f7fb",
                    color: isAllActive ? "#fff" : "#2b2f36",
                    boxShadow: isAllActive
                      ? "0 6px 18px rgba(246,165,49,0.35)"
                      : "0 2px 8px rgba(17,24,39,0.04)",
                    transition: "all .2s ease",
                  }}
                >
                  <span className="fw-medium">All Courses</span>
                  {isAllActive && (
                    <span
                      className="badge"
                      style={{ background: "#fff", color: THEME.secondary }}
                    >
                      Active
                    </span>
                  )}
                </Link>
                {categories.length === 0 ? (
                  <div className="text-muted">No categories.</div>
                ) : (
                  categories.map((cat) => {
                    const active = isCatActive(cat.id);
                    return (
                      <Link
                        key={cat.id}
                        href={`/categories/${cat.id}`}
                        className="list-group-item list-group-item-action d-flex align-items-center justify-content-between"
                        style={{
                          border: "none",
                          marginBottom: 8,
                          borderRadius: 12,
                          background: active ? THEME.secondary : "#f5f7fb",
                          color: active ? "#fff" : "#2b2f36",
                          boxShadow: active
                            ? "0 6px 18px rgba(246,165,49,0.35)"
                            : "0 2px 8px rgba(17,24,39,0.04)",
                        }}
                      >
                        <span className="fw-medium">{cat.name}</span>
                        {active && (
                          <span
                            className="badge"
                            style={{
                              background: "#fff",
                              color: THEME.secondary,
                            }}
                          >
                            Active
                          </span>
                        )}
                      </Link>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </aside>

        <main className="col-12 col-md-9 col-lg-10">
          <div className="container py-4">
            {loadingCourses ? (
              <div className="d-flex align-items-center gap-2 text-muted">
                <div
                  className="spinner-border"
                  role="status"
                  aria-label="Loading courses"
                />
                <span>Loading courses…</span>
              </div>
            ) : coursesError ? (
              <div className="alert alert-danger">{coursesError}</div>
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h4 className="mb-0">
                    {isAll
                      ? "All Courses"
                      : categories.find((c) => c.id === activeCategoryId)
                          ?.name || "Category"}
                  </h4>
                  <span className="text-muted">
                    {filtered.length} course{filtered.length === 1 ? "" : "s"}
                  </span>
                </div>

                {filtered.length === 0 ? (
                  <div className="text-muted">
                    No courses {isAll ? "" : "for this category"}.
                  </div>
                ) : (
                  <div className="row g-4 animate__animated animate__fadeInUp">
                    {filtered.map((course) => (
                      <div key={course.id} className="col-sm-6 col-md-4 col-xl-3">
                        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 16 }}>
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
                                  objectFit: "cover",
                                  mixBlendMode: "multiply",
                                }}
                              />
                            )}
                          </div>
                          <div className="card-body">
                            <h6 className="mb-1 fw-bold">{course.title}</h6>
                            <p className="text-muted small mb-3" style={{ minHeight: 40 }}>
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
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
