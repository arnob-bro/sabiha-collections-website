const nodemailer = require("nodemailer");
const {generateInquiryReplyTemplate} = require("../utils/generateInquiryReplyTemplate");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class UserService {
  constructor(db) {
    this.db = db;

    // Setup email transporter
    this.transporter = nodemailer.createTransport({
      host: "mail.m3techops.com", 
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  generateNewPassToken() {
    return crypto.randomBytes(32).toString("hex"); // random string
}

  // ----------Signup---------------
  async createUser(user_id, email, password, role) {
    try {

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const token = this.generateNewPassToken();
      const link = `${process.env.FRONTEND_URL}/change-password/${token}`;

      // Insert user
      const result = await this.db.query(
        `INSERT INTO users 
        (user_id, email, password_hash, role, new_pass_token)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
        [
            user_id,
            email,
            hashedPassword,
            role,
            token  
        ]
      );

      this.transporter.sendMail({
        from: `"M3TechOps Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Set Your New Password & Verify Your Account`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background:#f9f9f9; color:#333;">
              <h2 style="color:#0e0e53;">Welcome to M3TechOps!</h2>
              <p>We noticed you need to set a new password to get started. Once you set your new password, your account will be <b>automatically verified</b>.</p>
              
              <a href="${link}" 
                  style="display:inline-block; margin:15px 0; padding:12px 20px; background:#22577a; color:#fff; font-weight:bold; text-decoration:none; border-radius:8px;">
                  Change Password
              </a>
      
              <p>If the button doesn’t work, copy and paste this link into your browser:</p>
              <p><a href="${link}" style="color:#ff8800;">${link}</a></p>
      
              <hr style="margin-top:20px; border:none; border-top:1px solid #ddd;" />
              <p style="font-size:12px; color:#777;">If you did not request this change, please ignore this email.</p>
            </div>
        `,
      });
      

      return { success: true, message: "User creation successful." };
    } catch (err) {
      console.error("Error in creating user:", err.message);
      throw new Error("Failed to create user");
    }
  }

  async getUserByEmail(email) {
    try {
      const result = await this.db.query(`SELECT * FROM users WHERE email = $1`, [email]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("Error in getting user by email:", err.message);
      throw new Error("Failed to get user by email");
    }
  }

  async getRoleById(role_id) {
    try {
      const result = await this.db.query(`SELECT * FROM roles WHERE id = $1`, [role_id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("Error in getting role by id:", err.message);
      throw new Error("Failed to get role by id");
    }
  }

  
  async getUserById(user_id) {
    try {
      const result = await this.db.query(`SELECT * FROM users WHERE user_id = $1`, [user_id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("Error in getting user by id:", err.message);
      throw new Error("Failed to get user by id");
    }
  }

  async getUserByNewPassToken(token) {
    try {
      const result = await this.db.query(`SELECT * FROM users WHERE new_pass_token = $1`, [token]);
      return result.rows[0] || null;
    } catch (err) {
      console.error("Error in getting user by id:", err.message);
      throw new Error("Failed to get user by id");
    }
  }


  async updateUserEmail(user_id, email) {
    try {
      const result = await this.db.query(`UPDATE users SET email = $1 WHERE user_id = $2 RETURNING *`, [email, user_id]);
      return result.rows[0];
    } catch (err) {
      console.error("Error in getting user by email:", err.message);
      throw new Error("Failed to get user by email");
    }
  }


  async changePassword(userId,newPassword) {
    // Fetch user by ID
    const userResult = await this.db.query(
      `SELECT * FROM users WHERE user_id = $1`,
      [userId]
    );
    const user = userResult.rows[0];
    if (!user) throw new Error("User not found");
  
  
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    // Update password
    const result = await this.db.query(
      `UPDATE users 
      SET password_hash = $1, verified = true, new_pass_token = null, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = $2
      RETURNING user_id, email, updated_at;`,
      [hashedPassword, userId]
    );
  
    return result.rows[0];
  }


  async getUserPermissionsWithCodes(userId) {
    try {

      console.log("in permissions");
      // 1. Get all permissions
      const allPermissionsResult = await this.db.query(
        "SELECT id, code FROM permissions ORDER BY id"
      );
      const allPermissions = allPermissionsResult.rows;
      console.log(allPermissions);
  
      // 2. Get user's role
      const userResult = await this.db.query(
        "SELECT role_id FROM employees WHERE employee_id = $1",
        [userId]
      );
      const user = userResult.rows[0];
      
  
      if (!user) {
        return {
          permissions: new Array(allPermissions.length).fill(false),
          permissionCodes: allPermissions.map((p) => p.code),
        };
      }
      console.log(user);
  
      // 3. Get user's role permissions
      const userPermissionsResult = await this.db.query(
        `
        SELECT p.id, p.code 
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = $1
        `,
        [user.role_id]
      );
      const userPermissions = userPermissionsResult.rows;
      console.log(userPermissions);
  
      // 4. Map user's permissions
      const userPermissionMap = {};
      userPermissions.forEach((perm) => {
        userPermissionMap[perm.id] = true;
      });
      console.log(userPermissionMap);
  
      // 5. Admin override: check for ALL permission
      const hasAllPermission = userPermissions.some((perm) => perm.code === "ALL");
  
      // 6. Build boolean array for all permissions
      const permissionsArray = allPermissions.map(
        (perm) => hasAllPermission || userPermissionMap[perm.id] || false
      );
  
      return {
        permissions: permissionsArray,
        permissionCodes: allPermissions.map((p) => p.code),
      };
    } catch (error) {
      console.error("Error getting user permissions with codes:", error);
      return {
        permissions: [],
        permissionCodes: [],
      };
    }
  }
  

}

module.exports = UserService;
