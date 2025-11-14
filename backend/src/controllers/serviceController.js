class ServiceController {
    constructor(serviceService) {
      this.serviceService = serviceService;
  
      // Bind methods so 'this' works in routes
      this.createService = this.createService.bind(this);
      this.getServices = this.getServices.bind(this);
      this.updateService = this.updateService.bind(this);
      this.getServiceById = this.getServiceById.bind(this);

    }
  
    async createService(req, res) {
      try {
        const {
          title,
          short_desc,
          key_benefits,
          our_process,
          technologies,
          active,
          icon
        } = req.body;
    
        // --- Validation ---
        if (!title || typeof title !== "string") {
          return res.status(400).json({ error: "Title is required and must be a string" });
        }
    
        if (!short_desc || typeof short_desc !== "string") {
          return res.status(400).json({ error: "Short description is required and must be a string" });
        }
    
        if (!Array.isArray(key_benefits) || key_benefits.length === 0) {
          return res.status(400).json({ error: "Key benefits must be a non-empty array" });
        }
    
        if (!Array.isArray(our_process) || our_process.length === 0) {
          return res.status(400).json({ error: "Our process must be a non-empty array" });
        }

        if (!Array.isArray(technologies) || technologies.length === 0) {
          return res.status(400).json({ error: "Technologies must be a non-empty array" });
        }
    
        if (active !== undefined && typeof active !== "boolean") {
          return res.status(400).json({ error: "Active must be true or false" });
        }
    
        if (icon && typeof icon !== "string") {
          return res.status(400).json({ error: "Icon must be a string if provided" });
        }
    
        // --- Call Service Layer ---
        const newService = await this.serviceService.create(
          title,
          short_desc,
          key_benefits,
          our_process,
          technologies,
          active,
          icon
        );
    
        res.status(201).json({ success: true, newService });
    
      } catch (error) {
        console.error("Error in createService:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
    


      async getServices(req, res) {
        try {
          const services = await this.serviceService.getServices();
          res.json({success: true, services});
        } catch (error) {
          res.status(500).json({success: false, error: error.message });
        }
      }

      async getServiceById(req, res) {
        try {

          const { service_id } = req.params;
          const service = await this.serviceService.getServiceById(service_id);
          if(!service){
            return res.status(404).json({ error: "Service not found" });
          }
          res.json({success: true, service});
        } catch (error) {
          res.status(500).json({success: false, error: error.message });
        }
      }



      async updateService(req, res) {
        try {

          const {
            title,
            short_desc,
            key_benefits,
            our_process,
            technologies,
            active,
            icon
          } = req.body;

          const { service_id } = req.params;


          // --- Validation ---
        if (!title || typeof title !== "string") {
          return res.status(400).json({ error: "Title is required and must be a string" });
        }
    
        if (!short_desc || typeof short_desc !== "string") {
          return res.status(400).json({ error: "Short description is required and must be a string" });
        }
    
        if (!Array.isArray(key_benefits) || key_benefits.length === 0) {
          return res.status(400).json({ error: "Key benefits must be a non-empty array" });
        }
    
        if (!Array.isArray(our_process) || our_process.length === 0) {
          return res.status(400).json({ error: "Our process must be a non-empty array" });
        }
        if (!Array.isArray(technologies) || our_process.length === 0) {
          return res.status(400).json({ error: "Technologies must be a non-empty array" });
        }
    
        if (active !== undefined && typeof active !== "boolean") {
          return res.status(400).json({ error: "Active must be true or false" });
        }
    
        if (icon && typeof icon !== "string") {
          return res.status(400).json({ error: "Icon must be a string if provided" });
        }



          const updatedService = await this.serviceService.updateService(service_id, title,short_desc,key_benefits,our_process,technologies,active,icon);
          
          if (!updatedService) {
            return res.status(404).json({ error: "Service not found" });
          }
          
          res.json({success: true, updatedService});
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      
}
  
  module.exports = ServiceController;
  