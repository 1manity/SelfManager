const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello from backend!'));
app.listen(33456, () => console.log('Backend is running on port 3000'));
