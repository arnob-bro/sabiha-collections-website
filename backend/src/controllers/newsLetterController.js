class NewsLetterController {
    constructor(newsLetterService) {
      this.newsLetterService = newsLetterService;
  
      // Bind methods so 'this' works in routes
      this.subscribe = this.subscribe.bind(this);
      this.getSubscribers = this.getSubscribers.bind(this);
      this.updateSubscriberStatus = this.updateSubscriberStatus.bind(this);
  
      this.createNewsletter = this.createNewsletter.bind(this);
      this.getNewsletters = this.getNewsletters.bind(this);
      this.updateNewsletter = this.updateNewsletter.bind(this);
      this.sendNewsletter = this.sendNewsletter.bind(this);
    }
  
    // ---------------- SUBSCRIBERS ----------------
    async subscribe(req, res) {
      try {
        const { email } = req.body;
  
        if (!email || typeof email !== "string") {
          return res.status(400).json({ success: false, message: "Valid email is required" });
        }
  
        const trimmedEmail = email.trim();
        if (trimmedEmail.length === 0) {
          return res.status(400).json({ success: false, message: "Email cannot be empty" });
        }
        if (trimmedEmail.length > 150) {
          return res.status(400).json({ success: false, message: "Email cannot exceed 150 characters" });
        }
        if (!/^(?!.*\.\.)(?!.*\.$)[^\W][\w.+-]{0,63}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(trimmedEmail)) {
          return res.status(400).json({ success: false, message: "Invalid email format" });
        }
  
        const existingEmail = await this.newsLetterService.getSubscriptionByEmail(trimmedEmail);
        if (existingEmail) {
          return res.status(409).json({ success: false, message: "Subscription with this email already exists" });
        }
  
        const newSubscription = await this.newsLetterService.subscribe({ email: trimmedEmail });
        return res.status(201).json({ success: true, message: "Subscribed successfully", newSubscription });
      } catch (error) {
        console.error("Error creating subscription:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  
    async getSubscribers(req, res) {
      try {
        const { page, limit, email, status } = req.query;
        const subscribers = await this.newsLetterService.getSubscribers(page, limit, email, status);
        res.status(200).json(subscribers);
      } catch (err) {
        console.error("Error fetching subscribers:", err);
        res.status(500).json({ success: false, message: "Failed to fetch subscribers" });
      }
    }
  
    async updateSubscriberStatus(req, res) {
      const subscriber_id = req.params.subscriber_id;
      const { status } = req.body;
  
      if (!["Active", "Inactive"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
  
      try {
        const updatedSubscriber = await this.newsLetterService.updateSubscriberStatus(subscriber_id, status);
        if (!updatedSubscriber) {
          return res.status(404).json({ error: "Subscriber not found" });
        }
        return res.status(200).json({ success: true, message: "Subscriber status updated", updatedSubscriber });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Failed to update subscriber status" });
      }
    }
  
    // ---------------- NEWSLETTERS ----------------
    async createNewsletter(req, res) {
      try {
        const { title, content, status } = req.body;
  
        if (!title || typeof title !== "string") {
          return res.status(400).json({ success: false, message: "Title is required" });
        }
        if (!content || typeof content !== "string") {
          return res.status(400).json({ success: false, message: "Content is required" });
        }
  
        const newsletter = await this.newsLetterService.createNewsletter({ title, content, status });
        return res.status(201).json({ success: true, message: "Newsletter created", newNewsletter: newsletter });
      } catch (err) {
        console.error("Error creating newsletter:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  
    async getNewsletters(req, res) {
      try {
        const { page, limit, title, status  } = req.query;
        const newsletters = await this.newsLetterService.getNewsletters(page, limit, title, status );
        return res.status(200).json(newsletters);
      } catch (err) {
        console.error("Error fetching newsletters:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch newsletters" });
      }
    }
  
    async updateNewsletter(req, res) {
      try {
        const {title, content, status, sent_date } = req.body;
        const updated = await this.newsLetterService.updateNewsletter(req.params.newsletter_id, title, content, status, sent_date);
        if (!updated) {
          return res.status(404).json({ success: false, message: "Newsletter not found" });
        }
        return res.status(200).json({ success: true, message: "Newsletter updated", updatedNewsletter: updated });
      } catch (err) {
        console.error("Error updating newsletter:", err);
        return res.status(500).json({ success: false, message: "Failed to update newsletter" });
      }
    }
  
    
  
    async sendNewsletter(req, res) {
      try {
        const sent = await this.newsLetterService.sendNewsletter(req.params.newsletter_id);
        if (!sent) {
          return res.status(404).json({ success: false, message: "Newsletter not found" });
        }
        return res.status(200).json({ success: true, message: "Newsletter sent", data: sent });
      } catch (err) {
        console.error("Error sending newsletter:", err);
        return res.status(500).json({ success: false, message: "Failed to send newsletter" });
      }
    }
  }
  
  module.exports = NewsLetterController;
  