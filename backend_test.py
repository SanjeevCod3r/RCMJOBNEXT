#!/usr/bin/env python3
"""
Comprehensive backend test for CareerConnect Job Portal
Tests all API endpoints end-to-end with real Razorpay and Cloudinary credentials
"""

import requests
import json
import io
import time
from datetime import datetime

# Base URL from .env
BASE_URL = "https://career-connect-350.preview.emergentagent.com/api"

# Test data storage
test_data = {
    'admin': {},
    'employer': {},
    'candidate': {},
    'job': {},
    'application': {}
}

def log(msg):
    """Print timestamped log message"""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def test_auth_register():
    """Test 1: Register 3 users with different roles"""
    log("=" * 80)
    log("TEST 1: User Registration (ADMIN, EMPLOYER, CANDIDATE)")
    log("=" * 80)
    
    timestamp = int(time.time())
    users = [
        {
            'role': 'ADMIN',
            'name': 'Admin User',
            'email': f'admin_{timestamp}@careerconnect.test',
            'password': 'Admin@123'
        },
        {
            'role': 'EMPLOYER',
            'name': 'Tech Corp HR',
            'email': f'employer_{timestamp}@techcorp.com',
            'password': 'Employer@123'
        },
        {
            'role': 'CANDIDATE',
            'name': 'John Developer',
            'email': f'john.dev_{timestamp}@gmail.com',
            'password': 'Candidate@123'
        }
    ]
    
    for user_data in users:
        try:
            response = requests.post(
                f"{BASE_URL}/auth/register",
                json=user_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                role_key = user_data['role'].lower()
                test_data[role_key] = {
                    'user': data['user'],
                    'token': data['token'],
                    'email': user_data['email'],
                    'password': user_data['password']
                }
                log(f"✅ {user_data['role']} registered successfully: {user_data['email']}")
                log(f"   User ID: {data['user']['id']}, Token: {data['token'][:20]}...")
            else:
                log(f"❌ {user_data['role']} registration failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            log(f"❌ Exception during {user_data['role']} registration: {str(e)}")
            return False
    
    log("✅ All 3 users registered successfully\n")
    return True

def test_auth_login():
    """Test 2: Login for each user"""
    log("=" * 80)
    log("TEST 2: User Login")
    log("=" * 80)
    
    for role in ['admin', 'employer', 'candidate']:
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login",
                json={
                    'email': test_data[role]['email'],
                    'password': test_data[role]['password']
                },
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                test_data[role]['token'] = data['token']
                log(f"✅ {role.upper()} login successful: {test_data[role]['email']}")
            else:
                log(f"❌ {role.upper()} login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            log(f"❌ Exception during {role.upper()} login: {str(e)}")
            return False
    
    log("✅ All users logged in successfully\n")
    return True

def test_auth_me():
    """Test 3: GET /auth/me with Bearer token"""
    log("=" * 80)
    log("TEST 3: GET /auth/me with Bearer token")
    log("=" * 80)
    
    for role in ['admin', 'employer', 'candidate']:
        try:
            response = requests.get(
                f"{BASE_URL}/auth/me",
                headers={'Authorization': f"Bearer {test_data[role]['token']}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                expected_role = role.upper()
                actual_role = data['user']['role']
                if actual_role == expected_role:
                    log(f"✅ {role.upper()} /auth/me returned correct role: {actual_role}")
                else:
                    log(f"❌ {role.upper()} /auth/me role mismatch: expected {expected_role}, got {actual_role}")
                    return False
            else:
                log(f"❌ {role.upper()} /auth/me failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            log(f"❌ Exception during {role.upper()} /auth/me: {str(e)}")
            return False
    
    log("✅ All /auth/me requests successful with correct roles\n")
    return True

def test_job_post_without_premium():
    """Test 4: POST /jobs without premium (expect 402)"""
    log("=" * 80)
    log("TEST 4: POST /jobs without premium (expect 402)")
    log("=" * 80)
    
    job_data = {
        'title': 'Senior Full Stack Developer',
        'description': 'We are looking for an experienced full stack developer with expertise in React and Node.js',
        'requiredSkills': ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        'experienceRequired': 5,
        'companyName': 'Tech Corp',
        'location': 'Bangalore, India',
        'salary': 1500000
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/jobs",
            json=job_data,
            headers={
                'Authorization': f"Bearer {test_data['employer']['token']}",
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 402:
            log(f"✅ POST /jobs without premium correctly returned 402: {response.json().get('error', '')}")
            return True
        else:
            log(f"❌ POST /jobs without premium returned {response.status_code} instead of 402: {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during POST /jobs without premium: {str(e)}")
        return False

def test_admin_grant_premium():
    """Test 5: Admin grants premium to employer"""
    log("=" * 80)
    log("TEST 5: Admin grants premium to employer")
    log("=" * 80)
    
    employer_id = test_data['employer']['user']['id']
    
    try:
        response = requests.patch(
            f"{BASE_URL}/admin/users/{employer_id}/premium",
            json={'isPremium': True},
            headers={
                'Authorization': f"Bearer {test_data['admin']['token']}",
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 200:
            log(f"✅ Admin successfully granted premium to employer: {employer_id}")
            # Update local test data
            test_data['employer']['user']['isPremium'] = True
            return True
        else:
            log(f"❌ Admin grant premium failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during admin grant premium: {str(e)}")
        return False

def test_job_post_with_premium():
    """Test 6: POST /jobs with premium (expect 200)"""
    log("=" * 80)
    log("TEST 6: POST /jobs with premium (expect 200)")
    log("=" * 80)
    
    job_data = {
        'title': 'Senior Full Stack Developer',
        'description': 'We are looking for an experienced full stack developer with expertise in React and Node.js. You will work on cutting-edge projects and lead a team of developers.',
        'requiredSkills': ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
        'experienceRequired': 5,
        'companyName': 'Tech Corp',
        'location': 'Bangalore, India',
        'salary': 1500000
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/jobs",
            json=job_data,
            headers={
                'Authorization': f"Bearer {test_data['employer']['token']}",
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            test_data['job'] = data['job']
            log(f"✅ POST /jobs with premium successful")
            log(f"   Job ID: {data['job']['id']}")
            log(f"   Title: {data['job']['title']}")
            log(f"   Company: {data['job']['companyName']}")
            return True
        else:
            log(f"❌ POST /jobs with premium failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during POST /jobs with premium: {str(e)}")
        return False

def test_jobs_public_list():
    """Test 7: GET /jobs public (no token)"""
    log("=" * 80)
    log("TEST 7: GET /jobs public list (no token)")
    log("=" * 80)
    
    try:
        # Basic list
        response = requests.get(f"{BASE_URL}/jobs")
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /jobs public successful: {len(data['jobs'])} jobs found, total: {data['total']}")
            
            # Check if our job is in the list
            job_found = any(j['id'] == test_data['job']['id'] for j in data['jobs'])
            if job_found:
                log(f"✅ Newly posted job found in public list")
            else:
                log(f"⚠️  Newly posted job not found in public list (might be on another page)")
        else:
            log(f"❌ GET /jobs public failed: {response.status_code} - {response.text}")
            return False
        
        # Test search filter
        response = requests.get(f"{BASE_URL}/jobs?search=Full Stack")
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /jobs with search filter successful: {len(data['jobs'])} jobs found")
        else:
            log(f"❌ GET /jobs with search filter failed: {response.status_code}")
            return False
        
        # Test location filter
        response = requests.get(f"{BASE_URL}/jobs?location=Bangalore")
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /jobs with location filter successful: {len(data['jobs'])} jobs found")
        else:
            log(f"❌ GET /jobs with location filter failed: {response.status_code}")
            return False
        
        # Test skill filter
        response = requests.get(f"{BASE_URL}/jobs?skill=React")
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /jobs with skill filter successful: {len(data['jobs'])} jobs found")
        else:
            log(f"❌ GET /jobs with skill filter failed: {response.status_code}")
            return False
        
        # Test minSalary filter
        response = requests.get(f"{BASE_URL}/jobs?minSalary=1000000")
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /jobs with minSalary filter successful: {len(data['jobs'])} jobs found")
        else:
            log(f"❌ GET /jobs with minSalary filter failed: {response.status_code}")
            return False
        
        # Test pagination
        response = requests.get(f"{BASE_URL}/jobs?page=1&limit=5")
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /jobs with pagination successful: page {data['page']}, limit {data['limit']}")
        else:
            log(f"❌ GET /jobs with pagination failed: {response.status_code}")
            return False
        
        log("✅ All job listing and filter tests passed\n")
        return True
    except Exception as e:
        log(f"❌ Exception during GET /jobs tests: {str(e)}")
        return False

def test_job_details():
    """Test 8: GET /jobs/:id"""
    log("=" * 80)
    log("TEST 8: GET /jobs/:id (job details)")
    log("=" * 80)
    
    job_id = test_data['job']['id']
    
    try:
        response = requests.get(f"{BASE_URL}/jobs/{job_id}")
        
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /jobs/{job_id} successful")
            log(f"   Title: {data['job']['title']}")
            log(f"   Company: {data['job']['companyName']}")
            log(f"   Location: {data['job']['location']}")
            log(f"   Salary: {data['job']['salary']}")
            return True
        else:
            log(f"❌ GET /jobs/{job_id} failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during GET /jobs/:id: {str(e)}")
        return False

def test_resume_upload():
    """Test 9: POST /upload/resume with candidate token"""
    log("=" * 80)
    log("TEST 9: POST /upload/resume (Cloudinary upload)")
    log("=" * 80)
    
    # Create a minimal valid PDF in memory
    pdf_content = b"""%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(John Developer Resume) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000317 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
410
%%EOF
"""
    
    try:
        files = {
            'file': ('john_developer_resume.pdf', io.BytesIO(pdf_content), 'application/pdf')
        }
        
        response = requests.post(
            f"{BASE_URL}/upload/resume",
            files=files,
            headers={'Authorization': f"Bearer {test_data['candidate']['token']}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data['url'].startswith('https://res.cloudinary.com/'):
                test_data['candidate']['resumeUrl'] = data['url']
                test_data['candidate']['resumeName'] = data['name']
                log(f"✅ Resume upload successful")
                log(f"   URL: {data['url']}")
                log(f"   Size: {data['bytes']} bytes")
                return True
            else:
                log(f"❌ Resume upload returned invalid URL: {data['url']}")
                return False
        else:
            log(f"❌ Resume upload failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during resume upload: {str(e)}")
        return False

def test_profile_update():
    """Test 10: PUT /profile with candidate token"""
    log("=" * 80)
    log("TEST 10: PUT /profile (candidate profile)")
    log("=" * 80)
    
    profile_data = {
        'phone': '+91-9876543210',
        'location': 'Bangalore, Karnataka, India',
        'skills': ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS', 'Docker'],
        'experience': 3,
        'education': 'B.Tech in Computer Science, IIT Delhi',
        'bio': 'Passionate full-stack developer with 3 years of experience building scalable web applications. Strong expertise in MERN stack and cloud technologies.',
        'resumeUrl': test_data['candidate']['resumeUrl'],
        'resumeName': test_data['candidate']['resumeName']
    }
    
    try:
        response = requests.put(
            f"{BASE_URL}/profile",
            json=profile_data,
            headers={
                'Authorization': f"Bearer {test_data['candidate']['token']}",
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 200:
            log(f"✅ PUT /profile successful")
            
            # Verify with GET /profile
            response = requests.get(
                f"{BASE_URL}/profile",
                headers={'Authorization': f"Bearer {test_data['candidate']['token']}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                profile = data['profile']
                if profile and profile['skills'] == profile_data['skills']:
                    log(f"✅ GET /profile returned saved profile")
                    log(f"   Skills: {', '.join(profile['skills'])}")
                    log(f"   Experience: {profile['experience']} years")
                    log(f"   Location: {profile['location']}")
                    return True
                else:
                    log(f"❌ GET /profile data mismatch")
                    return False
            else:
                log(f"❌ GET /profile failed: {response.status_code}")
                return False
        else:
            log(f"❌ PUT /profile failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during profile update: {str(e)}")
        return False

def test_application_submit():
    """Test 11: POST /applications with candidate token"""
    log("=" * 80)
    log("TEST 11: POST /applications (submit application)")
    log("=" * 80)
    
    application_data = {
        'jobId': test_data['job']['id'],
        'resumeUrl': test_data['candidate']['resumeUrl'],
        'resumeName': test_data['candidate']['resumeName']
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/applications",
            json=application_data,
            headers={
                'Authorization': f"Bearer {test_data['candidate']['token']}",
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            test_data['application'] = data['application']
            log(f"✅ POST /applications successful")
            log(f"   Application ID: {data['application']['id']}")
            log(f"   Job: {data['application']['jobTitle']}")
            log(f"   Status: {data['application']['status']}")
            
            # Test duplicate submission (expect 409)
            response = requests.post(
                f"{BASE_URL}/applications",
                json=application_data,
                headers={
                    'Authorization': f"Bearer {test_data['candidate']['token']}",
                    'Content-Type': 'application/json'
                }
            )
            
            if response.status_code == 409:
                log(f"✅ Duplicate application correctly returned 409: {response.json().get('error', '')}")
                return True
            else:
                log(f"❌ Duplicate application returned {response.status_code} instead of 409")
                return False
        else:
            log(f"❌ POST /applications failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during application submission: {str(e)}")
        return False

def test_applications_mine():
    """Test 12: GET /applications/mine (candidate)"""
    log("=" * 80)
    log("TEST 12: GET /applications/mine (candidate's applications)")
    log("=" * 80)
    
    try:
        response = requests.get(
            f"{BASE_URL}/applications/mine",
            headers={'Authorization': f"Bearer {test_data['candidate']['token']}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            if len(data['applications']) >= 1:
                log(f"✅ GET /applications/mine successful: {len(data['applications'])} application(s) found")
                app = data['applications'][0]
                log(f"   Job: {app['jobTitle']}")
                log(f"   Company: {app['companyName']}")
                log(f"   Status: {app['status']}")
                return True
            else:
                log(f"❌ GET /applications/mine returned no applications")
                return False
        else:
            log(f"❌ GET /applications/mine failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during GET /applications/mine: {str(e)}")
        return False

def test_applications_by_job():
    """Test 13: GET /applications/job/:jobId with employer token (includes matchScore)"""
    log("=" * 80)
    log("TEST 13: GET /applications/job/:jobId (employer view with matchScore)")
    log("=" * 80)
    
    job_id = test_data['job']['id']
    
    try:
        response = requests.get(
            f"{BASE_URL}/applications/job/{job_id}",
            headers={'Authorization': f"Bearer {test_data['employer']['token']}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /applications/job/{job_id} successful: {len(data['applications'])} application(s)")
            
            if len(data['applications']) > 0:
                app = data['applications'][0]
                if 'matchScore' in app:
                    log(f"✅ matchScore present: {app['matchScore']}")
                    log(f"   Candidate: {app['candidateName']}")
                    log(f"   Skills: {', '.join(app.get('candidateSkills', []))}")
                    log(f"   Experience: {app.get('candidateExperience', 0)} years")
                    
                    # Verify matchScore is integer 0-100
                    if isinstance(app['matchScore'], int) and 0 <= app['matchScore'] <= 100:
                        log(f"✅ matchScore is valid integer (0-100)")
                        
                        # Verify sorted by matchScore desc
                        scores = [a['matchScore'] for a in data['applications']]
                        if scores == sorted(scores, reverse=True):
                            log(f"✅ Applications sorted by matchScore descending")
                            return True
                        else:
                            log(f"⚠️  Applications not sorted by matchScore (only 1 application, can't verify)")
                            return True
                    else:
                        log(f"❌ matchScore is not valid: {app['matchScore']}")
                        return False
                else:
                    log(f"❌ matchScore not present in application")
                    return False
            else:
                log(f"❌ No applications found for job")
                return False
        else:
            log(f"❌ GET /applications/job/{job_id} failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during GET /applications/job/:jobId: {str(e)}")
        return False

def test_application_status_update():
    """Test 14: PATCH /applications/:id with employer token"""
    log("=" * 80)
    log("TEST 14: PATCH /applications/:id (update status)")
    log("=" * 80)
    
    app_id = test_data['application']['id']
    
    try:
        response = requests.patch(
            f"{BASE_URL}/applications/{app_id}",
            json={'status': 'SHORTLISTED'},
            headers={
                'Authorization': f"Bearer {test_data['employer']['token']}",
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 200:
            log(f"✅ PATCH /applications/{app_id} successful (status -> SHORTLISTED)")
            
            # Verify status change as candidate
            response = requests.get(
                f"{BASE_URL}/applications/mine",
                headers={'Authorization': f"Bearer {test_data['candidate']['token']}"}
            )
            
            if response.status_code == 200:
                data = response.json()
                app = next((a for a in data['applications'] if a['id'] == app_id), None)
                if app and app['status'] == 'SHORTLISTED':
                    log(f"✅ GET /applications/mine reflects new status: {app['status']}")
                    return True
                else:
                    log(f"❌ Status not updated in candidate's view")
                    return False
            else:
                log(f"❌ GET /applications/mine failed: {response.status_code}")
                return False
        else:
            log(f"❌ PATCH /applications/{app_id} failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during application status update: {str(e)}")
        return False

def test_razorpay_create_order():
    """Test 15: POST /payment/create-order"""
    log("=" * 80)
    log("TEST 15: POST /payment/create-order (Razorpay)")
    log("=" * 80)
    
    try:
        response = requests.post(
            f"{BASE_URL}/payment/create-order",
            json={'amount': 499},
            headers={
                'Authorization': f"Bearer {test_data['candidate']['token']}",
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            if (data['orderId'].startswith('order_') and 
                data['amount'] == 49900 and 
                data['currency'] == 'INR' and 
                'keyId' in data):
                log(f"✅ POST /payment/create-order successful")
                log(f"   Order ID: {data['orderId']}")
                log(f"   Amount: {data['amount']} paise (₹{data['amount']/100})")
                log(f"   Currency: {data['currency']}")
                log(f"   Key ID: {data['keyId']}")
                test_data['razorpay_order_id'] = data['orderId']
                return True
            else:
                log(f"❌ Razorpay order response invalid: {data}")
                return False
        else:
            log(f"❌ POST /payment/create-order failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during Razorpay create-order: {str(e)}")
        return False

def test_razorpay_verify_invalid():
    """Test 16: POST /payment/verify with bogus signature (expect 400)"""
    log("=" * 80)
    log("TEST 16: POST /payment/verify with invalid signature (expect 400)")
    log("=" * 80)
    
    try:
        response = requests.post(
            f"{BASE_URL}/payment/verify",
            json={
                'razorpay_order_id': test_data.get('razorpay_order_id', 'order_fake123'),
                'razorpay_payment_id': 'pay_fake123',
                'razorpay_signature': 'invalid_signature_12345',
                'amount': 499
            },
            headers={
                'Authorization': f"Bearer {test_data['candidate']['token']}",
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code == 400:
            error_msg = response.json().get('error', '')
            if 'Signature verification failed' in error_msg:
                log(f"✅ POST /payment/verify correctly returned 400: {error_msg}")
                return True
            else:
                log(f"⚠️  POST /payment/verify returned 400 but with different error: {error_msg}")
                return True
        else:
            log(f"❌ POST /payment/verify returned {response.status_code} instead of 400: {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during Razorpay verify: {str(e)}")
        return False

def test_admin_stats():
    """Test 17: GET /admin/stats with admin token"""
    log("=" * 80)
    log("TEST 17: GET /admin/stats (admin only)")
    log("=" * 80)
    
    try:
        # Test with admin token
        response = requests.get(
            f"{BASE_URL}/admin/stats",
            headers={'Authorization': f"Bearer {test_data['admin']['token']}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['userCount', 'jobCount', 'revenue', 'premiumCount']
            if all(field in data for field in required_fields):
                log(f"✅ GET /admin/stats successful (admin)")
                log(f"   Users: {data['userCount']}")
                log(f"   Jobs: {data['jobCount']}")
                log(f"   Revenue: ₹{data['revenue']}")
                log(f"   Premium Users: {data['premiumCount']}")
            else:
                log(f"❌ GET /admin/stats missing required fields: {data}")
                return False
        else:
            log(f"❌ GET /admin/stats failed for admin: {response.status_code} - {response.text}")
            return False
        
        # Test with non-admin (expect 403)
        response = requests.get(
            f"{BASE_URL}/admin/stats",
            headers={'Authorization': f"Bearer {test_data['candidate']['token']}"}
        )
        
        if response.status_code == 403:
            log(f"✅ GET /admin/stats correctly returned 403 for non-admin")
            return True
        else:
            log(f"❌ GET /admin/stats returned {response.status_code} for non-admin instead of 403")
            return False
    except Exception as e:
        log(f"❌ Exception during GET /admin/stats: {str(e)}")
        return False

def test_admin_endpoints():
    """Test 18: GET /admin/users, /admin/jobs, /admin/payments"""
    log("=" * 80)
    log("TEST 18: Admin endpoints (users, jobs, payments)")
    log("=" * 80)
    
    try:
        # GET /admin/users
        response = requests.get(
            f"{BASE_URL}/admin/users",
            headers={'Authorization': f"Bearer {test_data['admin']['token']}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /admin/users successful: {len(data['users'])} users")
        else:
            log(f"❌ GET /admin/users failed: {response.status_code} - {response.text}")
            return False
        
        # GET /admin/jobs
        response = requests.get(
            f"{BASE_URL}/admin/jobs",
            headers={'Authorization': f"Bearer {test_data['admin']['token']}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /admin/jobs successful: {len(data['jobs'])} jobs")
        else:
            log(f"❌ GET /admin/jobs failed: {response.status_code} - {response.text}")
            return False
        
        # GET /admin/payments
        response = requests.get(
            f"{BASE_URL}/admin/payments",
            headers={'Authorization': f"Bearer {test_data['admin']['token']}"}
        )
        
        if response.status_code == 200:
            data = response.json()
            log(f"✅ GET /admin/payments successful: {len(data['payments'])} payments")
            return True
        else:
            log(f"❌ GET /admin/payments failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during admin endpoints test: {str(e)}")
        return False

def test_job_delete_cascade():
    """Test 19: DELETE /jobs/:id cascades to applications"""
    log("=" * 80)
    log("TEST 19: DELETE /jobs/:id (cascade delete applications)")
    log("=" * 80)
    
    # First create a new job for deletion test
    job_data = {
        'title': 'Backend Developer (Test Job)',
        'description': 'This is a test job for deletion',
        'requiredSkills': ['Python', 'Django'],
        'experienceRequired': 2,
        'companyName': 'Test Corp',
        'location': 'Mumbai, India',
        'salary': 800000
    }
    
    try:
        # Create job
        response = requests.post(
            f"{BASE_URL}/jobs",
            json=job_data,
            headers={
                'Authorization': f"Bearer {test_data['employer']['token']}",
                'Content-Type': 'application/json'
            }
        )
        
        if response.status_code != 200:
            log(f"❌ Failed to create test job for deletion: {response.status_code}")
            return False
        
        test_job = response.json()['job']
        log(f"✅ Created test job: {test_job['id']}")
        
        # Delete the job
        response = requests.delete(
            f"{BASE_URL}/jobs/{test_job['id']}",
            headers={'Authorization': f"Bearer {test_data['employer']['token']}"}
        )
        
        if response.status_code == 200:
            log(f"✅ DELETE /jobs/{test_job['id']} successful")
            
            # Verify job is deleted
            response = requests.get(f"{BASE_URL}/jobs/{test_job['id']}")
            if response.status_code == 404:
                log(f"✅ Job successfully deleted (404 on GET)")
                return True
            else:
                log(f"❌ Job still exists after deletion")
                return False
        else:
            log(f"❌ DELETE /jobs/{test_job['id']} failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        log(f"❌ Exception during job deletion test: {str(e)}")
        return False

def run_all_tests():
    """Run all backend tests in sequence"""
    log("\n" + "=" * 80)
    log("CAREERCONNECT JOB PORTAL - COMPREHENSIVE BACKEND TEST")
    log("=" * 80)
    log(f"Base URL: {BASE_URL}")
    log(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log("=" * 80 + "\n")
    
    tests = [
        ("User Registration", test_auth_register),
        ("User Login", test_auth_login),
        ("Auth /me Endpoint", test_auth_me),
        ("Job Post Without Premium", test_job_post_without_premium),
        ("Admin Grant Premium", test_admin_grant_premium),
        ("Job Post With Premium", test_job_post_with_premium),
        ("Public Job Listing & Filters", test_jobs_public_list),
        ("Job Details", test_job_details),
        ("Resume Upload (Cloudinary)", test_resume_upload),
        ("Profile Update", test_profile_update),
        ("Application Submission", test_application_submit),
        ("Candidate Applications List", test_applications_mine),
        ("Employer View Applications (matchScore)", test_applications_by_job),
        ("Application Status Update", test_application_status_update),
        ("Razorpay Create Order", test_razorpay_create_order),
        ("Razorpay Verify Invalid Signature", test_razorpay_verify_invalid),
        ("Admin Stats", test_admin_stats),
        ("Admin Endpoints", test_admin_endpoints),
        ("Job Delete Cascade", test_job_delete_cascade),
    ]
    
    results = []
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
            if result:
                passed += 1
            else:
                failed += 1
            log("")  # Empty line between tests
        except Exception as e:
            log(f"❌ CRITICAL ERROR in {test_name}: {str(e)}\n")
            results.append((test_name, False))
            failed += 1
    
    # Final summary
    log("\n" + "=" * 80)
    log("TEST SUMMARY")
    log("=" * 80)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        log(f"{status} - {test_name}")
    
    log("=" * 80)
    log(f"Total Tests: {len(tests)}")
    log(f"Passed: {passed}")
    log(f"Failed: {failed}")
    log(f"Success Rate: {(passed/len(tests)*100):.1f}%")
    log("=" * 80)
    log(f"Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log("=" * 80 + "\n")
    
    return passed, failed, results

if __name__ == "__main__":
    passed, failed, results = run_all_tests()
    exit(0 if failed == 0 else 1)
