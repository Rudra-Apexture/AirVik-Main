# Test script for AirVik Backend API endpoints
Write-Host "🚀 Testing AirVik Backend API Endpoints" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1. Testing Health Check Endpoint..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/health" -Method GET
    Write-Host "✅ Health Check: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($healthResponse | ConvertTo-Json)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Health Check: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: User Registration
Write-Host "`n2. Testing User Registration Endpoint..." -ForegroundColor Cyan
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$testEmail = "test$timestamp@example.com"

$registrationData = @{
    firstName = "John"
    lastName = "Doe"
    email = $testEmail
    password = "SecurePass123!"
    confirmPassword = "SecurePass123!"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method POST -Body $registrationData -ContentType "application/json"
    Write-Host "✅ User Registration: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($registerResponse | ConvertTo-Json -Depth 3)" -ForegroundColor Yellow
    
    # Store the test email for further tests
    $global:testEmail = $testEmail
} catch {
    Write-Host "❌ User Registration: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error Details: $errorContent" -ForegroundColor Red
    }
}

# Test 3: Duplicate Email Registration
Write-Host "`n3. Testing Duplicate Email Registration..." -ForegroundColor Cyan
try {
    $duplicateResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method POST -Body $registrationData -ContentType "application/json"
    Write-Host "❌ Duplicate Registration: Should have failed but succeeded" -ForegroundColor Red
} catch {
    Write-Host "✅ Duplicate Registration: Correctly rejected" -ForegroundColor Green
    Write-Host "Error (Expected): $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 4: Invalid Email Format
Write-Host "`n4. Testing Invalid Email Format..." -ForegroundColor Cyan
$invalidEmailData = @{
    firstName = "Jane"
    lastName = "Doe"
    email = "invalid-email"
    password = "SecurePass123!"
    confirmPassword = "SecurePass123!"
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/register" -Method POST -Body $invalidEmailData -ContentType "application/json"
    Write-Host "❌ Invalid Email: Should have failed but succeeded" -ForegroundColor Red
} catch {
    Write-Host "✅ Invalid Email: Correctly rejected" -ForegroundColor Green
    Write-Host "Error (Expected): $($_.Exception.Message)" -ForegroundColor Yellow
}

# Test 5: Resend Verification Email
Write-Host "`n5. Testing Resend Verification Email..." -ForegroundColor Cyan
if ($global:testEmail) {
    $resendData = @{
        email = $global:testEmail
    } | ConvertTo-Json

    try {
        $resendResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/resend-verification" -Method POST -Body $resendData -ContentType "application/json"
        Write-Host "✅ Resend Verification: SUCCESS" -ForegroundColor Green
        Write-Host "Response: $($resendResponse | ConvertTo-Json)" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Resend Verification: FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ Skipping resend test - no test email available" -ForegroundColor Yellow
}

Write-Host "`n🏁 API Testing Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
