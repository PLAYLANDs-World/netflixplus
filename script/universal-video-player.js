function openVideoPlayer(videoUrl) {
    // Convert YouTube URL to embed format
    const convertedUrl = videoUrl
        .replace('youtu.be/', 'youtube.com/embed/')
        .replace('watch?v=', 'embed/')
        .replace('/embed/embed/', '/embed/') + '?autoplay=1';

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
    overlay.style.zIndex = '9999';
    overlay.style.cursor = 'pointer';

    // Create iframe container
    const iframeContainer = document.createElement('div');
    iframeContainer.style.position = 'absolute';
    iframeContainer.style.top = '50%';
    iframeContainer.style.left = '50%';
    iframeContainer.style.transform = 'translate(-50%, -50%)';
    iframeContainer.style.width = '100%';
    iframeContainer.style.height = '100%';
    iframeContainer.style.cursor = 'auto';

    // Create YouTube iframe
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '10px';
    iframe.src = convertedUrl;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;

    // Create Close Button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = `<svg class="vp-back-ico" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="back-arrow" fill="white">
                            <path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path>
                            <path d="M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z"></path>
                            </svg>`;
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.left = '20px';
    closeButton.style.color = 'white';
    closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    closeButton.style.border = 'none';
    closeButton.style.padding = '3px';
    closeButton.style.borderRadius = '50%';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '10000';
    closeButton.style.transition = '0.3s';

    // Create Restore Button
    const restoreButton = document.createElement('button');
    restoreButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                            <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
                            </svg>`;
    restoreButton.style.position = 'absolute';
    restoreButton.style.top = '20px';
    restoreButton.style.right = '20px';
    restoreButton.style.color = 'white';
    restoreButton.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    restoreButton.style.border = 'none';
    restoreButton.style.padding = '3px';
    restoreButton.style.borderRadius = '50%';
    restoreButton.style.fontSize = '16px';
    restoreButton.style.cursor = 'pointer';
    restoreButton.style.zIndex = '10000';
    restoreButton.style.transition = '0.3s';

    // Hover effects
    closeButton.addEventListener('mouseover', () => {
        closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    });
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    });
    restoreButton.addEventListener('mouseover', () => {
        restoreButton.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    });
    restoreButton.addEventListener('mouseout', () => {
        restoreButton.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    });

    // State management
    let isFullscreen = false;
    let originalOrientation = window.matchMedia("(orientation: portrait)").matches ? 'portrait' : 'landscape';

    // Orientation control functions
    async function lockLandscape() {
        try {
            if (!document.fullscreenElement) {
                await iframeContainer.requestFullscreen();
            }
            if (screen.orientation?.lock) {
                await screen.orientation.lock('landscape');
            }
        } catch (e) {
            console.log('Orientation error:', e);
        }
    }

    async function unlockOrientation() {
        try {
            if (screen.orientation?.unlock) {
                await screen.orientation.unlock();
            }
            if (originalOrientation === 'portrait') {
                window.screen.orientation?.lock?.('portrait');
            }
        } catch (e) {
            console.log('Orientation unlock error:', e);
        }
    }

    // Assemble elements
    iframeContainer.appendChild(iframe);
    overlay.appendChild(iframeContainer);
    overlay.appendChild(closeButton);
    overlay.appendChild(restoreButton);
    document.body.appendChild(overlay);

    // Initial fullscreen
    lockLandscape();

    // Close functionality
    function closePlayer() {
        document.body.removeChild(overlay);
        unlockOrientation();
        document.exitFullscreen();
        document.body.style.overflow = 'auto';
    }

    // Restore functionality
    async function restoreFullscreen() {
        await lockLandscape();
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }

    // Event listeners
    closeButton.addEventListener('click', closePlayer);
    restoreButton.addEventListener('click', restoreFullscreen);

    // Handle overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            restoreFullscreen();
        }
    });

    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && document.body.contains(overlay)) {
            restoreButton.style.display = 'block';
        }
    });

    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}