// Validation functions
function validateName(name, errorId) {
  const error = document.getElementById(errorId);
  if (name.length < 2 || name.length > 50) {
    error.classList.add("show");
    return false;
  }
  error.classList.remove("show");
  return true;
}

function validateEmail(email, errorId) {
  const error = document.getElementById(errorId);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    error.classList.add("show");
    return false;
  }
  error.classList.remove("show");
  return true;
}

function validatePassword(password, errorId) {
  const error = document.getElementById(errorId);
  if (password.length < 6) {
    error.classList.add("show");
    return false;
  }
  error.classList.remove("show");
  return true;
}

function validatePhone(phone, errorId) {
  const error = document.getElementById(errorId);
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone) || phone.length < 10) {
    error.classList.add("show");
    return false;
  }
  error.classList.remove("show");
  return true;
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach(error => {
    error.classList.remove("show");
  });
}

// Search functionality
function searchReports(query) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const categoryFilter = document.getElementById('categoryFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;
  const siteFilter = document.getElementById('siteFilter').value;
  const itemFilter = document.getElementById('itemFilter').value;
  const rewardFilter = document.getElementById('rewardFilter').value;
  
  let filtered = reports.filter(report => {
    // Text search
    const searchText = query.toLowerCase();
    const textMatch = !query || 
      report.name.toLowerCase().includes(searchText) ||
      report.email.toLowerCase().includes(searchText) ||
      report.description.toLowerCase().includes(searchText) ||
      report.items.toLowerCase().includes(searchText) ||
      (report.site && report.site.toLowerCase().includes(searchText)) ||
      (report.location && report.location.toLowerCase().includes(searchText));
    
    // Category filters
    let categoryMatch = true;
    
    if (categoryFilter === 'type') {
      if (typeFilter) {
        categoryMatch = report.type.toLowerCase() === typeFilter;
      }
    } else if (categoryFilter === 'site') {
      if (siteFilter) {
        categoryMatch = report.site === siteFilter;
      }
    } else if (categoryFilter === 'item') {
      if (itemFilter) {
        // Check if the item filter matches any of the items in the report
        const reportItems = report.items.split(',').map(item => item.trim());
        categoryMatch = reportItems.includes(itemFilter);
      }
    } else if (categoryFilter === 'reward') {
      if (rewardFilter === 'yes') {
        categoryMatch = report.reward && report.reward.trim() !== '';
      } else if (rewardFilter === 'no') {
        categoryMatch = !report.reward || report.reward.trim() === '';
      }
    }
    
    return textMatch && categoryMatch;
  });
  
  displayReports(filtered);
}

// Admin search functionality
function adminSearchReports(query) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const categoryFilter = document.getElementById('adminCategoryFilter').value;
  const typeFilter = document.getElementById('adminTypeFilter').value;
  const siteFilter = document.getElementById('adminSiteFilter').value;
  const itemFilter = document.getElementById('adminItemFilter').value;
  const rewardFilter = document.getElementById('adminRewardFilter').value;
  
  let filtered = reports.filter(report => {
    // Text search
    const searchText = query.toLowerCase();
    const textMatch = !query || 
      report.name.toLowerCase().includes(searchText) ||
      report.email.toLowerCase().includes(searchText) ||
      report.description.toLowerCase().includes(searchText) ||
      report.items.toLowerCase().includes(searchText) ||
      (report.site && report.site.toLowerCase().includes(searchText)) ||
      (report.location && report.location.toLowerCase().includes(searchText));
    
    // Category filters
    let categoryMatch = true;
    
    if (categoryFilter === 'type') {
      if (typeFilter) {
        categoryMatch = report.type.toLowerCase() === typeFilter;
      }
    } else if (categoryFilter === 'site') {
      if (siteFilter) {
        categoryMatch = report.site === siteFilter;
      }
    } else if (categoryFilter === 'item') {
      if (itemFilter) {
        // Check if the item filter matches any of the items in the report
        const reportItems = report.items.split(',').map(item => item.trim());
        categoryMatch = reportItems.includes(itemFilter);
      }
    } else if (categoryFilter === 'reward') {
      if (rewardFilter === 'yes') {
        categoryMatch = report.reward && report.reward.trim() !== '';
      } else if (rewardFilter === 'no') {
        categoryMatch = !report.reward || report.reward.trim() === '';
      }
    }
    
    return textMatch && categoryMatch;
  });
  
  displayAdminReports(filtered);
}

