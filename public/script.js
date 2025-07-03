// DOM elements
const loadingElement = document.getElementById('loading');
const resultElement = document.getElementById('result');
const errorElement = document.getElementById('error');
const ipaddressElement = document.getElementById('ipaddress');
const languageElement = document.getElementById('language');
const softwareElement = document.getElementById('software');
const jsonResponseElement = document.getElementById('json-response');
const errorMessageElement = document.getElementById('error-message');

// Show/hide utility functions
function showLoading() {
    loadingElement.classList.remove('hidden');
    resultElement.classList.add('hidden');
    errorElement.classList.add('hidden');
}

function showResult() {
    loadingElement.classList.add('hidden');
    resultElement.classList.remove('hidden');
    errorElement.classList.add('hidden');
}

function showError(message) {
    loadingElement.classList.add('hidden');
    resultElement.classList.add('hidden');
    errorElement.classList.remove('hidden');
    errorMessageElement.textContent = message;
}

// Update UI with API response
function updateUI(data) {
    ipaddressElement.textContent = data.ipaddress || 'Unknown';
    languageElement.textContent = data.language || 'Unknown';
    softwareElement.textContent = data.software || 'Unknown';
    
    // Display formatted JSON
    jsonResponseElement.textContent = JSON.stringify(data, null, 2);
}

// Test API function
async function testAPI() {
    showLoading();
    
    try {
        // Use the Netlify function path
        const response = await fetch('/.netlify/functions/whoami');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate response structure
        if (!data.ipaddress || !data.language || !data.software) {
            throw new Error('Invalid response format. Missing required fields.');
        }
        
        updateUI(data);
        showResult();
        
    } catch (error) {
        console.error('Error fetching data:', error);
        showError(`Failed to fetch data: ${error.message}`);
    }
}

// Auto-test on page load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure everything is loaded
    setTimeout(() => {
        testAPI();
    }, 500);
});

// Add keyboard shortcut for testing
document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + Enter to test API
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        testAPI();
    }
}); 