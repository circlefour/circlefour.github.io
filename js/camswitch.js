const camSelect = document.getElementById('camSelect');

joinButton.addEventListener('click', () => {
    meeting.on("meeting-joined", () => {
        camSelect.style.display = 'block';
        listCams();
    });  
});

async function listCams() {
    try {
        const devices = await meeting?.getWebcams();
        console.log(devices);
        camSelect.innerHTML = '';
        
        devices.forEach((device) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `camera ${cameraDropdown.options.length + 1}`;
            camSelect.appendChild(option);
        });
    } catch(error) {
        console.log(error);
    }
}

camSelect.addEventListener('change', async () => {
    const selectedCam = camSelect.value;
    meeting?.changeWebcam(selectedCam);
});
