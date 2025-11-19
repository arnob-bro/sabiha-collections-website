const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/generateToken");



class AuthController {
    constructor(userService) {
      this.userService = userService;
  
      // Bind methods so 'this' works in routes
      this.createUser = this.createUser.bind(this);
      this.login = this.login.bind(this);
      this.logout = this.logout.bind(this);
      this.refresh = this.refresh.bind(this);
      this.getProfile = this.getProfile.bind(this);
      // this.changePassword = this.changePassword.bind(this);
      // this.verifyNewPassToken = this.verifyNewPassToken.bind(this);
    }
  
    async createUser(req, res) {
      try {
        const { email, password, role, first_name, last_name, phone} = req.body;
        
        // check if all fields are provided
        if (!email || !password || !role || !first_name || !last_name) {
          return res.status(400).json({success: false, message: "All fields are required"});
        }
        
        
        // check if email is a valid email
        if (!/^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{0,63}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(email)) {
          return res.status(400).json({ success: false, message: "Invalid email" });
        } 
        
        // check if password is at least 6 characters
        if (password.trim().length < 6) {
          return res.status(400).json({success: false, message: "Password must be at least 6 characters"});
        }
        
        
        
        // check if user already exists
        const userExists = await this.userService.getUserByEmail(email.toLowerCase());
        if (userExists) {
          return res.status(409).json({success: false, message: "User already exists"});
        }

        
        const user = await this.userService.createUser(
          email.toLowerCase(), 
          password.trim(), 
          role,
          first_name,
          last_name,
          phone
        );
        res.status(201).json({success: true, message: "User created successfully"});
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    }

    async login(req, res) {
      try {

          const { email, password } = req.body;

          // check if email and password are provided
          if (!email || !password) {
            return res.status(400).json({success: false, message: "Email and password are required"});
          }
          
          // check if email is a valid email
          if (!/^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{0,63}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
          }
          // check if password is at least 6 characters
          if (password.trim().length < 6) {
            return res.status(400).json({success: false, message: "Password must be at least 6 characters"});
          }
          console.log(email);
          console.log(password);
          
          
          // check if user exists
          const user = await this.userService.getUserByEmail(email.toLowerCase());
          if (!user) {
            return res.status(404).json({success: false, message: "Invalid credentials"});
          }

          // check if password is correct
          const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password_hash);
          if (!isPasswordCorrect) {
            return res.status(400).json({success: false, message: "Invalid password"});
          }
          // generate token
          const accessToken = generateAccessToken(user.user_id);
          const refreshToken = generateRefreshToken(user.user_id);
          console.log(accessToken);
          console.log(refreshToken);
          // const userPermissions = await this.userService.getUserPermissionsWithCodes(user.user_id);

          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, 
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

          res.status(200).json({
            success: true, 
            message: "Login successful", 
            accessToken, 
            // permissions: userPermissions.permissions,
				    // permissionCodes: userPermissions.permissionCodes,
            user: {
              user_id: user.user_id,
              email: user.email,
              role: user.role
            }});
          
        
      } catch (err) {
        console.error("Error logging in:", err);
        res.status(400).json({ success: false, message: err.message});
      }
    }
    

    async logout(req, res) {
      try {
        res.clearCookie("refreshToken");
        res.status(200).json({success: true, message: "Logged out successfully"});
      } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).json({ success: false, message: err.message });
      }
    }
  
    async refresh(req, res) {
      try {
        const token = req.cookies.refreshToken;
        if (!token) {
          return res.status(401).json({success: false, message: "Unauthorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_R_SECRET);
        const user_id = decoded.id;
        const user = await this.userService.getUserById(user_id);
        if (!user) {
          return res.status(401).json({success: false, message: "Unauthorized"});
        }
        const accessToken = generateAccessToken(user.user_id);
        res.status(200).json({success: true, message: "Token refreshed", accessToken});
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ success: false, message: "Refresh token expired" });
        }
        console.error("Error refreshing:", err);
        res.status(500).json({ success: false, message: "Invalid refresh token" });
      }
    }

    async getProfile(req, res) {
      try {
        const user_id = req.user.user_id;
        const user = await this.userService.getUserById(user_id);
        const userPermissions = await this.userService.getUserPermissionsWithCodes(user.user_id);
        res.status(200).json({
          success: true, 
          message: "Welcome!", 
          permissions: userPermissions.permissions,
				  permissionCodes: userPermissions.permissionCodes,
          user
        });
      } catch (err) {
        console.error("Error getting profile:", err);
        res.status(500).json({ success: false, message: "Invalid request for fetching profile"});
      }
    }

    async verifyNewPassToken(req, res) {
      try {
        const { new_pass_token } = req.params;
        const existedUser = await this.userService.getUserByNewPassToken(new_pass_token);
        if(!existedUser){
          res.status(400).json({ success: false, message: "Invalid or expired token" });
        }
        res.status(200).json({ success: true, message: "Verified token" });
      } catch (err) {
        console.error("Error verifying token:", err);
        res.status(500).json({ success: false, message: "Something went wrong in token"});
      }
    }

    async changePassword(req, res) {
      try {
        const { new_pass_token } = req.params;
        const { new_password } = req.body;
    
        if (!new_password) {
          return res.status(400).json({ success: false, message: "New password is required" });
        }
    
        if (new_password.length < 6) {
          return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        const existedUser = await this.userService.getUserByNewPassToken(new_pass_token);
        if(!existedUser){
          res.status(404).json({ success: false, message: "Invalid Token" });
        }
        const userId = existedUser.user_id;
    
        const updatedUser = await this.userService.changePassword(userId, new_password);
    
        res.status(200).json({ success: true, message: "Password changed successfully", user: updatedUser });
      } catch (err) {
        res.status(400).json({ success: false, message: err.message });
      }
    }
    
    
      
}
  
  module.exports = AuthController;
  