// Display reports
function displayReports(reports) {
  const container = document.getElementById("reportsContainer");
  container.innerHTML = "";
  
  if (reports.length === 0) {
    container.innerHTML = "<p style='color: rgba(255, 255, 255, 0.7); text-align: center; padding: 20px;'>No reports found.</p>";
    return;
  }
  
  reports.forEach(report => {
    const div = document.createElement("div");
    div.className = `report-item ${report.type.toLowerCase()}`; // Add 'found' or 'lost' class
    
    // Check if user info should be hidden (admin marked as hidden)
    const isHidden = report.hiddenInfo || false;
    
    // Create image element if image data exists
    let imageHtml = '';
    if (report.imageData) {
      imageHtml = `<img src="${report.imageData}" alt="${report.items}" />`;
    }
    
    div.innerHTML = `
      ${imageHtml}
      <div class="report-content">
        <h4>${report.type} - ${report.items}</h4>
        <p><strong>Name:</strong> ${isHidden ? '[Hidden]' : report.name}</p>
        <p><strong>Email:</strong> ${isHidden ? '[Hidden]' : report.email}</p>
        <p><strong>Phone:</strong> ${isHidden ? '[Hidden]' : report.phone}</p>
        ${report.site ? `<p><strong>Site:</strong> ${report.site}</p>` : ""}
        ${report.location ? `<p><strong>Location:</strong> ${report.location}</p>` : ""}
        <p><strong>Description:</strong> ${report.description}</p>
        ${report.date ? `<p><strong>Date:</strong> ${report.date}</p>` : ""}
        ${report.reward ? `<p><strong>Reward:</strong> ${report.reward}</p>` : ""}
      </div>
    `;
    container.appendChild(div);
  });
}

// Show Lost Item form
function showLost() {
  hideAll();
  document.getElementById("lost").classList.remove("hidden");
}

// Show Reports
function showReports() {
  hideAll();
  document.getElementById("reportsList").classList.remove("hidden");
  displayReports(JSON.parse(localStorage.getItem('reports') || '[]'));
}

// Hide Reports
function hideReports() {
  document.getElementById("reportsList").classList.add("hidden");
}

// Go back to dashboard (hide all forms)
function goBack() {
  hideAll();
  // Clear form data when going back
  document.querySelectorAll('form').forEach(form => {
    form.reset();
  });
  // Clear character counters
  document.querySelectorAll('.char-counter span').forEach(counter => {
    counter.textContent = '0';
  });
  // Clear selected items
  selectedItems = [];
  selectedFoundItems = [];
  selectedFoundSite = '';
  selectedLostSite = '';
  // Reset item button colors
  document.querySelectorAll('.item-buttons button').forEach(btn => {
    btn.style.background = '#e6efff';
    btn.style.color = '#1a1a2e';
  });
  // Reset site button colors
  document.querySelectorAll('.site-buttons button').forEach(btn => {
    btn.classList.remove('selected');
    btn.style.background = '#e8f4fd';
    btn.style.color = '#1a1a2e';
  });
}

// Hide all form sections
function hideAll() {
  document.querySelectorAll(".form-card").forEach(section => {
    section.classList.add("hidden");
  });
}

// Track selected sites
let selectedFoundSite = '';
let selectedLostSite = '';

// Select site for location
function selectSite(btn, type) {
  const site = btn.innerText;
  
  if (type === 'found') {
    // Clear previous selection
    document.querySelectorAll('#found .site-buttons button').forEach(button => {
      button.classList.remove('selected');
      button.style.background = '#e8f4fd';
      button.style.color = '#1a1a2e';
    });
    
    // Set new selection
    btn.classList.add('selected');
    btn.style.background = '#1a1a2e';
    btn.style.color = '#fff';
    selectedFoundSite = site;
  } else {
    // Clear previous selection
    document.querySelectorAll('#lost .site-buttons button').forEach(button => {
      button.classList.remove('selected');
      button.style.background = '#e8f4fd';
      button.style.color = '#1a1a2e';
    });
    
    // Set new selection
    btn.classList.add('selected');
    btn.style.background = '#1a1a2e';
    btn.style.color = '#fff';
    selectedLostSite = site;
  }
}

