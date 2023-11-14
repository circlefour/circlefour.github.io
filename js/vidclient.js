 // getting Elements from Dom 
 const joinButton = document.querySelector("button");
 const videoContainer = document.getElementById("videoContainer");
 const textDiv = document.getElementById("textDiv");
 
 // decalare Variables
 let participants = [];
 let meeting = null;
 let localParticipant;
 let localParticipantAudio;
 let remoteParticipantId = "";
 
 joinButton.addEventListener("click", () => {
   joinButton.style.display = "none";
   textDiv.textContent = "Please wait, we are joining the meeting";
 
  // generated dev token for a year : if using lan, removes necessity of auth server 
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
    videoElement.setAttribute("width", "320");
    videoElement.setAttribute("height", "180");
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
    // ...
    // ...
    // ...
    
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
    
      // other participants
      meeting.on("participant-joined", (participant) => {
        let videoElement = createVideoElement(participant.id);
        remoteParticipantId = participant.id;
    
        participant.on("stream-enabled", (stream) => {
          setTrack(stream, participant, (isLocal = false));
        });
        videoContainer.appendChild(videoElement);
      });
    
      // participants left
      meeting.on("participant-left", (participant) => {
        let vElement = document.getElementById(`v-${participant.id}`);
        vElement.parentNode.removeChild(vElement);
    
        let aElement = document.getElementById(`a-${participant.id}`);
        aElement.parentNode.removeChild(aElement);
        //remove it from participant list participantId;
        document.getElementById(`p-${participant.id}`).remove();
      });
    });