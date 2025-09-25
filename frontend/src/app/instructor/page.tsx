"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const THEME = { primary: "#77b0e4", secondary: "#f6a531" };

function Stars({ value }: { value: number }) {
  return (
    <div
      className="animate__animated animate__fadeIn"
      style={{ display: "flex", gap: 4, cursor: "Default" }}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className="animate__animated animate__zoomIn"
          style={{
            fontSize: 20,
            color: s <= value ? THEME.secondary : "#ccc",
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function page() {
  const auth = useSelector((state: RootState) => state.auth);
  console.log(auth);
  return (
    <div className="bg-light min-vh-100 d-flex">
      <section className="flex-grow-1 p-4">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4 d-flex justify-content-between align-items-center">
            <div className="pe-3" style={{ maxWidth: 680 }}>
              <h1 className="h4 fw-bold mb-2">Welcome back, Issa Azeez</h1>
              <p className="text-muted mb-0">
                Lorem ipsum dolor sit amet consectetur. Condimentum viverra
                pellentesque diam at sed.
              </p>
            </div>
            <div className="position-relative">
              <div
                className="rounded-4"
                style={{
                  width: 220,
                  height: 120,
                  background:
                    "linear-gradient(220deg, #f69d01, #4ab0ff, #f69d01",
                }}
              />
              <div
                className="position-absolute top-50 start-50 translate-middle bg-white rounded-3 border shadow"
                style={{
                  width: 86,
                  height: 86,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <img
                  className="rounded-3 shadow"
                  src={`${auth.avatarUrl}`}
                  alt="avatar"
                  style={{
                    width: 82,
                    height: 82,
                  }}
                />{" "}
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
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="rounded-3 bg-danger-subtle text-danger d-inline-grid justify-content-center"
                  style={{ width: 46, height: 46 }}
                >
                  <span className="bi bi-journal-text align-self-center" />
                </div>
                <div>
                  <div className="text-muted small">Total Course</div>
                  <div className="fs-4 fw-bold">21</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="rounded-3 bg-success-subtle text-success d-inline-grid justify-content-center"
                  style={{ width: 46, height: 46 }}
                >
                  <span className="bi bi-people align-self-center " />
                </div>
                <div>
                  <div className="text-muted small">Total Students</div>
                  <div className="fs-4 fw-bold">234</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="rounded-3 bg-warning-subtle text-warning d-inline-grid justify-content-center"
                  style={{ width: 46, height: 46 }}
                >
                  <span className="bi bi-star-fill align-self-center" />
                </div>
                <div>
                  <div className="text-muted small">Av. Ratings</div>
                  <div className="fs-4 fw-bold">4.92</div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="rounded-3 bg-primary-subtle text-primary d-inline-grid justify-content-center"
                  style={{ width: 46, height: 46 }}
                >
                  <span className="bi bi-wallet2 align-self-center" />
                </div>
                <div>
                  <div className="text-muted small">Total Earnings</div>
                  <div className="fs-4 fw-bold">$5.1K</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body ">
            <h5 className="m-2">Courses Statistics</h5>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="text-muted small">
                    <th scope="col">Rank</th>
                    <th scope="col">Course Name</th>
                    <th scope="col">Students</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Earning</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      rank: "01.",
                      name: "Phython and Django Full Stack Web...",
                      students: "22",
                      rating: 4,
                      earning: "$1.3K",
                    },
                    {
                      rank: "02.",
                      name: "Phython and Django Full Stack Web...",
                      students: "172",
                      rating: 4,
                      earning: "$1.3K",
                    },
                    {
                      rank: "03.",
                      name: "Phython and Django Full Stack Web...",
                      students: "32",
                      rating: 4,
                      earning: "$1.3K",
                    },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="fw-semibold">{row.rank}</td>
                      <td>{row.name}</td>
                      <td>{row.students}</td>
                      <td>
                        <Stars value={Number(row.rating)} />
                      </td>
                      <td className="fw-semibold">{row.earning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
