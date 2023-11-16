 // getting Elements from Dom 
 const joinButton = document.querySelector("button");
 const videoContainer = document.getElementById("videoContainer");
 const textDiv = document.getElementById("textDiv");
 const toggleCameraButton = document.getElementById('toggleCam');
 let frontCam = true;
 
 // decalare Variables
 let participants = [];
 let meeting = null;
 let localParticipant;

 let webcams = null;
 
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

   webcams = await meeting.getWebcams();
   console.log(webcams);
 });
 
 //(async () => {
 //   const ok = await meeting.getWebcams();
 //   console.log(ok);
 //})(); 

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
      if (webcams.length > 0) {
        console.log('hiiiiii');
        toggleCameraButton.style.display = 'block';
        toggleCameraButton.addEventListener('click', toggleCam);
      } else {
        console.log('no cameras found');
      }
    }
  }

  function toggleCam() {
    //frontCam = !frontCam;
    console.log('test switch');
    const { deviceId, label } = webcams[frontCam];
    console.log(deviceId);
    meeting.changeWebcam(deviceId);
    
    if (frontCam) {
      const participant = meeting.localParticipant;
      const videoElm = document.getElementById(`v-${participant.id}`);
      videoElm.style.transform = 'scaleX(-1)';
    } else {
      videoElm.style.transform = 'none';
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
      });   
  });
  
 //const cams = await meeting.getWebcams();
 // if (cams.length > 0) {
 //    toggleCameraButton.style.display = 'block';
 //    toggleCameraButton.addEventListener('click', toggleCam(cams));
 // } else {
 //    console.error('no webcams found');
 // }
