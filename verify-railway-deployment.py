#!/usr/bin/env python3
"""
Railway Deployment Verification Script
Verifies that the backend deployment on Railway is working correctly
"""

import requests
import json
import time
import sys
from typing import Dict, Any, Optional

class RailwayDeploymentVerifier:
    def __init__(self):
        self.backend_url = "https://data-bleed-backend.up.railway.app"
        self.results = {}
        
    def log(self, message: str, level: str = "INFO"):
        """Log a message with timestamp"""
        timestamp = time.strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def test_health_endpoint(self) -> bool:
        """Test the health endpoint"""
        self.log("Testing health endpoint...")
        
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                health_data = response.json()
                self.results['health'] = {
                    'status': 'pass',
                    'data': health_data
                }
                self.log("✅ Health endpoint working")
                
                # Check specific health indicators
                if health_data.get('openai_configured'):
                    self.log("✅ OpenAI API configured")
                else:
                    self.log("❌ OpenAI API not configured")
                    
                if health_data.get('characters_loaded'):
                    self.log(f"✅ Characters loaded: {health_data['characters_loaded']}")
                else:
                    self.log("❌ No characters loaded")
                    
                return True
            else:
                self.results['health'] = {
                    'status': 'fail',
                    'error': f"HTTP {response.status_code}"
                }
                self.log(f"❌ Health endpoint failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.results['health'] = {
                'status': 'fail',
                'error': str(e)
            }
            self.log(f"❌ Health endpoint error: {e}")
            return False
            
    def test_characters_endpoint(self) -> bool:
        """Test the characters endpoint"""
        self.log("Testing characters endpoint...")
        
        try:
            response = requests.get(f"{self.backend_url}/api/characters", timeout=10)
            
            if response.status_code == 200:
                characters_data = response.json()
                self.results['characters'] = {
                    'status': 'pass',
                    'data': characters_data
                }
                self.log(f"✅ Characters endpoint working: {len(characters_data)} characters")
                return True
            else:
                self.results['characters'] = {
                    'status': 'fail',
                    'error': f"HTTP {response.status_code}"
                }
                self.log(f"❌ Characters endpoint failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.results['characters'] = {
                'status': 'fail',
                'error': str(e)
            }
            self.log(f"❌ Characters endpoint error: {e}")
            return False
            
    def test_cors_configuration(self) -> bool:
        """Test CORS configuration"""
        self.log("Testing CORS configuration...")
        
        try:
            # Test OPTIONS request (preflight)
            headers = {
                'Origin': 'https://data-bleed-vsc-game.vercel.app',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = requests.options(f"{self.backend_url}/api/health", 
                                      headers=headers, timeout=10)
            
            cors_headers = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
                'access-control-allow-headers': response.headers.get('access-control-allow-headers')
            }
            
            if response.status_code in [200, 204]:
                self.results['cors'] = {
                    'status': 'pass',
                    'headers': cors_headers
                }
                self.log("✅ CORS configuration working")
                
                # Check specific CORS headers
                if cors_headers['access-control-allow-origin']:
                    self.log(f"✅ CORS origin allowed: {cors_headers['access-control-allow-origin']}")
                else:
                    self.log("⚠️ No CORS origin header found")
                    
                return True
            else:
                self.results['cors'] = {
                    'status': 'fail',
                    'error': f"HTTP {response.status_code}",
                    'headers': cors_headers
                }
                self.log(f"❌ CORS preflight failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.results['cors'] = {
                'status': 'fail',
                'error': str(e)
            }
            self.log(f"❌ CORS test error: {e}")
            return False
            
    def test_chat_endpoint(self) -> bool:
        """Test the chat endpoint"""
        self.log("Testing chat endpoint...")
        
        try:
            chat_data = {
                "message": "Hello, this is a deployment test",
                "character": "maya",
                "sessionId": f"test-{int(time.time())}"
            }
            
            headers = {
                'Content-Type': 'application/json',
                'Origin': 'https://data-bleed-vsc-game.vercel.app'
            }
            
            response = requests.post(f"{self.backend_url}/api/chat", 
                                   json=chat_data, headers=headers, timeout=30)
            
            if response.status_code == 200:
                chat_result = response.json()
                self.results['chat'] = {
                    'status': 'pass',
                    'data': chat_result
                }
                self.log("✅ Chat endpoint working")
                
                # Check response structure
                if 'reply' in chat_result:
                    self.log("✅ AI response received")
                else:
                    self.log("⚠️ No reply in chat response")
                    
                if 'trust_score' in chat_result:
                    self.log(f"✅ Trust score: {chat_result['trust_score']}")
                else:
                    self.log("⚠️ No trust score in response")
                    
                return True
            else:
                self.results['chat'] = {
                    'status': 'fail',
                    'error': f"HTTP {response.status_code}"
                }
                self.log(f"❌ Chat endpoint failed: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.results['chat'] = {
                'status': 'fail',
                'error': str(e)
            }
            self.log(f"❌ Chat endpoint error: {e}")
            return False
            
    def test_deployment_status(self) -> bool:
        """Test overall deployment status"""
        self.log("Testing deployment status...")
        
        try:
            # Simple connectivity test
            response = requests.get(self.backend_url, timeout=10)
            
            if response.status_code in [200, 404]:  # 404 is OK for root path
                self.results['deployment'] = {
                    'status': 'pass',
                    'url': self.backend_url
                }
                self.log("✅ Railway deployment is accessible")
                return True
            else:
                self.results['deployment'] = {
                    'status': 'fail',
                    'error': f"HTTP {response.status_code}"
                }
                self.log(f"❌ Railway deployment not accessible: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.results['deployment'] = {
                'status': 'fail',
                'error': str(e)
            }
            self.log(f"❌ Railway deployment error: {e}")
            return False
            
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all deployment verification tests"""
        self.log("🚀 Starting Railway deployment verification...")
        self.log(f"Backend URL: {self.backend_url}")
        
        tests = [
            ("Deployment Status", self.test_deployment_status),
            ("Health Endpoint", self.test_health_endpoint),
            ("Characters Endpoint", self.test_characters_endpoint),
            ("CORS Configuration", self.test_cors_configuration),
            ("Chat Endpoint", self.test_chat_endpoint)
        ]
        
        passed_tests = 0
        total_tests = len(tests)
        
        for test_name, test_func in tests:
            self.log(f"\n--- {test_name} ---")
            if test_func():
                passed_tests += 1
                
        # Generate summary
        self.log(f"\n📊 Railway Deployment Verification Summary")
        self.log(f"{'='*50}")
        self.log(f"✅ Passed: {passed_tests}/{total_tests}")
        self.log(f"❌ Failed: {total_tests - passed_tests}/{total_tests}")
        
        if passed_tests == total_tests:
            self.log("🎉 Railway deployment is fully functional!")
            success = True
        else:
            self.log("⚠️ Some tests failed. Check the logs above for details.")
            success = False
            
        # Save results to file
        results_file = "railway-deployment-verification.json"
        with open(results_file, 'w') as f:
            json.dump({
                'timestamp': time.time(),
                'backend_url': self.backend_url,
                'summary': {
                    'passed': passed_tests,
                    'total': total_tests,
                    'success': success
                },
                'results': self.results
            }, f, indent=2)
            
        self.log(f"📄 Results saved to: {results_file}")
        
        return self.results

def main():
    """Main function"""
    verifier = RailwayDeploymentVerifier()
    results = verifier.run_all_tests()
    
    # Exit with appropriate code
    success = all(result.get('status') == 'pass' for result in results.values())
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()