// Track selected items
let selectedItems = [];
let selectedFoundItems = [];

// Select Lost Item
function selectItem(btn) {
  toggleSelection(btn, selectedItems, "description", "lostOthersInput");
}

// Select Found Item
function selectFound(btn) {
  toggleSelection(btn, selectedFoundItems, "foundDescription", "foundOthersInput");
}

// Toggle item selection
function toggleSelection(btn, arr, descId, othersInputId) {
  const item = btn.innerText;
  
  // Handle Others category
  if (item === 'Others') {
    // Clear all other selections
    arr.length = 0;
    document.querySelectorAll('.item-buttons button').forEach(button => {
      if (button.innerText !== 'Others') {
        button.style.background = "rgba(255, 255, 255, 0.15)";
        button.style.color = "#fff";
      }
    });
    
    // Show/hide others input
    const othersInput = document.getElementById(othersInputId);
    if (arr.includes('Others')) {
      // Deselect Others
      arr.splice(arr.indexOf('Others'), 1);
      btn.style.background = "rgba(255, 255, 255, 0.15)";
      btn.style.color = "#fff";
      othersInput.classList.remove('show');
    } else {
      // Select Others
      arr.push('Others');
      btn.style.background = "rgba(102, 126, 234, 0.6)";
      btn.style.color = "#fff";
      othersInput.classList.add('show');
    }
  } else {
    // Handle regular items
    // Clear Others selection if any regular item is selected
    const othersBtn = Array.from(document.querySelectorAll('.item-buttons button')).find(b => b.innerText === 'Others');
    if (othersBtn) {
      const othersIndex = arr.indexOf('Others');
      if (othersIndex > -1) {
        arr.splice(othersIndex, 1);
        othersBtn.style.background = "rgba(255, 255, 255, 0.15)";
        othersBtn.style.color = "#fff";
        document.getElementById(othersInputId).classList.remove('show');
      }
    }
    
    if (arr.includes(item)) {
      // Remove item from selection
      arr.splice(arr.indexOf(item), 1);
      btn.style.background = "rgba(255, 255, 255, 0.15)";
      btn.style.color = "#fff";
    } else {
      // Add item to selection
      arr.push(item);
      btn.style.background = "rgba(102, 126, 234, 0.6)";
      btn.style.color = "#fff";
    }
  }

  // Update description field
  updateDescriptionField(arr, descId, othersInputId);
}

// Update description field based on selections
function updateDescriptionField(arr, descId, othersInputId) {
  let itemsText = '';
  
  if (arr.includes('Others')) {
    const othersInput = document.getElementById(othersInputId.replace('Input', 'Specify'));
    const othersValue = othersInput ? othersInput.value.trim() : '';
    if (othersValue) {
      itemsText = othersValue;
    }
  } else {
    itemsText = arr.join(", ");
  }
  
  document.getElementById(descId).value = itemsText;
  
  // Update character counter for description
  updateCharCounter(descId);
}

// Character counter functionality
function updateCharCounter(fieldId) {
  const field = document.getElementById(fieldId);
  const counterId = fieldId + "Count";
  const counter = document.getElementById(counterId);
  if (counter) {
    counter.textContent = field.value.length;
  }
}

// Save report to localStorage
function saveReport(report) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  reports.push(report);
  localStorage.setItem('reports', JSON.stringify(reports));
}

