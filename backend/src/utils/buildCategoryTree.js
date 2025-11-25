function buildCategoryTree(categories) {
    const map = {};
    const roots = [];
  
    // Create a hashmap for quick lookup
    categories.forEach(cat => {
      map[cat.category_id] = { ...cat, children: [] };
    });
  
    // Build the tree
    categories.forEach(cat => {
      if (cat.parent_id) {
        map[cat.parent_id].children.push(map[cat.category_id]);
      } else {
        roots.push(map[cat.category_id]); // root category (no parent)
      }
    });
  
    return roots;
  }
  
  module.exports = { buildCategoryTree }