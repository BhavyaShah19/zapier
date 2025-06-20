import express from 'express';

const app = express();

app.post('/hooks/catch/:userId/:zapId', (req, res) => {
  const { userId, zapId } = req.params;
});