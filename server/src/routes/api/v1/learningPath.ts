import { Router } from "express";
import { listLearningPath } from "../../../services/learningPathService.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const data = await listLearningPath();
    return res.json({ ok: true, data });
  } catch (e) {
    return next(e);
  }
});

export { router as learningPathRouter };
