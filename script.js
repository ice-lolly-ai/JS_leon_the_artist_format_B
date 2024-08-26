document.addEventListener('DOMContentLoaded', () => {
    const videoSources = [
        'vids/wealth_1_pure.mp4',
        'vids/wealth_2_pure.mp4'
    ];

    const initialVideoCount = 3;
    let videoElements = [];

    // Elements
    const videoSizeInput = document.getElementById('videoSize');
    const videoSpeedInput = document.getElementById('videoSpeed');
    const numVideosInput = document.getElementById('numVideos');
    const randomizeButton = document.getElementById('randomizeButton');
    const toggleDarkModeButton = document.getElementById('toggleDarkMode');
    
    // Initialize videos
    function initializeVideos(count) {
        const container = document.getElementById('video-container');
        container.innerHTML = ''; // Clear any existing videos
        videoElements = []; // Clear the video elements array

        for (let i = 0; i < count; i++) {
            const video = document.createElement('video');
            video.className = 'video-player';
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.src = videoSources[i % videoSources.length];
            container.appendChild(video);
            videoElements.push(video);
            startBouncingAnimation(video);
        }
    }

    // Update video size
    function updateVideoSize() {
        const size = videoSizeInput.value + 'px';
        videoElements.forEach(video => {
            video.style.width = size;
            video.style.height = size;
        });
    }

    // Update video speed
    function updateVideoSpeed() {
        const speed = videoSpeedInput.value;
        videoElements.forEach(video => {
            video.playbackRate = parseFloat(speed);
        });
    }

    // Update number of videos
    function updateNumVideos() {
        const numVideos = numVideosInput.value;
        initializeVideos(numVideos);
    }

    // Function to randomize the shape of videos
    function updateVideoShapes(shapeClass) {
        videoElements.forEach(video => {
            video.className = `video-player ${shapeClass}`;
        });
    }

    function startBouncingAnimation(video) {
        const container = document.getElementById('video-container');
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const videoWidth = video.offsetWidth;
        const videoHeight = video.offsetHeight;

        let dx = Math.random() * 4 - 2;
        let dy = Math.random() * 4 - 2;

        function animate() {
            let x = parseFloat(video.style.left || 0);
            let y = parseFloat(video.style.top || 0);

            x += dx;
            y += dy;

            if (x <= 0 || x + videoWidth >= containerWidth) {
                dx = -dx;
            }
            if (y <= 0 || y + videoHeight >= containerHeight) {
                dy = -dy;
            }

            video.style.left = `${x}px`;
            video.style.top = `${y}px`;

            requestAnimationFrame(animate);
        }

        video.style.position = 'absolute';
        video.style.left = `${Math.random() * (containerWidth - videoWidth)}px`;
        video.style.top = `${Math.random() * (containerHeight - videoHeight)}px`;

        animate();
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }

    // Speech recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const speechResult = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
            console.log('Speech recognized: ', speechResult);

            const shapesMap = {
                'circle': 'circle',
                'rectangle': 'rectangle',
                'triangle': 'triangle',
                'bird': 'bird-shape',
                'birds': 'bird-shape',
                'apple': 'apple-shape',
                'apples': 'apple-shape'
            };

            if (shapesMap[speechResult]) {
                updateVideoShapes(shapesMap[speechResult]);
            } else {
                console.log('No matching shape for:', speechResult);
            }
        };

        recognition.onerror = (event) => {
            console.log('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            recognition.start(); // Restart recognition on end
        };

        recognition.start();
    } else {
        console.log('Speech Recognition not supported in this browser.');
    }

    randomizeButton.addEventListener('click', () => {
        const shapes = ['circle', 'rectangle', 'triangle', 'bird-shape', 'apple-shape'];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        updateVideoShapes(randomShape);
    });
    
    toggleDarkModeButton.addEventListener('click', toggleDarkMode);

    // Initialize the videos and controls
    initializeVideos(initialVideoCount);
    updateVideoSize();
    updateVideoSpeed();
});
