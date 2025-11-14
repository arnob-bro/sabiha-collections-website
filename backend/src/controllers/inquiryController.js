class InquiryController {
    constructor(inquiryService) {
      this.inquiryService = inquiryService;
  
      // Bind methods so 'this' works in routes
      this.makeInquiry = this.makeInquiry.bind(this);
      this.getInquiries = this.getInquiries.bind(this);
      this.replyToInquiry = this.replyToInquiry.bind(this);
      // this.updateInquiryStatus = this.updateInquiryStatus.bind(this);
    }
  
    async makeInquiry(req, res) {
      try {
        const {
          first_name,
          last_name,
          email,
          company,
          job_title,
          phone,
          country,
          message
        } = req.body;
  
        // REQUIRED FIELDS
        if (!first_name || !last_name || !email || !message) {
          return res.status(400).json({ error: "Missing required fields" });
        }
  
        // Email format
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: "Invalid email format" });
        }
  
  
        // Name length
        if (first_name.length > 50 || last_name.length > 50) {
          return res
            .status(400)
            .json({ error: "First or last name too long (max 50 chars)" });
        }
  
        // other fields validation
        if (company && company.length > 50) {
          return res
            .status(400)
            .json({ error: "company field too long (max 50 chars)" });
        }

        if (job_title && job_title.length > 50) {
            return res
              .status(400)
              .json({ error: "job title field too long (max 50 chars)" });
          }
  
        if (phone && phone.length > 20) {
          return res
            .status(400)
            .json({ error: "Phone number too long (max 20 chars)" });
        }

        if (country && country.length > 30) {
            return res
              .status(400)
              .json({ error: "country field too long (max 30 chars)" });
          }
  
  
        if (message && message.length === 0) {
          return res
            .status(400)
            .json({ error: "message field cannot be empty" });
        }
  
        // then Service ke pass korbo
        const inquiry = await this.inquiryService.makeInquiry({
            first_name,
            last_name,
            email,
            company,
            job_title,
            phone,
            country,
            message
        });


  
        res.status(201).json(inquiry);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }

    async getInquiries(req, res) {
      try {
        const { page, limit, email, company, status } = req.query;
        
    
        const inquiries = await this.inquiryService.getInquiries(
          page,
          limit,
          company,
          email,
          status
        );
    
        res.status(200).json(inquiries);
      } catch (err) {
        console.error("Error fetching inquiries:", err);
        res.status(400).json({ error: err.message });
      }
    }
    

    async replyToInquiry (req, res) {
      try {
        const { inquiry_id } = req.params;
        const { replyMessage } = req.body;
  
        const reply = await this.inquiryService.replyToInquiry(inquiry_id, replyMessage);
  
        if(reply){
          await this.inquiryService.updateInquiryStatus(inquiry_id, "Replied");
        }
        if (!reply) {
          return res.status(404).json({ error: "Inquiry not found" });
        }
  
        res.json(reply);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
  }
  
  module.exports = InquiryController;
  