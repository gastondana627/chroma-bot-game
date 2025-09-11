# tools/character_constructor/backend/constructor_server.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fal_client
import os
from dotenv import load_dotenv
import numpy as np
import time

# --- SETUP ---
load_dotenv('.env_constructor')
app = FastAPI(title="Character Constructor API")
fal_client.api_key = os.getenv("FAL_KEY")
if not fal_client.api_key:
    raise ValueError("FAL_KEY not found in .env_constructor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReconstructRequest(BaseModel):
    image_url: str

# --- THE "PRODUCTION STUDIO" 3D PIPELINE ---
@app.post("/reconstruct-character")
async def reconstruct_character(request: ReconstructRequest):
    pipeline_start_time = time.time()
    
    # --- Stage 1: AI Background Removal ---
    print("🪐 Character Constructor: Starting PRODUCTION STUDIO Pipeline…")
    print("   Stage 1/5: Removing background for clean input...")
    base_image_url = request.image_url
    cleaned_image_url = base_image_url
    try:
        rembg_result = fal_client.run("fal-ai/imageutils/rembg", arguments={
            "image_url": base_image_url,
            "model": "u2net_human_seg" # Optimized for characters
        })
        cleaned_image_url = rembg_result["image_url"]
        print("   ✅ Stage 1/5 complete.")
    except Exception as e:
        print(f"   ⚠️ Stage 1/5 failed: {e}. Using original image.")

    # --- Stage 2: AI Art Direction ---
    print("   Stage 2/5: Analyzing character art...")
    try:
        desc_result = fal_client.run("fal-ai/llava-next", arguments={
            "image_url": cleaned_image_url, # Analyze the clean image
            "prompt": "You are a character concept artist. In 20 words, describe this character's key visual features, clothing, and style."
        })
        character_description = desc_result["output"]
        print(f"   - Art Direction: '{character_description}'")
    except Exception as e:
        print(f"   ⚠️ Stage 2/5 failed: {e}. Using generic prompt.")
        character_description = "a photorealistic, highly detailed character"

    # --- Stage 3: The 360° AI Photoshoot ---
    print("   Stage 3/5: Generating 16 precise camera angles...")
    image_urls = [cleaned_image_url] # Start with the clean image
    angles = [0, 22, 45, 67, 90, 112, 135, 157, 180, 202, 225, 247, 270, 292, 315, 337]
    
    for i, angle in enumerate(angles):
        try:
            prompt = f"{character_description}, full body shot, standing, neutral expression, centered, photorealistic, studio lighting, view from {angle} degree rotation."
            view_result = fal_client.run("fal-ai/stable-diffusion-v3-medium", arguments={"prompt": prompt})
            image_urls.append(view_result["images"][0]["url"])
            if (i + 1) % 4 == 0: print(f"     - Generated view {i+1}/{len(angles)}")
        except Exception as view_error:
            print(f"     - Failed to generate view {i+1}/{len(angles)}")
    
    print(f"   ✅ Stage 3/5 complete. Total views: {len(image_urls)}")

    # --- Stage 4: The Waterfall 3D Reconstruction ---
    print("   Stage 4/5: Reconstructing 3D model...")
    final_result, model_used = None, ""
    
    try: # Attempt 1: InstantMesh (Best for Multi-View)
        print("      - Attempting: fal-ai/instant-mesh (ULTRA)")
        result = fal_client.run("fal-ai/instant-mesh", arguments={"image_urls": image_urls, "texture_resolution": 4096})
        final_result, model_used = result, "fal-ai/instant-mesh (Multi-View)"
    except Exception as e:
        print(f"      - Instant-Mesh failed: {e}. Trying next model.")
        try: # Attempt 2: TripoSR (HQ Fallback)
            print("      - Attempting: fal-ai/triposr (HQ Fallback)")
            result = fal_client.run("fal-ai/triposr", arguments={"image_url": cleaned_image_url, "chunk_size": 8192, "mc_resolution": 256})
            final_result, model_used = result, "fal-ai/triposr (HQ)"
        except Exception as e2:
            print(f"      - TripoSR failed: {e2}.")

    if not final_result:
        raise HTTPException(status_code=500, detail="All 3D reconstruction models failed.")

    # --- Stage 5: Parse, Log, and Return ---
    print("   Stage 5/5: Parsing final model and logging metrics...")
    mesh_url = None
    model_mesh = {}
    if isinstance(final_result, list):
        mesh_url = final_result[0].get("url")
    else:
        model_mesh = final_result.get("model_mesh", {})
        mesh_url = model_mesh.get("url") or final_result.get("model_url")
        
    if not mesh_url:
        raise HTTPException(status_code=500, detail="Pipeline succeeded but returned no model URL.")

    total_time = round(time.time() - pipeline_start_time, 2)
    file_size_kb = model_mesh.get("file_size", 0) // 1024
    
    print(f"✅ Final PRODUCTION STUDIO Quality 3D Character generated in {total_time}s.")
    
    return { 
        "model_url": mesh_url, 
        "model_info": { 
            "model_used": model_used,
            "total_pipeline_time_s": total_time,
            "views_generated": len(image_urls),
            "file_size_kb": file_size_kb
        } 
    }