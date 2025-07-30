// Test script for user registration error handling
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function testEmailAlreadyExists() {
  console.log('Testing email already exists error...');
  
  const userData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser1753694587116@example.com', // Use the email we just registered
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
    
    if (!data.success && data.error === 'Email already exists' && data.code === 'EMAIL_EXISTS') {
      console.log('✅ Email already exists error handled correctly!');
    } else {
      console.log('❌ Email already exists error not handled correctly');
    }
  } catch (error) {
    console.error('❌ Error testing registration API:', error.message);
  }
}

async function testValidationErrors() {
  console.log('\nTesting validation errors...');
  
  const userData = {
    firstName: 'T', // Too short
    lastName: 'User',
    email: 'invalid-email', // Invalid email format
    password: 'short', // Too short
    confirmPassword: 'notmatching' // Doesn't match password
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
    
    if (!data.success && data.error && data.code === 'VALIDATION_ERROR') {
      console.log('✅ Validation errors handled correctly!');
    } else {
      console.log('❌ Validation errors not handled correctly');
    }
  } catch (error) {
    console.error('❌ Error testing validation errors:', error.message);
  }
}

async function testInvalidToken() {
  console.log('\nTesting invalid verification token...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: 'invalid-token-123' })
    });
    
    const data = await response.json();
    console.log('Verify Email API Response:', JSON.stringify(data, null, 2));
    
    if (!data.success && data.error && (data.code === 'INVALID_TOKEN' || data.error.includes('invalid'))) {
      console.log('✅ Invalid token error handled correctly!');
    } else {
      console.log('❌ Invalid token error not handled correctly');
    }
  } catch (error) {
    console.error('❌ Error testing invalid token:', error.message);
  }
}

async function runTests() {
  console.log('=== STARTING ERROR HANDLING TESTS ===');
  
  await testEmailAlreadyExists();
  await testValidationErrors();
  await testInvalidToken();
  
  console.log('\n=== ERROR HANDLING TESTS COMPLETED ===');
}

runTests();
