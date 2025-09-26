const express = require("express");
const { issueCertificate, getCertificate, verifyCertificate , getUserCertificates } = require("../controllers/certificates");
const certificatesRouter = express.Router();

certificatesRouter.post("/issue", issueCertificate);
certificatesRouter.get("/:id",getCertificate);
certificatesRouter.get("/verify/:certNo", verifyCertificate);
certificatesRouter.get("/user/:userId",getUserCertificates);

module.exports = certificatesRouter;