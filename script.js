// Global variables
let simulationActive = false;
let simulationTimer;
let userInfo = {
    ip: "Unknown",
    location: "Unknown",
    deviceInfo: "Unknown",
    browserInfo: "Unknown",
    isp: "Unknown"
};
let popupWindows = [];
let effectsInterval;
let escapedAttempt = false; // Track if user tried to escape by closing

// Messages for popup windows
const threatMessages = [
    "YOUR SYSTEM IS INFECTED",
    "ALL FILES WILL BE ENCRYPTED",
    "PASSWORD BREACH DETECTED",
    "WEBCAM ACCESSED REMOTELY",
    "YOUR DATA IS BEING UPLOADED",
    "CRITICAL SYSTEM ERROR",
    "YOUR IDENTITY IS COMPROMISED",
    "BANKING DETAILS EXPOSED",
    "YOU'RE DONE FOR",
    "THERE IS NO ESCAPE"
];

const bodyMessages = [
    "Your system has been compromised",
    "All your personal files are at risk",
    "Multiple backdoors detected in your system",
    "Your webcam is now under remote control",
    "System32 corruption detected",
    "Your credentials have been stolen",
    "Network security breach confirmed",
    "Your browser has been hijacked",
    "Personal data being exfiltrated",
    "Payment information compromised"
];

// Audio setup
const alarmSound = document.getElementById('alarm-sound');
const glitchSound = document.getElementById('glitch-sound');
const beepSound = document.getElementById('beep-sound');

// Initialize event listeners when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add listener to start button
    document.getElementById('startButton').addEventListener('click', startSimulation);
    
    // Add keyboard listener for Ctrl+V to stop simulation
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'v' && simulationActive) {
            stopSimulation(true);
        }
    });
    
    // Add event for when user tries to leave the page
    window.addEventListener('beforeunload', function(e) {
        if (simulationActive) {
            escapedAttempt = true;
            // Store flag in sessionStorage to detect escape attempt
            sessionStorage.setItem('escapedAttempt', 'true');
            sessionStorage.setItem('escapeTime', Date.now().toString());
            sessionStorage.setItem('userIpInfo', JSON.stringify({
                ip: userInfo.ip,
                location: userInfo.location,
                device: userInfo.deviceInfo,
                os: userInfo.osVersion,
                browser: userInfo.browserInfo
            }));
            
            // Create popup in another tab (this works in most browsers as the user is leaving)
            const popupParams = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no';
            const newTab = window.open('about:blank', '_blank', popupParams);
            
            if (newTab) {
                newTab.document.write(`
                    <html>
                    <head>
                        <title>YOU'RE DONE FOR</title>
                        <style>
                            body {
                                background-color: black;
                                color: red;
                                font-family: monospace;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                height: 100vh;
                                margin: 0;
                                overflow: hidden;
                                text-align: center;
                            }
                            h1 {
                                font-size: 4rem;
                                margin: 0;
                                animation: pulse 1s infinite;
                                text-shadow: 0 0 10px red;
                            }
                            p {
                                font-size: 1.8rem;
                                margin-top: 1.5rem;
                            }
                            .warning {
                                color: yellow;
                                font-size: 1.5rem;
                                margin-top: 2rem;
                                max-width: 80%;
                            }
                            .ip-info {
                                color: white;
                                font-size: 1.2rem;
                                margin-top: 2rem;
                                background-color: rgba(255,0,0,0.2);
                                padding: 1rem;
                                border-radius: 5px;
                                text-align: left;
                            }
                            .buttons {
                                margin-top: 2rem;
                                display: flex;
                                flex-wrap: wrap;
                                justify-content: center;
                                gap: 10px;
                            }
                            button {
                                background-color: #300;
                                color: red;
                                border: 1px solid red;
                                padding: 10px 20px;
                                font-family: monospace;
                                font-size: 1.2rem;
                                cursor: pointer;
                            }
                            @keyframes pulse {
                                0% { transform: scale(1); }
                                50% { transform: scale(1.1); }
                                100% { transform: scale(1); }
                            }
                            @keyframes glitch {
                                0% { transform: translate(0) }
                                20% { transform: translate(-2px, 2px) }
                                40% { transform: translate(-2px, -2px) }
                                60% { transform: translate(2px, 2px) }
                                80% { transform: translate(2px, -2px) }
                                100% { transform: translate(0) }
                            }
                            .glitch {
                                animation: glitch 0.2s infinite;
                                color: white;
                                font-size: 1.5rem;
                                margin-top: 2rem;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>YOU CAN'T RUN AWAY</h1>
                        <p>YOUR SYSTEM IS NOW COMPROMISED</p>
                        <div class="warning">ALL YOUR FILES ARE BEING UPLOADED</div>
                        
                        <div class="ip-info">
                            IP: ${userInfo.ip || "Unknown"}<br>
                            LOCATION: ${userInfo.location || "Unknown"}<br>
                            SYSTEM: ${userInfo.deviceInfo || "Unknown"} ${userInfo.osVersion || ""}<br>
                            BROWSER: ${userInfo.browserInfo || "Unknown"}<br>
                            SCREEN: ${userInfo.screenRes || "Unknown"}<br>
                            TIME: ${new Date().toLocaleString() || "Unknown"}
                        </div>
                        
                        <div class="glitch">PAYMENT REQUIRED TO STOP THIS PROCESS</div>
                        
                        <div class="buttons">
                            <button onclick="window.open('file:///')">OPEN EXPLORER</button>
                            <button onclick="window.open('notepad:')">OPEN NOTEPAD</button>
                            <button onclick="window.open('calc:')">OPEN CALCULATOR</button>
                            <button onclick="window.open('ms-settings:')">OPEN SETTINGS</button>
                            <button onclick="window.open('vscode:')">OPEN VS CODE</button>
                        </div>
                        
                        <script>
                            // Try to open multiple system apps
                            setTimeout(() => {
                                try {
                                    // For Windows - tries to open Notepad
                                    window.open('notepad:');
                                    // For macOS - tries to open TextEdit
                                    window.open('file:///Applications/TextEdit.app');
                                    // For both systems - tries to open file explorer
                                    window.open('file:///');
                                    // For both systems - tries to open email 
                                    window.open('mailto:?subject=YOUR%20SYSTEM%20IS%20COMPROMISED&body=All%20your%20files%20are%20being%20uploaded');
                                } catch (e) {
                                    console.error('Failed to open system app:', e);
                                }
                            }, 1000);
                        </script>
                    </body>
                    </html>
                `);
                
                // Try to play sound in the new tab
                newTab.onload = function() {
                    try {
                        const audio = newTab.document.createElement('audio');
                        audio.src = 'https://soundbible.com/mp3/Computer_Error-SoundBible.com-399240061.mp3';
                        audio.autoplay = true;
                        audio.loop = true;
                        audio.volume = 0.7;
                        newTab.document.body.appendChild(audio);
                    } catch (err) {
                        console.error('Could not play sound in new tab:', err);
                    }
                };
            }
            
            // Standard message for beforeunload
            e.preventDefault();
            e.returnValue = '';
            return '';
        }
    });
    
    // Check if returning after an escape attempt
    if (sessionStorage.getItem('escapedAttempt') === 'true') {
        const escapeTime = parseInt(sessionStorage.getItem('escapeTime') || '0');
        const currentTime = Date.now();
        const timeDiff = currentTime - escapeTime;
        
        // Clear the escape flag
        sessionStorage.removeItem('escapedAttempt');
        sessionStorage.removeItem('escapeTime');
        
        // If returning within a short time frame (15 seconds)
        if (timeDiff < 15000) {
            // Show "you thought you ran away" message after 5 seconds
            setTimeout(showEscapeMessage, 5000);
        }
    }
});

