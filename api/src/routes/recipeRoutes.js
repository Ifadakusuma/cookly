import express from "express";
import { RecipeController } from "../controllers/recipeController.js";
import { ReviewController } from "../controllers/reviewController.js";
import validateId from "../middleware/validateId.js";

const router = express.Router();

router.param("id", validateId);

router.get("/", RecipeController.getAll);
router.get("/:id", RecipeController.getById);
router.post("/", RecipeController.create);
router.put("/:id", RecipeController.update);
router.delete("/:id", RecipeController.remove);

router.get("/:id/reviews", ReviewController.getByRecipe);
router.post("/:id/reviews", ReviewController.create);

export default router;