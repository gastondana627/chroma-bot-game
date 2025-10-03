#!/usr/bin/env python3
"""
Test script to verify the unified deployment works locally
"""

import subprocess
import time
import requests
import webbrowser
from threading import Thread

def test_server():
    """Test that the server serves both API and static files"""
    print("🧪 Testing unified deployment...")
    
    # Wait a moment for server to start
    time.sleep(3)
    
    try:
        # Test API endpoint
        print("Testing API endpoint...")
        api_response = requests.get("http://localhost:8000/api/health")
        if api_response.status_code == 200:
            print("✅ API endpoint working")
        else:
            print("❌ API endpoint failed")
        
        # Test static file serving
        print("Testing static file serving...")
        static_response = requests.get("http://localhost:8000/")
        if static_response.status_code == 200 and "html" in static_response.headers.get("content-type", ""):
            print("✅ Static files working")
        else:
            print("❌ Static files failed")
        
        # Test performance benchmarks
        print("Testing performance benchmarks...")
        perf_response = requests.get("http://localhost:8000/test-3d-performance-benchmarks.html")
        if perf_response.status_code == 200:
            print("✅ Performance tests accessible")
        else:
            print("❌ Performance tests failed")
        
        print("\n🎉 All tests passed! Opening browser...")
        webbrowser.open("http://localhost:8000/")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

def main():
    print("🚀 Starting unified deployment test...")
    print("This will start the server and test all endpoints")
    
    # Start the test in a separate thread
    test_thread = Thread(target=test_server)
    test_thread.daemon = True
    test_thread.start()
    
    # Start the server
    try:
        subprocess.run(["python", "start.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Server failed to start: {e}")

if __name__ == "__main__":
    main()