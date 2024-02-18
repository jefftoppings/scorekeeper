import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello from the main route of my TypeScript NodeJS backend!');
});

export default router;
