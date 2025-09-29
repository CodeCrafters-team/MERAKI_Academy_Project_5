"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/app/instructor/loading";
import Unauthorized from "@/app/unauthorized";

const API_BASE = "http://localhost:5000";
const CLOUDINARY = { cloudName: "dkgru3hra", uploadPreset: "project-4" };

type Api<T> = { success: boolean; message: string; data: T };
type Course = {
  id: number; title: string; description: string | null; cover_url: string | null;
  price: number | string | null; is_published: boolean; created_by: number; category_id?: number | null;
};
type Category = { id: number; name: string };
type ModuleT = { id: number; course_id?: number; title: string; created_at?: string };
type LessonT = {
  id: number; module_id: number; title: string; description: string | null;
  video_url: string | null; resources: string[]; lesson_order: number | null;
  duration_sec: number | null; is_free_preview: boolean;
};

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("token") || ""}` });
const money = (v: number | string | null) => {
  const n = typeof v === "string" ? Number(v) : v;
  if (!n || Number(n) === 0 || Number.isNaN(n)) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n));
};
async function uploadImageToCloudinary(file: File) {
  const f = new FormData(); f.append("file", file); f.append("upload_preset", CLOUDINARY.uploadPreset);
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/image/upload`;
  const r = await fetch(url, { method: "POST", body: f }); const d = await r.json();
  if (!r.ok) throw new Error(d?.error?.message || "Upload failed"); return d.secure_url as string;
}
async function uploadVideoToCloudinary(file: File) {
  const f = new FormData(); f.append("file", file); f.append("upload_preset", CLOUDINARY.uploadPreset);
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/video/upload`;
  const r = await fetch(url, { method: "POST", body: f }); const d = await r.json();
  if (!r.ok) throw new Error(d?.error?.message || "Upload failed"); return d.secure_url as string;
}

function Modal({
  open, title, onClose, footer, children, size = "md",
}: {
  open: boolean; title: string; onClose: () => void; footer?: React.ReactNode; children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  if (!open) return null;
  const width =
    size === "sm" ? "min(520px,95vw)" :
    size === "lg" ? "min(960px,95vw)" : "min(760px,95vw)";
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,.45)", zIndex: 1050, padding: 24 }}
      onClick={onClose}
    >
      <div
        className="card shadow-lg border-0"
        style={{ width, maxHeight: "90vh", animation: "zoomIn .18s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header bg-body d-flex align-items-center">
          <h6 className="m-0">{title}</h6>
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>{children}</div>
        {footer && <div className="card-footer d-flex justify-content-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const courseId = Number(params?.id);

  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [course, setCourse] = useState<Course | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [cover, setCover] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [isPublished, setIsPublished] = useState(false);

  const [modules, setModules] = useState<ModuleT[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [lessonsByModule, setLessonsByModule] = useState<Record<number, LessonT[]>>({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmAction, setConfirmAction] = useState<null | (() => Promise<void> | void)>(null);

  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleT | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");

  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const emptyLessonForm = {
    module_id: 0, title: "", description: "", video_url: "",
    lesson_order: 1, duration_sec: 0, is_free_preview: false,
  };
  const [lessonForm, setLessonForm] = useState({ ...emptyLessonForm });
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonSaving, setLessonSaving] = useState(false);

  useEffect(() => {
    const idStr = localStorage.getItem("userId");
    if (!idStr) { router.replace("/login"); return; }
    setUserId(Number(idStr));

    axios.get<Api<Category[]>>(`${API_BASE}/categories`)
      .then(r => setCategories(r.data?.data || []))
      .catch(()=>{});

    setLoading(true);
    axios.get<Api<Course>>(`${API_BASE}/courses/${courseId}`)
      .then(r => {
        const c = r.data?.data; setCourse(c);
        setTitle(c.title || ""); setDescription(c.description || "");
        setPrice(Number(c.price) || 0); setCover(c.cover_url || "");
        setCategoryId(c.category_id ?? ""); setIsPublished(!!c.is_published);
      })
      .catch(() => toast.error("Failed to load course"))
      .finally(() => setLoading(false));
  }, [courseId, router]);

  useEffect(() => {
    if (!course || userId == null) return;
    if (Number(course.created_by) !== Number(userId)) {
      toast.error("You are not allowed to edit this course.");
      router.replace(`/courses/${course.id}`);
    } else {
      fetchModules(course.id);
    }
  }, [course, userId]);

  const fetchModules = async (cId: number) => {
    try {
      const r = await axios.get<{ success: boolean; modules: ModuleT[] }>(`${API_BASE}/modules/${cId}`);
      setModules(r.data?.modules || []);
    } catch { toast.error("Failed to load modules"); }
  };
  const fetchLessons = async (moduleId: number) => {
    try {
      const r = await axios.get<Api<LessonT[]>>(`${API_BASE}/lessons/module/${moduleId}`);
      setLessonsByModule(prev => ({ ...prev, [moduleId]: r.data?.data || [] }));
    } catch { toast.error("No lessons yet"); }
  };

  const handlePickCover = async (file?: File) => {
    if (!file) return; setSaving(true);
    try { const url = await uploadImageToCloudinary(file); setCover(url); toast.success("Cover uploaded"); }
    catch (e: any) { toast.error(e?.message || "Upload failed"); }
    finally { setSaving(false); }
  };
  const handleSaveCourse = async () => {
    if (!course) return; if (!title.trim()) return toast.error("Title is required");
    setSaving(true);
    try {
      const payload = {
        title: title.trim(), description: description?.trim() || null, price: Number(price) || 0,
        cover_url: cover || null, category_id: categoryId === "" ? null : Number(categoryId), is_published: !!isPublished,
      };
      const r = await axios.put<Api<Course>>(`${API_BASE}/courses/${course.id}`, payload, { headers: authHeader() });
      setCourse(r.data?.data || { ...course, ...payload });
      toast.success("Course saved");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) { toast.error(e?.response?.data?.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const openConfirm = (title: string, message: string, onConfirm: () => Promise<void> | void) => {
    setConfirmTitle(title); setConfirmMsg(message); setConfirmAction(() => onConfirm); setConfirmOpen(true);
  };
  const doConfirm = async () => {
    if (!confirmAction) return;
    setConfirmBusy(true);
    try { await confirmAction(); setConfirmOpen(false); }
    finally { setConfirmBusy(false); }
  };

  const openAddModule = () => { setEditingModule(null); setModuleTitle(""); setModuleModalOpen(true); };
  const openEditModule = (m: ModuleT) => { setEditingModule(m); setModuleTitle(m.title); setModuleModalOpen(true); };

  const saveModule = async () => {
    if (!course) return;
    if (!moduleTitle.trim()) { toast.error("Module title is required"); return; }
    try {
      if (editingModule) {
        await axios.put(`${API_BASE}/modules/${editingModule.id}`, { title: moduleTitle.trim() }, { headers: authHeader() });
        setModules(prev => prev.map(x => x.id === editingModule.id ? { ...x, title: moduleTitle.trim() } : x));
        toast.success("Module updated");
      } else {
        await axios.post(`${API_BASE}/modules`, { courseId: course.id, title: moduleTitle.trim() }, { headers: authHeader() });
        toast.success("Module added");
        fetchModules(course.id);
      }
      setModuleModalOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save module failed");
    }
  };

  const askDeleteModule = (m: ModuleT) => {
    if (!course) return;
    openConfirm(
      "Delete module",
      `Are you sure you want to delete "${m.title}"? This cannot be undone.`,
      async () => {
        await axios.delete(`${API_BASE}/modules/${m.id}`, { headers: authHeader() });
        toast.success("Module deleted");
        fetchModules(course.id);
      }
    );
  };

  const toggleExpand = async (moduleId: number) => {
    const isOpen = expanded.includes(moduleId);
    if (isOpen) setExpanded(expanded.filter(id => id !== moduleId));
    else { setExpanded([...expanded, moduleId]); if (!lessonsByModule[moduleId]) await fetchLessons(moduleId); }
  };

  const openAddLesson = (moduleId: number) => {
    setEditingLessonId(null);
    setLessonForm({ ...emptyLessonForm, module_id: moduleId });
    setLessonModalOpen(true);
  };
  const openEditLesson = (l: LessonT) => {
    setEditingLessonId(l.id);
    setLessonForm({
      module_id: l.module_id, title: l.title, description: l.description || "",
      video_url: l.video_url || "", lesson_order: l.lesson_order || 1,
      duration_sec: l.duration_sec || 0, is_free_preview: !!l.is_free_preview,
    });
    setLessonModalOpen(true);
  };

  const pickLessonVideo = async (file?: File) => {
    if (!file) return; setLessonSaving(true);
    try { const url = await uploadVideoToCloudinary(file); setLessonForm(f => ({ ...f, video_url: url })); toast.success("Video uploaded"); }
    catch (e: any) { toast.error(e?.message || "Upload failed"); }
    finally { setLessonSaving(false); }
  };

  const saveLesson = async () => {
    if (!lessonForm.module_id || !lessonForm.title.trim()) { toast.error("Lesson title & module are required"); return; }
    setLessonSaving(true);
    try {
      const payload = {
        module_id: lessonForm.module_id,
        title: lessonForm.title.trim(),
        description: lessonForm.description || null,
        video_url: lessonForm.video_url || null,
        lesson_order: Number(lessonForm.lesson_order) || null,
        duration_sec: Number(lessonForm.duration_sec) || null,
        is_free_preview: !!lessonForm.is_free_preview,
      };
      if (editingLessonId) {
        await axios.put(`${API_BASE}/lessons/${editingLessonId}`, payload, { headers: authHeader() });
        setLessonsByModule(prev => ({
          ...prev,
          [payload.module_id!]: (prev[payload.module_id!] || []).map(x => x.id === editingLessonId ? { ...x, ...payload, id: editingLessonId } as any : x),
        }));
        toast.success("Lesson updated");
      } else {
        const r = await axios.post(`${API_BASE}/lessons`, payload, { headers: authHeader() });
        const created: LessonT = r.data?.data;
        setLessonsByModule(prev => ({ ...prev, [payload.module_id!]: [created, ...(prev[payload.module_id!] || [])] }));
        toast.success("Lesson added");
      }
      setLessonModalOpen(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save lesson failed");
    } finally {
      setLessonSaving(false);
    }
  };

  const askDeleteLesson = (moduleId: number, lesson: LessonT) => {
    openConfirm(
      "Delete lesson",
      `Delete lesson "${lesson.title}"?`,
      async () => {
        await axios.delete(`${API_BASE}/lessons/${lesson.id}`, { headers: authHeader() });
        setLessonsByModule(prev => ({ ...prev, [moduleId]: (prev[moduleId] || []).filter(l => l.id !== lesson.id) }));
        toast.success("Lesson deleted");
      }
    );
  };

  const askDeleteCourse = () => {
    if (!course) return;
    openConfirm(
      "Delete course",
      `Delete course "${course.title}" and all of its content? This cannot be undone.`,
      async () => {
        setDeleting(true);
        try {
          await axios.delete(`${API_BASE}/courses/${course.id}`, { headers: authHeader() });
          toast.success("Course deleted");
          router.push("/instructor");
        } finally { setDeleting(false); }
      }
    );
  };

  if (loading || !course) {
    return <Loading />;
  }

  if (!course || (userId != null && Number(course.created_by) !== Number(userId))) {
    return <Unauthorized/>
}

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />

      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-4">
        <div>
          <div className="text-muted small">Course #{course.id}</div>
          <h1 className="h4 fw-bold m-0">Edit: {title || course.title}</h1>
        </div>
        <div className="d-flex gap-2">
          <a className="btn btn-secondary border-0" href={`/courses/${course.id}`}>
            <i className="bi bi-eye me-1"/> Preview
          </a>
          <button className="btn btn-primary border-0" onClick={handleSaveCourse} disabled={saving}>
            <i className="bi bi-check2-circle me-1"/>{saving ? "Saving..." : "Save changes"}
          </button>
          <button className="btn btn-danger border-0" onClick={askDeleteCourse} disabled={deleting}>
            <i className="bi bi-trash me-1"/>{deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border shadow-sm">
            <div className="card-header bg-body fw-semibold">Basics</div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Course title" />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={2} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe the course" />
              </div>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">Price</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input type="number" min={0} step="0.5" className="form-control" value={Number(price)} onChange={e=>setPrice(Number(e.target.value))} />
                  </div>
                  <small className="text-muted">Current: {money(price)}</small>
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={categoryId} onChange={e=>setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}>
                    <option value="">Select category</option>
                    {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-check form-switch mt-3">
                <input id="pub" className="form-check-input" type="checkbox" checked={isPublished} onChange={e=>setIsPublished(e.target.checked)} />
                <label htmlFor="pub" className="form-check-label">Publish now</label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border shadow-sm mb-3">
            <div className="card-header bg-body fw-semibold">Cover</div>
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <img src={cover || "https://via.placeholder.com/220x140?text=Cover"} alt="cover" className="rounded border" style={{ width:220, height:140, objectFit:"cover" }} />
                <div className="w-100">
                  <label className="form-label small">Upload</label>
                  <input type="file" accept="image/*" className="form-control" onChange={e=>handlePickCover(e.target.files?.[0])} disabled={saving} />
                </div>
              </div>
            </div>
          </div>

          <div className="card border shadow-sm">
            <div className="card-header bg-body fw-semibold">Quick Preview</div>
            <div className="card-body">
              <div className="fw-semibold mb-1">{title || "Untitled"}</div>
              <div className="text-muted small mb-2">{(description || "").slice(0,120) || "No description"}</div>
              <span className="badge text-bg-success">{money(price)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card border shadow-sm mt-4">
        <div className="card-header bg-body d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <strong>Curriculum</strong>
          <div className="d-flex gap-2">
            <button className="btn btn-primary border-0 btn-sm" onClick={openAddModule}>
              <i className="bi bi-plus-lg me-1"/>Add Module
            </button>
          </div>
        </div>

        <div className="card-body">
          {modules.length === 0 ? (
            <div className="text-muted">No modules yet. Start by adding one.</div>
          ) : (
            <div className="accordion" id="modules-acc">
              {modules.map((m) => {
                const open = expanded.includes(m.id);
                const lessons = lessonsByModule[m.id] || [];
                return (
                  <div key={m.id} className="accordion-item mb-2 border rounded">
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${open ? "" : "collapsed"}`}
                        type="button"
                        onClick={()=>toggleExpand(m.id)}
                      >
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-semibold">{m.title}</span>
                            <span className="badge text-bg-secondary">{lessons.length} lessons</span>
                          </div>
                          <div className="d-flex gap-2 " style={{ marginRight: 16 }}>
                            <button className="btn btn-sm btn-secondary" onClick={(e)=>{e.stopPropagation(); openEditModule(m);}}>
                              <i className="bi bi-pencil-square"/>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={(e)=>{e.stopPropagation(); askDeleteModule(m);}}>
                              <i className="bi bi-trash"/>
                            </button>
                            <button className="btn btn-sm btn-primary border-0" onClick={(e)=>{e.stopPropagation(); openAddLesson(m.id);}}>
                              <i className="bi bi-plus-lg"/> Lesson
                            </button>
                          </div>
                        </div>
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${open ? "show" : ""}`}>
                      <div className="accordion-body">
                        {lessons.length === 0 ? (
                          <div className="alert alert-light border small mb-0">No lessons yet.</div>
                        ) : (
                          <ul className="list-group list-group-flush">
                            {lessons.map(l => (
                              <li key={l.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="me-2">
                                  <div className="fw-semibold">{l.title}</div>
                                  <small className="text-muted">
                                    Order: {l.lesson_order ?? "-"} • Duration: {l.duration_sec ?? 0}s • {l.is_free_preview ? "Preview" : "Locked"}
                                  </small>
                                </div>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-sm btn-secondary" onClick={()=>openEditLesson(l)}>
                                    <i className="bi bi-pencil-square "/>    
                                  </button>
                                  <button className="btn btn-sm btn-danger" onClick={()=>askDeleteLesson(m.id, l)}>
                                    <i className="bi bi-trash "/>
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>


      <Modal
        open={confirmOpen}
        title={confirmTitle || "Confirm"}
        onClose={()=>!confirmBusy && setConfirmOpen(false)}
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" disabled={confirmBusy} onClick={()=>setConfirmOpen(false)}>Cancel</button>
            <button className="btn btn-danger" disabled={confirmBusy} onClick={doConfirm}>
              {confirmBusy ? "Working..." : "Confirm"}
            </button>
          </>
        }
      >
        <p className="mb-0">{confirmMsg}</p>
      </Modal>

      <Modal
        open={moduleModalOpen}
        title={editingModule ? "Edit Module" : "Add Module"}
        onClose={()=>setModuleModalOpen(false)}
        size="sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={()=>setModuleModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary border-0" onClick={saveModule}>
              <i className="bi bi-save2 me-1"/>{editingModule ? "Save" : "Add"}
            </button>
          </>
        }
      >
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input className="form-control" value={moduleTitle} onChange={e=>setModuleTitle(e.target.value)} placeholder="Module title" />
        </div>
      </Modal>

      <Modal
        open={lessonModalOpen}
        title={editingLessonId ? "Edit Lesson" : "Add Lesson"}
        onClose={()=>setLessonModalOpen(false)}
        size="md"
        footer={
          <>
            <button className="btn btn-secondary" onClick={()=>setLessonModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary border-0" onClick={saveLesson} disabled={lessonSaving}>
              <i className="bi bi-save2 me-1"/>{lessonSaving ? "Saving..." : (editingLessonId ? "Save" : "Add")}
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input className="form-control" value={lessonForm.title} onChange={e=>setLessonForm(f=>({...f, title:e.target.value}))} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Order</label>
            <input type="number" className="form-control" value={Number(lessonForm.lesson_order || 1)} onChange={e=>setLessonForm(f=>({...f, lesson_order:Number(e.target.value)}))} />
          </div>
         
          <div className="col-md-8">
            <label className="form-label">Video URL</label>
            <input className="form-control" value={lessonForm.video_url || ""} onChange={e=>setLessonForm(f=>({...f, video_url:e.target.value}))} />
          </div>
          <div className="col-md-4">
            <label className="form-label d-block">Upload video</label>
            <input type="file" accept="video/*" className="form-control" onChange={e=>pickLessonVideo(e.target.files?.[0])} disabled={lessonSaving} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Duration (sec)</label>
            <input type="number" className="form-control" value={Number(lessonForm.duration_sec || 0)} onChange={e=>setLessonForm(f=>({...f, duration_sec:Number(e.target.value)}))} />
          </div>
          <div className="col-md-6 d-flex align-items-end">
            <div className="form-check">
              <input id="freeprev" className="form-check-input" type="checkbox" checked={!!lessonForm.is_free_preview} onChange={e=>setLessonForm(f=>({...f, is_free_preview:e.target.checked}))} />
              <label htmlFor="freeprev" className="form-check-label">Free preview</label>
            </div>
          </div>
        </div>
        <div className="mt-3 small text-muted">
          Module ID: <span className="badge text-bg-secondary">{lessonForm.module_id}</span>
        </div>
      </Modal>
    </div>
  );
}