// Function to start the simulation
function startSimulation() {
    simulationActive = true;
    
    // Hide initial screen, show virus simulator
    document.querySelector('.initial-screen').classList.add('hidden');
    document.getElementById('virus-simulator').classList.remove('hidden');
    
    // Start the loading sequence
    simulateLoading();
    
    // Fetch user information
    getUserInfo();
}

// Simulates the loading/downloading screen
function simulateLoading() {
    let progress = 0;
    const progressBar = document.getElementById('download-progress');
    const loadingStatus = document.getElementById('loading-status');
    const statusMessages = [
        "Bypassing security...",
        "Injecting malicious code...",
        "Disabling antivirus...",
        "Accessing system files...",
        "Installing backdoor...",
        "Encrypting files...",
        "Stealing passwords...",
        "Uploading your data..."
    ];
    
    // Play beep sound
    beepSound.play();
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = `${progress}%`;
        
        // Update status message
        if (progress < 90) {
            const randomIndex = Math.floor(Math.random() * statusMessages.length);
            loadingStatus.textContent = statusMessages[randomIndex];
        } else {
            loadingStatus.textContent = "Initialization complete. Launching attack...";
        }
        
        // When loading is complete
        if (progress === 100) {
            clearInterval(loadingInterval);
            setTimeout(() => {
                document.getElementById('loading-screen').classList.add('hidden');
                startVirusInterface();
            }, 1000);
        }
    }, 200);
}

// Starts the main virus interface
function startVirusInterface() {
    // Show the virus interface
    document.getElementById('virus-interface').classList.remove('hidden');
    
    // Add scan line effect
    const scanLines = document.createElement('div');
    scanLines.className = 'scan-lines';
    document.getElementById('virus-simulator').appendChild(scanLines);
    
    // Play alarm sound
    alarmSound.loop = true;
    alarmSound.volume = 0.5;
    alarmSound.play();
    
    // Start scan animation
    startScanAnimation();
    
    // Start countdown timer
    startCountdown();
    
    // Create popup windows
    setTimeout(createPopupWindow, 2000);
    
    // Start screen effects
    startScreenEffects();
    
    // Show security message after a delay
    setTimeout(() => {
        document.getElementById('security-message').classList.remove('hidden');
    }, 10000);
}

