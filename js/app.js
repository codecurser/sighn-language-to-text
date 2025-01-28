const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const captureBtn = document.getElementById("captureBtn");
const loadingIndicator = document.querySelector(".loading");

// Camera handling
async function startCamera() {
  try {
    startBtn.disabled = true;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480,
        facingMode: "user",
      },
    });
    video.srcObject = stream;
    stopBtn.disabled = false;
    captureBtn.disabled = false;
  } catch (err) {
    console.error("Error accessing camera:", err);
    startBtn.disabled = false;
    alert(
      "Failed to access camera. Please ensure camera permissions are granted."
    );
  }
}

function stopCamera() {
  const stream = video.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
  }
  startBtn.disabled = false;
  stopBtn.disabled = true;
  captureBtn.disabled = true;
}

async function captureSign() {
  try {
    loadingIndicator.classList.add("active");
    document.getElementById("result").textContent = "Processing...";

    // Capture current frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob for API processing
    canvas.toBlob(async (blob) => {
      // TODO: Send blob to backend API for processing
      // For now, simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      document.getElementById("result").textContent =
        "Sign detected! (API integration pending)";
      loadingIndicator.classList.remove("active");
    }, "image/jpeg");
  } catch (error) {
    console.error("Error capturing sign:", error);
    document.getElementById("result").textContent = "Error processing sign";
    loadingIndicator.classList.remove("active");
  }
}

// Event Listeners
startBtn.addEventListener("click", startCamera);
stopBtn.addEventListener("click", stopCamera);
captureBtn.addEventListener("click", captureSign);

// Clean up on page unload
window.addEventListener("beforeunload", stopCamera);
