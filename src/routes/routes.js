import { Router } from "express";
import express from 'express';
import { uploadMiddleware, uploadFile } from './upload.controller.js';



const router = Router();

router.post('/upload', uploadMiddleware, uploadFile);

export default router;