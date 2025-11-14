
class TestimonialController {
  constructor(testimonialService) {
    this.testimonialService = testimonialService;
  
    // Bind methods so 'this' works in routes
    this.initTestimonial = this.initTestimonial.bind(this);
    this.getTestimonials = this.getTestimonials.bind(this);
    this.getAllActiveTestimonials = this.getAllActiveTestimonials.bind(this);
    this.getTestimonialFeedbackStatusByToken = this.getTestimonialFeedbackStatusByToken.bind(this);
    this.getTestimonialByToken = this.getTestimonialByToken.bind(this);
    this.submitTestimonial = this.submitTestimonial.bind(this);
    this.updateActiveStatus = this.updateActiveStatus.bind(this);
  }
  
  async initTestimonial(req, res) {
    try {
      const { client_name, client_email, company_name, designation} = req.body;
        
      // check if all fields are provided
      if (!client_email) {
        return res.status(400).json({error: "client email is required"});
      }
      // check if email is a valid email
      if (!/^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{0,63}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(client_email)) {
        return res.status(400).json({ error: "Invalid email" });
      }

      const testimonial = await this.testimonialService.initTestimonial({ client_name, client_email, company_name, designation});
      res.status(201).json({success: true, message: "testimonial initialized successfully", testimonial});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }


  async getTestimonials(req, res) {
    try {
        const { page, limit, searchTerm = "", status } = req.query;
        const data = await this.testimonialService.getTestimonials(page, limit, searchTerm, status);
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching testimonials:", err);
        res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
    }
  }

  async getAllActiveTestimonials(req, res) {
    try {
        const data = await this.testimonialService.getAllActiveTestimonials();
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching active testimonials:", err);
        res.status(500).json({ success: false, message: "Failed to fetch active testimonials" });
    }
  }

  async getTestimonialByToken(req, res) {
    try {
      const { token } = req.params;
      const data = await this.testimonialService.getTestimonialByToken(token);
      res.status(200).json({success: true, testimonial: data});
    } catch (err) {
      console.error("Error fetching testimonial by token:", err);
      res.status(500).json({ success: false, message: "Failed to fetch testimonial by token" });
    }
  }

  async getTestimonialFeedbackStatusByToken(req, res) {
    try {
      const { token } = req.params;
    
      if (!token) {
        return res.status(400).json({
          success: false,
          message: "Token is required",
        });
      }
    
      const data = await this.testimonialService.getTestimonialFeedbackStatusByToken(token);
    
      if (data === null) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired testimonial token",
        });
      }
    
      return res.status(200).json({
        success: true,
        testimonialFeedbackStatus: data,
      });
    } catch (err) {
      console.error("Error fetching testimonial by token:", err.message || err);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while fetching testimonial by token",
      });
    }
  }
    
    // Submit testimonial feedback
  async submitTestimonial(req, res) {
    try {
      const { token } = req.params;
      const { client_name, client_email, feedback, imageUrl, company_name, designation } = req.body;
      const imageFile = req.file;

      if (!feedback || !imageFile || !client_name) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      const feedbackStatus = await this.testimonialService.getTestimonialFeedbackStatusByToken(token);
      if(feedbackStatus){
        return res.status(404).json({
          success: false,
          message: "testimonial feedback is already given",
        });
      }

      const result = await this.testimonialService.submitTestimonial({
        token,
        client_name, 
        client_email, 
        feedback, 
        imageFile,
        imageUrl, 
        company_name, 
        designation 
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      res.status(200).json({
        success: true,
        message: "Testimonial submitted successfully",
      });
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      res.status(500).json({
        success: false,
        message: "Failed to submit testimonial",
      });
    }
  }

  async updateActiveStatus(req, res) {
    try {
      const { testimonial_id } = req.params;
      const { active } = req.body;
      const data = await this.testimonialService.updateActiveStatus({testimonial_id, active});
      res.status(200).json({success: true, testimonial: data});
    } catch (err) {
      console.error("Error updating testimonial active status:", err);
      res.status(500).json({ success: false, message: "Failed to update testimonial active status" });
    }
  }
  
      
}
  
  module.exports = TestimonialController;
  