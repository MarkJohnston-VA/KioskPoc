// Kiosk Session Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully!');
    
    // Get form elements
    const userNameInput = document.getElementById('userName');
    const birthDateInput = document.getElementById('birthDate');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const clearSessionBtn = document.getElementById('clearSessionBtn');
    const sessionInfo = document.getElementById('sessionInfo');
    const sessionDetails = document.getElementById('sessionDetails');
    
    // Timer variables
    let sessionTimer = null;
    const SESSION_TIMEOUT = 60000; // 1 minute in milliseconds
    
    // Load existing session data on page load
    loadSessionData();
    
    // Update button states initially
    updateButtonStates();
    
    // Add event listeners
    saveUserBtn.addEventListener('click', function() {
        saveUserSession();
    });
    
    clearSessionBtn.addEventListener('click', function() {
        clearUserSession();
    });
    
    function saveUserSession() {
        const userName = userNameInput.value.trim();
        const birthDate = birthDateInput.value;
        
        // Validate inputs
        if (!userName) {
            alert('Please enter your name');
            return;
        }
        
        if (!birthDate) {
            alert('Please select your birth date');
            return;
        }
        
        // Create user session object
        const now = new Date();
        const expirationTime = new Date(now.getTime() + SESSION_TIMEOUT);
        
        const userSession = {
            name: userName,
            birthDate: birthDate,
            createdOn: now.toISOString(),
            expiresOn: expirationTime.toISOString()
        };
        
        // Store in session storage
        sessionStorage.setItem('KioskUserSession', JSON.stringify(userSession));
        
        // Display session info
        displaySessionInfo(userSession);
        
        // Start the session timer
        startSessionTimer(userSession.expiresOn);
        
        // Update button states
        updateButtonStates();
        
        console.log('User session saved:', userSession);
        //alert('Session saved successfully!');
    }
    
    function clearUserSession() {
        // Clear the timer if it exists
        if (sessionTimer) {
            clearTimeout(sessionTimer);
            sessionTimer = null;
        }
        
        // Remove from session storage
        sessionStorage.removeItem('KioskUserSession');
        
        // Clear form fields
        userNameInput.value = '';
        birthDateInput.value = '';
        
        // Hide session info
        sessionInfo.style.display = 'none';
        
        // Update button states
        updateButtonStates();
        
        console.log('User session cleared');
        alert('Session cleared successfully!');
    }
    
    function loadSessionData() {
        const savedSession = sessionStorage.getItem('KioskUserSession');
        
        if (savedSession) {
            try {
                const userSession = JSON.parse(savedSession);
                
                // Populate form fields
                userNameInput.value = userSession.name;
                birthDateInput.value = userSession.birthDate;
                
                // Display session info
                displaySessionInfo(userSession);
                
                // Start the session timer since we have an existing session
                startSessionTimer(userSession.expiresOn);
                
                // Update button states
                updateButtonStates();
                
                console.log('Loaded existing session:', userSession);
            } catch (error) {
                console.error('Error loading session data:', error);
                sessionStorage.removeItem('KioskUserSession');
            }
        }
    }
    
    function displaySessionInfo(userSession) {
        const formattedCreatedOn = new Date(userSession.createdOn).toLocaleString();
        const formattedExpiresOn = new Date(userSession.expiresOn).toLocaleString();
        sessionDetails.innerHTML = `
            <strong>Name:</strong> ${userSession.name}<br>
            <strong>Birth Date:</strong> ${userSession.birthDate}<br>
            <strong>Session Created:</strong> ${formattedCreatedOn}<br>
            <strong>Session Expires:</strong> ${formattedExpiresOn}
        `;
        sessionInfo.style.display = 'block';
    }
    
    function updateButtonStates() {
        const hasSession = sessionStorage.getItem('KioskUserSession') !== null;
        
        // Enable Login button only when there's no session
        saveUserBtn.disabled = hasSession;
        
        // Enable Logout button only when there's a session
        clearSessionBtn.disabled = !hasSession;
        
        console.log(`Button states updated - Login: ${!hasSession ? 'enabled' : 'disabled'}, Logout: ${hasSession ? 'enabled' : 'disabled'}`);
    }
    
    function startSessionTimer(expiresOn) {
        // Clear any existing timer
        if (sessionTimer) {
            clearTimeout(sessionTimer);
        }
        
        // Calculate the remaining time until expiration
        const now = new Date().getTime();
        const expirationTime = new Date(expiresOn).getTime();
        const remainingTime = expirationTime - now;
        
        // If the session has already expired, clear it immediately
        if (remainingTime <= 0) {
            console.log('Session has already expired - clearing immediately');
            clearUserSession();
            return;
        }
        
        // Start a new timer for the remaining time
        sessionTimer = setTimeout(function() {
            console.log('Session timeout - automatically clearing session');
            alert('Your session has expired and will be cleared automatically.');
            clearUserSession();
        }, remainingTime);
        
        console.log(`Session timer started - will expire in ${Math.round(remainingTime / 1000)} seconds`);
    }
});

// Utility function for greeting (kept for compatibility)
function greetUser(name = 'Guest') {
    return `Hello, ${name}! Welcome to our kiosk.`;
}