// Handle login
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  
  // Debug logging
  console.log('Login attempt:', { email, password });
  
  // Clear previous errors
  clearErrors();
  
  // Validate inputs
  let isValid = true;
  
  if (!validateEmail(email, "emailError")) isValid = false;
  if (!validatePassword(password, "passwordError")) isValid = false;
  
  if (isValid) {
    console.log('Validation passed, checking admin credentials...');
    
    // Check for admin credentials first
    if (email === "admin@gmail.com" && password === "admin123") {
      console.log('Admin credentials verified!');
      
      const adminUser = {
        name: "Administrator",
        email: "admin@gmail.com",
        password: password, // Store the actual password!
        role: "admin",
        isAdmin: true
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      document.getElementById("userName").textContent = adminUser.name;
      document.getElementById("adminPanelBtn").classList.remove("hidden");
      document.getElementById("loginPage").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      hideAll(); // Hide all forms to show clean dashboard
    } else {
      console.log('Regular user credentials:', { email, password });
      
      // For regular users, store their credentials
      const regularUser = {
        name: email.split('@')[0], // Use part before @ as name
        email: email,
        password: password, // Store the password for regular users too
        role: "user",
        isAdmin: false
      };
      localStorage.setItem('currentUser', JSON.stringify(regularUser));
      document.getElementById("userName").textContent = regularUser.name;
      document.getElementById("adminPanelBtn").classList.add("hidden");
      document.getElementById("loginPage").classList.add("hidden");
      document.getElementById("dashboard").classList.remove("hidden");
      hideAll(); // Hide all forms to show clean dashboard
    }
  } else {
    console.log('Validation failed');
  }
  
  const user = users.find(u => u.email === email && u.password === password);
  console.log('User found in storage:', user);
  
  if (user) {
    console.log('Setting current user from storage');
    user.isAdmin = false;
    localStorage.setItem('currentUser', JSON.stringify(user));
    document.getElementById("userName").textContent = user.name;
    document.getElementById("adminPanelBtn").classList.add("hidden");
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    hideAll(); // Hide all forms to show clean dashboard
  } else {
    console.log('No user found in storage');
    alert('Invalid email or password!');
  }
}

// Show create account form
function showCreateAccount() {
  document.getElementById("loginFormContainer").classList.add("hidden");
  document.getElementById("createAccountContainer").classList.remove("hidden");
  clearErrors();
}

// Show login form
function showLogin() {
  document.getElementById("createAccountContainer").classList.add("hidden");
  document.getElementById("loginFormContainer").classList.remove("hidden");
  clearErrors();
}

// Create account
function createAccount() {
  const name = document.getElementById("createName").value.trim();
  const email = document.getElementById("createEmail").value.trim();
  const phone = document.getElementById("createPhone").value.trim();
  const password = document.getElementById("createPassword").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  
  // Clear previous errors
  clearErrors();
  
  // Validate inputs
  let isValid = true;
  
  if (!validateName(name, "createNameError")) isValid = false;
  if (!validateEmail(email, "createEmailError")) isValid = false;
  if (!validatePhone(phone, "createPhoneError")) isValid = false;
  if (!validatePassword(password, "createPasswordError")) isValid = false;
  if (password !== confirmPassword) {
    document.getElementById("confirmPasswordError").classList.add("show");
    isValid = false;
  }
  
  if (isValid) {
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      alert('An account with this email already exists!');
      return;
    }
    
    // Create new user
    const newUser = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Account created successfully! You can now login.');
    showLogin();
  }
}

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
  
  // Clear login form
  document.getElementById("loginForm").reset();
  document.querySelectorAll('.char-counter span').forEach(counter => {
    counter.textContent = '0';
  });
  
  alert('You have been logged out successfully!');
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Character counters for all inputs
  const inputs = [
    'email', 'password', 'createName', 'createEmail', 'createPhone', 
    'createPassword', 'confirmPassword', 'foundName', 'foundEmail', 'foundPhone',
    'foundLocation', 'foundDescription', 'foundOthersSpecify',
    'lostName', 'lostEmail', 'lostPhone', 'lostLocation', 'description', 'lostOthersSpecify', 'lostReward'
  ];
  
  inputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', () => updateCharCounter(id));
      element.addEventListener('blur', () => {
        if (id.includes('name')) validateName(element.value, id + 'Error');
        if (id.includes('email')) validateEmail(element.value, id + 'Error');
        if (id.includes('phone')) validatePhone(element.value, id + 'Error');
        if (id.includes('Password')) validatePassword(element.value, id + 'Error');
      });
    }
  });
  
  // Category filter event listeners
  const categoryFilter = document.getElementById('categoryFilter');
  const adminCategoryFilter = document.getElementById('adminCategoryFilter');
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      const typeFilter = document.getElementById('typeFilter');
      const siteFilter = document.getElementById('siteFilter');
      const itemFilter = document.getElementById('itemFilter');
      const rewardFilter = document.getElementById('rewardFilter');
      
      // Hide all sub-filters first
      if (typeFilter) typeFilter.style.display = 'none';
      if (siteFilter) siteFilter.style.display = 'none';
      if (itemFilter) itemFilter.style.display = 'none';
      if (rewardFilter) rewardFilter.style.display = 'none';
      
      // Show relevant sub-filter
      if (this.value === 'type' && typeFilter) {
        typeFilter.style.display = 'block';
      } else if (this.value === 'site' && siteFilter) {
        siteFilter.style.display = 'block';
      } else if (this.value === 'item' && itemFilter) {
        itemFilter.style.display = 'block';
      } else if (this.value === 'reward' && rewardFilter) {
        rewardFilter.style.display = 'block';
      }
      
      // Trigger search
      searchReports(document.getElementById('searchInput').value);
    });
  }
  
  if (adminCategoryFilter) {
    adminCategoryFilter.addEventListener('change', function() {
      const adminTypeFilter = document.getElementById('adminTypeFilter');
      const adminSiteFilter = document.getElementById('adminSiteFilter');
      const adminItemFilter = document.getElementById('adminItemFilter');
      const adminRewardFilter = document.getElementById('adminRewardFilter');
      
      // Hide all sub-filters first
      if (adminTypeFilter) adminTypeFilter.style.display = 'none';
      if (adminSiteFilter) adminSiteFilter.style.display = 'none';
      if (adminItemFilter) adminItemFilter.style.display = 'none';
      if (adminRewardFilter) adminRewardFilter.style.display = 'none';
      
      // Show relevant sub-filter
      if (this.value === 'type' && adminTypeFilter) {
        adminTypeFilter.style.display = 'block';
      } else if (this.value === 'site' && adminSiteFilter) {
        adminSiteFilter.style.display = 'block';
      } else if (this.value === 'item' && adminItemFilter) {
        adminItemFilter.style.display = 'block';
      } else if (this.value === 'reward' && adminRewardFilter) {
        adminRewardFilter.style.display = 'block';
      }
      
      // Trigger search
      adminSearchReports(document.getElementById('adminSearchInput').value);
    });
  }
  
  // Form submissions
  document.getElementById('foundForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitFoundReport();
  });
  
  document.getElementById('lostForm').addEventListener('submit', function(e) {
    e.preventDefault();
    submitLostReport();
  });
  
  // Check if user is already logged in
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (currentUser) {
    document.getElementById("userName").textContent = currentUser.name;
    if (currentUser.isAdmin) {
      document.getElementById("adminPanelBtn").classList.remove("hidden");
    } else {
      document.getElementById("adminPanelBtn").classList.add("hidden");
    }
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    hideAll(); // Hide all forms and reports to show clean dashboard first
    document.getElementById("reportsList").classList.add("hidden"); // Ensure reports list is hidden
  }
  
  // Don't auto-load reports - let users choose from dashboard
});

