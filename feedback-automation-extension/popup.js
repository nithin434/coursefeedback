// Handle checkbox interactions
document.querySelectorAll('.course-item').forEach(item => {
  item.addEventListener('click', (e) => {
    if (e.target.type !== 'checkbox') {
      const checkbox = item.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
    }
  });
});

// Select all functionality
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const courseCheckboxes = document.querySelectorAll('.course-checkbox');

selectAllCheckbox.addEventListener('change', () => {
  courseCheckboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
  });
});

// Update select all state when individual checkboxes change
courseCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const allChecked = Array.from(courseCheckboxes).every(cb => cb.checked);
    const someChecked = Array.from(courseCheckboxes).some(cb => cb.checked);
    selectAllCheckbox.checked = allChecked;
    selectAllCheckbox.indeterminate = someChecked && !allChecked;
  });
});

// Get selected courses
function getSelectedCourses() {
  const selected = [];
  document.querySelectorAll('.course-item').forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox.checked) {
      selected.push({
        value: item.dataset.value,
        name: item.querySelector('.course-name').textContent
      });
    }
  });
  return selected;
}

// Show status message
function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  
  if (type === 'success') {
    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }
}

// Fill button - just fills without submitting
document.getElementById('fillBtn').addEventListener('click', async () => {
  const selectedCourses = getSelectedCourses();
  
  if (selectedCourses.length === 0) {
    showStatus('⚠️ Please select at least one course', 'error');
    return;
  }
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillForms,
      args: [selectedCourses, false]
    });
    
    showStatus(`✅ Filled forms for ${selectedCourses.length} course(s)`, 'success');
  } catch (error) {
    showStatus('❌ Error: ' + error.message, 'error');
  }
});

// Auto-submit button - fills and submits
document.getElementById('autoSubmitBtn').addEventListener('click', async () => {
  const selectedCourses = getSelectedCourses();
  
  if (selectedCourses.length === 0) {
    showStatus('⚠️ Please select at least one course', 'error');
    return;
  }
  
  const confirmed = confirm(
    `This will automatically fill and submit feedback for ${selectedCourses.length} course(s):\n\n` +
    selectedCourses.map(c => `• ${c.name}`).join('\n') +
    '\n\nContinue?'
  );
  
  if (!confirmed) return;
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: fillForms,
      args: [selectedCourses, true]
    });
    
    showStatus(`🚀 Processing ${selectedCourses.length} course(s)...`, 'info');
  } catch (error) {
    showStatus('❌ Error: ' + error.message, 'error');
  }
});

// This function runs in the page context
function fillForms(courses, autoSubmit) {
  let currentIndex = 0;
  
  function processCourse() {
    if (currentIndex >= courses.length) {
      console.log('✅ All courses processed!');
      return;
    }
    
    const course = courses[currentIndex];
    console.log(`Processing: ${course.name}`);
    
    // Select the course
    const courseSelect = document.getElementById('courseId') || document.querySelector('select[name="courseId"]');
    if (courseSelect) {
      courseSelect.value = course.value;
      
      // Trigger change event
      const event = new Event('change', { bubbles: true });
      courseSelect.dispatchEvent(event);
      
      // If there's an onchange handler, call it
      if (courseSelect.onchange) {
        courseSelect.onchange({ target: courseSelect });
      }
      
      // Also try calling the global function if it exists
      if (typeof getDetails === 'function') {
        getDetails(course.value);
      }
    }
    
    // Wait for form to load, then fill it
    setTimeout(() => {
      // Step 1: Handle radio buttons
      const groups = {};
      
      document.querySelectorAll('input[type="radio"]').forEach(el => {
        const name = el.name;
        if (!groups[name]) groups[name] = [];
        groups[name].push(el);
      });
      
      Object.keys(groups).forEach(name => {
        const options = groups[name];
        
        // Pick only value 3 or 4 if exists (positive feedback)
        let filtered = options.filter(o => o.value === "3" || o.value === "4");
        
        // Fallback if not present
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
      
      console.log(`✅ Filled form for: ${course.name}`);
      
      // Step 4: Submit if autoSubmit is true
      if (autoSubmit) {
        setTimeout(() => {
          const submitBtn = document.querySelector('#submit') || 
                          document.querySelector('button[type="submit"]') ||
                          document.querySelector('input[type="submit"]');
          
          if (submitBtn) {
            console.log(`📤 Submitting: ${course.name}`);
            submitBtn.click();
            
            // Wait for submission to complete, then move to next course
            setTimeout(() => {
              currentIndex++;
              processCourse();
            }, 2000);
          } else {
            console.log('⚠️ Submit button not found for: ' + course.name);
            currentIndex++;
            processCourse();
          }
        }, 500);
      } else {
        currentIndex++;
        processCourse();
      }
    }, 1500); // Wait for AJAX to load the form
  }
  
  processCourse();
}
