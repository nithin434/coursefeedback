# 📝 Course Feedback Automator Extension

A browser extension to automatically fill and submit course feedback forms with ease.

## ✨ Features

- **Multi-course selection**: Select one or multiple courses to process
- **Smart form filling**: Automatically fills radio buttons (preferring positive ratings 3-4), text fields, and textareas
- **Two modes**:
  - **Fill Forms**: Just fills the forms without submitting (for review)
  - **Auto-Fill & Submit**: Fills and automatically submits all selected courses
- **Floating quick-fill button**: Appears on feedback pages for instant access
- **Safe and transparent**: Shows what will be filled before submission

## 🚀 Installation

### For Chrome/Edge/Brave

1. **Download the extension folder** to your computer

2. **Open your browser's extension page**:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

3. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**:
   - Click "Load unpacked"
   - Select the `feedback-automation-extension` folder
   - The extension icon should appear in your toolbar

### For Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file from the extension folder

## 📖 How to Use

### Method 1: Using the Extension Popup

1. Navigate to your course feedback page
2. Click the extension icon in your toolbar
3. Select the courses you want to fill feedback for
4. Choose an option:
   - **Fill Forms**: Reviews without submitting
   - **Auto-Fill & Submit**: Automatically processes and submits

### Method 2: Using the Floating Button

1. Navigate to your course feedback page
2. Look for the blue "⚡ Quick Fill" button in the bottom-right corner
3. Click it to instantly fill the current form (won't auto-submit)

## ⚙️ What It Does

The extension automatically:

1. **Radio Buttons**: Selects values 3 or 4 (positive ratings) when available, otherwise picks randomly
2. **Text Fields**: Fills with "Good course, well structured."
3. **Text Areas**: Fills with "The course content was well organized and the instructor was helpful."
4. **Course Selection**: Iterates through selected courses one by one
5. **Submission**: (Optional) Clicks the submit button after filling

## 🎯 Supported Courses

- Theory of Computation
- Software Design and Architecture
- Information Theory and Coding
- Web Technologies
- Optoelectronics
- Advanced Competitive Coding - II

*You can easily modify the course list in `popup.html` if your courses change.*

## 🛠️ Customization

### Change the feedback text:

Edit `popup.js`, find these lines and modify as needed:

```javascript
// Text inputs
el.value = "Good course, well structured.";

// Textareas
el.value = "The course content was well organized and the instructor was helpful.";
```

### Add/remove courses:

Edit `popup.html` and add/remove course items in the `.course-list` section.

### Adjust timing:

In `popup.js`, modify the `setTimeout` values:
- Form load wait: `1500ms` (line ~150)
- Submission wait: `2000ms` (line ~200)

## ⚠️ Important Notes

- **Review before submitting**: Use "Fill Forms" mode first to review what will be submitted
- **Wait between courses**: The extension waits ~3.5 seconds between courses to allow forms to load
- **Check submissions**: Always verify that feedback was submitted successfully
- **Be honest**: This tool should help you save time, but provide genuine feedback when possible

## 🔒 Privacy & Security

- This extension runs **locally** in your browser
- No data is sent to external servers
- Only interacts with the feedback form page
- Open source - you can review all the code

## 🐛 Troubleshooting

**Extension doesn't appear:**
- Make sure Developer Mode is enabled
- Try reloading the extension
- Check browser console for errors

**Forms not filling:**
- Wait for the page to fully load
- Check if the form structure matches
- Verify course selection dropdown has loaded

**Submit button not working:**
- The page might use a different submit button ID
- Try "Fill Forms" mode and submit manually

## 📝 License

Free to use and modify for educational purposes.

## 🤝 Contributing

Feel free to modify and improve this extension for your needs!

---

**Made with ❤️ to save time on repetitive feedback forms**