// Toggle Help Modal
function toggleHelpModal() {
  const modal = document.getElementById('helpModal');
  modal.classList.toggle('show');
}

// Switch Campus Information
function switchCampus(campus) {
  // Hide all campus info
  document.querySelectorAll('.campus-info').forEach(info => {
    info.classList.remove('active');
  });
  
  // Remove active class from all buttons
  document.querySelectorAll('.campus-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected campus info
  document.getElementById(campus + '-campus').classList.add('active');
  
  // Add active class to clicked button
  event.target.classList.add('active');
}

// Make help modal draggable
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

const helpModal = document.getElementById('helpModal');
const helpHeader = document.querySelector('.help-header');

function dragStart(e) {
  if (e.type === "touchstart") {
    initialX = e.touches[0].clientX - xOffset;
    initialY = e.touches[0].clientY - yOffset;
  } else {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
  }

  if (e.target === helpHeader || helpHeader.contains(e.target)) {
    isDragging = true;
  }
}

function dragEnd(e) {
  initialX = currentX;
  initialY = currentY;
  isDragging = false;
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    
    if (e.type === "touchmove") {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    xOffset = currentX;
    yOffset = currentY;

    helpModal.style.transform = `translate(${currentX}px, ${currentY}px)`;
  }
}

// Add event listeners for dragging
helpHeader.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

// Touch events for mobile
helpHeader.addEventListener('touchstart', dragStart);
document.addEventListener('touchmove', drag);
document.addEventListener('touchend', dragEnd);

// Show Admin Panel
function showAdminPanel() {
  // Check if current user is admin
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser || !currentUser.isAdmin) {
    alert('Access denied! Only admin users can access this panel.');
    return;
  }
  
  hideAll();
  document.getElementById("adminPanel").classList.remove("hidden");
  showAllReports();
}

