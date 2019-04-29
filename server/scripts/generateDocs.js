// import express from 'express';
// import * as sw from 'sw2dts';

// import initialize from '../api-v1/initialize';

// const app = express();

// const openApiDoc = initialize(app);
// console.error('Object.keys(openApiDoc)', Object.keys(openApiDoc));
// console.error('openApiDoc.originalApiDoc', openApiDoc.originalApiDoc);

// console.error('openApiDoc', JSON.stringify(openApiDoc.apiDoc, null, 2));
// const { schemas } = openApiDoc.apiDoc.components
// sw.convert({
//   $schema: 'http://json-schema.org/draft-07/schema#',
//   ...openApiDoc.apiDoc,
// }).then(something => {});