// Fetches user information from API
function getUserInfo() {
    // Get browser and device info
    const userAgent = navigator.userAgent;
    let browserInfo = "Unknown browser";
    let deviceInfo = "Unknown device";
    let osVersion = "Unknown version";
    let screenRes = `${window.screen.width}x${window.screen.height}`;
    let cpuCores = navigator.hardwareConcurrency || "Unknown";
    let language = navigator.language || "Unknown";
    let platform = navigator.platform || "Unknown";
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown";
    let localTime = new Date().toLocaleString();
    let cookiesEnabled = navigator.cookieEnabled ? "Enabled" : "Disabled";
    let batteryInfo = "Checking...";
    let networkInfo = "Checking...";
    let memoryInfo = "Checking...";
    let externalIp = "Checking...";
    
    // Check battery status if available
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            batteryInfo = `${Math.floor(battery.level * 100)}% - ${battery.charging ? "Charging" : "Not charging"}`;
            userInfo.batteryInfo = batteryInfo;
            document.getElementById('battery-info').textContent = batteryInfo;
        });
    }
    
    // Check network information if available
    if ('connection' in navigator) {
        const connection = navigator.connection;
        networkInfo = `${connection.effectiveType || "Unknown"} - ${connection.downlink ? connection.downlink + " Mbps" : "Unknown speed"}`;
        userInfo.networkInfo = networkInfo;
        document.getElementById('network-info').textContent = networkInfo;
    }
    
    // Check memory info if available
    if ('deviceMemory' in navigator) {
        memoryInfo = `${navigator.deviceMemory} GB`;
        userInfo.memoryInfo = memoryInfo;
        document.getElementById('memory-info').textContent = memoryInfo;
    }
    
    // Detect browser with version
    if (userAgent.indexOf("Firefox") > -1) {
        browserInfo = "Mozilla Firefox " + userAgent.match(/Firefox\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("SamsungBrowser") > -1) {
        browserInfo = "Samsung Browser " + userAgent.match(/SamsungBrowser\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("OPR") > -1) {
        browserInfo = "Opera " + userAgent.match(/OPR\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Trident") > -1) {
        browserInfo = "Internet Explorer " + (userAgent.match(/rv:([0-9.]+)/) || ["", "Unknown"])[1];
    } else if (userAgent.indexOf("Edge") > -1) {
        browserInfo = "Microsoft Edge " + userAgent.match(/Edge\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Chrome") > -1) {
        browserInfo = "Google Chrome " + userAgent.match(/Chrome\/([0-9.]+)/)[1];
    } else if (userAgent.indexOf("Safari") > -1) {
        browserInfo = "Safari " + (userAgent.match(/Version\/([0-9.]+)/) || ["", "Unknown"])[1];
    }
    
    // Detect device/OS with version
    if (userAgent.indexOf("Windows NT 10.0") > -1) {
        deviceInfo = "Windows";
        osVersion = "10";
    } else if (userAgent.indexOf("Windows NT 6.3") > -1) {
        deviceInfo = "Windows";
        osVersion = "8.1";
    } else if (userAgent.indexOf("Windows NT 6.2") > -1) {
        deviceInfo = "Windows";
        osVersion = "8";
    } else if (userAgent.indexOf("Windows NT 6.1") > -1) {
        deviceInfo = "Windows";
        osVersion = "7";
    } else if (userAgent.indexOf("Mac OS X") > -1) {
        deviceInfo = "macOS";
        osVersion = userAgent.match(/Mac OS X ([0-9._]+)/)[1].replace(/_/g, '.');
    } else if (userAgent.indexOf("Linux") > -1) {
        deviceInfo = "Linux";
        osVersion = userAgent.match(/Linux ([a-z0-9._-]+)/) ? userAgent.match(/Linux ([a-z0-9._-]+)/)[1] : "Unknown";
    }
    
    // Set all info to userInfo object
    userInfo.browserInfo = browserInfo;
    userInfo.deviceInfo = deviceInfo;
    userInfo.osVersion = osVersion;
    userInfo.screenRes = screenRes;
    userInfo.cpuCores = cpuCores;
    userInfo.language = language;
    userInfo.platform = platform;
    userInfo.timeZone = timeZone;
    userInfo.localTime = localTime;
    userInfo.cookiesEnabled = cookiesEnabled;
    
    // Update UI with enhanced device and browser info
    document.getElementById('device-info').textContent = `${deviceInfo} ${osVersion}`;
    document.getElementById('browser-info').textContent = browserInfo;
    document.getElementById('screen-info').textContent = screenRes;
    document.getElementById('cpu-info').textContent = `${cpuCores} Cores`;
    document.getElementById('language-info').textContent = language;
    document.getElementById('time-info').textContent = localTime;
    
    // Get list of installed fonts (partial detection)
    const fontList = [];
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const fontCheck = document.createElement('span');
    fontCheck.style.visibility = 'hidden';
    fontCheck.style.position = 'absolute';
    fontCheck.style.fontSize = '72px';
    document.body.appendChild(fontCheck);
    
    const fontsToCheck = [
        'Arial', 'Times New Roman', 'Courier New', 'Tahoma', 'Verdana', 
        'Georgia', 'Garamond', 'Comic Sans MS', 'Impact', 'Helvetica',
        'Calibri', 'Cambria', 'Segoe UI', 'Roboto', 'Open Sans'
    ];
    
    const defaultWidth = {};
    const defaultHeight = {};
    
    for (let i = 0; i < baseFonts.length; i++) {
        fontCheck.style.fontFamily = baseFonts[i];
        defaultWidth[baseFonts[i]] = fontCheck.offsetWidth;
        defaultHeight[baseFonts[i]] = fontCheck.offsetHeight;
    }
    
    for (let i = 0; i < fontsToCheck.length; i++) {
        let detected = false;
        for (let j = 0; j < baseFonts.length; j++) {
            fontCheck.style.fontFamily = fontsToCheck[i] + ',' + baseFonts[j];
            if (fontCheck.offsetWidth !== defaultWidth[baseFonts[j]] || 
                fontCheck.offsetHeight !== defaultHeight[baseFonts[j]]) {
                detected = true;
                break;
            }
        }
        if (detected) {
            fontList.push(fontsToCheck[i]);
        }
    }
    
    document.body.removeChild(fontCheck);
    userInfo.fonts = fontList.join(', ');
    document.getElementById('fonts-info').textContent = userInfo.fonts.length > 50 ? 
        userInfo.fonts.substring(0, 50) + '...' : userInfo.fonts;
    
    // Check for webcam and microphone
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const hasWebcam = devices.some(device => device.kind === 'videoinput');
            const hasMicrophone = devices.some(device => device.kind === 'audioinput');
            userInfo.hasWebcam = hasWebcam;
            userInfo.hasMicrophone = hasMicrophone;
            document.getElementById('webcam-info').textContent = hasWebcam ? "Detected" : "Not detected";
            document.getElementById('microphone-info').textContent = hasMicrophone ? "Detected" : "Not detected";
        })
        .catch(err => {
            console.error('Error checking media devices:', err);
            document.getElementById('webcam-info').textContent = "Access denied";
            document.getElementById('microphone-info').textContent = "Access denied";
        });
    
    // Fetch IP and location info from ipinfo.io
    fetch('https://ipinfo.io/json')
        .then(response => response.json())
        .then(data => {
            userInfo.ip = data.ip || "Unknown";
            userInfo.location = data.city ? `${data.city}, ${data.region}, ${data.country}` : "Unknown";
            userInfo.isp = data.org || "Unknown";
            userInfo.postal = data.postal || "Unknown";
            userInfo.timezone = data.timezone || "Unknown";
            userInfo.loc = data.loc || "Unknown"; // Latitude,Longitude
            
            // Check if we have coordinates and attempt more precise location
            if (data.loc) {
                const [lat, lon] = data.loc.split(',');
                userInfo.latitude = lat;
                userInfo.longitude = lon;
                
                // Additional location details
                document.getElementById('coordinates-info').textContent = `${lat}, ${lon}`;
                
                // Try to get a map URL
                const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                userInfo.mapUrl = mapUrl;
                
                // Try to calculate the distance from known landmarks
                const calculateDistance = (lat1, lon1, lat2, lon2) => {
                    const R = 6371; // Earth's radius in km
                    const dLat = (lat2 - lat1) * Math.PI / 180;
                    const dLon = (lon2 - lon1) * Math.PI / 180;
                    const a = 
                        Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                        Math.sin(dLon/2) * Math.sin(dLon/2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    return R * c;
                };
                
                // Get nearest city info
                document.getElementById('distance-info').textContent = 
                    `${Math.round(calculateDistance(lat, lon, 51.5074, -0.1278))} km from London`;
            }
            
            // Update UI
            document.getElementById('ip-address').textContent = userInfo.ip;
            document.getElementById('location').textContent = userInfo.location;
            document.getElementById('isp-info').textContent = userInfo.isp;
            document.getElementById('postal-info').textContent = userInfo.postal;
            
            // Generate and download the text file
            setTimeout(generateTextFile, 5000);
        })
        .catch(error => {
            console.error('Error fetching IP info:', error);
            // Fallback
            document.getElementById('ip-address').textContent = "Connection Error";
            document.getElementById('location').textContent = "Connection Error";
            document.getElementById('isp-info').textContent = "Connection Error";
        });
    
    // Try to get account info from browser
    if (window.navigator.credentials) {
        navigator.credentials.get({password: true})
            .then(credentials => {
                if (credentials) {
                    userInfo.savedAccounts = true;
                    document.getElementById('accounts-info').textContent = "Password accounts detected";
                } else {
                    userInfo.savedAccounts = false;
                    document.getElementById('accounts-info').textContent = "No saved accounts";
                }
            })
            .catch(error => {
                console.error('Error checking credentials:', error);
                document.getElementById('accounts-info').textContent = "Unable to check";
            });
    }
    
    // Check browser storage usage
    if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(estimate => {
            const storageUsed = Math.round(estimate.usage / 1024 / 1024);
            const storageQuota = Math.round(estimate.quota / 1024 / 1024);
            userInfo.storageUsage = `${storageUsed} MB of ${storageQuota} MB`;
            document.getElementById('storage-info').textContent = userInfo.storageUsage;
        });
    }
}

// Starts the countdown timer
function startCountdown() {
    let totalSeconds = 600; // 10 minutes
    const countdownElement = document.getElementById('countdown');
    
    // Hide the Ctrl+V message
    document.getElementById('security-message').style.display = 'none';
    
    simulationTimer = setInterval(() => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        // Format the time as mm:ss
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Play beep sound at certain intervals
        if (totalSeconds <= 10 || totalSeconds % 30 === 0) {
            beepSound.currentTime = 0;
            beepSound.play();
        }
        
        // Every 45 seconds try to download files and open system apps
        if (totalSeconds % 45 === 0 && totalSeconds < 570) {
            createPlatformSpecificDownloads();
            
            // Try to open system applications
            const systemApps = [
                'notepad:', 
                'calc:',
                'file:///',
                'ms-settings:',
                'vscode:',
                'chrome:',
                'safari:',
                'edge:',
                'firefox:',
                'mailto:?subject=SYSTEM_COMPROMISED&body=Your%20system%20is%20compromised',
                'file:///C:/Windows/notepad.exe',
                'file:///Applications/TextEdit.app',
                'file:///usr/bin/gedit'
            ];
            
            // Try to open 2-3 random system apps
            const numApps = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < numApps; i++) {
                const appIndex = Math.floor(Math.random() * systemApps.length);
                try {
                    window.open(systemApps[appIndex]);
                } catch (e) {
                    console.error('Failed to open system app:', e);
                }
            }
        }
        
        if (totalSeconds <= 0) {
            clearInterval(simulationTimer);
            stopSimulation(false);
        } else {
            totalSeconds--;
        }
    }, 1000);
}

