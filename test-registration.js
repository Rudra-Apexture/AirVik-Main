// Test script for user registration and email verification API
// For Node.js v18 and above, use the native fetch API
// For older versions, we need to import node-fetch properly
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function testRegistration() {
  console.log('Testing user registration API...');
  
  const userData = {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser${Date.now()}@example.com`, // Use timestamp to ensure unique email
    password: 'Test1234',
    confirmPassword: 'Test1234'
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    console.log('Registration API Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Registration successful!');
      console.log('User email:', userData.email);
      return userData.email;
    } else {
      console.log('❌ Registration failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error testing registration API:', error.message);
    return null;
  }
}

async function testResendVerification(email) {
  if (!email) {
    console.log('Skipping resend verification test - no email available');
    return;
  }
  
  console.log('\nTesting resend verification API...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    console.log('Resend Verification API Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Verification email resent successfully!');
    } else {
      console.log('❌ Resend verification failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing resend verification API:', error.message);
  }
}

async function runTests() {
  console.log('=== STARTING API TESTS ===');
  const registeredEmail = await testRegistration();
  
  if (registeredEmail) {
    await testResendVerification(registeredEmail);
  }
  
  console.log('\n=== API TESTS COMPLETED ===');
}

runTests();
