#!/usr/bin/env python3
"""
Railway Environment Variable Setup and Verification Script
Helps configure and verify environment variables for Railway deployment
"""

import os
import sys
import subprocess
import json
from typing import Dict, Any, Optional

def check_railway_cli() -> bool:
    """Check if Railway CLI is installed and available"""
    try:
        result = subprocess.run(['railway', '--version'], 
                              capture_output=True, text=True, timeout=10)
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False

def check_railway_auth() -> bool:
    """Check if user is authenticated with Railway"""
    try:
        result = subprocess.run(['railway', 'whoami'], 
                              capture_output=True, text=True, timeout=10)
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False

def get_local_env_vars() -> Dict[str, str]:
    """Get environment variables from local .env file"""
    env_vars = {}
    
    # Try to load from .env
    env_files = ['.env', 'chroma-bot/.env']
    
    for env_file in env_files:
        if os.path.exists(env_file):
            print(f"📄 Reading {env_file}")
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key.strip()] = value.strip()
    
    return env_vars

def get_railway_env_vars() -> Optional[Dict[str, str]]:
    """Get environment variables from Railway project"""
    try:
        result = subprocess.run(['railway', 'variables'], 
                              capture_output=True, text=True, timeout=30)
        
        if result.returncode != 0:
            print(f"❌ Failed to get Railway variables: {result.stderr}")
            return None
        
        # Parse Railway variables output
        variables = {}
        lines = result.stdout.strip().split('\n')
        
        for line in lines:
            if '=' in line:
                key, value = line.split('=', 1)
                variables[key.strip()] = value.strip()
        
        return variables
        
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        print(f"❌ Error getting Railway variables: {e}")
        return None

def set_railway_env_var(key: str, value: str) -> bool:
    """Set an environment variable in Railway"""
    try:
        result = subprocess.run(['railway', 'variables', 'set', f'{key}={value}'], 
                              capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print(f"✅ Set Railway variable: {key}")
            return True
        else:
            print(f"❌ Failed to set Railway variable {key}: {result.stderr}")
            return False
            
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        print(f"❌ Error setting Railway variable {key}: {e}")
        return False

def verify_openai_key(api_key: str) -> bool:
    """Verify OpenAI API key is valid"""
    if not api_key or len(api_key) < 20:
        return False
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        # Make a minimal test request
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=1,
            temperature=0
        )
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API key validation failed: {e}")
        return False

def main():
    print("🚂 Railway Environment Variable Setup")
    print("=" * 50)
    
    # Check Railway CLI
    if not check_railway_cli():
        print("❌ Railway CLI not found. Install it with:")
        print("   npm install -g @railway/cli")
        print("   or visit: https://railway.app/cli")
        return 1
    
    print("✅ Railway CLI found")
    
    # Check authentication
    if not check_railway_auth():
        print("❌ Not authenticated with Railway. Run:")
        print("   railway login")
        return 1
    
    print("✅ Railway authentication verified")
    
    # Get local environment variables
    print("\n📋 Local Environment Variables")
    local_vars = get_local_env_vars()
    
    if not local_vars:
        print("❌ No local environment variables found in .env files")
        return 1
    
    for key, value in local_vars.items():
        masked_value = value[:8] + "..." + value[-4:] if len(value) > 12 else "***"
        print(f"   {key}: {masked_value}")
    
    # Get Railway environment variables
    print("\n🚂 Railway Environment Variables")
    railway_vars = get_railway_env_vars()
    
    if railway_vars is None:
        print("❌ Could not retrieve Railway environment variables")
        return 1
    
    if not railway_vars:
        print("⚠️  No environment variables set in Railway")
    else:
        for key, value in railway_vars.items():
            masked_value = value[:8] + "..." + value[-4:] if len(value) > 12 else "***"
            print(f"   {key}: {masked_value}")
    
    # Check for required variables
    required_vars = ['OPENAI_API_KEY']
    missing_vars = []
    
    print("\n🔍 Checking Required Variables")
    for var in required_vars:
        local_has = var in local_vars and local_vars[var]
        railway_has = var in railway_vars and railway_vars[var]
        
        print(f"   {var}:")
        print(f"     Local: {'✅' if local_has else '❌'}")
        print(f"     Railway: {'✅' if railway_has else '❌'}")
        
        if not railway_has:
            missing_vars.append(var)
    
    # Sync missing variables
    if missing_vars:
        print(f"\n🔄 Syncing {len(missing_vars)} missing variables to Railway")
        
        for var in missing_vars:
            if var in local_vars and local_vars[var]:
                print(f"\n📤 Setting {var} in Railway...")
                
                # Verify OpenAI key before setting
                if var == 'OPENAI_API_KEY':
                    print("🔑 Verifying OpenAI API key...")
                    if not verify_openai_key(local_vars[var]):
                        print("❌ OpenAI API key validation failed - skipping")
                        continue
                    print("✅ OpenAI API key is valid")
                
                if set_railway_env_var(var, local_vars[var]):
                    print(f"✅ Successfully set {var} in Railway")
                else:
                    print(f"❌ Failed to set {var} in Railway")
            else:
                print(f"⚠️  {var} not found in local environment")
    
    # Final verification
    print("\n🏥 Final Health Check")
    print("Run this command to verify deployment:")
    print("   python test-cors-configuration.py")
    print("\nOr test the health endpoint directly:")
    print("   curl https://data-bleed-backend.up.railway.app/api/health")
    
    print("\n✅ Railway environment setup completed!")
    return 0

if __name__ == "__main__":
    sys.exit(main())