import express from "express";
import { ReviewController } from "../controllers/reviewController.js";
import validateId from "../middleware/validateId.js";

const router = express.Router();

router.param("id", validateId);

router.put("/:id", ReviewController.update);
router.delete("/:id", ReviewController.remove);

export default router;