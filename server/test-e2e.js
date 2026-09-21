const BASE_URL = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

async function runE2ETest() {
  console.log('🚀 Starting End-to-End System Verification...\n');

  try {
    // 1. Health check
    const health = await req(`${BASE_URL}/health`);
    console.log('✅ 1. Health Check:', health);

    // 2. Student Login
    const studentLogin = await req(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'student@college.edu',
        password: 'Student@123',
      }),
    });
    const studentToken = studentLogin.token;
    console.log('✅ 2. Student Logged In:', studentLogin.user.name, `(${studentLogin.user.role})`);

    // 3. Student submits complaint
    const newComplaintRes = await req(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        title: 'AC unit dripping water on podium in Seminar Hall 1',
        category: 'Infrastructure',
        location: 'Academic Block B, Seminar Hall 1',
        priority: 'High',
        description: 'The split AC unit right above the speaker podium has developed a condensate leak and is not cooling properly.',
      }),
    });
    const complaintId = newComplaintRes.complaint._id;
    console.log('✅ 3. Complaint Created successfully! ID:', complaintId, 'Status:', newComplaintRes.complaint.status);

    // 4. Student adds follow-up comment
    const commentRes = await req(`${BASE_URL}/complaints/${complaintId}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        message: 'Guest lecture scheduled tomorrow at 10 AM, priority resolution requested.',
      }),
    });
    console.log('✅ 4. Student Comment Posted:', commentRes.comment.message);

    // 5. Admin Login
    const adminLogin = await req(`${BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@college.edu',
        password: 'Admin@123',
      }),
    });
    const adminToken = adminLogin.token;
    console.log('✅ 5. Admin Logged In:', adminLogin.user.name, `(${adminLogin.user.role})`);

    // 6. Admin assigns and moves to In Progress
    const updateProgress = await req(`${BASE_URL}/complaints/${complaintId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'In Progress',
        priority: 'High',
        assignedDepartment: 'Estate & Infrastructure',
        assignedStaff: 'Mr. Ramesh (HVAC Tech)',
        commentMessage: 'HVAC technician dispatched with replacement condensate tray.',
      }),
    });
    console.log('✅ 6. Admin Updated Complaint to In Progress:', updateProgress.complaint.status, 'Dept:', updateProgress.complaint.assignedDepartment);

    // 7. Admin resolves complaint
    const updateResolved = await req(`${BASE_URL}/complaints/${complaintId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        status: 'Resolved',
        resolutionDetails: 'Condensate drain cleared and AC coil chemical wash completed. System tested and cooling normally.',
        commentMessage: 'Maintenance complete and verified.',
      }),
    });
    console.log('✅ 7. Admin Marked Complaint Resolved:', updateResolved.complaint.status, 'Resolution:', updateResolved.complaint.resolutionDetails);

    // 8. Student leaves 5-star rating & review
    const feedbackRes = await req(`${BASE_URL}/complaints/${complaintId}/feedback`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        rating: 5,
        feedback: 'Excellent response time! The seminar hall AC was functioning perfectly for the lecture.',
      }),
    });
    console.log('✅ 8. Student Rated Complaint:', feedbackRes.complaint.rating, 'Stars. Final Status:', feedbackRes.complaint.status);

    // 9. Fetch Complaint Details to verify full lifecycle history
    const detailRes = await req(`${BASE_URL}/complaints/${complaintId}`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log('✅ 9. Verification of Full Activity Log: Total Events:', detailRes.comments.length);

    // 10. Check Admin Analytics / Stats
    const statsRes = await req(`${BASE_URL}/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log('✅ 10. System Analytics Verified:');
    console.log('     Total Complaints:', statsRes.stats.total);
    console.log('     Resolved/Closed:', statsRes.stats.resolved + statsRes.stats.closed);
    console.log('     Avg Resolution Hours:', statsRes.stats.avgResolutionHours, 'hrs');

    console.log('\n🎉 ALL 10 END-TO-END WORKFLOW TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ Test Failed:', err.message);
    process.exit(1);
  }
}

runE2ETest();
