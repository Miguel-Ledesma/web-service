const express = require('express');

const service = express();

// The resource to share.
const array = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];

const port = 5000;
service.listen(port, () => {
  console.log(`We're live on port ${port}!`);
});