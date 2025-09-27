const { pool } = require("../models/db");
const crypto = require("crypto");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const issueCertificate = (req, res) => {
  const { user_id, course_id } = req.body;

  if (!user_id || !course_id) {
    return res
      .status(400)
      .json({ success: false, message: "user_id and course_id required" });
  }

  pool
    .query("SELECT * FROM certificates WHERE user_id=$1 AND course_id=$2", [
      user_id,
      course_id,
    ])
    .then((result) => {
      if (result.rows.length) {
        return res.json({ success: false, message:"Certificate already exists" });
      }

      const certNo = `CRT-${new Date().getFullYear()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;

      return pool
        .query("SELECT first_name,last_name FROM users WHERE id=$1", [user_id])
        .then((userRes) => {
          return pool
            .query("SELECT title FROM courses WHERE id=$1", [course_id])
            .then((courseRes) => {
              const user = userRes.rows[0];
              const course = courseRes.rows[0];
              const userName = `${user.first_name} ${user.last_name}`;
              const courseTitle = course.title;


const issuedAt = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
const brandPrimary = "#77b0e4";
const brandSecondary = "#f6a531"; 
const logoUrl = "https://i.postimg.cc/vmkQhLt2/first-logo.png"
const signUrl = "https://i.postimg.cc/0NxjmCZD/6a681d6d-fdaa-4943-8775-6b79db0e1c57.png"

const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<style>
  @page { size: A5 landscape; margin: 10mm; }
  html, body { margin:0; padding:0; }
  body {
    font-family: "Segoe UI", Arial, "Cairo", sans-serif;
    color:#1f2937; background:#fbfbfd;
  }

  :root{
    --primary: ${brandPrimary};
    --secondary: ${brandSecondary};
    --ink: #111827;
    --muted: #6b7280;
    --frame: #dfe6ee;
  }

  .sheet{
    position:relative; box-sizing:border-box; width:100%; height:100%;
    padding:28px 34px; background:#fff; border-radius:16px;
    overflow:hidden; box-shadow: 0 8px 30px rgba(0,0,0,.06);
  }

  .bg-decor{
    position:absolute; inset:0; pointer-events:none; opacity:.10;
    background:
      radial-gradient(600px 280px at 20% 10%, var(--primary), transparent 60%),
      radial-gradient(500px 240px at 90% 80%, var(--secondary), transparent 60%);
  }

  .inner-frame{
    position:absolute; inset:12px; border-radius:14px;
    border:2.5px solid var(--frame);
    box-shadow: inset 0 0 0 6px rgba(255,255,255,.6);
    pointer-events:none;
  }

  .header{
    display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px;
  }
  .brand{
    display:flex; align-items:center; gap:12px;
  }
  .logo{
    width:56px; height:56px; object-fit:contain; border-radius:12px; background:#fff;
    box-shadow:0 2px 10px rgba(0,0,0,.06);
  }
  .org{
    font-weight:800; color:var(--ink); letter-spacing:.3px;
  }
  .ribbon{
    font-weight:800; letter-spacing:.8px; text-transform:uppercase; color:#fff;
    padding:10px 16px; border-radius:999px;
    background: linear-gradient(135deg, var(--secondary), var(--primary));
    box-shadow:0 6px 18px rgba(0,0,0,.15);
    border:1px solid rgba(255,255,255,.4);
  }

  .title{
    text-align:center; font-size:28px; font-weight:900; color:var(--ink);
    margin:8px 0 4px;
  }
  .subtitle{
    text-align:center; color:var(--muted); margin-bottom:16px;
  }

  .name{
    text-align:center; font-size:26px; font-weight:900; color:var(--ink);
    margin:8px 0 4px;
  }
  .line{
    width:220px; height:3px; margin:10px auto 14px; border-radius:3px;
    background: linear-gradient(90deg, var(--secondary), var(--primary));
  }
  .course{
    text-align:center; font-size:17px; color:var(--ink); font-weight:700;
  }
  .meta{
    display:flex; gap:18px; justify-content:center; margin-top:10px; color:var(--muted); font-size:12px;
  }

  .footer{
    display:grid; grid-template-columns: 1fr auto auto; gap:18px; align-items:end;  margin-top:40px; ;
  }
  .signature{
    text-align:center;
  }
  .signature img{
    width:150px; height:60px; object-fit:contain; display:block; margin:0 auto 6px;
    filter: drop-shadow(0 2px 6px rgba(0,0,0,.08));
      position: relative;
  top: 20px;
  }
  .sig-line{ width:200px; height:1px; background:#c9ced6; margin:8px auto 4px; }
  .sig-name{ font-size:12px; color:#374151; font-weight:700; }

  .qr{
    text-align:center; font-size:11px; color:var(--muted);
  }
  .cert-box{
    text-align:center; border-left:2px dashed #e5e7eb; padding-left:14px;
  }
  .cert-no{
    font-family: ui-monospace, Menlo, Consolas, monospace; font-size:12px; color:var(--ink);
    background:#f9fafb; padding:6px 10px; border-radius:8px; display:inline-block; border:1px solid #e5e7eb;
  }

  .wm{
    position:absolute; inset:0; display:grid; place-items:center; pointer-events:none;
    font-weight:900; font-size:110px; opacity:.05;
    background: linear-gradient(135deg, var(--secondary), var(--primary));
    -webkit-background-clip: text; background-clip: text; color: transparent;
    transform: rotate(-16deg);
  }
</style>
</head>
<body>
  <div class="sheet">
    <div class="bg-decor"></div>
    <div class="inner-frame"></div>

    <div class="header">
      <div class="brand">
        <img class="logo" src="${logoUrl}" alt="logo" />
        <div class="org">Smart Path</div>
      </div>
      <div class="ribbon">Certificate</div>
    </div>

    <div class="title">Certificate of Completion</div>
    <div class="subtitle">This is to certify that</div>
    <div class="name">${userName}</div>
    <div class="line"></div>
    <div class="course">has successfully completed the course:
      <span style="font-weight:900">${courseTitle}</span>
    </div>

    <div class="meta">
      <div>Issued: ${issuedAt}</div>
      <div>Certificate No: ${certNo}</div>
    </div>

    <div class="footer">
      <div class="signature">
        <img src="${signUrl}" alt="signature"/>
        <div class="sig-line"></div>
        <div class="sig-name">Issa Abu-Msameh</div>
      </div>

      <div class="qr">
        <!-- QR -->
        <!-- <img src="data:image/png;base64,..." style="width:110px;height:110px;border:1px solid #e5e7eb;border-radius:8px;object-fit:contain" /> -->
        <div>Scan to verify</div>
      </div>

      <div class="cert-box">
        <div class="cert-no"># ${certNo}</div>
      </div>
    </div>

    <div class="wm">Smart Path</div>
  </div>
</body>
</html>
`;

              const dir = path.join(__dirname, "..", "uploads", "certificates");
              if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
              const filePath = path.join(dir, `${certNo}.pdf`);

              return puppeteer
                .launch({ headless: "new", args: ["--no-sandbox"] })
                .then((browser) => {
                  return browser.newPage().then((page) => {
                    return page
                      .setContent(html)
                      .then(() =>
                        page.pdf({
                          path: filePath,
                          format: "A4",
                          printBackground: true,
                        })
                      )
                      .then(() => browser.close());
                  });
                })
                .then(() => {
                  const pdfUrl = `/uploads/certificates/${certNo}.pdf`;
                  return pool.query(
                    `INSERT INTO certificates (user_id, course_id, certificate_no, pdf_url, user_full_name, course_title)
                     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
                    [user_id, course_id, certNo, pdfUrl, userName, courseTitle]
                  );
                });
            });
        });
    })
    .then((insertRes) => {
      if (insertRes) {
        res.status(201).json({ success: true, data: insertRes.rows[0] });
      }
    })
    .catch((err) => {
      console.error("issueCertificate error:", err.message);
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    });
};

const getCertificate = (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM certificates WHERE id=$1", [id])
    .then((result) => {
      if (!result.rows.length) {
        return res
          .status(404)
          .json({ success: false, message: "Certificate not found" });
      }
      res.json({ success: true, data: result.rows[0] });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message })
    );
};

const verifyCertificate = (req, res) => {
  const { certNo } = req.params;
  pool
    .query("SELECT * FROM certificates WHERE certificate_no=$1", [certNo])
    .then((result) => {
      if (!result.rows.length) {
        return res
          .status(404)
          .json({ success: false, message: "Certificate not found" });
      }
      res.json({ success: true, data: result.rows[0] });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message })
    );
};

const getUserCertificates = (req, res) => {
  const { userId } = req.params;
  pool.query("SELECT * FROM certificates WHERE user_id=$1 ORDER BY issued_at DESC", [userId])
    .then((result) => res.json({ success: true, data: result.rows }))
    .catch((err) => res.status(500).json({ success: false, message: "Server error", error: err.message }));
};


module.exports = { issueCertificate, getCertificate, verifyCertificate , getUserCertificates };
