
"use client"
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "animate.css";
import axios from "axios";
import { updateProfile } from "@/redux/slices/authSlice";



function Modal({ show, onClose, children }: { show: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ background: "#0008", zIndex: 9999, position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}>
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: 400, width: "100%", zIndex: 10000 }}>
        <div className="modal-content animate__animated animate__fadeInDown" style={{ borderRadius: 12 }}>
          <button type="button" className="btn-close position-absolute end-0 mt-2 me-2" aria-label="Close" onClick={onClose} style={{ zIndex: 2 }} />
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
        width: `${Math.min(100, Math.max(0, percent))}%`,
        background: "linear-gradient(90deg,   #f69d01 ,#4ab0ff)",
        height: 10,
        borderRadius: 8,
        transition: "width .3s",
      }}
    />
  </div>
);


const API = "http://localhost:5000";

export default function ProfilePage() {
  const cardStyle = {
    borderRadius: 16,
    border: "1px solid #ECEEF3",
    background: "#fff",
  };

  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
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
  const [certificates, setCertificates] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [progress, setProgress] = useState<{[courseId: number]: number}>({});

  useEffect(() => {
    if (!user.userId) return;
    fetch(`${API}/certificates/user/${user.userId}`)
      .then(r => r.json())
      .then(res => setCertificates(Array.isArray(res.data) ? res.data : []));
    fetch(`${API}/enrollments/user/${user.userId}`)
      .then(r => r.json())
      .then(res => setCourses(Array.isArray(res.data) ? res.data : []));
  }, [user.userId]);

  useEffect(() => {
    if (!courses.length) return;
    Promise.all(
      courses.map((c: any) =>
        fetch(`${API}/progress/course/${c.course_id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
          .then(r => r.json())
          .then(res => ({ id: c.course_id, percent: res.data?.progress_percent || 0 }))
          .catch(() => ({ id: c.course_id, percent: 0 }))
      )
    ).then(arr => {
      const obj: {[courseId: number]: number} = {};
      arr.forEach(({id, percent}) => { obj[id] = percent; });
      setProgress(obj);
    });
  }, [courses, user.token]);

  return (
    <main className="min-vh-100" style={{ backgroundColor: "#f7f9fc" }}>
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
                <div className="position-relative" style={{ width: 64, height: 64 }}>
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    className="rounded-circle object-fit-cover border"
                    style={{ width: 64, height: 64, objectFit: "cover" }}
                  />
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold" style={{ fontSize: 32, lineHeight: 1.2 }}>
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
          onSubmit={async e => {
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
                { headers: { Authorization: `Bearer ${user.token}` } }
              );
              setAvatarUrl(uploadedUrl);
              dispatch(updateProfile({
                firstName: editProfileData.firstName,
                lastName: editProfileData.lastName,
                avatarUrl: uploadedUrl,
              }));
              setShowEditProfile(false);
            } catch (err) {
              setError("Failed to update profile");
            } finally {
              setSaving(false);
            }
          }}
        >
          <div className="mb-3 d-flex flex-column align-items-center gap-2">
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : (editProfileData.avatarUrl || "https://thumbs.dreamstime.com/b/icono-de-perfil-avatar-predeterminado-imagen-vectorial-usuario-medios-sociales-209162840.jpg")}
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
                onChange={e => {
                  if (!e.target.files || !e.target.files[0]) return;
                  setImageFile(e.target.files[0]);
                  setEditProfileData(data => ({ ...data, avatarUrl: URL.createObjectURL(e.target.files![0]) }));
                }}
              />
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              className="form-control"
              value={editProfileData.firstName}
              onChange={e => setEditProfileData(data => ({ ...data, firstName: e.target.value }))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              className="form-control"
              value={editProfileData.lastName}
              onChange={e => setEditProfileData(data => ({ ...data, lastName: e.target.value }))}
            />
          </div>
          <input
            type="hidden"
            value={editProfileData.email}
            readOnly
          />
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button className="btn btn-primary w-100" type="submit" disabled={saving}>
            {saving ? <span className="spinner-border spinner-border-sm" /> : "Save"}
          </button>
        </form>
      </Modal>
      <Modal show={showEditInfo} onClose={() => setShowEditInfo(false)}>
        <h5 className="mb-3">Edit Personal Info</h5>
        <form onSubmit={e => { e.preventDefault(); setShowEditInfo(false); }}>
          <div className="mb-3">
            <label className="form-label">Mobile Number</label>
            <input className="form-control" defaultValue={user.phone || ""} />
          </div>
          <div className="mb-3">
            <label className="form-label">Country</label>
            <input className="form-control" defaultValue={user.country || "Jordan"} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" defaultValue={user.email || ""} />
          </div>
          <button className="btn btn-primary w-100" type="submit">Save</button>
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
                    <span>{user.phone || "Add your mobile number"}</span>
                  </li>
                  <li className="d-flex align-items-center gap-3 py-2">
                    <i className="bi bi-geo-alt"></i>
                    <span>{user.country || "Jordan"}</span>
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
                  {certificates.length === 0 && <div className="text-muted">No certificates yet.</div>}
                  {certificates.map((cert) => (
                    <div className="col-md-6" key={cert.id}>
                      <div className="position-relative" style={{ width: 220, height: 130, background: "#77B0E4", borderRadius: 6 }}>
                        <div className="position-absolute" style={{ right: 0, top: 0, width: 84, height: 84, background: "#5DA1DD", clipPath: "polygon(0 0, 100% 0, 100% 100%)", borderTopRightRadius: 6 }} />
                        <div className="position-absolute" style={{ right: 0, top: 0, width: 94, height: 64, background: "#A9CEF2", clipPath: "polygon(0 0, 100% 0, 0 100%)", borderTopRightRadius: 6 }} />
                        <div className="position-absolute" style={{ left: 12, top: 12 }}>
                          <i className="bi bi-award text-white" style={{ fontSize: 20 }} />
                        </div>
                        <div className="position-absolute text-white" style={{ left: 12, top: 40, fontWeight: 600, fontSize: 14 }}>
                          {cert.course_title}
                        </div>
                        <div className="position-absolute" style={{ left: 12, bottom: 10 }}>
                          <span style={{ background: "#6d757d", color: "#fff", borderRadius: 999, padding: "4px 10px", fontWeight: 600, fontSize: 11 }}>
                            Verified
                          </span>
                        </div>
                        <div className="position-absolute" style={{ right: 10, bottom: 10 }}>
                          <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="badge bg-light text-dark border">View</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="shadow-sm mt-4" style={cardStyle}>
              <div className="p-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="fw-semibold mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-journal-text "></i>
                    <span>My Courses</span>
                  </h5>
                </div>
                <div className="row g-3">
                  {courses.length === 0 && <div className="text-muted">No courses enrolled.</div>}
                  {courses?.map((c) => (
                    <div className="col-md-6" key={c.course_id}>
                      <div className="border rounded p-3 h-100 d-flex flex-column gap-2">
                        {c.cover_url && (
                          <img src={c.cover_url} alt={c.course_title || c.title} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover", borderRadius: 12, maxHeight: 260 }} />
                        )}
                        <div className="fw-semibold mb-1">{c.course_title || c.title}</div>
                        <div className="small text-muted mb-2">Enrolled at: {c.enrolled_at ? new Date(c.enrolled_at).toLocaleDateString() : "-"}</div>
                        <ProgressBar percent={progress[c.course_id] || 0} />
                        <div className="small mt-1 mb-2">Progress: {progress[c.course_id] || 0}%</div>
                        <a href={`/courses/${c.course_id}`} className="btn btn-sm btn-primary mt-auto align-self-end">Go to Course</a>
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
