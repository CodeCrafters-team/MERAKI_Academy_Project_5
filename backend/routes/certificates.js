const express = require("express");
const { issueCertificate, getCertificate, verifyCertificate , getUserCertificates ,getCertificateFile} = require("../controllers/certificates");
const certificatesRouter = express.Router();

certificatesRouter.post("/issue", issueCertificate);
certificatesRouter.get("/:id",getCertificate);
certificatesRouter.get("/verify/:certNo", verifyCertificate);
certificatesRouter.get("/user/:userId",getUserCertificates);
certificatesRouter.get("/file/:certNo", getCertificateFile);


module.exports = certificatesRouter;