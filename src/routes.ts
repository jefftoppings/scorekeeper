import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the main route of my TypeScript NodeJS backend!');
});

router.get('/mexican-train', (req, res) => {
  res.send('Hello from the main route of mexican-train!');
});

// Catch-all route for 404 errors within this specific routes file
router.use((req, res) => {
  res.status(404).send('404 - Not Found within routes.ts');
});

export default router;
