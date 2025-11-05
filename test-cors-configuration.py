#!/usr/bin/env python3
"""
Test script to verify CORS configuration works correctly
Tests both preflight OPTIONS requests and actual POST requests
"""

import requests
import json
import sys
from typing import Dict, Any

def test_cors_preflight(base_url: str, origin: str) -> Dict[str, Any]:
    """Test CORS preflight request"""
    print(f"\n🔍 Testing CORS preflight for origin: {origin}")
    
    headers = {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
    }
    
    try:
        response = requests.options(f"{base_url}/api/chat", headers=headers, timeout=10)
        
        result = {
            'status_code': response.status_code,
            'headers': dict(response.headers),
            'success': response.status_code == 200,
            'cors_headers': {}
        }
        
        # Check CORS headers
        cors_headers = [
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Methods', 
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Credentials'
        ]
        
        for header in cors_headers:
            if header in response.headers:
                result['cors_headers'][header] = response.headers[header]
        
        return result
        
    except requests.exceptions.RequestException as e:
        return {
            'status_code': None,
            'error': str(e),
            'success': False
        }

def test_actual_request(base_url: str, origin: str) -> Dict[str, Any]:
    """Test actual POST request with CORS"""
    print(f"\n📡 Testing actual POST request from origin: {origin}")
    
    headers = {
        'Origin': origin,
        'Content-Type': 'application/json'
    }
    
    data = {
        'message': 'Hello, this is a CORS test',
        'character': 'maya',
        'sessionId': 'cors-test-session'
    }
    
    try:
        response = requests.post(
            f"{base_url}/api/chat", 
            headers=headers,
            json=data,
            timeout=10
        )
        
        result = {
            'status_code': response.status_code,
            'success': response.status_code == 200,
            'response_data': None,
            'cors_headers': {}
        }
        
        if response.status_code == 200:
            try:
                result['response_data'] = response.json()
            except:
                result['response_data'] = response.text
        
        # Check CORS headers in response
        if 'Access-Control-Allow-Origin' in response.headers:
            result['cors_headers']['Access-Control-Allow-Origin'] = response.headers['Access-Control-Allow-Origin']
        
        return result
        
    except requests.exceptions.RequestException as e:
        return {
            'status_code': None,
            'error': str(e),
            'success': False
        }

def test_health_endpoint(base_url: str) -> Dict[str, Any]:
    """Test health endpoint"""
    print(f"\n🏥 Testing health endpoint")
    
    try:
        response = requests.get(f"{base_url}/api/health", timeout=10)
        
        result = {
            'status_code': response.status_code,
            'success': response.status_code == 200,
            'data': None
        }
        
        if response.status_code == 200:
            try:
                result['data'] = response.json()
            except:
                result['data'] = response.text
        
        return result
        
    except requests.exceptions.RequestException as e:
        return {
            'status_code': None,
            'error': str(e),
            'success': False
        }

def main():
    # Test URLs
    production_backend = "https://data-bleed-backend.up.railway.app"
    local_backend = "http://localhost:8001"
    
    # Test origins
    production_frontend = "https://data-bleed-vsc-game.vercel.app"
    local_origins = ["http://localhost:3000", "http://localhost:8080"]
    
    print("🧪 CORS Configuration Test Suite")
    print("=" * 50)
    
    # Determine which backend to test
    backend_url = production_backend
    if len(sys.argv) > 1 and sys.argv[1] == "--local":
        backend_url = local_backend
        print(f"🏠 Testing LOCAL backend: {backend_url}")
    else:
        print(f"🌐 Testing PRODUCTION backend: {backend_url}")
    
    # Test health endpoint first
    health_result = test_health_endpoint(backend_url)
    if health_result['success']:
        print("✅ Health endpoint working")
        if health_result['data']:
            print(f"   Status: {health_result['data'].get('status', 'unknown')}")
            print(f"   OpenAI: {health_result['data'].get('openai_configured', 'unknown')}")
    else:
        print("❌ Health endpoint failed")
        if 'error' in health_result:
            print(f"   Error: {health_result['error']}")
        else:
            print(f"   Status Code: {health_result['status_code']}")
        print("\n⚠️  Backend not accessible - CORS tests may fail")
    
    # Test CORS with production frontend origin
    print(f"\n🎯 Testing CORS with production frontend origin")
    preflight_result = test_cors_preflight(backend_url, production_frontend)
    
    if preflight_result['success']:
        print("✅ CORS preflight successful")
        for header, value in preflight_result.get('cors_headers', {}).items():
            print(f"   {header}: {value}")
    else:
        print("❌ CORS preflight failed")
        if 'error' in preflight_result:
            print(f"   Error: {preflight_result['error']}")
        else:
            print(f"   Status Code: {preflight_result['status_code']}")
    
    # Test actual request
    actual_result = test_actual_request(backend_url, production_frontend)
    
    if actual_result['success']:
        print("✅ Actual CORS request successful")
        if actual_result.get('response_data'):
            data = actual_result['response_data']
            if isinstance(data, dict):
                print(f"   Reply: {data.get('reply', 'No reply')[:100]}...")
                print(f"   Trust Score: {data.get('trust_score', 'N/A')}")
                print(f"   Persona: {data.get('persona', 'N/A')}")
    else:
        print("❌ Actual CORS request failed")
        if 'error' in actual_result:
            print(f"   Error: {actual_result['error']}")
        else:
            print(f"   Status Code: {actual_result['status_code']}")
    
    # Test with local origins if testing local backend
    if backend_url == local_backend:
        for origin in local_origins:
            print(f"\n🏠 Testing local origin: {origin}")
            local_preflight = test_cors_preflight(backend_url, origin)
            if local_preflight['success']:
                print("✅ Local CORS preflight successful")
            else:
                print("❌ Local CORS preflight failed")
    
    print("\n" + "=" * 50)
    print("🏁 CORS test suite completed")

if __name__ == "__main__":
    main()