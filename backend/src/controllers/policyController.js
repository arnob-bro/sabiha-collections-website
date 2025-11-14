class PolicyController {
    constructor(policyService) {
      this.policyService = policyService;
  
      // Bind methods so 'this' works in routes
      this.getAllPolicies = this.getAllPolicies.bind(this);
      this.getpolicyByType = this.getpolicyByType.bind(this);
      this.updatePolicy = this.updatePolicy.bind(this);

    }
  
    getAllPolicies = async (req, res) => {
        try {
          const policies = await this.policyService.getAllPolicies();
          res.json({success:true, policies});
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error fetching policies" });
        }
    }


    getpolicyByType = async (req, res) => {
        try {
            const {type} = req.params;
          const policy = await this.policyService.getpolicyByType(type);
          res.json({success:true, policy});
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Error fetching policy by type" });
        }
    }

    updatePolicy = async (req, res) => {
      try {
        const { type } = req.params;
        const { title, content } = req.body;
    
        // Basic validation
        if (!type || typeof type !== 'string' || !type.trim()) {
          return res.status(400).json({ success: false, message: "Policy type is required" });
        }
    
        if (!title || typeof title !== 'string' || !title.trim()) {
          return res.status(400).json({ success: false, message: "Title is required" });
        }
    
        if (!content || typeof content !== 'string') {
          return res.status(400).json({ success: false, message: "Content is required" });
        }
    
        // Optionally, validate type against allowed policy types
        const allowedTypes = ['terms', 'privacy', 'cookie'];
        if (!allowedTypes.includes(type)) {
          return res.status(400).json({ success: false, message: "Invalid policy type" });
        }
    
        // Update the policy
        const updatedPolicy = await this.policyService.updatePolicy(type, title, content);
    
        if (!updatedPolicy) {
          return res.status(404).json({ success: false, message: "Policy not found" });
        }
    
        res.json({ success: true, updatedPolicy });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating policy" });
      }
    };
    
      
}
  
  module.exports = PolicyController;
  