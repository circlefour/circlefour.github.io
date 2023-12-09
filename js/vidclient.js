 // getting Elements from Dom 
 const joinButton = document.querySelector("button");
 const videoContainer = document.getElementById("videoContainer");
 const textDiv = document.getElementById("textDiv");
 const flipBtn = document.getElementById('flip');

const camSelect = document.getElementById('camSelect');
 
 // decalare Variables
 let participants = [];
 let meeting = null;
 let localParticipant;

let camIndex = 0; 
 
 joinButton.addEventListener("click", async () => {
   joinButton.style.display = "none";
   textDiv.textContent = "joining the feed";
 
  // generated dev token for a year 
  // ye it's terrible practice.... 4 now
   window.VideoSDK.config("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJiNDlkYjU3NS01NzEwLTQyZmMtODUwOS1mZjg3ZGYyZTc3YjEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5OTY3ODIwNywiZXhwIjoxNzMxMjE0MjA3fQ.CfEsNocGrn-YKXsJv7maKmhKEgvLsCqlSgxqgcqlnTY");
   meeting = window.VideoSDK.initMeeting({
     meetingId: "zw7a-clv1-5tdq", // required
     name: "Circle's Org", // required
     micEnabled: false, // optional, default: true
     webcamEnabled: true, // optional, default: true
   });
 
   meeting.join();
 });
 
  // creating video element
  function createVideoElement(pId) {
    let videoElement = document.createElement("video");
    videoElement.classList.add("video-frame");
    videoElement.setAttribute("id", `v-${pId}`);
    videoElement.setAttribute("playsinline", true);
    videoElement.setAttribute("width", "100%");
    videoElement.setAttribute("height", "100%");
    return videoElement;
  }
  
  // creating local participant
  function createLocalParticipant() {
    localParticipant = createVideoElement(meeting.localParticipant.id);
    videoContainer.appendChild(localParticipant);
  }
  
  // setting media track
  function setTrack(stream, participant, isLocal) {
    if (stream.kind == "video") {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(stream.track);
      let videoElm = document.getElementById(`v-${participant.id}`);
      videoElm.srcObject = mediaStream;
      videoElm
        .play()
        .catch((error) =>
          console.error("videoElem.current.play() failed", error)
        );
    }
  }

  joinButton.addEventListener("click", () => {
    
    // creating local participant
      createLocalParticipant();
    
    // setting local participant stream
      meeting.localParticipant.on("stream-enabled", (stream) => {
        setTrack(
          stream,
          meeting.localParticipant,
          (isLocal = true)
        );
      });
    
      meeting.on("meeting-joined", () => {
        textDiv.style.display = "none";
        
        // displaying flip cam button
        flipBtn.style.display = 'block';
      });   
  });

async function listCams() {
    try {
        const devices = await meeting?.getWebcams();
        //alert(devices);
        console.log(devices);
        camSelect.innerHTML = '';
        
        devices.forEach((device) => {
            //alert('here');
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `camera ${cameraDropdown.options.length + 1}`;
            camSelect.appendChild(option);
        });
    } catch(error) {
        alert(error);
        //console.log(error);
    }
}

camSelect.addEventListener('click', async () => {
    listCams();
});

camSelect.addEventListener('change', async () => {
    const selectedCam = camSelect.value;
    meeting?.changeWebcam(selectedCam);
});

flipBtn.addEventListener('click', async () => {
    const devices = await meeting?.getWebcams();

    console.log(devices);
    
    camIndex = (camIndex + 1) % devices.length;
    meeting?.changeWebcam(devices[camIndex].deviceId);
});

