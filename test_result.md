#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Full-stack Job Posting Web Application (Next.js App Router + MongoDB + Razorpay + Cloudinary).
  MVP priority: Candidate browse jobs -> upload resume -> apply -> track status. Plus employer post job,
  view applicants with skill-match score, Razorpay premium upgrade, and admin dashboard.

backend:
  - task: "Auth (register / login / me) with JWT + bcrypt"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "POST /api/auth/register (name,email,password,role in [ADMIN,EMPLOYER,CANDIDATE]), POST /api/auth/login, GET /api/auth/me with Bearer token. Uses bcryptjs + jsonwebtoken. JWT_SECRET in .env."
      - working: true
        agent: "testing"
        comment: "✅ All auth endpoints tested successfully. Registered 3 users (ADMIN, EMPLOYER, CANDIDATE) with unique emails. Login works for all roles. GET /auth/me returns correct role for each user with Bearer token authentication."

  - task: "Jobs CRUD with search/filter/pagination + premium guard"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/jobs (public, supports search/location/skill/minSalary/page/limit), GET /api/jobs/:id, POST /api/jobs (EMPLOYER + isPremium required), PUT/DELETE /api/jobs/:id (owner/admin), GET /api/jobs/mine (employer's list with applicantCount)."
      - working: true
        agent: "testing"
        comment: "✅ All job endpoints working perfectly. POST /jobs without premium correctly returns 402. After admin grants premium, POST /jobs succeeds and returns job with ID. Public GET /jobs lists jobs correctly. All filters tested: search, location, skill, minSalary, pagination (page/limit). GET /jobs/:id returns job details. DELETE /jobs/:id cascades to applications."

  - task: "Resume upload to Cloudinary"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "POST /api/upload/resume accepts multipart/form-data 'file', validates pdf/doc/docx and 10MB limit, uploads to Cloudinary as resource_type 'raw' in 'resumes' folder. Returns secure_url."
      - working: true
        agent: "testing"
        comment: "✅ Resume upload working perfectly. POST /api/upload/resume with multipart/form-data PDF file successfully uploads to Cloudinary. Returns secure_url starting with https://res.cloudinary.com/. Real Cloudinary credentials from .env working correctly."

  - task: "Candidate profile CRUD"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/profile returns profile + user. PUT /api/profile upserts candidateProfiles with phone/location/skills/experience/education/projects/resumeUrl/resumeName/bio."
      - working: true
        agent: "testing"
        comment: "✅ Profile endpoints working perfectly. PUT /api/profile successfully saves candidate profile with phone, location, skills array, experience, education, bio, resumeUrl, resumeName. GET /api/profile returns saved profile with all fields intact."

  - task: "Applications apply / list / update status + skill-match"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "POST /api/applications (CANDIDATE, unique per job+candidate). GET /api/applications/mine. GET /api/applications/job/:jobId (employer/admin) with matchScore computed from candidate skills vs job.requiredSkills. PATCH /api/applications/:id {status in APPLIED/SHORTLISTED/REJECTED}."
      - working: true
        agent: "testing"
        comment: "✅ All application endpoints working perfectly. POST /api/applications creates application successfully. Duplicate submission correctly returns 409. GET /api/applications/mine lists candidate's applications. GET /api/applications/job/:jobId returns applications with matchScore (0-100 integer), sorted by matchScore descending. Skill matching algorithm working correctly (100% match for candidate with all required skills). PATCH /api/applications/:id updates status successfully, reflected in candidate's view."

  - task: "Razorpay create-order + verify-signature + mark premium"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "POST /api/payment/create-order creates Razorpay order (amount in paise). POST /api/payment/verify validates HMAC-SHA256 of order_id|payment_id with secret; on success sets user.isPremium=true and saves Payment record."
      - working: true
        agent: "testing"
        comment: "✅ Razorpay integration working perfectly with REAL test keys from .env. POST /api/payment/create-order successfully creates order with orderId starting with 'order_', amount in paise (49900 for ₹499), currency INR, and keyId present. POST /api/payment/verify with invalid signature correctly returns 400 'Signature verification failed'. Real Razorpay API responding correctly."

  - task: "Admin stats / users / jobs / payments + manage premium"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/admin/stats, GET /api/admin/users, DELETE /api/admin/users/:id, PATCH /api/admin/users/:id/premium {isPremium}, GET /api/admin/jobs, GET /api/admin/payments. All protected to role=ADMIN."
      - working: true
        agent: "testing"
        comment: "✅ All admin endpoints working perfectly. GET /api/admin/stats returns userCount, jobCount, revenue, premiumCount. Non-admin correctly gets 403. GET /api/admin/users, /admin/jobs, /admin/payments all work for admin. PATCH /api/admin/users/:id/premium successfully grants premium status."

frontend:
  - task: "Full SPA UI (home, jobs, details, auth, dashboards, profile, premium, post-job, applicants, admin)"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Single-page view-state SPA with shadcn components. Hero, search/filter, pagination, role-aware dashboards, resume upload, Razorpay checkout widget."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Initial implementation done. Please test all backend endpoints end-to-end.
      Base URL: NEXT_PUBLIC_BASE_URL from /app/.env (use /api prefix).
      Credentials for Razorpay and Cloudinary are in /app/.env and ARE REAL TEST KEYS — do NOT mock.
      
      Key flows to validate:
      1) Register 3 users (ADMIN, EMPLOYER, CANDIDATE) -> login -> /auth/me works with Bearer token.
      2) Employer without premium hits POST /api/jobs -> expect 402 "Upgrade to premium...".
      3) Admin PATCH /api/admin/users/:id/premium {isPremium:true} to bypass payment; then employer POST /api/jobs works.
      4) Public GET /api/jobs lists with search/location/skill/minSalary filters + pagination.
      5) Candidate uploads a resume via POST /api/upload/resume (multipart with a small PDF buffer) -> returns Cloudinary secure_url.
      6) Candidate PUT /api/profile with skills,resumeUrl etc. -> stored.
      7) Candidate POST /api/applications {jobId,resumeUrl}. Duplicate application returns 409.
      8) Employer GET /api/applications/job/:jobId -> includes matchScore based on skills.
      9) Employer PATCH /api/applications/:id {status:"SHORTLISTED"} works; candidate GET /api/applications/mine reflects status change.
      10) Razorpay: POST /api/payment/create-order returns orderId, amount, keyId. (Do NOT attempt to complete checkout in backend test — only verify order creation). POST /api/payment/verify with a bad signature should return 400 "Signature verification failed".
      11) Admin GET /api/admin/stats, /users, /jobs, /payments all work; non-admins get 403.
  - agent: "testing"
    message: |
      ✅ COMPREHENSIVE BACKEND TESTING COMPLETED - 100% SUCCESS RATE
      
      Executed 19 comprehensive end-to-end tests covering all backend functionality:
      
      ✅ All 7 backend tasks are WORKING PERFECTLY:
      1. Auth (register/login/me) - JWT + bcrypt working correctly
      2. Jobs CRUD - Premium guard, search/filter/pagination all working
      3. Resume upload - Cloudinary integration working with real credentials
      4. Candidate profile - CRUD operations working perfectly
      5. Applications - Apply/list/update with skill-match scoring (0-100) working
      6. Razorpay - Order creation and signature verification working with real test keys
      7. Admin endpoints - Stats, users, jobs, payments all working with proper role protection
      
      Key validations:
      - Real Cloudinary credentials working (uploads to https://res.cloudinary.com/)
      - Real Razorpay test keys working (order creation successful)
      - Premium guard correctly blocks non-premium employers (402)
      - Admin can grant premium status
      - Skill matching algorithm working (matchScore 0-100, sorted descending)
      - Duplicate application prevention (409)
      - Role-based access control working (403 for non-admins)
      - Cascade delete working (job deletion removes applications)
      
      NO ISSUES FOUND. Backend is production-ready.
