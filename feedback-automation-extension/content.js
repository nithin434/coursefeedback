// Content script - runs on all pages
// This can be used for additional page-specific functionality if needed

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkPage') {
    // Check if this is a feedback form page
    const hasCourseSelect = document.getElementById('courseId') || document.querySelector('select[name="courseId"]');
    sendResponse({ isFeedbackPage: !!hasCourseSelect });
  }
  return true;
});

// Optional: Add a floating button on the feedback page itself
function addFloatingButton() {
  const courseSelect = document.getElementById('courseId') || document.querySelector('select[name="courseId"]');
  
  if (courseSelect && !document.getElementById('auto-fill-floating-btn')) {
    const button = document.createElement('button');
    button.id = 'auto-fill-floating-btn';
    button.innerHTML = '⚡ Quick Fill';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      padding: 12px 20px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.2s;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)';
      button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });
    
    button.addEventListener('click', () => {
      fillCurrentForm(false);
    });
    
    document.body.appendChild(button);
  }
}

function fillCurrentForm(autoSubmit) {
  // Step 1: Handle radio buttons
  const groups = {};
  
  document.querySelectorAll('input[type="radio"]').forEach(el => {
    const name = el.name;
    if (!groups[name]) groups[name] = [];
    groups[name].push(el);
  });
  
  Object.keys(groups).forEach(name => {
    const options = groups[name];
    
    // Pick only value 3 or 4 if exists
    let filtered = options.filter(o => o.value === "3" || o.value === "4");
    
    if (filtered.length === 0) {
      filtered = options;
    }
    
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    random.checked = true;
  });
  
  // Step 2: Fill text inputs
  document.querySelectorAll('input[type="text"]').forEach(el => {
    el.value = "Good course, well structured.";
  });
  
  // Step 3: Fill textareas
  document.querySelectorAll('textarea').forEach(el => {
    el.value = "The course content was well organized and the instructor was helpful.";
  });
  
  console.log("Form filled ✅");
  
  // Step 4: Submit if requested
  if (autoSubmit) {
    const submitBtn = document.querySelector('#submit') || 
                    document.querySelector('button[type="submit"]') ||
                    document.querySelector('input[type="submit"]');
    
    if (submitBtn) {
      submitBtn.click();
      console.log("Form submitted ✅");
    }
  }
}

// Add the floating button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addFloatingButton);
} else {
  addFloatingButton();
}
