const supabase = require("../config/supabaseClient.js");

class PortfolioController {
    constructor(portfolioService) {
        this.portfolioService = portfolioService;

        // Bind methods so 'this' works in routes
        this.getActivePortfolios = this.getActivePortfolios.bind(this);
        this.getAllPortfolios = this.getAllPortfolios.bind(this);
        this.getPortfolioById = this.getPortfolioById.bind(this);
        this.createPortfolio = this.createPortfolio.bind(this);
        this.updatePortfolio = this.updatePortfolio.bind(this);
    }

    async getActivePortfolios(req, res) {
        try {
          const { page, limit, category, active } = req.query;
          
      
          const payslips = await this.portfolioService.getActivePortfolios(
            page,
            limit,
            category,
            active
          );
      
          res.status(200).json(payslips);
        } catch (err) {
          console.error("Error fetching portfolios:", err);
          res.status(400).json({ error: err.message });
        }
    }

    async getAllPortfolios(req, res) {
        try {
            const portfolios = await this.portfolioService.getAll();
            return res.json({ success: true, portfolios });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    
    async getPortfolioById(req, res) {
        try {
            const { portfolio_item_id } = req.params;
            const portfolio = await this.portfolioService.getById(portfolio_item_id);

            if (!portfolio) {
                return res.status(404).json({ success: false, message: 'Portfolio item not found' });
            }

            return res.json({ success: true, portfolio });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    
    async createPortfolio(req, res) {
        try {
            const {
                title,
                category,
                description,
                problem,
                solution,
                results,
                tech_stack,
                active
            } = req.body;
            const imageFile = req.file;

            // Validate required fields
            if (!title || !category || !description || !imageFile || !problem || !solution || !results) {
                return res.status(400).json({
                    success: false,
                    message: 'Title, category, description, image, problem, solution, and results are required'
                });
            }

            // Validate techStack
            if (!Array.isArray(tech_stack) || tech_stack.length === 0 || !tech_stack.every(t => typeof t === 'string' && t.trim() !== '')) {
                return res.status(400).json({
                    success: false,
                    message: 'TechStack must be a non-empty array of non-empty strings'
                });
            }

            const newPortfolio = await this.portfolioService.create({
                title: title.trim(),
                category: category.trim(),
                description: description.trim(),
                image: imageFile,
                problem: problem.trim(),
                solution: solution.trim(),
                results: results.trim(),
                tech_stack: tech_stack.map(t => t.trim()),
                active: active ?? true
            });

            return res.status(201).json({ success: true, newPortfolio });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    
    async updatePortfolio(req, res) {
        try {
            const { portfolio_item_id } = req.params;
            const {
                title,
                category,
                description,
                problem,
                solution,
                results,
                tech_stack,
                active
            } = req.body;

            const imageFile = req.file;

            // Optional validation if fields are provided
            const updateData = {};
            if (title) updateData.title = title.trim();
            if (category) updateData.category = category.trim();
            if (description) updateData.description = description.trim();
            if (problem) updateData.problem = problem.trim();
            if (solution) updateData.solution = solution.trim();
            if (results) updateData.results = results.trim();
            if (imageFile) {
                const imageFileName = `portfolio_${Date.now()}_${imageFile.originalname}`;
                const { error: imgErr } = await supabase.storage
                  .from("portfolios")
                  .upload(imageFileName, imageFile.buffer, { contentType: imageFile.mimetype });
                if (imgErr) throw imgErr;
          
                const { data: imgUrlData } = supabase.storage
                  .from("portfolios")
                  .getPublicUrl(imageFileName);
                updateData.image = imgUrlData.publicUrl;
            }
            if (tech_stack) {
                if (!Array.isArray(tech_stack) || tech_stack.some(t => typeof t !== 'string' || t.trim() === '')) {
                    return res.status(400).json({
                        success: false,
                        message: 'TechStack must be an array of non-empty strings'
                    });
                }
                updateData.tech_stack = tech_stack.map(t => t.trim());
            }
            if (active !== undefined) updateData.active = active;

            const updatedItem = await this.portfolioService.update(portfolio_item_id, updateData);

            if (!updatedItem) {
                return res.status(404).json({ success: false, message: 'Portfolio item not found' });
            }

            return res.json({ success: true, data: updatedItem });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = PortfolioController;
