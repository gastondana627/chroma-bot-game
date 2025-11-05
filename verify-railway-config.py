#!/usr/bin/env python3
"""
Verify Railway Configuration Script
Tests the health endpoint to confirm environment variables are loaded correctly
"""

import requests
import json
import sys
from typing import Dict, Any

def test_health_endpoint(base_url: str) -> Dict[str, Any]:
    """Test the enhanced health endpoint"""
    print(f"🏥 Testing health endpoint: {base_url}/api/health")
    
    try:
        response = requests.get(f"{base_url}/api/health", timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            return {
                'success': True,
                'data': data,
                'status_code': response.status_code
            }
        else:
            return {
                'success': False,
                'status_code': response.status_code,
                'error': f"HTTP {response.status_code}: {response.text[:200]}"
            }
            
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': str(e)
        }

def analyze_health_data(data: Dict[str, Any]) -> None:
    """Analyze and display health check data"""
    print("\n📊 Health Check Analysis")
    print("=" * 40)
    
    # Overall status
    overall_status = data.get('status', 'unknown')
    status_emoji = {
        'healthy': '✅',
        'demo_mode': '⚠️',
        'api_key_invalid': '❌',
        'no_characters': '❌'
    }.get(overall_status, '❓')
    
    print(f"Overall Status: {status_emoji} {overall_status}")
    
    # Environment information
    env_info = data.get('environment', {})
    print(f"\n🌍 Environment Information:")
    print(f"   Environment: {env_info.get('environment', 'unknown')}")
    print(f"   OpenAI Key Set: {'✅' if env_info.get('openai_api_key_set') else '❌'}")
    print(f"   OpenAI Key Length: {env_info.get('openai_api_key_length', 0)} chars")
    print(f"   Railway Environment: {env_info.get('railway_environment', 'Not set')}")
    print(f"   Port: {env_info.get('port', 'Not set')}")
    
    # OpenAI status
    openai_info = data.get('openai', {})
    print(f"\n🤖 OpenAI Configuration:")
    print(f"   Client Initialized: {'✅' if openai_info.get('client_initialized') else '❌'}")
    print(f"   API Key Valid: {'✅' if openai_info.get('api_key_valid') else '❌'}")
    
    if 'error' in openai_info:
        print(f"   Error: {openai_info['error']}")
    
    # Characters status
    char_info = data.get('characters', {})
    print(f"\n👥 Characters Configuration:")
    print(f"   Characters Loaded: {char_info.get('character_count', 0)}")
    print(f"   Available: {', '.join(char_info.get('characters_loaded', []))}")
    print(f"   Global Knowledge: {'✅' if char_info.get('global_knowledge_loaded') else '❌'}")
    
    # CORS configuration
    cors_origins = data.get('cors_origins', [])
    print(f"\n🔒 CORS Configuration:")
    print(f"   Allowed Origins: {len(cors_origins)}")
    for origin in cors_origins:
        print(f"     - {origin}")
    
    # Timestamp
    timestamp = data.get('timestamp', 'unknown')
    print(f"\n⏰ Last Check: {timestamp}")

def main():
    # Determine which backend to test
    production_backend = "https://data-bleed-backend.up.railway.app"
    local_backend = "http://localhost:8001"
    
    backend_url = production_backend
    if len(sys.argv) > 1 and sys.argv[1] == "--local":
        backend_url = local_backend
        print(f"🏠 Testing LOCAL backend: {backend_url}")
    else:
        print(f"🌐 Testing PRODUCTION backend: {backend_url}")
    
    print("🔍 Railway Configuration Verification")
    print("=" * 50)
    
    # Test health endpoint
    result = test_health_endpoint(backend_url)
    
    if result['success']:
        print("✅ Health endpoint accessible")
        analyze_health_data(result['data'])
        
        # Check for issues
        data = result['data']
        issues = []
        
        if data.get('status') != 'healthy':
            issues.append(f"Status is '{data.get('status')}' instead of 'healthy'")
        
        env_info = data.get('environment', {})
        if not env_info.get('openai_api_key_set'):
            issues.append("OpenAI API key not set")
        
        openai_info = data.get('openai', {})
        if not openai_info.get('client_initialized'):
            issues.append("OpenAI client not initialized")
        
        if not openai_info.get('api_key_valid'):
            issues.append("OpenAI API key is invalid")
        
        char_info = data.get('characters', {})
        if char_info.get('character_count', 0) == 0:
            issues.append("No characters loaded")
        
        if issues:
            print(f"\n⚠️  Issues Found ({len(issues)}):")
            for i, issue in enumerate(issues, 1):
                print(f"   {i}. {issue}")
            
            print(f"\n🔧 Recommended Actions:")
            if not env_info.get('openai_api_key_set'):
                print("   - Set OPENAI_API_KEY environment variable in Railway")
                print("   - Run: python setup-railway-env.py")
            
            if not openai_info.get('api_key_valid'):
                print("   - Verify OpenAI API key is correct and has credits")
                print("   - Check OpenAI account status")
            
            if char_info.get('character_count', 0) == 0:
                print("   - Ensure characters.json is deployed with the application")
                print("   - Check file paths in deployment")
        else:
            print("\n🎉 All checks passed! Configuration is healthy.")
    
    else:
        print("❌ Health endpoint failed")
        if 'error' in result:
            print(f"   Error: {result['error']}")
        else:
            print(f"   Status Code: {result.get('status_code', 'unknown')}")
        
        print(f"\n🔧 Troubleshooting:")
        print(f"   1. Check if Railway deployment is running")
        print(f"   2. Verify the URL is correct: {backend_url}")
        print(f"   3. Check Railway logs for errors")
        print(f"   4. Ensure the application is deployed and started")
    
    print("\n" + "=" * 50)
    print("🏁 Configuration verification completed")

if __name__ == "__main__":
    main()