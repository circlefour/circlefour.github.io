const camSelect = document.getElementById('camSelect');

joinButton.addEventListener('click', () => {
    listCams();
    camSelect.style.display = 'block';
});

async function listCams() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await meeting?.getWebcams();
        console.log(devices);
        camSelect.innerHTML = '';
        
        devices.forEach((device) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `camera ${camSelect.options.length + 1}`;
            camSelect.appendChild(option);
        // stop the stream as it was only used to get camera access permission
        stream.getTracks().forEach(track => track.stop());
        });
    } catch(error) {
        console.log(error);
    }
}

camSelect.addEventListener('change', async () => {
    const selectedCam = camSelect.value;
    meeting?.changeWebcam(selectedCam);
});
