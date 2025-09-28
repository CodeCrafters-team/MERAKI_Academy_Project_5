"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const THEME = { primary: "#77b0e4", secondary: "#f6a531" };
const API_BASE = "http://localhost:5000";

interface Course {
  id: number;
  title: string;
  description: string | null;
  cover_url: string | null;
  price: number | string | null;
  created_at: string;
  created_by: number;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

interface Lesson {
  id: number;
  module_id: number | null;
  title: string;
  description: string | null;
  video_url: string | null;
  resources: string[];
  lesson_order: number | null;
  duration_sec: number | null;
  is_free_preview: boolean;
  created_at: string;
}

interface Module {
  id: number;
  title: string;
}

export default function InstructorCoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [curriculumCourse, setCurriculumCourse] = useState<Course | null>(null);

  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newCoursePrice, setNewCoursePrice] = useState("0");
  const [newCourseCoverUrl, setNewCourseCoverUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const idStr = localStorage.getItem("userId");
    if (idStr) setUserId(Number(idStr));
    else window.location.href = "/login";

    axios
      .get(`${API_BASE}/categories`)
      .then(res => setCategories(res.data?.data || []))
      .catch(() => console.error("Failed to fetch categories"));
  }, []);

  const fetchMyCourses = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/courses`);
      const allCourses: Course[] = (res.data as any)?.data ?? res.data;
      const myCoursesFromApi = Array.isArray(allCourses)
        ? allCourses.filter(c => c.created_by === userId)
        : [];

      const storedCourses: Course[] = JSON.parse(localStorage.getItem("myCourses") || "[]");

      const mergedCourses = [
        ...myCoursesFromApi,
        ...storedCourses.filter(sc => !myCoursesFromApi.find(c => c.id === sc.id))
      ];

      setCourses(mergedCourses);
    } catch (e: any) {
      setError("Failed to load courses: " + (e.response?.status || e.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, [userId]);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const handleCreateCourse = async () => {
    if (!newCourseTitle || !newCourseDescription || !selectedCategory || !userId) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsCreating(true);
    try {
      const courseData = {
        title: newCourseTitle,
        description: newCourseDescription,
        price: Number(newCoursePrice),
        cover_url: newCourseCoverUrl || null,
        category_id: selectedCategory,
        created_by: userId,
      };

      const res = await axios.post(`${API_BASE}/courses`, courseData, { headers: authHeader() });

      const newCourse: Course = res.data?.data || { ...courseData, id: Date.now(), created_at: new Date().toISOString() };

      setCourses(prev => [newCourse, ...prev]);
      const storedCourses: Course[] = JSON.parse(localStorage.getItem("myCourses") || "[]");
      localStorage.setItem("myCourses", JSON.stringify([newCourse, ...storedCourses]));

      setIsModalOpen(false);
      setNewCourseTitle(""); setNewCourseDescription(""); setNewCoursePrice("0"); setNewCourseCoverUrl(""); setSelectedCategory(null);

      toast.success("Course created successfully!");
    } catch (e: any) {
      toast.error("Failed to create course: " + (e.response?.data?.message || e.message));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${API_BASE}/courses/${courseId}`, { headers: authHeader() });
    } catch (e: any) {
      if (e.response?.status !== 404) {
        toast.error("Failed to delete course: " + (e.response?.data?.message || e.message));
        return;
      }
    }

    const updatedCourses = courses.filter(c => c.id !== courseId);
    setCourses(updatedCourses);

    const storedCourses: Course[] = JSON.parse(localStorage.getItem("myCourses") || "[]");
    localStorage.setItem(
      "myCourses",
      JSON.stringify(storedCourses.filter(c => c.id !== courseId))
    );

    toast.success("Course deleted successfully!");
  };

  const handleUpdateCourse = async (course: Course) => {
    if (!course) return;
    setIsSaving(true);
    try {
      const courseData = {
        title: course.title,
        description: course.description,
        price: Number(course.price) || 0,
        cover_url: course.cover_url || null,
        category_id: course.category_id,
        created_by: course.created_by,
      };

      const res = await axios.put(`${API_BASE}/courses/${course.id}`, courseData, { headers: authHeader() });
      const updatedCourse: Course = res.data?.data || { ...course, ...courseData };
      setCourses(prev => prev.map(c => (c.id === updatedCourse.id ? updatedCourse : c)));
      setEditingCourse(null);
      toast.success("Course updated successfully!");
    } catch (err: any) {
      toast.error("Failed to update course: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);

  const [lessonForm, setLessonForm] = useState<Omit<Lesson, "id" | "created_at">>({
    module_id: null,
    title: "",
    description: "",
    video_url: "",
    resources: [],
    lesson_order: 1,
    duration_sec: 0,
    is_free_preview: false,
  });

  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [savingLesson, setSavingLesson] = useState(false);

const openCurriculumModal = async (course: Course) => {
  setCurriculumCourse(course);
  setLoadingCurriculum(true);

  try {
    const modulesRes = await axios.get(`${API_BASE}/modules?course_id=${course.id}`);
    setModules(modulesRes.data?.data || []); 

    const lessonsRes = await axios.get(`${API_BASE}/lessons?course_id=${course.id}`);
    setLessons(lessonsRes.data?.data || []); 
  } catch (err) {
    console.error(err);
    toast.error("Failed to load curriculum"); 
    setLessons([]); 
    setModules([]);
  } finally {
    setLoadingCurriculum(false);
  }
};


const saveLesson = async () => {
  setSavingLesson(true); 
  try {
   
    const payload = {
      ...lessonForm,
      course_id: curriculumCourse?.id || 0,
    };

    let res: any;
    if (editingLessonId) {
      res = await axios.put(`${API_BASE}/lessons/${editingLessonId}`, payload);
      setLessons(prev => prev.map(l => (l.id === editingLessonId ? res.data.data : l)));
      setEditingLessonId(null);
      toast.success("Lesson updated successfully!");
    } else {
      res = await axios.post(`${API_BASE}/lessons`, payload);
      setLessons(prev => [res.data.data, ...prev]);
      toast.success("Lesson added successfully!");
    }

    setLessonForm({
      module_id: null,
      title: "",
      description: "",
      video_url: "",
      resources: [],
      lesson_order: 1,
      duration_sec: 0,
      is_free_preview: false,
    });
  } catch (err: any) {
    console.error(err);
    toast.error("Failed to save lesson");
  } finally {
    setSavingLesson(false);
  }
};



  const editLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setLessonForm({
      module_id: lesson.module_id,
      title: lesson.title,
      description: lesson.description,
      video_url: lesson.video_url,
      resources: lesson.resources,
      lesson_order: lesson.lesson_order || 1,
      duration_sec: lesson.duration_sec || 0,
      is_free_preview: lesson.is_free_preview,
    });
  };

  const deleteLesson = async (lessonId: number) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(`${API_BASE}/lessons/${lessonId}`);
      setLessons(prev => prev.filter(l => l.id !== lessonId));
      toast.success("Lesson deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete lesson");
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">My Courses</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary border-0 shadow"
          style={{ background: THEME.secondary }}
        >
          ➕
        </button>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2 text-muted">Loading your courses...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : courses.length === 0 ? (
        <div className="alert alert-info">You haven't created any courses yet. Start by adding a new one!</div>
      ) : (
        <div className="list-group shadow-sm">
          {courses.map(course => (
            <div key={course.id} className="list-group-item d-flex justify-content-between align-items-center p-3 mb-2 rounded border">
              <div className="flex-grow-1 me-3">
                <h5 className="mb-1 fw-bold">{course.title}</h5>
                <p className="text-muted small mb-1">
                  ID: {course.id} | Price: {course.price === 0 || course.price === null ? "Free" : `$${Number(course.price)?.toFixed(2)}`}
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => setEditingCourse(course)}>Edit</button>
                <button className="btn btn-sm btn-outline-success" onClick={() => openCurriculumModal(course)} title="Manage Curriculum">➕</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

     
{isModalOpen && (
  <div
    className="modal fade show d-block"
    style={{ background: "rgba(0,0,0,.5)", zIndex: 1050 }}
    onClick={() => setIsModalOpen(false)}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
      <div className="modal-content p-4">
        <h5 className="mb-3 fw-bold mt-2">Create New Course</h5>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={selectedCategory || ""}
            onChange={e => setSelectedCategory(Number(e.target.value))}
            disabled={isCreating}
          >
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={newCourseTitle}
            onChange={e => setNewCourseTitle(e.target.value)}
            disabled={isCreating}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={3}
            value={newCourseDescription}
            onChange={e => setNewCourseDescription(e.target.value)}
            disabled={isCreating}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={newCoursePrice}
            onChange={e => setNewCoursePrice(e.target.value)}
            disabled={isCreating}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cover URL (Optional)</label>
          <input
            className="form-control"
            value={newCourseCoverUrl}
            onChange={e => setNewCourseCoverUrl(e.target.value)}
            disabled={isCreating}
          />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)} disabled={isCreating}>Cancel</button>
          <button
            className="btn btn-primary border-0"
            style={{ background: THEME.primary }}
            onClick={handleCreateCourse}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{editingCourse && (
  <div
    className="modal fade show d-block"
    style={{ background: "rgba(0,0,0,.5)", zIndex: 1050 }}
    onClick={() => setEditingCourse(null)}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
      <div className="modal-content p-4">
        <h5 className="mb-3 fw-bold mt-2">Edit Course</h5>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={editingCourse.category_id || ""}
            onChange={e => setEditingCourse({ ...editingCourse, category_id: Number(e.target.value) })}
          >
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            value={editingCourse.title}
            onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={3}
            value={editingCourse.description || ""}
            onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={editingCourse.price || 0}
            onChange={e => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cover URL</label>
          <input
            className="form-control"
            value={editingCourse.cover_url || ""}
            onChange={e => setEditingCourse({ ...editingCourse, cover_url: e.target.value })}
          />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-secondary" onClick={() => setEditingCourse(null)}>Cancel</button>
          <button
            className="btn btn-primary border-0"
            style={{ background: THEME.primary }}
            onClick={async () => {
              if (!editingCourse) return;
              setIsSaving(true);
              try {
                const courseData = {
                  title: editingCourse.title,
                  description: editingCourse.description,
                  price: Number(editingCourse.price) || 0,
                  cover_url: editingCourse.cover_url || null,
                  category_id: editingCourse.category_id,
                  created_by: editingCourse.created_by,
                };
                const res = await axios.put(
                  `${API_BASE}/courses/${editingCourse.id}`,
                  courseData,
                  { headers: authHeader() }
                );
                const updatedCourse: Course = res.data?.data || { ...editingCourse, ...courseData };
                setCourses(prev => prev.map(c => (c.id === updatedCourse.id ? updatedCourse : c)));
                setEditingCourse(null);
                toast.success("Course updated successfully!");
              } catch (err: any) {
                toast.error("Failed to update course: " + (err.response?.data?.message || err.message));
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}


{curriculumCourse && (
  <div
    className="modal fade show d-block"
    style={{ background: "rgba(0,0,0,.5)", zIndex: 1050 }}
    onClick={() => setCurriculumCourse(null)}
  >
    <div className="modal-dialog modal-dialog-centered modal-xl" onClick={e => e.stopPropagation()}>
      <div className="modal-content p-4">
        <h5 className="mb-3 fw-bold mt-2">Curriculum for {curriculumCourse.title}</h5>

      {loadingCurriculum ? (
  <div className="text-center p-3">
    <div className="spinner-border" role="status"></div>
    <p className="mt-2 text-muted">Loading curriculum...</p>
  </div>
) : (
  <>
    {lessons.length === 0 ? (
  <p className="text-muted">No lessons yet. Add a lesson below.</p>
) : (
  <div className="list-group">
    {lessons.map(lesson => (
      <div key={lesson.id} className="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>{lesson.title || "Untitled Lesson"}</strong> - Module: {modules.find(m => m.id === lesson.module_id)?.title || "-"}
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-primary" onClick={() => editLesson(lesson)}>Edit</button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteLesson(lesson.id)}>Delete</button>
        </div>
      </div>
    ))}
  </div>
)}


            <div className="border p-3 rounded mb-3">
              <h6>{editingLessonId ? "Edit Lesson" : "Add New Lesson"}</h6>
          
              <div className="mb-2">
                <label>Title</label>
                <input className="form-control" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} />
              </div>
              <div className="mb-2">
                <label>Description</label>
                <textarea className="form-control" rows={2} value={lessonForm.description || ""} onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })} />
              </div>
              <div className="mb-2">
                <label>Video URL</label>
                <input className="form-control" value={lessonForm.video_url || ""} onChange={e => setLessonForm({ ...lessonForm, video_url: e.target.value })} />
              </div>
              <div className="mb-2">
                <label>Resources (comma separated)</label>
                <input className="form-control" value={lessonForm.resources.join(",")} onChange={e => setLessonForm({ ...lessonForm, resources: e.target.value.split(",").map(r => r.trim()) })} />
              </div>
              <div className="mb-2 d-flex gap-2">
                <div className="flex-grow-1">
                  <label>Lesson Order</label>
                  <input type="number" className="form-control" value={lessonForm.lesson_order || 1} onChange={e => setLessonForm({ ...lessonForm, lesson_order: Number(e.target.value) })} />
                </div>
                <div className="flex-grow-1">
                  <label>Duration (sec)</label>
                  <input type="number" className="form-control" value={lessonForm.duration_sec || 0} onChange={e => setLessonForm({ ...lessonForm, duration_sec: Number(e.target.value) })} />
                </div>
                <div className="flex-grow-1 d-flex align-items-center mt-4">
                  <input type="checkbox" className="form-check-input me-2" checked={lessonForm.is_free_preview} onChange={e => setLessonForm({ ...lessonForm, is_free_preview: e.target.checked })} />
                  <label className="form-check-label">Free Preview</label>
                </div>
              </div>
              <div className="mt-3 d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={() => setCurriculumCourse(null)}>Close</button>
                <button className="btn btn-primary" onClick={saveLesson} disabled={savingLesson}>
                  {savingLesson ? "Saving..." : editingLessonId ? "Save Changes" : "Add Lesson"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
}
