# tools/character_constructor/backend/constructor_server.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fal_client
import os
from dotenv import load_dotenv
import time
import asyncio # ✅ NEW: Import asyncio for parallel processing

# --- 1. SETUP ---
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

# --- 2. DATA MODELS ---
class ReconstructRequest(BaseModel):
    image_url: str

# --- 3. THE "PRODUCTION STUDIO" 3D PIPELINE (FINAL VERSION) ---
@app.post("/reconstruct-character")
async def reconstruct_character(request: ReconstructRequest):
    pipeline_start_time = time.time()
    
    # --- Stage 1: AI Background Removal ---
    print("🪐 Character Constructor: Starting PRODUCTION STUDIO Pipeline…")
    print("   Stage 1/4: Removing background for clean input...")
    base_image_url = request.image_url
    cleaned_image_url = base_image_url
    try:
        rembg_result = fal_client.run("fal-ai/imageutils/rembg", arguments={
            "image_url": base_image_url,
            "model": "u2net_human_seg"
        })
        cleaned_image_url = rembg_result["image_url"]
        print("   ✅ Stage 1/4 complete.")
    except Exception as e:
        print(f"   ⚠️ Stage 1/4 failed: {e}. Using original image.")

    # --- Stage 2: AI Art Direction ---
    print("   Stage 2/4: Analyzing character art...")
    try:
        desc_result = fal_client.run("fal-ai/llava-next", arguments={
            "image_url": cleaned_image_url,
            "prompt": "You are a character concept artist. In 20 words, describe this character's key visual features, clothing, and style."
        })
        character_description = desc_result["output"]
        print(f"   - Art Direction: '{character_description}'")
    except Exception as e:
        character_description = "a photorealistic, highly detailed character"
        print(f"   ⚠️ Stage 2/4 failed: {e}. Using generic prompt.")

    # --- Stage 3: PARALLEL AI Photoshoot ---
    print("   Stage 3/4: Generating 16 camera angles in parallel...")
    image_urls = [cleaned_image_url]
    angles = [22, 45, 67, 90, 112, 135, 157, 180, 202, 225, 247, 270, 292, 315, 337]
    
    # This function defines the task for generating one view
    async def generate_view(angle: int):
        try:
            prompt = f"{character_description}, full body shot, standing, neutral expression, centered, photorealistic, studio lighting, view from a {angle} degree rotation."
            return fal_client.run("fal-ai/stable-diffusion-v3-medium", arguments={"prompt": prompt})
        except Exception as e:
            print(f"     - View generation failed for angle {angle}: {e}")
            return None # Return None on failure

    # asyncio.gather runs all the tasks concurrently
    tasks = [generate_view(angle) for angle in angles]
    results = await asyncio.gather(*tasks)
    
    # Filter out any failed results and add the successful ones
    successful_views = [res["images"][0]["url"] for res in results if res and "images" in res]
    image_urls.extend(successful_views)
    print(f"   ✅ Stage 3/4 complete. Total views for reconstruction: {len(image_urls)}")

    # --- Stage 4: The "Waterfall" 3D Reconstruction ---
    print("   Stage 4/4: Reconstructing 3D model with waterfall approach...")
    final_result, model_used = None, ""
    
    # Attempt 1: Trellis (Highest Quality, but prefers single view)
    try:
        print("      - Attempting: fal-ai/trellis (ULTRA-HQ)")
        result = fal_client.run("fal-ai/trellis", arguments={
            "image_url": cleaned_image_url, # Use the best single image
            "texture_resolution": 2048,
            "target_polycount": 150000
        })
        final_result, model_used = result, "fal-ai/trellis (ULTRA-HQ)"
    except Exception as e:
        print(f"      - Trellis failed: {e}. Trying next model.")

    # Attempt 2: TripoSR (Reliable Fallback)
    if not final_result:
        try:
            print("      - Attempting: fal-ai/triposr (HQ Fallback)")
            result = fal_client.run("fal-ai/triposr", arguments={"image_url": cleaned_image_url})
            final_result, model_used = result, "fal-ai/triposr (HQ)"
        except Exception as e2:
            print(f"      - TripoSR failed: {e2}.")

    if not final_result:
        raise HTTPException(status_code=500, detail="All 3D reconstruction models failed.")

    # --- 5. Parse and Return ---
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