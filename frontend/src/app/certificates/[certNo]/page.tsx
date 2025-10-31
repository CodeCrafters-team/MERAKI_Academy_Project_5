"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const API_BASE = "https://meraki-academy-project-5-anxw.onrender.com";

export default function CertificatePage() {
  const { certNo } = useParams();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!certNo) return;
    axios
      .get(`${API_BASE}/certificates/verify/${certNo}`)
      .then((res) => setCertificate(res.data?.data ?? null))
      .catch(() => setCertificate(null))
      .finally(() => setLoading(false));
  }, [certNo]);

  const id = useMemo(
    () => (Array.isArray(certNo) ? certNo[0] : (certNo as string)),
    [certNo]
  );

  const rawPdfUrl = `${API_BASE}/certificates/file/${encodeURIComponent(id)}`;


  const viewerUrl =`${rawPdfUrl}#toolbar=0&navpanes=0&pagemode=none&view=Fit&zoom=85`;

  if (loading) {
    return (
      <div className="container py-5" style={{ maxWidth: 960 }}>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="placeholder-glow" style={{ height: 540 }}>
              <span className="placeholder col-12 h-100 rounded-4"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="container py-5" style={{ maxWidth: 960 }}>
        <div className="alert alert-danger text-center">
          Certificate not found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-body-tertiary">
      <div className="container py-4 py-lg-5" style={{ maxWidth: 960 }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
          <div>
            <h1 className="h3 fw-bold mb-1">
             Certificate of Completion
            </h1>
            <div className="text-secondary">
              <strong className="text-dark">{certificate.user_full_name}</strong>{" "}
              has successfully completed
              <div className="fst-italic">{certificate.course_title}</div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-pill text-bg-light border fw-semibold px-3 py-2">
              #{certificate.certificate_no}
            </span>
            <a
              href={rawPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-secondary"
            >
              Open in new tab ↗
            </a>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-3 p-sm-4">
            <div className="cert-shell">
              <iframe
                src={viewerUrl}
                className="cert-frame"
                title="Certificate PDF"
              />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <a
                href={rawPdfUrl}
                download={`${certificate.certificate_no}.pdf`}
                className="btn-primary btn text-white border-0"
              >
              Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
