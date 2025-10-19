import { Router } from 'express';
import { listReviews, createReview, deleteReview } from '../controllers/reviewController.js';
import { authRequired } from '../middlewares/authRequired.js';
const r = Router();
r.get('/:cafe_id', listReviews);
r.post('/', authRequired, createReview);
r.delete('/:review_id', authRequired, deleteReview);
export default r;
