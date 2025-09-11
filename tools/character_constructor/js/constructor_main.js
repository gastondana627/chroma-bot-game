// tools/character_constructor/js/constructor_main.js

document.addEventListener("DOMContentLoaded", () => {
    // --- DOM Elements ---
    const imageUploadInput = document.getElementById("image-upload");
    const generateBtn = document.getElementById("generate-btn");
    const statusText = document.getElementById("status-text");
    const uploadLabelSpan = document.querySelector(".upload-label span");
    
    // New UI elements
    const comparisonContainer = document.getElementById("comparison-container");
    const sourceImage = document.getElementById("source-image");
    const viewerContainer = document.getElementById("viewer-container");
    const resultsSection = document.getElementById("results-section");
    const downloadLink = document.getElementById("download-link");
    
    // Stats panel elements
    const statModel = document.getElementById("stat-model");
    const statTime = document.getElementById("stat-time");
    const statViews = document.getElementById("stat-views");
    const statSize = document.getElementById("stat-size");

    let uploadedFile = null;
    const API_URL = "http://127.0.0.1:3002/reconstruct-character";

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    imageUploadInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadedFile = file;
            uploadLabelSpan.textContent = `✅ ${file.name}`;
            generateBtn.disabled = false;
            statusText.textContent = "Ready to generate. Click the button!";
        }
    });

    generateBtn.addEventListener("click", async () => {
        if (!uploadedFile) return;

        // --- Reset UI and start loading state ---
        generateBtn.disabled = true;
        comparisonContainer.classList.add("hidden");
        resultsSection.classList.add("hidden");
        statusText.textContent = "Starting AI Pipeline...";
        statusText.classList.add("processing");

        try {
            const base64Image = await toBase64(uploadedFile);
            
            // Display the source image immediately
            sourceImage.src = base64Image;

            statusText.textContent = "Generating 3D model (this will take several minutes)...";

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
            const { model_url, model_info } = result;

            if (!model_url) {
                throw new Error("Pipeline succeeded but did not return a model URL.");
            }
            
            // --- Success: Display results ---
            statusText.textContent = "Success! Your 3D model is ready.";
            statusText.classList.remove("processing");
            
            // Display 3D model
            const modelViewer = document.createElement("model-viewer");
            modelViewer.src = model_url;
            modelViewer.cameraControls = true;
            modelViewer.autoRotate = true;
            viewerContainer.innerHTML = '';
            viewerContainer.appendChild(modelViewer);
            
            // Populate stats and download link
            statModel.textContent = model_info.model_used;
            statTime.textContent = model_info.total_pipeline_time_s;
            statViews.textContent = model_info.views_generated;
            statSize.textContent = model_info.file_size_kb;
            downloadLink.href = model_url;
            downloadLink.download = `${uploadedFile.name.split('.')[0]}_3D.glb`;
            
            // Show the results
            comparisonContainer.classList.remove("hidden");
            resultsSection.classList.remove("hidden");

        } catch (error) {
            console.error("Reconstruction failed:", error);
            statusText.textContent = `Error: ${error.message}`;
            statusText.classList.remove("processing");
        } finally {
            generateBtn.disabled = false;
        }
    });
});