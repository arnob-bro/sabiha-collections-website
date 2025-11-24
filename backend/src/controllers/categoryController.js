const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/generateToken");

const {buildCategoryTree} = require("../utils/buildCategoryTree");



class CategoryController {
    constructor(categoryService) {
      this.categoryService = categoryService;
  
      // Bind methods so 'this' works in routes
      this.listCategories = this.listCategories.bind(this);
      this.listAllCategories = this.listAllCategories.bind(this);
      this.addCategory = this.addCategory.bind(this);
      this.editCategory = this.editCategory.bind(this);
    //   this.deleteCategory = this.deleteCategory.bind(this);
    }


    async listCategories (req, res) {
        try {
          const categories = await this.categoryService.listCategories();
          const tree = buildCategoryTree(categories);

          res.json({ success: true, data: tree });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async listAllCategories (req, res) {
        try {
          const categories = await this.categoryService.listAllCategories();

          res.json({ success: true, data: categories });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    async addCategory (req, res) {
      try {
        let { name, slug, parent_id, is_featured, is_active } = req.body;
        
            // check if all fields are provided
        if (!name ) {
          return res.status(400).json({success: false, message: "name is required"});
        }

        is_featured = is_featured ?? false;
        is_active = is_active ?? false;

        // Auto-generate slug if not provided
        if (!slug) {
          slug = name.toLowerCase().replace(/\s+/g, "-");
        }

        if(parent_id){
            const parentExists = await this.categoryService.getCategoryById(parent_id);
            if (!parentExists) {
                return res.status(409).json({success: false, message: "Parent Category does not exist"});
            }
        }
        const data = await this.categoryService.addCategory({name, slug, parent_id, is_featured, is_active});
        res.json({ success: true, data });
      } catch (err) {
          res.status(500).json({ success: false, message: err.message });
      }
    }

    async editCategory (req, res) {
        try {
          const { name, slug, parent_id, is_featured, is_active } = req.body;
          const { category_id } = req.params;
          
              // check if all fields are provided
          if (!name ) {
            return res.status(400).json({success: false, message: "name is required"});
          }

          
          const categoryExists = await this.categoryService.getCategoryById(category_id);
          if (!categoryExists) {
            return res.status(409).json({success: false, message: "Category does not exist"});
          }
        
          if(parent_id){
              const parentExists = await this.categoryService.getCategoryById(parent_id);
              if (!parentExists) {
                  return res.status(409).json({success: false, message: "Parent Category does not exist"});
              }

              if (parent_id === category_id) {
                return res.status(400).json({ success: false, message: "Category cannot be its own parent" });
              }
          }
          const data = await this.categoryService.editCategory({category_id, name, slug, parent_id, is_featured, is_active});
          res.json({ success: true, data });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }




    
    
      
}
  
  module.exports = CategoryController;
  