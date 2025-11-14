const express = require("express");

function createNewsLetterRouter(newsLetterController) {
  const router = express.Router();

  router.post("/subscribe", newsLetterController.subscribe);
  router.get("/subscribers", newsLetterController.getSubscribers);
  router.put("/subscribers/:subscriber_id/status", newsLetterController.updateSubscriberStatus);

  router.post("/", newsLetterController.createNewsletter);         // Create
  router.get("/", newsLetterController.getNewsletters);         // List all (with pagination)
  router.put("/:newsletter_id", newsLetterController.updateNewsletter);    // Update title/content/status
  router.post("/:newsletter_id/send", newsLetterController.sendNewsletter);  // Trigger sending


  return router;
}

module.exports = createNewsLetterRouter;
