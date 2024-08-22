const jwt = require('jsonwebtoken');

// Step 1: Generate the Token
const payload = {
  user: {
    id: '66b1550c38ea48ecb87b6d1a'  // Example user ID
  }
};
const secretKey = 'your_secret_key';  // Replace with your actual secret key

const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
console.log('Generated JWT:', token);

// Step 2: Verify the Token
jwt.verify(token, secretKey, (err, decoded) => {
  if (err) {
    console.error('Token verification failed:', err.message);
  } else {
    console.log('Token is valid:', decoded);
  }
});
