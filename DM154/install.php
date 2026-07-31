<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meseret Solar | System Installer & Database Seeder</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    body { background: linear-gradient(135deg, #0f2117 0%, #13713a 100%); color: #0f172a; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .setup-card { background: rgba(255, 255, 255, 0.98); width: 100%; max-width: 620px; border-radius: 20px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); }
    .setup-header { text-align: center; margin-bottom: 28px; }
    .setup-logo { width: 56px; height: 56px; background: linear-gradient(135deg, #16a34a, #15803d); border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 24px; margin-bottom: 12px; box-shadow: 0 8px 20px rgba(22, 163, 74, 0.4); }
    .setup-title { font-size: 24px; font-weight: 800; color: #0f172a; }
    .setup-subtitle { font-size: 13px; color: #16a34a; font-weight: 700; margin-top: 4px; }
    .section-label { font-size: 13px; font-weight: 700; color: #16a34a; text-transform: uppercase; margin-bottom: 12px; display: block; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px; }
    .form-control { width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; outline: none; transition: all 0.2s; }
    .form-control:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .btn-install { width: 100%; padding: 16px; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 800; cursor: pointer; box-shadow: 0 8px 20px rgba(22, 163, 74, 0.35); transition: all 0.2s; margin-top: 12px; }
    .btn-install:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(22, 163, 74, 0.45); }
    .alert-box { padding: 12px 16px; border-radius: 10px; font-size: 13px; margin-bottom: 20px; display: none; }
    .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: #ef4444; }
    .alert-success { background: #dcfce7; border: 1px solid #bbf7d0; color: #15803d; }
  </style>
</head>
<body>

<div class="setup-card">
  <div class="setup-header">
    <div class="setup-logo">☀️</div>
    <h1 class="setup-title">Meseret Solar Setup & Seeder</h1>
    <p class="setup-subtitle">1-Click Database Setup & Frontend Content Migration</p>
  </div>

  <div id="alertBox" class="alert-box"></div>

  <form id="setupForm">
    <span class="section-label">1. MySQL Database Configuration</span>
    <div class="form-grid">
      <div class="form-group">
        <label>Database Host</label>
        <input type="text" id="db_host" class="form-control" value="127.0.0.1" required />
      </div>
      <div class="form-group">
        <label>Database Port</label>
        <input type="text" id="db_port" class="form-control" value="3306" required />
      </div>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label>Database Name</label>
        <input type="text" id="db_name" class="form-control" value="meseret_db" required />
      </div>
      <div class="form-group">
        <label>Database Username</label>
        <input type="text" id="db_user" class="form-control" value="root" required />
      </div>
    </div>

    <div class="form-group">
      <label>Database Password</label>
      <input type="password" id="db_pass" class="form-control" placeholder="Leave empty if none" />
    </div>

    <span class="section-label" style="margin-top: 16px;">2. Super Admin Credentials</span>
    <div class="form-grid">
      <div class="form-group">
        <label>Admin Username</label>
        <input type="text" id="admin_user" class="form-control" value="admin" required />
      </div>
      <div class="form-group">
        <label>Admin Email</label>
        <input type="email" id="admin_email" class="form-control" value="admin@meseretmare.com" required />
      </div>
    </div>

    <div class="form-group">
      <label>Admin Password</label>
      <input type="password" id="admin_pass" class="form-control" value="admin123" required />
    </div>

    <button type="submit" id="submitBtn" class="btn-install">
      Initialize Database & Seed 38 Products + 12 News + Sections
    </button>
  </form>
</div>

<script>
document.getElementById('setupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const alertBox = document.getElementById('alertBox');
  const submitBtn = document.getElementById('submitBtn');
  
  alertBox.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.innerText = 'Installing & Seeding Database...';

  const payload = {
    db_host: document.getElementById('db_host').value.trim(),
    db_port: document.getElementById('db_port').value.trim(),
    db_name: document.getElementById('db_name').value.trim(),
    db_user: document.getElementById('db_user').value.trim(),
    db_pass: document.getElementById('db_pass').value,
    admin_user: document.getElementById('admin_user').value.trim(),
    admin_email: document.getElementById('admin_email').value.trim(),
    admin_pass: document.getElementById('admin_pass').value.trim()
  };

  try {
    const res = await fetch('/DM154/api/setup.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      alertBox.className = 'alert-box alert-success';
      alertBox.innerText = data.message;
      alertBox.style.display = 'block';
      setTimeout(() => {
        window.location.href = '/DM154/';
      }, 1500);
    } else {
      alertBox.className = 'alert-box alert-error';
      alertBox.innerText = data.error || 'Installation failed.';
      alertBox.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.innerText = 'Initialize Database & Seed Data';
    }
  } catch (err) {
    alertBox.className = 'alert-box alert-error';
    alertBox.innerText = 'Network error: ' + err.message;
    alertBox.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.innerText = 'Initialize Database & Seed Data';
  }
});
</script>

</body>
</html>
