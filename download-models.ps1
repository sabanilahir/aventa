# Download face-api.js models
$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$targetDir = "public\models"

Write-Host "Downloading face-api models to $targetDir..."

# TinyFaceDetector models
Invoke-WebRequest -Uri "$baseUrl/tiny_face_detector_model-weights_manifest.json" -OutFile "$targetDir\tiny_face_detector_model-weights_manifest.json"
Invoke-WebRequest -Uri "$baseUrl/tiny_face_detector_model-shard1" -OutFile "$targetDir\tiny_face_detector_model-shard1"

# FaceLandmark68Net models
Invoke-WebRequest -Uri "$baseUrl/face_landmark_68_model-weights_manifest.json" -OutFile "$targetDir\face_landmark_68_model-weights_manifest.json"
Invoke-WebRequest -Uri "$baseUrl/face_landmark_68_model-shard1" -OutFile "$targetDir\face_landmark_68_model-shard1"

Write-Host "Download complete!"
