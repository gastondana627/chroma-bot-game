# tools/character_constructor/backend/constructor_server.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fal_client
import os
from dotenv import load_dotenv
import time
import asyncio
from enum import Enum
from typing import List, Optional

# --- 1. SETUP ---
load_dotenv('.env_constructor')
app = FastAPI(title="Character Constructor API - Production Studio")
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

# --- 2. QUALITY TIERS & DATA MODELS ---
class QualityTier(str, Enum):
    FAST = "FAST"
    GOOD = "GOOD"
    ULTRA = "ULTRA"

class ReconstructRequest(BaseModel):
    image_url: str
    quality: QualityTier = QualityTier.GOOD

# --- 3. THE "PRODUCTION STUDIO" 3D PIPELINE ---
@app.post("/reconstruct-character")
async def reconstruct_character(request: ReconstructRequest):
    pipeline_start_time = time.time()
    
    try:
        quality_settings = {
            "FAST": {"views": 8, "elevations": [25], "angles_per_level": 8, "concurrent": 8},
            "GOOD": {"views": 16, "elevations": [15, 30], "angles_per_level": 8, "concurrent": 4},  
            "ULTRA": {"views": 32, "elevations": [10, 25, 40], "angles_per_level": 12, "concurrent": 4}
        }[request.quality]

        print(f"🪐 Character Constructor: Starting PRODUCTION STUDIO Pipeline (Quality: {request.quality})...")
        base_image_url = request.image_url
        
        # --- Stage 1: AI Art Direction ---
        print("   Stage 1/4: AI Art Director analyzing character...")
        character_description = await get_character_description(base_image_url)
        print(f"   - Art Direction: '{character_description}'")

        # --- Stage 2: Intelligent Multi-View Generation ---
        print(f"   Stage 2/4: Generating {quality_settings['views']} views in parallel...")
        image_urls = await generate_intelligent_views(
            base_image_url, 
            character_description, 
            quality_settings
        )
        print(f"   ✅ Stage 2/4 complete. Total views: {len(image_urls)}")

        # --- Stage 3: High-Fidelity 3D Reconstruction ---
        print("   Stage 3/4: 3D reconstruction with fallback chain...")
        final_result, model_used = await reconstruct_with_fallbacks(image_urls)
        
        # --- Stage 4: Results Processing ---
        print("   Stage 4/4: Parsing final model and logging metrics...")
        mesh_url = extract_mesh_url(final_result)
        if not mesh_url:
            raise HTTPException(status_code=500, detail="No valid 3D model generated")

        total_time = round(time.time() - pipeline_start_time, 2)
        file_size_kb = final_result.get("model_mesh", {}).get("file_size", 0) // 1024
        
        print(f"✅ PRODUCTION STUDIO Character generated in {total_time}s")
        print(f"   📊 Model: {model_used} | Views: {len(image_urls)} | Size: {file_size_kb}KB")
        
        return { 
            "model_url": mesh_url, 
            "model_info": { 
                "model_used": model_used,
                "quality_tier": request.quality,
                "total_pipeline_time_s": total_time,
                "views_processed": len(image_urls),
                "file_size_kb": file_size_kb
            } 
        }

    except Exception as exc:
        print(f"❌ Pipeline failure: {exc}")
        raise HTTPException(status_code=500, detail=f"The Production Studio pipeline failed: {str(exc)}")

# --- HELPER FUNCTIONS (FROM FEEDBACK) ---

async def get_character_description(image_url: str) -> str:
    """Enhanced character analysis with fallback"""
    try:
        result = await asyncio.to_thread(
            fal_client.run, "fal-ai/llava-next",
            arguments={ "image_url": image_url, "prompt": "You are a professional 3D character artist. Describe this character's key visual features, clothing, pose, and style in exactly 25 words for accurate 3D reconstruction." }
        )
        return result["output"]
    except Exception as e:
        print(f"   ⚠️ Art direction failed: {e}")
        return "photorealistic human character, detailed clothing, neutral pose"

async def generate_intelligent_views(base_url: str, description: str, settings: dict) -> List[str]:
    """Generate views with concurrency control"""
    semaphore = asyncio.Semaphore(settings["concurrent"])
    image_urls = [base_url]
    
    async def generate_single_view(angle: int, elevation: int):
        async with semaphore:
            try:
                prompt = f"{description}, full body, A-pose, studio lighting, {angle}° rotation, {elevation}° elevation, clean background"
                result = await asyncio.to_thread(fal_client.run, "fal-ai/stable-diffusion-v3-medium", arguments={"prompt": prompt})
                return result["images"][0]["url"] if result.get("images") else None
            except Exception as e:
                print(f"     - View failed: {angle}°/{elevation}° - {e}")
                return None

    tasks = []
    total_views_to_gen = settings["angles_per_level"] * len(settings["elevations"])
    for elevation in settings["elevations"]:
        for i in range(settings["angles_per_level"]):
            angle = int((i / settings["angles_per_level"]) * 360)
            tasks.append(generate_single_view(angle, elevation))
    
    results = []
    for i, f in enumerate(asyncio.as_completed(tasks)):
        result = await f
        if result: results.append(result)
        if (i + 1) % 4 == 0: print(f"     - Progress: {i+1}/{total_views_to_gen} views attempted")
    
    image_urls.extend(results)
    return image_urls

async def reconstruct_with_fallbacks(image_urls: List[str]):
    """Try multiple 3D reconstruction models in order of quality"""
    models = [
        ("fal-ai/trellis", {"texture_resolution": 4096, "target_polycount": 200000}),
        ("fal-ai/triposr", {"chunk_size": 8192, "mc_resolution": 256}),
    ]
    
    for model_name, params in models:
        try:
            print(f"      - Attempting: {model_name}")
            # Use multi-view for trellis if available, otherwise single
            args = {"image_urls" if "trellis" in model_name else "image_url": image_urls if "trellis" in model_name else image_urls[0], **params}
            result = await asyncio.to_thread(fal_client.run, model_name, arguments=args)
            return result, model_name
        except Exception as e:
            print(f"      - {model_name} failed: {e}")
            continue
    
    raise Exception("All 3D reconstruction models failed")

def extract_mesh_url(result) -> Optional[str]:
    """Extract mesh URL from various response formats"""
    if isinstance(result, list) and result: return result[0].get("url")
    if isinstance(result, dict): return result.get("model_mesh", {}).get("url") or result.get("model_url") or result.get("url")
    return None