import express from "express";
import { CategoryController } from "../controllers/categoryController.js";
import validateId from "../middleware/validateId.js";

const router = express.Router();

router.param("id", validateId);

router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getById);
router.post("/", CategoryController.create);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.remove);

export default router;