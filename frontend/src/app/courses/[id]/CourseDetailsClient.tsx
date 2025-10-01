"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CheckoutModal from "../../components/CheckoutModal/CheckoutModal";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import LessonModal from "@/app/components/LessonModal/index";
import QuizInline from "@/app/components/Quize";

const THEME = { primary: "#77b0e4", secondary: "#f6a531" };
const API_BASE =  "http://localhost:5000";

type Course = {
  id: number;
  title: string;
  description: string | null;
  cover_url: string | null;
  price: number | null;
  is_published: boolean;
  created_by: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string | null;
  bio?: string | null;
};
type Module = { id: number; title: string };
type Lesson = { id: number; title: string; duration_sec: number | null; video_url?: string; is_free_preview?: boolean };
type Review = { id: number; user_id: number; rating: number; comment: string | null; created_at: string; first_name?: string; last_name?: string; avatar_url?: string | null };

const fmtDuration = (sec?: number | null) => {
  if (sec == null) return "";
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}m${s ? ` ${s}s` : ""}`;
};
const fmtMoney = (v: number | string | null) => {
  const n = typeof v === "string" ? Number(v) : v;
  if (n == null || Number(n) === 0 || Number.isNaN(n)) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(Number(n));
};

function Stars({ value, onChange, readOnly = false }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  return (
    <div className="animate__animated animate__fadeIn" style={{ display: "flex", gap: 4, cursor: readOnly ? "default" : "pointer" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => !readOnly && onChange?.(s)}
          className="animate__animated animate__zoomIn"
          style={{ fontSize: 20, color: s <= value ? THEME.secondary : "#ccc", lineHeight: 1 }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const ProgressBar = ({ percent }: { percent: number }) => (
  <div className="w-100" style={{ background: "#eee", borderRadius: 8 }}>
    <div
      className="animate__animated animate__fadeIn"
      style={{
        width: `${Math.min(100, Math.max(0, percent))}%`,
        background: "linear-gradient(90deg,   #f69d01 ,#4ab0ff)",
        height: 10,
        borderRadius: 8,
        transition: "width .3s",
      }}
    />
  </div>
);

export default function CourseDetailsClient({
  courseId,
  initialCourse,
  initialModules,
  initialReviews,
}: {
  courseId: string;
  initialCourse: Course;
  initialModules: Module[];
  initialReviews: Review[];
}) {
  const router = useRouter();

  const [auth, setAuth] = useState({ id: null as number | null, firstName: "", lastName: "", avatarUrl: null as string | null });
  useEffect(() => {
    try {
      const idStr = localStorage.getItem("userId");
      setAuth({
        id: idStr ? Number(idStr) : null,
        firstName: localStorage.getItem("firstName") || "",
        lastName: localStorage.getItem("lastName") || "",
        avatarUrl: localStorage.getItem("avatar"),
      });
    } catch {}
  }, []);
  const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });

  const [course] = useState<Course | null>(initialCourse || null);
  const [modules] = useState<Module[]>(initialModules || []);
  const [lessonsByModule, setLessonsByModule] = useState<Record<number, Lesson[]>>({});
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnroll, setCheckingEnroll] = useState(true);

  const [progress, setProgress] = useState({ totalLessons: 0, completedLessons: 0, progressPercent: 0 });
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const [addRating, setAddRating] = useState(5);
  const [addComment, setAddComment] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [openModuleIds, setOpenModuleIds] = useState<Set<number>>(new Set());

const [checkoutOpen, setCheckoutOpen] = useState(false);
const [loading, setLoading] = useState(false);

const [openLesson, setOpenLesson] = useState<Lesson | null>(null);

const handleOpenLesson = (lesson: Lesson) => setOpenLesson(lesson);
const handleCloseLesson = () => setOpenLesson(null);
const [issuing, setIssuing] = useState(false);
const [cert, setCert] = useState<any>(null);

useEffect(() => {
  if (!auth.id || !course?.id) return;

  axios
    .get(`${API_BASE}/certificates/user/${auth.id}`, { headers: authHeader() })
    .then((res) => {
      const list = res.data?.data || [];
      const found = list.find((c: any) => Number(c.course_id) === Number(course.id));
      setCert(found || null);
    })
    .catch(() => setCert(null));
}, [auth.id, course?.id]);

const handleIssueCertificate = async () => {
  if (!auth.id || !course?.id) {
    router.push("/login");
    return;
  }
  try {
    setIssuing(true);
    const { data } = await axios.post(
      `${API_BASE}/certificates/issue`,
      { user_id: auth.id, course_id: course.id },
      { headers: authHeader() }
    );

    const c = data?.data; 
    if (c?.certificate_no) {
      setCert(c); 
      router.push(`/certificates/${c.certificate_no}`);
    } else {
      if (cert?.certificate_no) {
        router.push(`/certificates/${cert.certificate_no}`);
      } else {
        alert(data?.message || "Certificate already exists");
      }
    }
  } catch (e:any) {
    alert(e?.response?.data?.message || "Failed to issue certificate");
  } finally {
    setIssuing(false);
  }
};

const handleMarkCompleted = async (id: number) => {
  if (!auth.id) { router.push("/login"); return; }

  try {
    await axios.post(
      `${API_BASE}/progress/complete`,
      { user_id: auth.id, lesson_id: id },
      { headers: authHeader() }
    );

    setCompleted(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    if (course?.id) {
      const { data } = await axios.get(
        `${API_BASE}/progress/course/${course.id}`,
        { headers: authHeader() }
      );
      const d = data?.data || {};
      setProgress({
        totalLessons: Number(d.totalLessons ?? d.total_lessons ?? 0),
        completedLessons: Number(d.completedLessons ?? d.completed_lessons ?? 0),
        progressPercent: Number(d.progressPercent ?? d.progress_percent ?? 0),
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    setOpenLesson(null);
  }
};

const handleEnrollFree = async () => {
  if (!auth.id || !course?.id) { 
    router.push("/login");
    return;
  }

  try {
    setLoading(true);
    await axios.post(`${API_BASE}/enrollments`, {
      user_id: auth.id,
      course_id: course.id,
    }, { headers: authHeader() });


    setIsEnrolled(true);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    modules.forEach((m) => {
      axios
        .get(`${API_BASE}/lessons/module/${m.id}`)
        .then((res) => {
          const lessons: Lesson[] = (res.data?.data || []).map((x: any) => ({
            id: Number(x.id),
            title: x.title,
            duration_sec: x.duration_sec == null ? null : Number(x.duration_sec),
            video_url: x.video_url,
            is_free_preview: !!x.is_free_preview,
          }));
          setLessonsByModule((prev) => ({ ...prev, [m.id]: lessons }));
        })
        .catch(() => {});
    });
  }, [modules]);
  useEffect(() => {
    if (!course?.id || !auth.id) {
      setCheckingEnroll(false);
      return;
    }
    axios
      .get(`${API_BASE}/enrollments/check/${course.id}`, { headers: authHeader() })
      .then((res) => setIsEnrolled(!!res.data?.enrolled))
      .catch(() => setIsEnrolled(false))
      .finally(() => setCheckingEnroll(false));
  }, [auth.id, course?.id]);

  useEffect(() => {
    if (!isEnrolled || !auth.id || !course?.id) return;
    axios
      .get(`${API_BASE}/progress/course/${course.id}`, { headers: authHeader() })
      .then((res) => {
        const d = res.data?.data || {};
        setProgress({
          totalLessons: Number(d.totalLessons ?? d.total_lessons ?? 0),
          completedLessons: Number(d.completedLessons ?? d.completed_lessons ?? 0),
          progressPercent: Number(d.progressPercent ?? d.progress_percent ?? 0),
        });
      })
      .catch(() => {});
  }, [isEnrolled, auth.id, course?.id]);

  useEffect(() => {
    if (!isEnrolled || !auth.id) return;
    const allLessons: Lesson[] = Object.values(lessonsByModule).flat();
    allLessons.forEach((l) => {
      axios
        .get(`${API_BASE}/progress/lesson/${l.id}`, { headers: authHeader() })
        .then((res) => {
          const done = !!res.data?.data?.isCompleted;
          setCompleted((prev) => {
            const next = new Set(prev);
            if (done) next.add(l.id);
            else next.delete(l.id);
            return next;
          });
        })
        .catch(() => {});
    });
  }, [isEnrolled, auth.id, lessonsByModule]);

  if (!course) return null;

  const totalLectures = Object.values(lessonsByModule).flat().length;
  const totalDuration = Object.values(lessonsByModule).flat().reduce((s, l) => s + (l.duration_sec || 0), 0);
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length : 0;

  const ensureLogin = (fn: () => void) => {
    if (!auth.id) { router.push("/login"); return false; }
    fn(); return true;
  };

  const handleAddReview = () =>
    ensureLogin(() => {
      axios
        .post(`${API_BASE}/reviews`, { course_id: course.id, user_id: auth.id, rating: addRating, comment: addComment }, { headers: authHeader() })
        .then((res) => {
          if (!res.data?.success) return;
          const d = res.data.data;
          const item: Review = {
            ...d,
            id: Number(d.id),
            user_id: Number(auth.id),
            rating: Number(d.rating),
            first_name: auth.firstName || "User",
            last_name: auth.lastName || "",
            avatar_url: auth.avatarUrl,
            created_at: d.created_at || new Date().toISOString(),
            comment: d.comment ?? addComment,
          };
          setReviews((prev) => [item, ...prev]);
          setAddRating(5);
          setAddComment("");
        })
        .catch(() => {});
    });

  const openEditModal = (r: Review) => {
    setEditId(r.id);
    setEditRating(Number(r.rating));
    setEditComment(r.comment || "");
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editId) return;
    ensureLogin(() => {
      axios
        .put(`${API_BASE}/reviews/${editId}`, { rating: editRating, comment: editComment }, { headers: authHeader() })
        .then((res) => {
          if (!res.data?.success) return;
          const d = res.data.data;
          setReviews((prev) =>
            prev.map((x) =>
              x.id === editId ? { ...x, rating: Number(d.rating ?? x.rating), comment: d.comment ?? x.comment } : x
            )
          );
          setEditOpen(false);
        })
        .catch(() => {});
    });
  };

  const handleDelete = (id: number) =>
    ensureLogin(() => {
      axios
        .delete(`${API_BASE}/reviews/${id}`, { headers: authHeader() })
        .then((res) => {
          if (res.data?.success) setReviews((prev) => prev.filter((r) => r.id !== id));
        })
        .catch(() => {});
    });

  const toggleModule = (moduleId: number) =>
    setOpenModuleIds((prev) => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });

  const startChat = (toUserId: number) =>
    axios
      .post(`${API_BASE}/conversations`, { participantIds: [toUserId] }, { headers: authHeader() })
      .then((res) => {
        const id = res.data?.data?.id ?? res.data?.conversation?.id ?? res.data?.id;
        if (!id) throw new Error("No conversation id");
        router.push(`/chat/${id}`);
      })
      .catch(() => alert("Failed to start conversation"));

  const goMessageInstructor = () => {
    if (!course?.created_by || course.created_by === auth.id) return;
    startChat(course.created_by);
  };

  return (
    <div className="container py-4 animate__animated animate__fadeIn">
      <div className="mb-3 animate__animated animate__fadeInDown">
        <h1 className="fw-bold mb-1 animate__animated animate__fadeInDown">{course.title}</h1>
        <p className="text-muted mb-2 animate__animated animate__fadeInUp">{course.description}</p>
        <div className="d-flex gap-3 align-items-center small animate__animated animate__fadeInUp">
          <div className="d-flex align-items-center gap-2">
            <Stars value={Math.round(avgRating)} readOnly />
            <span className="text-muted">
              {avgRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>
      </div>

      <div className="row g-4">
     

        <div className="col-lg-4 border animate__animated animate__fadeInUp animate__delay-1s">
          <div className="card shadow-sm mb-3 p-2 animate__animated animate__fadeInUp" style={{ marginTop: "2.55rem" }}>
            <div className="animate__animated animate__fadeIn" style={{ height: "100%", background: "#eef4fb" }}>
              {course.cover_url ? (
                <img src={course.cover_url} className="animate__animated animate__zoomIn" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Course cover" />
              ) : (
                <span className="d-flex align-items-center justify-content-center h-100 text-muted animate__animated animate__fadeIn">No cover</span>
              )}
            </div>
            <div className="card-body animate__animated animate__fadeInUp">
              {checkingEnroll ? (
                <button className="btn btn-light" disabled>Checking...</button>
              ) : isEnrolled ? (
                     <div className="d-flex flex-column gap-2">
                       <div className="d-flex align-items-center justify-content-between">
                           <strong>Progress</strong>
                           <span>{progress.progressPercent}%</span>
                                </div>
                             <ProgressBar percent={progress.progressPercent} />
                              <small className="text-muted">
                            {progress.completedLessons}/{progress.totalLessons} lessons
                               </small>

                            </div>
                      )   : (
                <>
                  <h3 style={{ color: "green" }} className="fw-bold animate__animated animate__fadeInDown">{fmtMoney(course.price)}</h3>
                  <div className="d-grid gap-2">
                 <button
                 className="btn btn-primary border-0 shadow animate__animated animate__pulse"
                  onClick={() => {
                     const price = Number(course?.price ?? 0);
                    if (price === 0) {
                     handleEnrollFree();  
                     } else {
                  setCheckoutOpen(true);
                    }
                      }}
                      >
                       {loading ? "Processing..." : (Number(course?.price ?? 0) === 0 ? "Enroll for free" : "Buy course")}
                       </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-3 animate__animated animate__fadeInUp">
            <div className="card-body d-flex align-items-center justify-content-between border">
              <div className="d-flex align-items-center gap-2 animate__animated animate__fadeIn">
                {course.avatar_url ? (
                  <img src={course.avatar_url} alt="" className="rounded-circle animate__animated animate__zoomIn" style={{ width: 40, height: 40, objectFit: "cover" }} />
                ) : (
                  <div className="rounded-circle animate__animated animate__fadeIn" style={{ width: 40, height: 40, background: "#e9ecef" }} />
                )}
                <div>
                  <div className="fw-semibold animate__animated animate__fadeInDown">{course.first_name} {course.last_name}</div>
                  <div className="small text-muted animate__animated animate__fadeInUp">Instructor</div>
                </div>
              </div>
              <button className="btn btn-primary btn-sm animate__animated animate__pulse border-0"  onClick={goMessageInstructor}>Message</button>
            </div>
          </div>

          <div className="card border shadow-sm animate__animated animate__fadeInUp mb-2 ">
            <div className="card-body">
              <h6 className="mb-2 animate__animated animate__fadeInDown">This course includes</h6>
              <ul className="list-unstyled small mb-0 animate__animated animate__fadeIn">
                <li className="animate__animated animate__fadeInUp">Lectures: {totalLectures}</li>
                <li className="animate__animated animate__fadeInUp animate__delay-1s">Duration: {fmtDuration(totalDuration)}</li>
                <li className="animate__animated animate__fadeInUp animate__delay-2s">Language: English</li>
                <li className="animate__animated animate__fadeInUp animate__delay-3s">Certificate: Yes</li>
              </ul>
            </div>
          </div>
        </div>
           <div className="col-lg-8 border animate__animated animate__fadeInUp">
          <ul className="nav nav-tabs animate__animated animate__fadeIn">
            <li className="nav-item">
              <a className="nav-link active animate__animated animate__fadeInUp" data-bs-toggle="tab" href="#overview">Overview</a>
            </li>
            <li className="nav-item">
              <a className="nav-link animate__animated animate__fadeInUp animate__delay-1s" data-bs-toggle="tab" href="#curriculum">Curriculum</a>
            </li>
            <li className="nav-item">
              <a className="nav-link animate__animated animate__fadeInUp animate__delay-2s" data-bs-toggle="tab" href="#instructor">Instructor</a>
            </li>
            <li className="nav-item">
              <a className="nav-link animate__animated animate__fadeInUp animate__delay-3s" data-bs-toggle="tab" href="#reviews">Reviews</a>
            </li>
              {progress.progressPercent >= 100 && (
                <li className="nav-item">
                  <a className="nav-link animate__animated animate__fadeInUp animate__delay-4s" data-bs-toggle="tab" href="#quiz">Quiz</a>
                </li>
              )}
          </ul>

          <div className="tab-content border border-top-0 p-3 rounded-bottom shadow-sm animate__animated animate__fadeInUp">
            <div className="tab-pane fade show active animate__animated animate__fadeIn" id="overview">
              <h5 className="mb-2 animate__animated animate__fadeInDown">About this course</h5>
              <p className="mb-0 animate__animated animate__fadeInUp">{course.description}</p>
            </div>
{progress.progressPercent >= 100 && (
  <div className="tab-pane fade" id="quiz">
    <div className="p-3">
      <h4 className="mb-3">
        Quiz #{course.id} - {course.title}
      </h4>
      <QuizInline 
        courseId={course.id.toString()} 
        onIssueCertificate={handleIssueCertificate}
        issuing={issuing}
        cert={cert}
      />
    </div>
  </div>
)}

            <div className="tab-pane fade animate__animated animate__fadeIn" id="curriculum">
              {modules.map((m, i) => {
                const lessons = lessonsByModule[m.id] || [];
                const open = openModuleIds.has(m.id);
                return (
                  <div key={m.id} className="mb-2 animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 0.05}s` as any }}>
                    <button
                      className="btn w-100 d-flex justify-content-between align-items-center text-start animate__animated animate__fadeIn"
                      type="button"
                      onClick={() => toggleModule(m.id)}
                      style={{ background: "#f8f9fa", border: "1px solid #ddd" }}
                    >
                      <span>{m.title} ({lessons.length} lessons)</span>
                    </button>

                    {open && (
                      <ul className="list-group animate__animated animate__fadeIn">
                        {lessons.map((l, j) => {
                          const canWatch = isEnrolled || !!l.is_free_preview;
                          const isDone = isEnrolled && completed.has(l.id);
                          return (
                            <li
                              key={l.id}
                              className="list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeInUp"
                              style={{ animationDelay: `${j * 0.03}s` as any }}
                            >
                              <div className="animate__animated animate__fadeInLeft">
                                <div className="fw-semibold">{l.title}</div>
                                {l.duration_sec != null && <small className="text-muted">{fmtDuration(l.duration_sec)}</small>}
                              </div>

                              <div className="d-flex align-items-center gap-2">
                                {isEnrolled && (isDone ? (
                                  <span className="badge bg-success animate__animated animate__zoomIn">Completed</span>
                                ) : (
                                  <span className="badge bg-warning text-dark animate__animated animate__fadeInRight">Not completed</span>
                                ))}

                                {canWatch ? (
                                  l.video_url ? (
                                  <button
                                   className="btn btn-sm btn-primary border-0 animate__animated animate__pulse"
                                   onClick={() => handleOpenLesson(l)}
                                    >
                                    Study
                                    </button>
                                  ) : (
                                   null
                                  )
                                ) : (
                                  <span className="badge bg-secondary animate__animated animate__fadeInRight">Locked</span>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}

              {!checkingEnroll && !isEnrolled && (
                <div className="alert alert-info mt-3 animate__animated animate__fadeIn">
                  Buy the course to unlock all lessons.
                </div>
              )}
            </div>

            <div className="tab-pane fade animate__animated animate__fadeIn" id="instructor">
              <div className="d-flex align-items-start gap-3 animate__animated animate__fadeInUp">
                {course.avatar_url ? (
                  <img src={course.avatar_url} alt="Instructor avatar" className="animate__animated animate__zoomIn" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div className="animate__animated animate__fadeIn" style={{ width: 72, height: 72, borderRadius: "50%", background: "#e9ecef" }} />
                )}
                <div className="animate__animated animate__fadeIn">
                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <strong className="fs-5 animate__animated animate__fadeInDown">{course.first_name} {course.last_name}</strong>
                    {course.email && (
                      <span className="animate__animated animate__fadeInRight" style={{ background: "#f8fbff", border: "1px solid #e7f0fb", color: "#4a6b8a", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                        {course.email}
                      </span>
                    )}
                  </div>
                  {course.bio && <p className="mt-2 mb-0 text-muted" style={{ whiteSpace: "pre-line" }}>{course.bio}</p>}
                </div>
              </div>
            </div>

            <div className="tab-pane fade animate__animated animate__fadeIn" id="reviews">
              <h5 className="mb-3 animate__animated animate__fadeInDown">Reviews</h5>

              <div className="mb-3 border rounded p-3 animate__animated animate__fadeInUp">
                {auth.id ? (
                  <>
                    <div className="mb-2"><Stars value={addRating} onChange={setAddRating} /></div>
                    <textarea className="form-control mb-2 animate__animated animate__fadeIn" value={addComment} onChange={(e) => setAddComment(e.target.value)} placeholder="Write your opinion..." rows={3} />
                  </>
                ) : (
                  <div className="text-muted mb-2 animate__animated animate__fadeIn">Log in to add a review</div>
                )}
                <button className="btn btn-primary border-0 animate__animated animate__pulse" onClick={handleAddReview}>Add Review</button>
              </div>

              {reviews.map((r, i) => (
                <div key={r.id} className="border rounded p-3 mb-2 animate__animated animate__fadeInUp" style={{ animationDelay: `${i * 0.04}s` as any }}>
                  <div className="d-flex align-items-center gap-2 mb-1 animate__animated animate__fadeIn">
                    {r.avatar_url ? (
                      <img src={r.avatar_url} className="animate__animated animate__zoomIn" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} alt="User avatar" />
                    ) : (
                      <div className="animate__animated animate__fadeIn" style={{ width: 36, height: 36, borderRadius: "50%", background: "#ccc" }} />
                    )}
                    <strong className="animate__animated animate__fadeInLeft">{(r.first_name || "") + " " + (r.last_name || "")}</strong>
                    <small className="text-muted ms-auto animate__animated animate__fadeInRight">{new Date(r.created_at).toLocaleDateString()}</small>
                  </div>

                  <Stars value={Number(r.rating)} readOnly />
                  <p className="mb-2 animate__animated animate__fadeInUp">{r.comment}</p>

                  {r.user_id === auth.id && (
                    <div className="d-flex gap-2 animate__animated animate__fadeIn">
                      <button
                        className="btn  btn-sm btn-primary animate__animated animate__pulse border 0 "
                        onClick={() => openEditModal(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger animate__animated animate__shakeX"
                        onClick={() => handleDelete(r.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="position-fixed top-0 start-0 w-100 h-100 animate__animated animate__fadeIn"
          style={{ background: "rgba(0,0,0,.4)" }}
          onClick={() => setEditOpen(false)}
        >
          <div
            className="bg-white rounded shadow p-3 animate__animated animate__zoomIn"
            style={{ width: 420, maxWidth: "90%", margin: "10% auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h6 className="mb-2 animate__animated animate__fadeInDown">Edit your review</h6>
            <div className="mb-2"><Stars value={editRating} onChange={setEditRating} /></div>
            <textarea className="form-control mb-3 animate__animated animate__fadeIn" rows={3} value={editComment} onChange={(e) => setEditComment(e.target.value)} />
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary animate__animated animate__fadeIn" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="btn btn-primary animate__animated animate__pulse border-0"  onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
         <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        userId={auth.id}
        courseId={courseId}
        cPrice={course.price}      
        apiBase="http://localhost:5000"
        paymentsPrefix="/payments"
      />
      <LessonModal
  open={!!openLesson}
  lesson={openLesson}
  onClose={handleCloseLesson}
  onMarkCompleted={handleMarkCompleted}
/>

   </div>
  );
}