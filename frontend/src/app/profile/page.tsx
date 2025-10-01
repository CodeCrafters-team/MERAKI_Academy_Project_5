
"use client";

export default function ProfilePage() {
  const cardStyle = {
    borderRadius: 16,
    border: "1px solid #ECEEF3",
    background: "#fff",
  };


  return (
    <main className="min-vh-100" style={{ backgroundColor: "#f7f9fc" }}>
      <div className="container-xxl py-5">
        <div className="row g-4 g-xl-5">
      
          <div className="col-12 col-lg-4">
           
            <div className="shadow-sm position-relative" style={cardStyle}>
              <button
                className="btn btn-sm btn-secondary position-absolute"
                style={{ top: 16, right: 16 }}
                aria-label="Edit personal info"
              >
                <i className="bi bi-pencil-square"></i>
              </button>
              <div className="p-4 d-flex align-items-center gap-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 64,
                    height: 64,
                    background: "#f0f2f7",
                    border: "1px solid #E3E7EE",
                  }}
                >
                  <span className="fw-bold fs-4 text-secondary">H</span>
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="fw-semibold"
                      style={{ fontSize: 32, lineHeight: 1.2 }}
                    >
                      Issa Azeez
                    </span>
               
                  </div>
                  <div className="text-muted mt-1">Student</div>
                </div>
              </div>
            </div>
            <div className="shadow-sm position-relative mt-4" style={cardStyle}>
              <button
                className="btn btn-sm btn-secondary position-absolute"
                style={{ top: 16, right: 16 }}
                aria-label="Edit personal info"
              >
                <i className="bi bi-pencil-square"></i>
              </button>
              <div className="p-4">
                <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-person"></i>
                  <span>Personal Information</span>
                </h5>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center gap-3 py-2">
                    <i className="bi bi-envelope"></i>
                    <a
                      href="mailto:issa.abumsameh@gmail.com"
                      className="text-decoration-none"
                    >
                      issa.abumsameh@gmail.com
                    </a>
                  </li>
                  <li className="d-flex align-items-center gap-3 py-2 text-muted">
                    <i className="bi bi-telephone"></i>
                    <span>Add your mobile number</span>
                  </li>
                  <li className="d-flex align-items-center gap-3 py-2">
                    <i className="bi bi-geo-alt"></i>
                    <span>Jordan</span>
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

                <div
                  className="position-relative"
                  style={{
                    width: 220,
                    height: 130,
                    background: "#77B0E4",
                    borderRadius: 6,
                  }}
                >
                  <div
                    className="position-absolute"
                    style={{
                      right: 0,
                      top: 0,
                      width: 84,
                      height: 84,
                      background: "#5DA1DD",
                      clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                      borderTopRightRadius: 6,
                    }}
                  />

                  <div
                    className="position-absolute"
                    style={{
                      right: 0,
                      top: 0,
                      width: 94,
                      height: 64,
                      background: "#A9CEF2",
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      borderTopRightRadius: 6,
                    }}
                  />

                  <div
                    className="position-absolute"
                    style={{ left: 12, top: 12 }}
                  >
                    <i
                      className="bi bi-award text-white"
                      style={{ fontSize: 20 }}
                    />
                  </div>
                  <div
                    className="position-absolute text-white"
                    style={{ left: 12, top: 40, fontWeight: 600, fontSize: 14 }}
                  >
                    Problem Solving (Basic)
                  </div>
                  <div
                    className="position-absolute"
                    style={{ left: 12, bottom: 10 }}
                  >
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
                  <div
                    className="position-absolute"
                    style={{ right: 10, bottom: 10 }}
                  ></div>
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
                <p className="text-muted mb-0">
                  Add all the relevant links that help in knowing you as a
                  hacker
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