// Show all reports for admin
function showAllReports() {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  displayAdminReports(reports);
}

// Display admin reports with controls
function displayAdminReports(reports) {
  const container = document.getElementById("adminReportsContainer");
  container.innerHTML = "";
  
  if (reports.length === 0) {
    container.innerHTML = "<p style='color: rgba(255, 255, 255, 0.7); text-align: center; padding: 20px;'>No reports found.</p>";
    return;
  }
  
  reports.forEach((report, index) => {
    const div = document.createElement("div");
    div.className = `admin-report-item ${report.type.toLowerCase()}`; 
    div.id = `report-${index}`;
    
    // Check if user info should be hidden (admin marked as hidden)
    const isHidden = report.hiddenInfo || false;
    
    // Create image element if image data exists - same as view reports
    let imageHtml = '';
    let hasImageClass = '';
    if (report.imageData) {
      imageHtml = `<img src="${report.imageData}" alt="${report.items}" />`;
      hasImageClass = 'has-image';
    } else {
      hasImageClass = 'no-image';
    }
    
    div.innerHTML = `
      ${imageHtml}
      <div class="report-content">
        <h4>${report.type} - ${report.items}</h4>
        <p><strong>Name:</strong> ${isHidden ? '[Hidden]' : report.name}</p>
        <p><strong>Email:</strong> ${isHidden ? '[Hidden]' : report.email}</p>
        <p><strong>Phone:</strong> ${isHidden ? '[Hidden]' : report.phone}</p>
        ${report.site ? `<p><strong>Site:</strong> ${report.site}</p>` : ""}
        ${report.location ? `<p><strong>Location:</strong> ${report.location}</p>` : ""}
        <p><strong>Description:</strong> ${report.description}</p>
        ${report.date ? `<p><strong>Date:</strong> ${report.date}</p>` : ""}
        ${report.reward ? `<p><strong>Reward:</strong> ${report.reward}</p>` : ""}
      </div>
      <div class="report-actions">
        <button class="toggle-info-btn" onclick="toggleUserInfo(${index})">${isHidden ? 'Show Info' : 'Hide Info'}</button>
        <button class="edit-btn" onclick="openEditModal(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteReport(${index})">Delete</button>
      </div>
    `;
    
    // Add class for styling based on whether there's an image
    div.classList.add(hasImageClass);
    
    container.appendChild(div);
  });
}

// Toggle user information visibility
function toggleUserInfo(index) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const report = reports[index];
  
  // Toggle hidden status in the report data
  report.hiddenInfo = !report.hiddenInfo;
  
  // Update localStorage
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Refresh both displays to apply changes
  displayAdminReports(reports);
  showReports(); // Also refresh user reports view
}

// Open Edit Modal
function openEditModal(index) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const report = reports[index];
  
  // Set report index
  document.getElementById('editReportIndex').value = index;
  
  // Populate form fields
  document.getElementById('editType').value = report.type;
  document.getElementById('editName').value = report.name;
  document.getElementById('editEmail').value = report.email;
  document.getElementById('editPhone').value = report.phone;
  document.getElementById('editItems').value = report.items;
  document.getElementById('editDescription').value = report.description;
  document.getElementById('editSite').value = report.site || '';
  document.getElementById('editLocation').value = report.location || '';
  document.getElementById('editDate').value = report.date || '';
  document.getElementById('editReward').value = report.reward || '';
  
  // Show/hide date and reward fields based on type
  if (report.type === 'Lost') {
    document.getElementById('editDateGroup').style.display = 'block';
    document.getElementById('editRewardGroup').style.display = 'block';
  } else {
    document.getElementById('editDateGroup').style.display = 'none';
    document.getElementById('editRewardGroup').style.display = 'none';
  }
  
  // Show current image if exists
  const currentImage = document.getElementById('currentImage');
  if (report.imageData) {
    currentImage.src = report.imageData;
    currentImage.style.display = 'block';
  } else {
    currentImage.style.display = 'none';
  }
  
  // Show modal
  document.getElementById('editModal').style.display = 'block';
}

// Close Edit Modal
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
}

// Remove Image
function removeImage() {
  const currentImage = document.getElementById('currentImage');
  currentImage.style.display = 'none';
  // Note: Image will be removed when saved
}

