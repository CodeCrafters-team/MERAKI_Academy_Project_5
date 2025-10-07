"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "animate.css";
import axios from "axios";
import { updateProfile } from "@/redux/slices/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Modal({
  show,
  onClose,
  children,
}: {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!show) return null;
  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{
        background: "#0008",
        zIndex: 9999,
        position: "fixed",
        inset: 0,
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: 420,
          width: "100%",
          zIndex: 10000,
        }}
      >
        <div
          className="modal-content animate__animated animate__fadeInDown"
          style={{ borderRadius: 12 }}
        >
          <button
            type="button"
            className="btn-close position-absolute end-0 mt-2 me-2"
            aria-label="Close"
            onClick={onClose}
            style={{ zIndex: 2 }}
          />
          <div className="modal-body p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

const ProgressBar = ({ percent }: { percent: number }) => (
  <div className="w-100" style={{ background: "#eee", borderRadius: 8 }}>
    <div
      className="animate__animated animate__fadeIn"
      style={{
        width: `${Math.min(100, Math.max(0, Number(percent) || 0))}%`,
        background: "linear-gradient(90deg, #f69d01 ,#4ab0ff)",
        height: 10,
        borderRadius: 8,
        transition: "width .3s",
      }}
    />
  </div>
);

const API = "http://localhost:5000";

type RootAuth = {
  userId: number | null;
  token: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  age?: number;
  role?: string;
};

