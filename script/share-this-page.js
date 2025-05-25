function initializeShareWidget() {
    let sharedImageUrl = '';
    let isModalOpen = false;

    // Create elements
    const style = document.createElement('style');
    const overlay = document.createElement('div');
    const modal = document.createElement('div');
    const toast = document.createElement('div');
    const closeBtn = document.createElement('span');
    const scrollContainer = document.createElement('div');
    const urlContainer = document.createElement('div');
    const copyBtn = document.createElement('button');

    // Set initial hidden state
    modal.style.display = 'none';
    overlay.style.display = 'none';
    toast.style.display = 'none';

    // Add styles
    style.textContent = `

        * {
        scrollbar-width: thin;
        scrollbar-color:rgba(137, 43, 226, 0) #1a1a1a;
    }

    /* Chrome/Edge/Safari */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background:rgba(26, 26, 26, 0);
        border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background:rgba(137, 43, 226, 0);
        border-radius: 4px;
        border: 2px solid #1a1a1a;
    }

    ::-webkit-scrollbar-thumb:hover {
        background:rgba(123, 31, 162, 0);
    }

    /* Specific to platforms scroll */
    .platforms-scroll {
        scrollbar-width: thin; /* Firefox */
        scrollbar-color: #444rgba(26, 26, 26, 0); /* Firefox */
    }

    .platforms-scroll::-webkit-scrollbar-track {
        background:rgba(26, 26, 26, 0);
    }

    .platforms-scroll::-webkit-scrollbar-thumb {
        background: #444;
        border: 1px solid #1a1a1a;
    }
        .share-modal {
            position: fixed;
            bottom: -300px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(to bottom,rgb(111, 1, 6), #000000);
            padding: 20px;
            border-radius: 20px 20px 0 0;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
            z-index: 1001;
            max-width: 90%;
            width: 440px;
            animation: modalSlideDown 0.3s ease forwards;
        }

        .share-modal.active {
            animation: modalSlideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1) forwards;
        }

        .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(5px);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .overlay.active {
            opacity: 1;
            pointer-events: all;
        }

        .platforms-scroll {
            display: flex;
            gap: 15px;
            overflow-x: auto;
            padding: 10px 0;
            scrollbar-width: thin;
            scrollbar-color: #444rgba(26, 26, 26, 0);
        }

        .platform {
            min-width: 60px;
            height: 60px;
            border-radius: 15px;
            border: none;
            cursor: none;
            transition: all 0.2s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            background:rgba(45, 45, 45, 0);
            padding: 0;
        }

        .platform:active {
            transform: scale(0.85);
            transition: all 0.2s ease;
            filter: brightness(1.15);
        }

        .platform svg {
            width: 35px;
            height: 35px;
        }

        .url-container {
            display: flex;
            align-items: center;
            background:rgba(45, 45, 45, 0.6);
            border-radius: 8px;
            padding: 0;
            margin-bottom: 5px;
            gap: 12px;
            transition: all 0.2s ease;
        }

        .url-text {
            flex: 1;
            color: #fff;
            padding-left: 12px;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-family: monospace;
        }

        .copy-btn {
            background:rgba(137, 43, 226, 0);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            cursor: none;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
        }

        .copy-btn:active {
            transform: scale(0.75
            );
        }

        .copy-btn svg {
            width: 18px;
            height: 18px;
        }

         .toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #8a2be2;
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 14px;
            display: none;
            align-items: center;
            gap: 12px;
            box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
            z-index: 1002;
            animation: toastSlideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }

        .toast-icon {
            width: 24px;
            height: 24px;
            animation: iconBounce 0.6s ease;
        }

        @keyframes toastSlideUp {
            0% {
                opacity: 0;
                transform: translate(-50%, 30px);
            }
            100% {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }

        @keyframes iconBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
        }

        @keyframes modalSlideUp {
            from { bottom: -300px; opacity: 0; }
            to { bottom: 20px; opacity: 1; }
        }

        @keyframes modalSlideDown {
            from { bottom: 20px; opacity: 1; }
            to { bottom: -300px; opacity: 0; }
        }

        @keyframes toastPop {
            0% { transform: translate(-50%, 20px); opacity: 0; }
            100% { transform: translate(-50%, 0); opacity: 1; }
        }

        .image-preview {
            position: relative;
            width: 100%;
            padding-top: 50%;
            border-radius: 1rem 1rem 0 0;
            overflow: hidden;
            margin-bottom: 10px;
        }


        @media (min-width: 768px) {
            .platforms {
                cursor: none;
            }
            .copy-btn {
                cursor: none;
            }
        }

        @media (min-width: 992px) {
            .platforms {
                cursor: pointer;
            }
            .copy-btn {
                cursor: pointer;
            }
        }



        .image-preview img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        @media (min-width: 768px) {
            .share-modal {
                    height: 85%;
                    left: 25%;
                    border-radius: 2rem 2rem 2rem 0;
                    width: 350px;
                    display: grid;
                    justify-content: center;
                    overflow-y: auto;
                }

        @media (min-width: 992px) {
            .share-modal {
                height: 55%;
                left: 15%;
                }
                .platforms-scroll {
                display: flex;
                gap: 0;
                overflow-x: auto;
                scrollbar-width: thin;
                scrollbar-color: #444rgba(26, 26, 26, 0);
            }
            }
    `;

    // Configure elements
    overlay.className = 'overlay';
    modal.className = 'share-modal';
    scrollContainer.className = 'platforms-scroll';

    // Platform SVGs
    const platformSVGs = {
        whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48" id="whatsapp">
        <path fill="white" d="M0 48L3.374 35.674C1.292 32.066 0.198 27.976 0.2 23.782C0.206 10.67 10.876 0 23.986 0C30.348 0.002 36.32 2.48 40.812 6.976C45.302 11.472 47.774 17.448 47.772 23.804C47.766 36.918 37.096 47.588 23.986 47.588C20.006 47.586 16.084 46.588 12.61 44.692L0 48ZM13.194 40.386C16.546 42.376 19.746 43.568 23.978 43.57C34.874 43.57 43.75 34.702 43.756 23.8C43.76 12.876 34.926 4.02 23.994 4.016C13.09 4.016 4.22 12.884 4.216 23.784C4.214 28.234 5.518 31.566 7.708 35.052L5.71 42.348L13.194 40.386ZM35.968 29.458C35.82 29.21 35.424 29.062 34.828 28.764C34.234 28.466 31.312 27.028 30.766 26.83C30.222 26.632 29.826 26.532 29.428 27.128C29.032 27.722 27.892 29.062 27.546 29.458C27.2 29.854 26.852 29.904 26.258 29.606C25.664 29.308 23.748 28.682 21.478 26.656C19.712 25.08 18.518 23.134 18.172 22.538C17.826 21.944 18.136 21.622 18.432 21.326C18.7 21.06 19.026 20.632 19.324 20.284C19.626 19.94 19.724 19.692 19.924 19.294C20.122 18.898 20.024 18.55 19.874 18.252C19.724 17.956 18.536 15.03 18.042 13.84C17.558 12.682 17.068 12.838 16.704 12.82L15.564 12.8C15.168 12.8 14.524 12.948 13.98 13.544C13.436 14.14 11.9 15.576 11.9 18.502C11.9 21.428 14.03 24.254 14.326 24.65C14.624 25.046 18.516 31.05 24.478 33.624C25.896 34.236 27.004 34.602 27.866 34.876C29.29 35.328 30.586 35.264 31.61 35.112C32.752 34.942 35.126 33.674 35.622 32.286C36.118 30.896 36.118 29.706 35.968 29.458Z"></path>
        </svg>`,

        facebook: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" id="facebook-logo">
            <path fill="white" d="m21 0h-18c-1.655 0-3 1.345-3 3v18c0 1.654 1.345 3 3 3h18c1.654 0 3-1.346 3-3v-18c0-1.655-1.346-3-3-3z"></path>
            <path fill="black" d="m16.5 12v-3c0-.828.672-.75 1.5-.75h1.5v-3.75h-3c-2.486 0-4.5 2.014-4.5 4.5v3h-3v3.75h3v8.25h4.5v-8.25h2.25l1.5-3.75z"></path>
            </svg>`,

        twitter: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 28 22.934" viewBox="0 0 28 22.934" id="twitter-logo">
                <path fill="white" d="M1.85,1.131c0,0,4.175,5.608,11.859,6.003c0,0-1.046-4.086,2.807-6.343s7.06,1.027,7.06,1.027s1.977-0.33,3.676-1.344c0,0-0.57,2.053-2.472,3.169c0,0,2.053-0.292,3.22-0.862c0,0-1.166,1.876-2.801,2.928c0,0,0.71,11.826-10.597,16.187C6.761,24.92,0,20.375,0,20.375s3.904,0.811,8.366-2.383c0,0-3.574,0.177-5.349-4.081c0,0,1.217,0.33,2.586-0.076c0,0-4.31-0.608-4.563-5.704c0,0,1.546,0.71,2.51,0.684C3.549,8.815-0.533,5.894,1.85,1.131z"></path>
                </svg>`,

        instagram: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" fill="white"/>
        </svg>`,

        telegram: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 100 100"
                            viewBox="0 0 100 100" id="telegram">
                            <path id="Layer_2" fill="#ffffff" d="M88.723,12.142C76.419,17.238,23.661,39.091,9.084,45.047c-9.776,3.815-4.053,7.392-4.053,7.392
                                      s8.345,2.861,15.499,5.007c7.153,2.146,10.968-0.238,10.968-0.238l33.62-22.652c11.922-8.107,9.061-1.431,6.199,1.431
                                      c-6.199,6.2-16.452,15.975-25.036,23.844c-3.815,3.338-1.908,6.199-0.238,7.63c6.199,5.246,23.129,15.976,24.082,16.691
                                      c5.037,3.566,14.945,8.699,16.452-2.146c0,0,5.961-37.435,5.961-37.435c1.908-12.637,3.815-24.321,4.053-27.659
                                      C97.307,8.804,88.723,12.142,88.723,12.142z"></path>
                        </svg>`
    };

    // Create platform buttons
    const platforms = ['whatsapp', 'facebook', 'twitter', 'instagram', 'telegram'];
    platforms.forEach(platform => {
        const btn = document.createElement('button');
        btn.className = `platform ${platform}`;
        btn.innerHTML = platformSVGs[platform];
        btn.onclick = () => handlePlatformClick(platform);
        scrollContainer.appendChild(btn);
    });

    // URL Container
    urlContainer.className = 'url-container';
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
    `;

    const urlText = document.createElement('span');
    urlText.className = 'url-text';
    urlText.textContent = window.location.href;
    urlContainer.appendChild(urlText);
    urlContainer.appendChild(copyBtn);

    // Toast Notification
    toast.innerHTML = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
        </svg>
        <span>✨ Link Copied!</span>
    `;
    toast.className = 'toast';

    // Build modal structure
    modal.appendChild(closeBtn);
    modal.appendChild(urlContainer);
    modal.appendChild(scrollContainer);

    // Share functionality
    const currentUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    function toggleShareModal(imageUrl) {
        if (imageUrl) {
            sharedImageUrl = encodeURIComponent(imageUrl);
            loadImagePreview(imageUrl);
        }

        if (isModalOpen) {
            document.body.style.overflow = 'auto';
            document.body.style.pointerEvents = 'all';
            modal.classList.remove('active');
            overlay.classList.remove('active');
            modal.style.animation = 'modalSlideDown 0.3s ease forwards';

            modal.addEventListener('animationend', () => {
                modal.style.display = 'none';
                modal.style.animation = '';
            }, { once: true });
        } else {
            document.body.style.overflow = 'hidden';
            document.body.style.pointerEvents = 'none';
            modal.style.display = 'block';
            overlay.style.display = 'block';

            void modal.offsetHeight;
            modal.classList.add('active');
            overlay.classList.add('active');
            modal.style.animation = 'modalSlideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards';
            modal.style.pointerEvents = 'all';
            scrollContainer.style.pointerEvents = 'all';
        }
        isModalOpen = !isModalOpen;
    }

    function loadImagePreview(url) {
        const existingPreview = document.querySelector('.image-preview');
        if (existingPreview) existingPreview.remove();

        const imgPreview = document.createElement('div');
        imgPreview.className = 'image-preview';

        const img = document.createElement('img');
        img.src = url;

        imgPreview.appendChild(img);
        modal.insertBefore(imgPreview, urlContainer);
    }

    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    function handlePlatformClick(platform) {
        const shareData = {
            whatsapp: `https://api.whatsapp.com/send?text=${pageTitle}%0A${currentUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${pageTitle}&url=${currentUrl}`,
            telegram: `https://t.me/share/url?url=${currentUrl}&text=${pageTitle}`,
            instagram: ''
        };

        if (platform === 'instagram') {
            const message = `Check this out: ${decodeURIComponent(currentUrl)}`;
            if (isMobile()) {
                window.location.href = `instagram://library?LocalIdentifier=${sharedImageUrl}`;
                setTimeout(() => {
                    if (!document.hidden) window.open('https://www.instagram.com/', '_blank');
                }, 500);
            } else {
                navigator.clipboard?.writeText(message) || prompt('Copy this message:', message);
                showToast('Copied to clipboard!');
            }
            return;
        }

        window.open(shareData[platform], '_blank', 'width=600,height=400');
        toggleShareModal();
    }

    async function copyToClipboard() {
        try {
            // Modern clipboard API
            await navigator.clipboard.writeText(window.location.href);
            showToast('Copied to clipboard!');
            return true;
        } catch (err) {
            // Fallback for older browsers
            return handleLegacyCopy();
        }
    }

    function handleLegacyCopy() {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                showToast('Copied to clipboard!');
                return true;
            } else {
                showToast('Press Ctrl+C to copy');
                return false;
            }
        } catch (err) {
            showToast('Failed to copy');
            return false;
        }
    }

    function showToast(message, isSuccess = true) {
        const toast = document.createElement('div');
        toast.className = `share-toast ${isSuccess ? 'success' : 'error'}`;

        // SVG Icons
        const successIcon = `
        <svg class="toast-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>`;

        const errorIcon = `
        <svg class="toast-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>`;

        toast.innerHTML = `
        <div class="toast-content">
            ${isSuccess ? successIcon : errorIcon}
            <span class="toast-message">${message}</span>
            <div class="toast-progress"></div>
        </div>
    `;

        const style = document.createElement('style');
        style.textContent = `
        .share-toast {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(145deg, ${isSuccess ? 'rgba(54, 146, 57, 0.7)' : 'rgba(209, 41, 41, 0.7)'}, ${isSuccess ? 'rgba(44, 134, 48, 0.7)' : 'rgba(128, 0, 0, 0.7)'});
            color: white;
            padding: 10px 15px;
            border-radius: 12px;
            font-family: apple-system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: toastEntrance 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            min-width: 200px;
            text-align: center;
        }

        .toast-content {
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
        }

        .toast-icon {
            width: 20px;
            height: 20px;
            margin-bottom: 10px;
            animation: iconBounce 0.6s ease;
        }

        .toast-message {
            font-weight: 500;
            font-size: 14px;
            margin-bottom: 10px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .toast-progress {
            position: absolute;
            bottom: -1px;
            left: 0;
            height: 3px;
            background: rgba(255,255,255,0.3);
            width: 100%;
            animation: progress 3s linear forwards;
            border-radius: 0 0 12px 12px;
        }

        @keyframes toastEntrance {
            0% {
                opacity: 0;
                transform: translate(-50%, 20px) scale(0.95);
            }
            100% {
                opacity: 1;
                transform: translate(-50%, 0) scale(1);
            }
        }

        @keyframes iconBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }

        @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
        }
    `;

        document.head.appendChild(style);
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
                style.remove();
            }, 300);
        }, 2700);
    }

    // Event listeners
    closeBtn.onclick = () => toggleShareModal();
    overlay.onclick = () => toggleShareModal();
    copyBtn.onclick = async () => {
        const originalText = copyBtn.textContent;

        // Visual feedback
        copyBtn.style.transform = 'scale(0.95)';
        copyBtn.style.opacity = '0.8';

        const success = await copyToClipboard();

        // Additional feedback for failure
        if (!success) {
            copyBtn.style.backgroundColor = '#f44336';
            setTimeout(() => {
                copyBtn.style.backgroundColor = '#8a2be2';
            }, 1000);
        }

        // Reset button state
        setTimeout(() => {
            copyBtn.style.transform = 'scale(1)';
            copyBtn.style.opacity = '1';
        }, 200);
    };
    // Append elements to DOM
    document.head.appendChild(style);
    document.body.append(overlay, modal, toast);

    // Expose the toggle function
    window.sharePage = toggleShareModal;
}

// Initialize the widget
initializeShareWidget();