// Save Edited Report
function saveEditedReport(event) {
  event.preventDefault();
  
  // Ask for confirmation first
  const confirmEdit = confirm('Are you sure you want to save these changes to this report?');
  if (!confirmEdit) {
    return;
  }
  
  // Ask for admin password verification
  const adminPassword = prompt('Please enter admin password to confirm this change:');
  if (!adminPassword) {
    return;
  }
  
  // Verify admin password (check against current user's password)
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser || !currentUser.isAdmin || currentUser.password !== adminPassword) {
    alert('Admin session invalid! Please log in again.');
    return;
  }
  
  // Get form values and validate them
  const index = document.getElementById('editReportIndex').value;
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const report = reports[index];
  
  // Update report data
  report.type = document.getElementById('editType').value;
  report.name = document.getElementById('editName').value.trim();
  report.email = document.getElementById('editEmail').value.trim();
  report.phone = document.getElementById('editPhone').value.trim();
  report.items = document.getElementById('editItems').value.trim();
  report.description = document.getElementById('editDescription').value.trim();
  report.site = document.getElementById('editSite').value;
  report.location = document.getElementById('editLocation').value.trim();
  report.date = document.getElementById('editDate').value;
  report.reward = document.getElementById('editReward').value.trim();
  
  // Check for missing required fields
  if (!report.type || !report.name || !report.email || !report.phone || !report.items || !report.description) {
    alert('Please fill in all required fields: Type, Name, Email, Phone, Items, and Description are required.');
    return;
// ...
  }
  
  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(report.email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Check phone format (basic validation)
  if (report.phone && report.phone.length < 10) {
    alert('Please enter a valid phone number (at least 10 digits).');
    return;
  }
  
  // Remove image if it was hidden
  const currentImage = document.getElementById('currentImage');
  if (currentImage.style.display === 'none') {
    report.imageData = null;
  }
  
  // Update localStorage
  localStorage.setItem('reports', JSON.stringify(reports));
  
  // Refresh displays
  displayAdminReports(reports);
  showReports();
  
  // Close modal
  closeEditModal();
  
  alert('Report updated successfully!');
}

// Delete Report
function deleteReport(index) {
  // Ask for confirmation first
  const confirmDelete = confirm('Are you sure you want to delete this report? This action cannot be undone.');
  if (!confirmDelete) {
    return;
  }
  
  // Ask for admin password verification
  const adminPassword = prompt('Please enter admin password to confirm this deletion:');
  if (!adminPassword) {
    return;
  }
  
  // Verify admin password (check against current user's password)
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!currentUser || !currentUser.isAdmin || currentUser.password !== adminPassword) {
    alert('Invalid admin password! Report not deleted.');
    return;
  }
  
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  reports.splice(index, 1);
  localStorage.setItem('reports', JSON.stringify(reports));
  showAllReports();
  alert('Report deleted successfully!');
}

// Admin Search Function
function adminSearchReports(query) {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const filtered = reports.filter(report => {
    const searchText = query.toLowerCase();
    return report.name.toLowerCase().includes(searchText) ||
           report.email.toLowerCase().includes(searchText) ||
           report.description.toLowerCase().includes(searchText) ||
           report.items.toLowerCase().includes(searchText) ||
           report.type.toLowerCase().includes(searchText);
  });
  displayAdminReports(filtered);
}

