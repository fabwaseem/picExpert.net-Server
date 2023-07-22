import express from "express";
import { saveContactForm } from "../Controllers/ContactController.js";

const router = express.Router();

router.post("/", saveContactForm);

export default router;
 