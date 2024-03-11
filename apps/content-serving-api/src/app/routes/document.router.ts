import Router from 'koa-router';
import * as documentController from '../controllers/document.controller';

const router = new Router();

router.get('/documents', documentController.getAllPublishedVersions);
router.get(
  '/documents/:id',
  documentController.getAllPublishedVersionsOfDocument
);
router.get(
  '/documents/:id/latest',
  documentController.getLatestPublishedVersionOfDocument
);

export default router;