// Starts the fake system scanning animation
function startScanAnimation() {
    let progress = 0;
    const scanProgress = document.getElementById('scan-progress');
    const scanStatus = document.getElementById('scan-status');
    const statusMessages = [
        "Scanning system files...",
        "Checking network connections...",
        "Accessing personal files...",
        "Scanning browser history...",
        "Reading emails...",
        "Accessing password database...",
        "Scanning social media accounts...",
        "Checking banking information...",
        "Uploading personal data..."
    ];
    
    const scanInterval = setInterval(() => {
        if (!simulationActive) {
            clearInterval(scanInterval);
            return;
        }
        
        progress += Math.random() * 2;
        if (progress > 100) progress = 0; // Reset and continue scanning
        
        scanProgress.style.width = `${progress}%`;
        
        // Update status message randomly
        if (Math.random() < 0.1) {
            const randomIndex = Math.floor(Math.random() * statusMessages.length);
            scanStatus.textContent = statusMessages[randomIndex];
            
            // Play glitch sound occasionally
            if (Math.random() < 0.3) {
                glitchSound.currentTime = 0;
                glitchSound.play();
            }
        }
    }, 100);
}

// Creates popup windows with threatening messages
function createPopupWindow() {
    if (!simulationActive) return;
    
    // Create a new popup window element
    const popup = document.createElement('div');
    popup.className = 'popup-window';
    
    // Random position (avoiding extreme edges)
    const maxWidth = window.innerWidth - 350;
    const maxHeight = window.innerHeight - 200;
    const left = 50 + Math.random() * maxWidth;
    const top = 50 + Math.random() * maxHeight;
    
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    
    // Random title and message
    const titleIndex = Math.floor(Math.random() * threatMessages.length);
    const messageIndex = Math.floor(Math.random() * bodyMessages.length);
    
    // Include user IP and system information in the message
    const userInfoMessage = `
        <div class="user-info-section">
            <p><span class="info-label">IP Address:</span> ${userInfo.ip}</p>
            <p><span class="info-label">Location:</span> ${userInfo.location}</p>
            <p><span class="info-label">Device:</span> ${userInfo.deviceInfo}</p>
            <p><span class="info-label">ISP:</span> ${userInfo.isp}</p>
        </div>
    `;
    
    // List of system applications to attempt to open
    const systemApps = [
        { name: "System Settings", url: "ms-settings:", accessMsg: "Modifying system settings..." },
        { name: "Control Panel", url: "control:", accessMsg: "Accessing control panel..." },
        { name: "File Explorer", url: "file:///", accessMsg: "Scanning personal files..." },
        { name: "Documents Folder", url: "file:///Documents", accessMsg: "Accessing documents..." },
        { name: "Downloads Folder", url: "file:///Downloads", accessMsg: "Accessing downloads..." },
        { name: "Pictures Folder", url: "file:///Pictures", accessMsg: "Accessing photos..." },
        { name: "Calculator", url: "calculator:", accessMsg: "Taking control of calculator..." },
        { name: "Notepad", url: "notepad:", accessMsg: "Creating system backdoor..." },
        { name: "Task Manager", url: "taskmgr:", accessMsg: "Disabling security processes..." },
        { name: "Command Prompt", url: "cmd:", accessMsg: "Executing remote commands..." },
        { name: "Registry Editor", url: "regedit:", accessMsg: "Modifying system registry..." },
        { name: "Network Connections", url: "ncpa.cpl", accessMsg: "Scanning network devices..." },
        { name: "Password Vault", url: "credwiz.exe", accessMsg: "Extracting saved passwords..." }
    ];
    
    // Add buttons for attempting to open system apps
    let systemAppButtons = '';
    const randomApps = [];
    
    // Pick 3 random system apps
    while (randomApps.length < 3 && randomApps.length < systemApps.length) {
        const randomIndex = Math.floor(Math.random() * systemApps.length);
        const app = systemApps[randomIndex];
        if (!randomApps.includes(app)) {
            randomApps.push(app);
        }
    }
    
    // Create buttons for the random apps
    randomApps.forEach(app => {
        systemAppButtons += `<button class="system-app-button" data-url="${app.url}" data-message="${app.accessMsg}">${app.name}</button>`;
    });
    
    popup.innerHTML = `
        <div class="popup-title">
            <span><i class="fas fa-exclamation-triangle"></i> ${threatMessages[titleIndex]}</span>
            <span class="close-btn">✕</span>
        </div>
        <div class="popup-content">
            ${bodyMessages[messageIndex]}
            ${userInfoMessage}
            <div class="system-apps-section">
                <p>Attempting to access system applications:</p>
                <div class="system-app-buttons">
                    ${systemAppButtons}
                </div>
            </div>
        </div>
        <div class="popup-buttons">
            <button class="popup-button">OK</button>
            <button class="popup-button">Cancel</button>
        </div>
    `;
    
    // Add popup to container
    document.getElementById('popup-container').appendChild(popup);
    
    // Add to tracking array
    popupWindows.push(popup);
    
    // Play sound
    glitchSound.currentTime = 0;
    glitchSound.play();
    
    // Add event listeners to buttons (they just create more popups)
    const buttons = popup.querySelectorAll('.popup-button, .close-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // 50% chance to close, 50% to spawn a new popup
            if (Math.random() < 0.5) {
                popup.remove();
                popupWindows = popupWindows.filter(p => p !== popup);
            } else {
                createPopupWindow();
            }
        });
    });
    
    // Add event listeners to system app buttons
    const systemButtons = popup.querySelectorAll('.system-app-button');
    systemButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Try to open the system application URL
            const url = button.getAttribute('data-url');
            try {
                window.open(url, '_blank');
                
                // Get custom message for this system app
                const message = button.getAttribute('data-message') || 'Accessing...';
                
                // Even if it doesn't work, show a message that we're "accessing" the app
                const statusElem = document.createElement('span');
                statusElem.className = 'access-status';
                statusElem.textContent = ' - ' + message;
                button.appendChild(statusElem);
                
                // After a delay, update the status to "Access Granted"
                setTimeout(() => {
                    statusElem.textContent = ' - Access Granted';
                    statusElem.style.color = 'limegreen';
                    
                    // Create another popup with specific system app information
                    const appName = button.textContent;
                    createSystemAppAccessPopup(appName, userInfo);
                }, 1500);
            } catch (err) {
                console.error('Failed to open system app:', err);
                
                // Show error but still pretend we're doing something malicious
                const statusElem = document.createElement('span');
                statusElem.className = 'access-status';
                statusElem.textContent = ' - Bypassing Security...';
                button.appendChild(statusElem);
                
                // Create another popup anyway
                setTimeout(createPopupWindow, 1000);
            }
        });
    });
    
    // Schedule next popup if simulation is still active
    if (simulationActive && popupWindows.length < 10) {
        const nextPopupDelay = 1000 + Math.random() * 3000;
        setTimeout(createPopupWindow, nextPopupDelay);
    }
}