export default function ProfilePage() {
  const cardStyle: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid #ECEEF3",
    background: "#fff",
  };

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth) as RootAuth;

  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [phone_number, setphone_number] = useState(user.phoneNumber || "");
  const [country, setcountry] = useState(user.country || "");
  const [age, setAge] = useState<number>(user.age ?? 0);

  const [editProfileData, setEditProfileData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    avatarUrl: user.avatarUrl || "",
    email: user.email || "",
  });

  const CLOUD_NAME = "dkgru3hra";
  const UPLOAD_PRESET = "project-4";
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditInfo, setShowEditInfo] = useState(false);

  type CertificateItem = {
    id: number;
    certificate_no: string;
    course_title?: string;
  };
  type RawCourse = {
    id?: number;
    course_id?: number;
    title?: string;
    course_title?: string;
    course?: { title?: string; cover_url?: string };
    cover_url?: string;
    enrolled_at?: string;
  };

  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [courses, setCourses] = useState<
    { course_id: number; title: string; cover_url?: string; enrolled_at?: string }[]
  >([]);
  const [progress, setProgress] = useState<Record<number, number>>({});

  const headers = user.token ? { Authorization: `Bearer ${user.token}` } : {};

  useEffect(() => {
    if (!user.userId) return;

    axios
      .get(`${API}/certificates/user/${user.userId}`, { headers })
      .then((r) => setCertificates(Array.isArray(r.data?.data) ? r.data.data : []))
      .catch(() => setCertificates([]));

    axios
      .get(`${API}/enrollments/user/${user.userId}`, { headers })
      .then((r) => {
        const raw: RawCourse[] = Array.isArray(r.data?.data) ? r.data.data : [];
        const norm = raw
          .map((c) => ({
            course_id: Number(c.course_id ?? c.id ?? 0),
            title: String(c.title ?? c.course_title ?? c.course?.title ?? "Untitled course"),
            cover_url: c.cover_url ?? c.course?.cover_url,
            enrolled_at: c.enrolled_at,
          }))
          .filter((x) => x.course_id > 0);
        setCourses(norm);
      })
      .catch(() => setCourses([]));
  }, [user.userId, user.token]);

  useEffect(() => {
    if (!courses.length || !user.token) return;
    Promise.all(
      courses.map((c) =>
        axios
          .get(`${API}/progress/course/${c.course_id}`, { headers })
          .then((r) => {
            const d = r.data?.data || {};
            const p = Number(d.progress_percent ?? d.progressPercent ?? 0);
            return { id: c.course_id, percent: isFinite(p) ? p : 0 };
          })
          .catch(() => ({ id: c.course_id, percent: 0 }))
      )
    ).then((arr) => {
      const obj: Record<number, number> = {};
      arr.forEach(({ id, percent }) => (obj[id] = percent));
      setProgress(obj);
    });
  }, [courses, user.token]);

  const avatarFallback =
    avatarUrl ||
    "https://thumbs.dreamstime.com/b/icono-de-perfil-avatar-predeterminado-imagen-vectorial-usuario-medios-sociales-209162840.jpg";

  return (
    <main className="min-vh-100" style={{ backgroundColor: "#f7f9fc" }}>
      <ToastContainer position="top-center" autoClose={1800} hideProgressBar />
      <div className="container-xxl py-5">
        <div className="row g-4 g-xl-5">
          <div className="col-12 col-lg-4">
            <div className="shadow-sm position-relative" style={cardStyle}>
              <button
                className="btn btn-sm btn-secondary position-absolute"
                style={{ top: 16, right: 16, zIndex: 2 }}
                aria-label="Edit profile"
                onClick={() => setShowEditProfile(true)}
              >
                <i className="bi bi-pencil-square"></i>
              </button>
              <div className="p-4 d-flex align-items-center gap-3">
                <img
                  src={avatarFallback}
                  alt="avatar"
                  className="rounded-circle border"
                  style={{ width: 64, height: 64, objectFit: "cover" }}
                />
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold" style={{ fontSize: 24, lineHeight: 1.2 }}>
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <div className="text-muted mt-1">{user.role || "Student"}</div>
                  {error && <div className="text-danger small mt-1">{error}</div>}
                </div>
              </div>
            </div>

            <div className="shadow-sm position-relative mt-4" style={cardStyle}>
              <button
                className="btn btn-sm btn-secondary position-absolute"
                style={{ top: 16, right: 16, zIndex: 2 }}
                aria-label="Edit info"
                onClick={() => setShowEditInfo(true)}
              >
                <i className="bi bi-pencil-square"></i>
              </button>

              <Modal show={showEditProfile} onClose={() => setShowEditProfile(false)}>
                <h5 className="mb-3">Edit Profile</h5>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSaving(true);
                    setError(null);
                    let uploadedUrl = editProfileData.avatarUrl;
                    try {
                      if (imageFile) {
                        const formData = new FormData();
                        formData.append("file", imageFile);
                        formData.append("upload_preset", UPLOAD_PRESET);
                        const res = await axios.post(
                          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                          formData
                        );
                        uploadedUrl = res.data.secure_url;
                      }
                      await axios.put(
                        `${API}/users/${user.userId}`,
                        {
                          firstName: editProfileData.firstName,
                          lastName: editProfileData.lastName,
                          avatarUrl: uploadedUrl,
                          email: editProfileData.email,
                        },
                        { headers }
                      );
                      setAvatarUrl(uploadedUrl);
                      dispatch(
                        updateProfile({
                          firstName: editProfileData.firstName,
                          lastName: editProfileData.lastName,
                          avatarUrl: uploadedUrl,
                        })
                      );
                      toast.success("Profile updated");
                      setShowEditProfile(false);
                    } catch {
                      setError("Failed to update profile");
                      toast.error("Update failed");
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  <div className="mb-3 d-flex flex-column align-items-center gap-2">
                    <img
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : editProfileData.avatarUrl || avatarFallback
                      }
                      alt="avatar preview"
                      className="rounded-circle border"
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                    <label htmlFor="avatar-upload-modal" className="btn btn-outline-secondary btn-sm mt-1">
                      <i className="bi bi-camera"></i> Choose Photo
                      <input
                        id="avatar-upload-modal"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          if (!e.target.files?.[0]) return;
                          setImageFile(e.target.files[0]);
                          setEditProfileData((d) => ({
                            ...d,
                            avatarUrl: URL.createObjectURL(e.target.files![0]),
                          }));
                        }}
                      />
                    </label>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-control"
                      value={editProfileData.firstName}
                      onChange={(e) =>
                        setEditProfileData((d) => ({ ...d, firstName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-control"
                      value={editProfileData.lastName}
                      onChange={(e) =>
                        setEditProfileData((d) => ({ ...d, lastName: e.target.value }))
                      }
                    />
                  </div>
                  <input type="hidden" value={editProfileData.email} readOnly />

                  <button className="btn btn-primary w-100" type="submit" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm" /> : "Save"}
                  </button>
                </form>
              </Modal>

              <Modal show={showEditInfo} onClose={() => setShowEditInfo(false)}>
                <h5 className="mb-3">Edit Personal Info</h5>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSaving(true);
                    setError(null);
                    try {
                      await axios.put(
                        `${API}/users/${user.userId}`,
                        {
                          phoneNumber: phone_number,
                          country: country,
                          age: age,
                          email: editProfileData.email,
                        },
                        { headers }
                      );
                      dispatch(
                        updateProfile({
                          phoneNumber: phone_number,
                          country,
                          age,
                          email: editProfileData.email,
                        })
                      );
                      toast.success("Personal info updated");
                      setShowEditInfo(false);
                    } catch {
                      setError("Failed to update profile");
                      toast.error("Update failed");
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" defaultValue={user.email || ""} readOnly />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Country</label>
                    <input
                      className="form-control"
                      value={country}
                      onChange={(e) => setcountry(String(e.target.value))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-control"
                      value={phone_number}
                      onChange={(e) => setphone_number(String(e.target.value))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                    />
                  </div>
                  <button className="btn btn-primary w-100" type="submit" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm" /> : "Save"}
                  </button>
                </form>
              </Modal>

              <div className="p-4">
                <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-person"></i>
                  <span>Personal Information</span>
                </h5>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center gap-3 py-2">
                    <i className="bi bi-envelope"></i>
                    <a href={`mailto:${user.email}`} className="text-decoration-none">
                      {user.email}
                    </a>
                  </li>
                  <li className="d-flex align-items-center gap-3 py-2 text-muted">
                    <i className="bi bi-telephone"></i>
                    <span>{user.phoneNumber || "Add your mobile number"}</span>
                  </li>
                  <li className="d-flex align-items-center gap-3 py-2">
                    <i className="bi bi-geo-alt"></i>
                    <span>{user.country || "Jordan"}</span>
                  </li>
                  <li className="d-flex align-items-center gap-3 py-2">
                    <i className="bi bi-cake"></i>
                    <span>{user.age ?? ""}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="shadow-sm" style={cardStyle}>
              <div className="p-4">
                <h5 className="fw-semibold mb-4 d-flex align-items-center gap-2">
                  <i className="bi bi-file-earmark-text"></i>
                  <span>My Certifications</span>
                </h5>

                <div className="row g-3">
                  {certificates.length === 0 && (
                    <div className="text-muted">No certificates yet.</div>
                  )}

                  {certificates.map((cert) => (
                    <div className="col-12 col-sm-6 col-lg-4" key={cert.id}>
                      <a
                        href={`/certificates/${cert.certificate_no}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ display: "block" }}
                      >
                        <div
                          className="position-relative w-100"
                          style={{
                            height: 140,
                            background: "#77B0E4",
                            borderRadius: 8,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            className="position-absolute"
                            style={{
                              right: 0,
                              top: 0,
                              width: 90,
                              height: 90,
                              background: "#5DA1DD",
                              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                            }}
                          />
                          <div
                            className="position-absolute"
                            style={{
                              right: 0,
                              top: 0,
                              width: 110,
                              height: 70,
                              background: "#A9CEF2",
                              clipPath: "polygon(0 0, 100% 0, 0 100%)",
                            }}
                          />
                          <div className="position-absolute" style={{ left: 12, top: 12 }}>
                            <i className="bi bi-award text-white" style={{ fontSize: 20 }} />
                          </div>
                          <div
                            className="position-absolute text-white"
                            style={{
                              left: 12,
                              top: 42,
                              fontWeight: 700,
                              fontSize: 14,
                              right: 12,
                              lineHeight: 1.2,
                            }}
                          >
                            {cert.course_title || "Course"}
                          </div>
                          <div className="position-absolute" style={{ left: 12, bottom: 12 }}>
                            <span
                              style={{
                                background: "#6d757d",
                                color: "#fff",
                                borderRadius: 999,
                                padding: "4px 10px",
                                fontWeight: 600,
                                fontSize: 11,
                              }}
                            >
                              Verified
                            </span>
                          </div>
                          <span
                            className="position-absolute badge bg-light text-dark border"
                            style={{ right: 10, bottom: 10 }}
                          >
                            View
                          </span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shadow-sm mt-4" style={cardStyle}>
              <div className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="fw-semibold mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-journal-text"></i>
                    <span>My Courses</span>
                  </h5>
                </div>

                <div className="row g-3">
                  {courses.length === 0 && (
                    <div className="text-muted">No courses enrolled.</div>
                  )}

                  {courses.map((c) => (
                    <div className="col-6" key={c.course_id}>
                      <div className="d-flex flex-column gap-2 border rounded p-3">
                        {c.cover_url && (
                          <img
                            src={c.cover_url}
                            alt={c.title}
                            style={{
                              width: "100%",
                              aspectRatio: "16/9",
                              objectFit: "cover",
                              borderRadius: 12,
                              maxHeight: 260,
                            }}
                          />
                        )}
                        <span className="fw-semibold">{c.title}</span>
                        <ProgressBar percent={progress[c.course_id] || 0} />
                        <div className="small">Progress: {progress[c.course_id] || 0}%</div>
                        <a
                          href={`/courses/${c.course_id}`}
                          className="btn btn-sm btn-primary align-self-end mt-1 border-0"
                        >
                          Go to Course
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
