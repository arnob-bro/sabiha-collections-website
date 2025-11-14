const express = require("express");
const multer = require("multer");

function createPortfolioRouter(portfolioController) {
  const router = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });


    router.get('/', portfolioController.getAllPortfolios);
    router.get('/active', portfolioController.getActivePortfolios);
    router.get('/:portfolio_item_id', portfolioController.getPortfolioById);
    router.post('/', upload.single("image"), portfolioController.createPortfolio);
    router.put('/:portfolio_item_id', upload.single("image"), portfolioController.updatePortfolio);

  return router;
}

module.exports = createPortfolioRouter;