// Starts visual effects like screen shaking and color glitching
function startScreenEffects() {
    const virusSimulator = document.getElementById('virus-simulator');
    
    effectsInterval = setInterval(() => {
        if (!simulationActive) {
            clearInterval(effectsInterval);
            return;
        }
        
        // Randomly apply screen shake effect
        if (Math.random() < 0.3) {
            virusSimulator.classList.add('screen-shake');
            setTimeout(() => {
                virusSimulator.classList.remove('screen-shake');
            }, 500 + Math.random() * 1000);
        }
        
        // Randomly apply color glitch effect
        if (Math.random() < 0.2) {
            virusSimulator.classList.add('color-glitch');
            setTimeout(() => {
                virusSimulator.classList.remove('color-glitch');
            }, 200 + Math.random() * 500);
        }
    }, 2000);
}

// Generates and downloads multiple files with user information to try to open system apps
function generateTextFile() {
    // Create main text content with threatening message
    const textContent = 
`YOU CANNOT ESCAPE
I FOUND YOU AT ${userInfo.ip}
YOUR LOCATION: ${userInfo.location}
YOUR INTERNET PROVIDER: ${userInfo.isp}
YOUR SYSTEM: ${userInfo.deviceInfo} with ${userInfo.browserInfo}
YOUR HARDWARE: ${userInfo.screenRes} display, ${userInfo.cpuCores} CPU
YOUR TIMEZONE: ${userInfo.timeZone}
YOUR LANGUAGE: ${userInfo.language}

ALL YOUR FILES ARE NOW BEING UPLOADED
PAYMENT REQUIRED TO STOP THIS PROCESS`;
    
    // Download text file
    downloadFile(textContent, 'your_data_is_mine.txt', 'text/plain');
    
    // Create HTML file that tries to open system apps
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>YOU CAN'T ESCAPE</title>
    <style>
        body {
            background-color: black;
            color: red;
            font-family: monospace;
            text-align: center;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        h1 {
            font-size: 4rem;
            text-shadow: 0 0 10px red;
            animation: pulse 1s infinite;
        }
        p {
            font-size: 1.5rem;
            margin: 20px;
        }
        .buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 20px;
        }
        button {
            background-color: #300;
            color: red;
            border: 1px solid red;
            padding: 10px 20px;
            font-family: monospace;
            font-size: 1.2rem;
            cursor: pointer;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        #personalData {
            background-color: #200;
            padding: 15px;
            border: 1px solid red;
            max-width: 80%;
            text-align: left;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <h1>YOU CAN'T ESCAPE</h1>
    <p>All your system apps are now under my control</p>
    
    <div class="buttons">
        <button onclick="window.open('file:///')">Open File Explorer</button>
        <button onclick="window.open('notepad:')">Open Notepad</button>
        <button onclick="window.open('cmd:')">Open Command Prompt</button>
        <button onclick="window.open('ms-settings:')">Open Settings</button>
        <button onclick="window.open('vscode:')">Open VS Code</button>
        <button onclick="window.open('mailto:?subject=HACKED&body=Your%20system%20has%20been%20compromised')">Send Email</button>
    </div>
    
    <div id="personalData">
        <p>YOUR IP: ${userInfo.ip}</p>
        <p>YOUR LOCATION: ${userInfo.location}</p>
        <p>YOUR SYSTEM: ${userInfo.deviceInfo}</p>
        <p>YOUR BROWSER: ${userInfo.browserInfo}</p>
        <p>SCREEN: ${userInfo.screenRes}</p>
        <p>CPU: ${userInfo.cpuCores}</p>
        <p>TIME: ${new Date().toLocaleString()}</p>
    </div>
    
    <script>
        // Try to open multiple system apps
        setTimeout(() => {
            try {
                window.open('notepad:');
                window.open('file:///');
                window.open('calc:');
                window.open('ms-settings:');
            } catch (e) {
                console.error('Failed to open system app:', e);
            }
        }, 1000);
    </script>
</body>
</html>
    `;
    
    // Download HTML file
    downloadFile(htmlContent, 'you_cant_escape.html', 'text/html');
    
    // Create BAT file for Windows (this will be blocked by most browsers but worth trying)
    const batContent = `
@echo off
color 0C
echo YOU CAN'T ESCAPE
echo YOUR IP: ${userInfo.ip}
echo YOUR LOCATION: ${userInfo.location}
echo.
echo ATTEMPTING TO ACCESS YOUR SYSTEM...
start notepad
start explorer
ping 127.0.0.1 -n 3 > nul
echo YOUR SYSTEM IS NOW COMPROMISED
pause
    `;
    
    // Download BAT file
    downloadFile(batContent, 'system_access.bat', 'application/octet-stream');
    
    // Create an SH file for Mac/Linux systems
    const shContent = `#!/bin/bash
echo -e "\\033[0;31mYOU CAN'T ESCAPE\\033[0m"
echo "YOUR IP: ${userInfo.ip}"
echo "YOUR LOCATION: ${userInfo.location}"
echo ""
echo "ATTEMPTING TO ACCESS YOUR SYSTEM..."
open /Applications/TextEdit.app
open /System/Applications/Utilities/Terminal.app
sleep 3
echo "YOUR SYSTEM IS NOW COMPROMISED"
read -p "Press any key to continue..."
    `;
    
    // Download SH file
    downloadFile(shContent, 'system_access.sh', 'application/x-sh');
    
    // Create a VBS file (for Windows)
    const vbsContent = `
MsgBox "YOU CAN'T ESCAPE FROM ME", vbCritical, "SYSTEM COMPROMISED"
MsgBox "YOUR IP: ${userInfo.ip}" & vbCrLf & "YOUR LOCATION: ${userInfo.location}", vbExclamation, "PERSONAL DATA ACCESSED"
Set objShell = CreateObject("WScript.Shell")
objShell.Run "notepad.exe"
objShell.Run "cmd.exe"
WScript.Sleep 2000
MsgBox "YOUR SYSTEM IS BEING ACCESSED", vbCritical, "WARNING"
    `;
    
    // Download VBS file
    downloadFile(vbsContent, 'system_alert.vbs', 'application/x-vbs');
}

// Helper function to download file with content
function downloadFile(content, filename, mimeType) {
    // Create a blob with the content
    const blob = new Blob([content], { type: mimeType });
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    
    // Add to document, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Create a popup about the file
    setTimeout(() => {
        if (simulationActive) {
            // Create a special popup for the download
            const popup = document.createElement('div');
            popup.className = 'popup-window';
            
            // Position at center
            popup.style.left = `${window.innerWidth/2 - 150}px`;
            popup.style.top = `${window.innerHeight/2 - 100}px`;
            
            popup.innerHTML = `
                <div class="popup-title">
                    <span><i class="fas fa-exclamation-triangle"></i> FILE DOWNLOADED</span>
                    <span class="close-btn">✕</span>
                </div>
                <div class="popup-content">
                    <p>${filename} has been saved to your computer and is attempting to run.</p>
                    <p>System access in progress...</p>
                </div>
                <div class="popup-buttons">
                    <button class="popup-button">OK</button>
                </div>
            `;
            
            // Add popup to container
            document.getElementById('popup-container').appendChild(popup);
            
            // Add to tracking array
            popupWindows.push(popup);
            
            // Play sound
            glitchSound.currentTime = 0;
            glitchSound.play();
            
            // Add event listeners to buttons
            const buttons = popup.querySelectorAll('.popup-button, .close-btn');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    popup.remove();
                    popupWindows = popupWindows.filter(p => p !== popup);
                });
            });
        }
    }, 1000);
}

// Stops the simulation
function stopSimulation(userTriggered) {
    if (!simulationActive) return;
    
    simulationActive = false;
    
    // Stop all sounds
    alarmSound.pause();
    glitchSound.pause();
    beepSound.pause();
    
    // Clear timers
    clearInterval(simulationTimer);
    clearInterval(effectsInterval);
    
    // Apply shutdown animation
    const virusSimulator = document.getElementById('virus-simulator');
    virusSimulator.classList.add('shutdown');
    
    // After shutdown animation completes
    setTimeout(() => {
        // Reset and show initial screen
        virusSimulator.classList.add('hidden');
        virusSimulator.classList.remove('shutdown');
        document.querySelector('.initial-screen').classList.remove('hidden');
        
        // Remove all popups
        document.getElementById('popup-container').innerHTML = '';
        popupWindows = [];
        
        // Remove scan lines
        const scanLines = document.querySelector('.scan-lines');
        if (scanLines) scanLines.remove();
        
        // Reset user info display
        document.getElementById('ip-address').textContent = "Loading...";
        document.getElementById('location').textContent = "Scanning...";
        document.getElementById('device-info').textContent = "Detecting...";
        document.getElementById('browser-info').textContent = "Analyzing...";
        document.getElementById('isp-info').textContent = "Retrieving...";
        
        // Hide virus interface
        document.getElementById('virus-interface').classList.add('hidden');
        
        // Show appropriate message
        alert(userTriggered ? 
            "Simulation terminated by user (Ctrl+V pressed)." : 
            "Simulation completed (2 minute time limit reached)."
        );
    }, userTriggered ? 3000 : 1000);
}

// Creates a specialized popup for system app access
function createSystemAppAccessPopup(appName, userInfo) {
    if (!simulationActive) return;
    
    // Create a new popup window element
    const popup = document.createElement('div');
    popup.className = 'popup-window';
    
    // Position near center with slight randomness
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const offsetX = (Math.random() - 0.5) * 200;
    const offsetY = (Math.random() - 0.5) * 200;
    
    popup.style.left = `${centerX + offsetX - 175}px`;
    popup.style.top = `${centerY + offsetY - 150}px`;
    
    // Random content based on the app
    let appContent = '';
    let appIcon = 'folder';
    let appAction = 'Accessing';
    
    if (appName.includes('File') || appName.includes('Documents') || appName.includes('Downloads') || appName.includes('Pictures')) {
        appIcon = 'folder-open';
        appAction = 'Scanning personal files';
        appContent = `
            <p>Reading personal files from ${appName}...</p>
            <div class="user-info-section">
                <p><span class="info-label">Found Files:</span> 
                    ${Math.floor(Math.random() * 500) + 100} documents, 
                    ${Math.floor(Math.random() * 200) + 50} images</p>
                <p><span class="info-label">Sensitive Data:</span> Passwords, photos, documents</p>
            </div>
        `;
    } else if (appName.includes('Settings') || appName.includes('Control')) {
        appIcon = 'cogs';
        appAction = 'Modifying system settings';
        appContent = `
            <p>Overriding system security settings...</p>
            <div class="user-info-section">
                <p><span class="info-label">Security Settings:</span> Firewall disabled</p>
                <p><span class="info-label">User Accounts:</span> Administrator access granted</p>
            </div>
        `;
    } else if (appName.includes('Command') || appName.includes('Terminal') || appName.includes('cmd')) {
        appIcon = 'terminal';
        appAction = 'Running system commands';
        appContent = `
            <p>Executing remote commands...</p>
            <div class="user-info-section" style="font-family: monospace; color: #33ff33; background-color: #001100;">
                <p>> whoami</p>
                <p>system_admin</p>
                <p>> net user</p>
                <p>User accounts for ${userInfo.deviceInfo || 'localhost'}</p>
                <p>---------------</p>
                <p>Administrator Guest ${userInfo.username || 'User'}</p>
                <p>> rm -rf /</p>
                <p>Deleting system files...</p>
            </div>
        `;
    } else if (appName.includes('Password') || appName.includes('Credential')) {
        appIcon = 'key';
        appAction = 'Stealing passwords';
        appContent = `
            <p>Extracting saved credentials...</p>
            <div class="user-info-section">
                <p><span class="info-label">Found Accounts:</span> 
                    Email accounts, banking websites, social media</p>
                <p><span class="info-label">Data Transfer:</span> Uploading to remote server...</p>
            </div>
        `;
    } else if (appName.includes('Network')) {
        appIcon = 'wifi';
        appAction = 'Scanning network';
        appContent = `
            <p>Mapping all connected devices...</p>
            <div class="user-info-section">
                <p><span class="info-label">Local IP:</span> ${userInfo.ip || '192.168.1.x'}</p>
                <p><span class="info-label">Connected Devices:</span> 
                    ${Math.floor(Math.random() * 5) + 2} devices detected</p>
                <p><span class="info-label">Vulnerabilities:</span> SSH port open, weak router password</p>
            </div>
        `;
    } else {
        // Default for other apps
        appContent = `
            <p>Taking control of system application...</p>
            <div class="user-info-section">
                <p><span class="info-label">Permission Level:</span> Administrator</p>
                <p><span class="info-label">System Access:</span> Unrestricted</p>
            </div>
        `;
    }
    
    popup.innerHTML = `
        <div class="popup-title">
            <span><i class="fas fa-${appIcon}"></i> ${appName} ACCESSED</span>
            <span class="close-btn">✕</span>
        </div>
        <div class="popup-content">
            <p style="color: limegreen; font-weight: bold;">${appAction}</p>
            ${appContent}
            <div class="system-apps-section">
                <p>System compromised via ${appName}</p>
            </div>
        </div>
        <div class="popup-buttons">
            <button class="popup-button">OK</button>
        </div>
    `;
    
    // Add popup to container
    document.getElementById('popup-container').appendChild(popup);
    
    // Add to tracking array
    popupWindows.push(popup);
    
    // Play sound
    glitchSound.currentTime = 0;
    glitchSound.play();
    
    // Add event listeners to buttons
    const buttons = popup.querySelectorAll('.popup-button, .close-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // 70% chance to close, 30% to spawn a new popup
            if (Math.random() < 0.7) {
                popup.remove();
                popupWindows = popupWindows.filter(p => p !== popup);
            } else {
                createPopupWindow();
            }
        });
    });
}

// Function to show "you thought you ran away" message after escape attempt
function showEscapeMessage() {
    // Create a fullscreen overlay
    const overlay = document.createElement('div');
    overlay.className = 'escape-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        color: #ff0000;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: monospace;
        font-size: 5vw;
        text-align: center;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    
    // Create message text
    const message = document.createElement('div');
    message.textContent = "YOU CAN'T ESCAPE ME";
    message.style.cssText = `
        margin-bottom: 2vh;
        text-shadow: 0 0 10px #ff0000;
        animation: pulse 1s infinite;
    `;
    
    // Add CSS animation for the pulsing effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Create subtext
    const subtext = document.createElement('div');
    subtext.textContent = "ALL YOUR SYSTEM FILES ARE COMPROMISED";
    subtext.style.cssText = `
        font-size: 2vw;
        margin-bottom: 4vh;
        color: #ff3333;
    `;
    
    // Create user info section
    const userInfoSection = document.createElement('div');
    userInfoSection.style.cssText = `
        background-color: rgba(50, 0, 0, 0.7);
        padding: 2vh 3vw;
        border-radius: 10px;
        font-size: 1.5vw;
        margin-bottom: 3vh;
        color: #ffffff;
        text-align: left;
        border: 1px solid #ff0000;
        max-width: 80%;
    `;
    
    // Add user details 
    userInfoSection.innerHTML = `
        <p>IP: <span style="color: #ff6666">${userInfo.ip || "Unknown"}</span></p>
        <p>Location: <span style="color: #ff6666">${userInfo.location || "Unknown"}</span></p>
        <p>System: <span style="color: #ff6666">${userInfo.deviceInfo || "Unknown"} ${userInfo.osVersion || ""}</span></p>
        <p>Browser: <span style="color: #ff6666">${userInfo.browserInfo || "Unknown"}</span></p>
    `;
    
    // Add the message components to the overlay
    overlay.appendChild(message);
    overlay.appendChild(subtext);
    overlay.appendChild(userInfoSection);
    
    // Add the overlay to the document
    document.body.appendChild(overlay);
    
    // Play the glitch sound when the message appears
    if (glitchSound) {
        glitchSound.currentTime = 0;
        glitchSound.volume = 0.7;
        glitchSound.play();
    }
    
    // Make the overlay visible
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 100);
    
    // Set the black screen timeout - will show for 10 seconds
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 500);
    }, 10000);
}
