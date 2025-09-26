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
      if (result.rows.length > 0) {
        return res.json({ success: true, data: result.rows[0] });
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

              const html = `
                <html>
                  <body style="font-family:sans-serif; text-align:center; padding:50px;">
                    <h1>Certificate of Completion</h1>
                    <p>This certifies that <strong>${userName}</strong></p>
                    <p>has successfully completed the course</p>
                    <h2>${courseTitle}</h2>
                    <p>Certificate No: ${certNo}</p>
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

module.exports = { issueCertificate, getCertificate, verifyCertificate };
