import { Router } from 'express';

const router = Router();

// Simple test routes
router.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

router.get('/test/:id', (req, res) => {
  res.json({ message: 'Test route with parameter', id: req.params.id });
});

export default router; 