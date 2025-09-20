"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  description: string | null;
  cover_url: string | null;
  created_at: string;
}

type ApiResponse<T> = T | { success: boolean; data: T };

export default function CategoriesGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiResponse<Category[]>>(
          "http://localhost:5000/categories"
        );
        // @ts-ignore
        setCategories(res.data.data);
      } catch (e: any) {
        setError(e?.message || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const colors = ["#77b0e4", "#f6a531"];

  return (
    <section>
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-8 mx-auto text-center">
            <h2>Choose a Categories</h2>
            <p className="mb-0">
              Perceived end knowledge certainly day sweetness why cordially
            </p>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border" role="status" />
          </div>
        ) : (
          <div className="row g-4">
            {categories.length === 0 ? (
              <div className="col-12 text-center text-muted">
                No categories to show.
              </div>
            ) : (
              categories.map((item, idx) => {
                const bg = colors[idx % colors.length];
                return (
                  <div
                    className="col-sm-6 col-md-4 col-xl-3 animate__animated animate__fadeInUp"
                    key={item.id ?? idx}
                  >
                    <div className="card card-body text-center p-4 shadow">
                      <div
                        className="mx-auto rounded-circle mb-3 d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: bg,
                          width: 60,
                          height: 60,
                        }}
                      >
                        {item.cover_url && (
                          <img
                            src={item.cover_url}
                            alt={item.name}
                            style={{ width: 40, height: 40 }}
                          />
                        )}
                      </div>
                      <h5 className="mb-2">{item.name}</h5>
                      <p className="mb-0 text-muted">15 Courses</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}
