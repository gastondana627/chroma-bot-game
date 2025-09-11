// tools/character_constructor/js/constructor_main.js

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const imageUploadInput = document.getElementById("image-upload");
    const generateBtn = document.getElementById("generate-btn");
    const viewerContainer = document.getElementById("viewer-container");
    const statusText = document.getElementById("status-text");
    const downloadSection = document.getElementById("download-section");
    const downloadLink = document.getElementById("download-link");
    const uploadLabelSpan = document.querySelector(".upload-label span");

    let uploadedFile = null;

    // --- API Configuration ---
    const API_URL = "http://127.0.0.1:3002/reconstruct-character";

    // --- Helper Function ---
    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    // --- Event Listeners ---
    imageUploadInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadedFile = file;
            uploadLabelSpan.textContent = `✅ ${file.name}`;
            generateBtn.disabled = false;
            statusText.textContent = "Ready to generate. Click the button!";
            viewerContainer.style.borderColor = "#7b61ff";
        }
    });

    generateBtn.addEventListener("click", async () => {
        if (!uploadedFile) {
            alert("Please upload an image first.");
            return;
        }

        // --- Start Loading State ---
        generateBtn.disabled = true;
        setLoadingState("Converting image...");
        viewerContainer.innerHTML = ''; // Clear previous model
        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'status-display';
        viewerContainer.appendChild(statusDisplay);
        const statusP = document.createElement('p');
        statusP.id = 'status-text';
        statusDisplay.appendChild(statusP);
        
        downloadSection.classList.add("hidden");

        try {
            const base64Image = await toBase64(uploadedFile);
            setLoadingState("Sending to AI Pipeline (This will take several minutes)...");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image_url: base64Image }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "The AI pipeline failed.");
            }

            const result = await response.json();
            const modelUrl = result.model_url;

            if (!modelUrl) {
                throw new Error("The pipeline succeeded but did not return a model URL.");
            }
            
            // --- Success: Display the Model ---
            setLoadingState("Success! Loading 3D Model...");
            const modelViewer = document.createElement("model-viewer");
            modelViewer.setAttribute("src", modelUrl);
            modelViewer.setAttribute("camera-controls", "");
            modelViewer.setAttribute("auto-rotate", "");
            modelViewer.style.backgroundColor = "#111";

            viewerContainer.innerHTML = ''; // Clear status text
            viewerContainer.appendChild(modelViewer);
            viewerContainer.style.borderColor = "transparent";
            
            // --- Show Download Button ---
            downloadLink.href = modelUrl;
            downloadLink.download = `${uploadedFile.name.split('.')[0]}_3D.glb`;
            downloadSection.classList.remove("hidden");

        } catch (error) {
            console.error("Reconstruction failed:", error);
            setErrorState(`Error: ${error.message}`);
        } finally {
            generateBtn.disabled = false;
        }
    });

    function setLoadingState(message) {
        viewerContainer.style.borderColor = "#f0ad4e";
        const statusP = viewerContainer.querySelector('#status-text');
        if (statusP) {
            statusP.textContent = message;
            statusP.classList.add("processing");
        }
    }

    function setErrorState(message) {
        viewerContainer.style.borderColor = "#d9534f";
        const statusP = viewerContainer.querySelector('#status-text');
        if (statusP) {
            statusP.textContent = message;
            statusP.classList.remove("processing");
        }
    }
});