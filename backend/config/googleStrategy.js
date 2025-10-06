const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { pool } = require("../models/db");
require("dotenv").config();

module.exports = () => {
  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    `${process.env.BASE_URL || "http://localhost:5000"}/auth/google/callback`;

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL,
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails?.[0]?.value?.toLowerCase() || null;
        if (!email) {
          return done(null, false, { message: "Email is required" });
        }

        const firstName = profile.name?.givenName || "";
        const lastName = profile.name?.familyName || "";
        const avatarUrl = profile.photos?.[0]?.value || null;

        const selectUserSQL = `
          SELECT
            u.id,
            u.email,
            u.password_hash,
            u.first_name AS "firstName",
            u.last_name  AS "lastName",
            u.avatar_url AS "avatarUrl",
            u.is_active  AS "isActive",
            u.role_id    AS "roleId",
            r.name       AS "roleName",
            r.permissions
          FROM users u
          LEFT JOIN roles r ON r.id = u.role_id
          WHERE u.email = $1
          LIMIT 1
        `;

        pool
          .query(selectUserSQL, [email])
          .then(({ rows }) => {
            if (rows.length > 0) {
              return rows[0];
            }

            const randomPwd = crypto.randomBytes(18).toString("hex");
            return bcrypt.hash(randomPwd, 12).then((passwordHash) => {
              const role_id = 3; 
              const insertQuery = `
                INSERT INTO users
                  (email, password_hash, first_name, last_name, avatar_url, role_id, age)
                VALUES
                  ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
              `;
              const values = [
                email,
                passwordHash,
                firstName,
                lastName,
                avatarUrl,
                role_id,
                18, 
              ];

              return pool.query(insertQuery, values).then(({ rows: ins }) => {
                const id = ins[0].id;
                return pool
                  .query(
                    `
                    SELECT
                      u.id,
                      u.email,
                      u.first_name AS "firstName",
                      u.last_name  AS "lastName",
                      u.avatar_url AS "avatarUrl",
                      u.phone_number AS "phoneNumber",
                      u.country AS "country",
                      u.is_active  AS "isActive",
                      u.role_id    AS "roleId",
                      r.name       AS "roleName",
                      r.permissions
                    FROM users u
                    LEFT JOIN roles r ON r.id = u.role_id
                    WHERE u.id = $1
                    LIMIT 1
                  `,
                    [id]
                  )
                  .then(({ rows: afterInsert }) => afterInsert[0]);
              });
            });
          })
          .then((userRow) => {
            if (userRow.isActive === false) {
              return done(null, false, { message: "Account is deactivated" });
            }

            const payload = {
              userId: userRow.id,
              roleId: userRow.roleId,
              roleName: userRow.roleName,
              role: {
                permissions: userRow.permissions || [],
              },
            };

            const token = jwt.sign(payload, process.env.SECRET, {
              expiresIn: "24h",
            });

            const safeUser = {
              id: userRow.id,
              email: userRow.email,
              firstName: userRow.firstName,
              lastName: userRow.lastName,
              avatarUrl: userRow.avatarUrl,
              roleId: userRow.roleId,
              roleName: userRow.roleName,
              permissions: userRow.permissions,
              phoneNumber: userRow.phoneNumber,
              country: userRow.country,
            };

            return done(null, { user: safeUser, token });
          })
          .catch((err) => done(err, null));
      }
    )
  );
};
