import express from 'express';
const router = express.Router();
import { ensureAuthenticated, ensureAdmin } from '../config/auth.mjs';

// Trang chủ
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    name: req.user.name,
    role: req.user.role,
  })
);

// Chi tiết doanh nghiệp
router.get('/detail', (req, res) => res.render('detail'));

// Admin page
router.get('/admin', ensureAuthenticated, ensureAdmin, (req, res) =>
  res.render('admin', {
    name: req.user.name,
  })
);

export default router;

