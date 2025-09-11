# tools/character_constructor/backend/constructor_server.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fal_client
import os
from dotenv import load_dotenv
import numpy as np

# --- 1. SETUP ---
# Load the .env file from this directory
load_dotenv('.env_constructor')

app = FastAPI(title="Character Constructor API")
fal_client.api_key = os.getenv("FAL_KEY")

if not fal_client.api_key:
    raise ValueError("FAL_KEY not found in .env_constructor")

# Allow our HTML file to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For simple local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. DATA MODELS ---
class ReconstructRequest(BaseModel):
    image_url: str

# --- 3. THE ULTIMATE QUALITY 3D PIPELINE ---
@app.post("/reconstruct-character")
async def reconstruct_character(request: ReconstructRequest):
    try:
        print("🪐 Character Constructor: Starting Ultimate Quality Pipeline…")
        
        # --- Stage 1: Scene Analysis ---
        print("   Stage 1/3: Analyzing character image...")
        base_image_url = request.image_url
        
        scene_desc_result = fal_client.run("fal-ai/llava-next", arguments={
            "image_url": base_image_url,
            "prompt": "You are a character concept artist. In 15 words, describe this character."
        })
        character_description = scene_desc_result["output"]
        print(f"   - Character Description: '{character_description}'")

        # --- Stage 2: Mass View Generation (12 Views for Characters) ---
        print("   Stage 2/3: Generating 12 camera angles...")
        image_urls = [base_image_url]
        num_views = 12 # Reduced slightly for faster character iteration
        
        for i in range(num_views - 1):
            angle = (i / (num_views - 1)) * 360
            try:
                view_prompt = f"{character_description}, photorealistic, view from a {int(angle)} degree angle."
                view_result = fal_client.run("fal-ai/stable-diffusion-v3-medium", arguments={"prompt": view_prompt})
                image_urls.append(view_result["images"][0]["url"])
                if (i + 1) % 4 == 0: print(f"     - Generated view {i+1}/{num_views}")
            except Exception as view_error:
                print(f"     - Failed to generate view {i+1}/{num_views}: {view_error}")
        
        print(f"   ✅ Stage 2/3 complete. Total views: {len(image_urls)}")

        # --- Stage 3: Multi-View Reconstruction ---
        print("   Stage 3/3: Reconstructing 3D model with InstantMesh...")
        
        result = fal_client.run("fal-ai/instant-mesh", arguments={
            "image_urls": image_urls,
            "texture_resolution": 4096,
            "multiview_consistent": True,
        })
        
        mesh_url = result[0].get("url") if isinstance(result, list) and len(result) > 0 else None
        if not mesh_url: raise Exception("3D model generation returned no usable URL.")
            
        print(f"✅ Final 3D Character Model generated successfully: {mesh_url}")
        
        return { 
            "model_url": mesh_url, 
            "model_info": { "model_used": "fal-ai/instant-mesh (Multi-View)" } 
        }
        
    except Exception as exc:
        print(f"❌ Critical reconstruction pipeline error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))