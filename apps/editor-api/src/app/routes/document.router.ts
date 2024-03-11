import Router from 'koa-router';
import * as documentController from '../controllers/document.controller';

const router = new Router();

router.post('/documents', documentController.createDocument);
router.get('/documents/:id', documentController.getDocumentVersions);
router.post('/documents/:id', documentController.createDocumentDraft);
router.put('/documents/:id/:version', documentController.updateDocumentDraft);
router.post('/documents/:id/:version', documentController.publishDocumentDraft);

export default router;