// Export Reports
function exportReports() {
  const reports = JSON.parse(localStorage.getItem('reports') || '[]');
  const dataStr = JSON.stringify(reports, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `lostnmore_reports_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  alert('Reports exported successfully!');
}
function showFound() {
  hideAll();
  document.getElementById("found").classList.remove("hidden");
}

// Submit Found Report
function submitFoundReport() {
  clearErrors();
  
  const name = document.getElementById('foundName').value.trim();
  const email = document.getElementById('foundEmail').value.trim();
  const phone = document.getElementById('foundPhone').value.trim();
  const location = document.getElementById('foundLocation').value.trim();
  const description = document.getElementById('foundDescription').value.trim();
  const fileInput = document.getElementById('foundFile');
  
  let isValid = true;
  if (!validateName(name, 'foundNameError')) isValid = false;
  if (!validateEmail(email, 'foundEmailError')) isValid = false;
  if (!validatePhone(phone, 'foundPhoneError')) isValid = false;
  if (!selectedFoundSite) {
    alert('Please select where the item was found');
    isValid = false;
  }
  if (location.length < 3) {
    document.getElementById('foundLocationError').classList.add('show');
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Image upload
  let imageData = null;
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imageData = e.target.result;
      saveFoundReportWithData(imageData);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveFoundReportWithData(null);
  }
}

function saveFoundReportWithData(imageData) {
  const name = document.getElementById('foundName').value.trim();
  const email = document.getElementById('foundEmail').value.trim();
  const phone = document.getElementById('foundPhone').value.trim();
  const location = document.getElementById('foundLocation').value.trim();
  const description = document.getElementById('foundDescription').value.trim();
  
  let itemName = '';
  if (selectedFoundItems.includes('Others')) {
    const othersValue = document.getElementById('foundOthersSpecify').value.trim();
    if (!othersValue) {
      alert('Please specify the item when selecting "Others"');
      return;
    }
    itemName = othersValue;
  } else if (selectedFoundItems.length > 0) {
    itemName = selectedFoundItems.join(', ');
  } else {
    alert('Please select at least one item');
    return;
  }
  
  const report = {
    type: 'Found',
    name: name,
    email: email,
    phone: phone,
    site: selectedFoundSite,
    location: location,
    items: itemName,
    description: description,
    imageData: imageData,
    timestamp: new Date().toISOString()
  };
  
  saveReport(report);
  alert('Found report submitted successfully! Location: ' + selectedFoundSite + ' - ' + location);
  goBack();
  showReports(); // Redirect to search inventory
  localStorage.setItem('reports', JSON.stringify(reports));
}

// Submit lost report
function submitLostReport() {
  clearErrors();
  
  const name = document.getElementById('lostName').value.trim();
  const email = document.getElementById('lostEmail').value.trim();
  const phone = document.getElementById('lostPhone').value.trim();
  const location = document.getElementById('lostLocation').value.trim();
  const date = document.getElementById('lostDate').value;
  const description = document.getElementById('description').value.trim();
  const reward = document.getElementById('lostReward').value.trim();
  const fileInput = document.querySelectorAll('#lostForm input[type="file"]')[0]; // Reference the file input

  let isValid = true;
  if (!validateName(name, 'lostNameError')) isValid = false;
  if (!validateEmail(email, 'lostEmailError')) isValid = false;
  if (!validatePhone(phone, 'lostPhoneError')) isValid = false;
  if (!selectedLostSite) {
    alert('Please select where you lost the item');
    isValid = false;
  }
  if (location.length < 3) {
    document.getElementById('lostLocationError').classList.add('show');
    isValid = false;
  }
  if (!date) {
    alert('Please select date lost');
    isValid = false;
  }
  
  // Date format validation for lost report
  if (date) {
    const dateParts = date.split('/');
    if (dateParts.length === 3 && dateParts[2]) {
      const year = parseInt(dateParts[2]);
      // Check if year is exactly 4 digits
      if (!/^\d{4}$/.test(dateParts[2])) {
        alert('Year must be exactly 4 digits (yyyy format).');
        isValid = false;
      }
      // Check if year is within reasonable range (1900-2100)
      if (year < 1900 || year > 2100) {
        alert('Year must be between 1900 and 2100.');
        isValid = false;
      }
    }
  }
  
  if (!isValid) return;

  // Handle Image Upload
  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      saveLostReportWithData(e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveLostReportWithData(null);
  }
}

// New helper function to save the data
function saveLostReportWithData(imageData) {
  const name = document.getElementById('lostName').value.trim();
  const email = document.getElementById('lostEmail').value.trim();
  const phone = document.getElementById('lostPhone').value.trim();
  const location = document.getElementById('lostLocation').value.trim();
  const date = document.getElementById('lostDate').value;
  const description = document.getElementById('description').value.trim();
  const reward = document.getElementById('lostReward').value.trim();
  
  let itemName = selectedItems.join(', ');
  if (selectedItems.includes('Others')) {
    itemName = document.getElementById('lostOthersSpecify').value.trim();
  }

  const report = {
    type: 'Lost',
    name: name,
    email: email,
    phone: phone,
    site: selectedLostSite,
    location: location,
    date: date,
    items: itemName,
    description: description,
    reward: reward || null,
    imageData: imageData, // Now saving the image!
    timestamp: new Date().toISOString()
  };
  
  saveReport(report);
  alert('Lost report submitted successfully!');
  goBack();
  showReports();
}
