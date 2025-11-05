#!/usr/bin/env python3
"""
API Endpoint Validation Script
Comprehensive testing of all backend API endpoints for production deployment
"""

import requests
import json
import sys
import time
from typing import Dict, Any, List, Optional

class APIValidator:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.timeout = 15
        
    def test_health_endpoint(self) -> Dict[str, Any]:
        """Test /api/health endpoint"""
        print("🏥 Testing /api/health endpoint...")
        
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            
            result = {
                'endpoint': '/api/health',
                'status_code': response.status_code,
                'success': response.status_code == 200,
                'response_time': response.elapsed.total_seconds(),
                'data': None,
                'error': None
            }
            
            if response.status_code == 200:
                try:
                    result['data'] = response.json()
                    
                    # Validate expected fields
                    expected_fields = ['ok', 'status', 'environment', 'openai', 'characters']
                    missing_fields = [f for f in expected_fields if f not in result['data']]
                    
                    if missing_fields:
                        result['warning'] = f"Missing expected fields: {missing_fields}"
                    
                except json.JSONDecodeError:
                    result['error'] = "Invalid JSON response"
                    result['success'] = False
            else:
                result['error'] = f"HTTP {response.status_code}: {response.text[:200]}"
            
            return result
            
        except requests.exceptions.RequestException as e:
            return {
                'endpoint': '/api/health',
                'success': False,
                'error': str(e),
                'status_code': None
            }
    
    def test_characters_endpoint(self) -> Dict[str, Any]:
        """Test /api/characters endpoint"""
        print("👥 Testing /api/characters endpoint...")
        
        try:
            response = self.session.get(f"{self.base_url}/api/characters")
            
            result = {
                'endpoint': '/api/characters',
                'status_code': response.status_code,
                'success': response.status_code == 200,
                'response_time': response.elapsed.total_seconds(),
                'data': None,
                'error': None
            }
            
            if response.status_code == 200:
                try:
                    result['data'] = response.json()
                    
                    # Validate response structure
                    if 'characters' not in result['data']:
                        result['error'] = "Missing 'characters' field in response"
                        result['success'] = False
                    else:
                        characters = result['data']['characters']
                        if not isinstance(characters, list):
                            result['error'] = "'characters' field is not a list"
                            result['success'] = False
                        elif len(characters) == 0:
                            result['warning'] = "No characters found"
                        else:
                            expected_chars = ['maya', 'eli', 'stanley']
                            missing_chars = [c for c in expected_chars if c not in characters]
                            if missing_chars:
                                result['warning'] = f"Missing expected characters: {missing_chars}"
                    
                except json.JSONDecodeError:
                    result['error'] = "Invalid JSON response"
                    result['success'] = False
            else:
                result['error'] = f"HTTP {response.status_code}: {response.text[:200]}"
            
            return result
            
        except requests.exceptions.RequestException as e:
            return {
                'endpoint': '/api/characters',
                'success': False,
                'error': str(e),
                'status_code': None
            }
    
    def test_chat_endpoint(self, character: str = "maya") -> Dict[str, Any]:
        """Test /api/chat endpoint"""
        print(f"💬 Testing /api/chat endpoint with character '{character}'...")
        
        test_data = {
            'message': 'Hello, this is a test message for API validation.',
            'character': character,
            'sessionId': f'api-test-{int(time.time())}'
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/chat",
                json=test_data,
                headers={'Content-Type': 'application/json'}
            )
            
            result = {
                'endpoint': '/api/chat',
                'status_code': response.status_code,
                'success': response.status_code == 200,
                'response_time': response.elapsed.total_seconds(),
                'data': None,
                'error': None,
                'test_input': test_data
            }
            
            if response.status_code == 200:
                try:
                    result['data'] = response.json()
                    
                    # Validate response structure
                    expected_fields = ['reply', 'trust_score', 'persona']
                    missing_fields = [f for f in expected_fields if f not in result['data']]
                    
                    if missing_fields:
                        result['error'] = f"Missing expected fields: {missing_fields}"
                        result['success'] = False
                    else:
                        # Validate field types
                        reply = result['data'].get('reply')
                        trust_score = result['data'].get('trust_score')
                        persona = result['data'].get('persona')
                        
                        if not isinstance(reply, str) or len(reply) == 0:
                            result['warning'] = "Reply is empty or not a string"
                        
                        if not isinstance(trust_score, (int, float)):
                            result['warning'] = "Trust score is not a number"
                        
                        if persona not in ['guardian', 'deceiver', None]:
                            result['warning'] = f"Unexpected persona value: {persona}"
                    
                except json.JSONDecodeError:
                    result['error'] = "Invalid JSON response"
                    result['success'] = False
            else:
                result['error'] = f"HTTP {response.status_code}: {response.text[:200]}"
            
            return result
            
        except requests.exceptions.RequestException as e:
            return {
                'endpoint': '/api/chat',
                'success': False,
                'error': str(e),
                'status_code': None,
                'test_input': test_data
            }
    
    def test_reset_endpoint(self) -> Dict[str, Any]:
        """Test /api/reset endpoint"""
        print("🔄 Testing /api/reset endpoint...")
        
        test_data = {
            'sessionId': f'reset-test-{int(time.time())}'
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/reset",
                json=test_data,
                headers={'Content-Type': 'application/json'}
            )
            
            result = {
                'endpoint': '/api/reset',
                'status_code': response.status_code,
                'success': response.status_code == 200,
                'response_time': response.elapsed.total_seconds(),
                'data': None,
                'error': None
            }
            
            if response.status_code == 200:
                try:
                    result['data'] = response.json()
                    
                    # Validate response structure
                    if 'ok' not in result['data']:
                        result['error'] = "Missing 'ok' field in response"
                        result['success'] = False
                    elif not result['data']['ok']:
                        result['error'] = "Reset operation returned ok: false"
                        result['success'] = False
                    
                except json.JSONDecodeError:
                    result['error'] = "Invalid JSON response"
                    result['success'] = False
            else:
                result['error'] = f"HTTP {response.status_code}: {response.text[:200]}"
            
            return result
            
        except requests.exceptions.RequestException as e:
            return {
                'endpoint': '/api/reset',
                'success': False,
                'error': str(e),
                'status_code': None
            }
    
    def test_cors_headers(self, origin: str = "https://data-bleed-vsc-game.vercel.app") -> Dict[str, Any]:
        """Test CORS headers on API endpoints"""
        print(f"🔒 Testing CORS headers with origin: {origin}")
        
        headers = {
            'Origin': origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        
        try:
            response = self.session.options(f"{self.base_url}/api/chat", headers=headers)
            
            result = {
                'endpoint': 'OPTIONS /api/chat',
                'status_code': response.status_code,
                'success': response.status_code == 200,
                'response_time': response.elapsed.total_seconds(),
                'cors_headers': {},
                'error': None
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
            
            # Validate CORS configuration
            if 'Access-Control-Allow-Origin' not in result['cors_headers']:
                result['error'] = "Missing Access-Control-Allow-Origin header"
                result['success'] = False
            elif result['cors_headers']['Access-Control-Allow-Origin'] not in [origin, '*']:
                result['warning'] = f"Origin {origin} not explicitly allowed"
            
            return result
            
        except requests.exceptions.RequestException as e:
            return {
                'endpoint': 'OPTIONS /api/chat',
                'success': False,
                'error': str(e),
                'status_code': None
            }
    
    def run_full_validation(self) -> Dict[str, Any]:
        """Run complete API validation suite"""
        print(f"🧪 Running full API validation for: {self.base_url}")
        print("=" * 60)
        
        results = {
            'base_url': self.base_url,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime()),
            'tests': [],
            'summary': {
                'total_tests': 0,
                'passed': 0,
                'failed': 0,
                'warnings': 0
            }
        }
        
        # Run all tests
        test_methods = [
            self.test_health_endpoint,
            self.test_characters_endpoint,
            lambda: self.test_chat_endpoint('maya'),
            lambda: self.test_chat_endpoint('eli'),
            lambda: self.test_chat_endpoint('stanley'),
            self.test_reset_endpoint,
            self.test_cors_headers
        ]
        
        for test_method in test_methods:
            try:
                test_result = test_method()
                results['tests'].append(test_result)
                
                results['summary']['total_tests'] += 1
                
                if test_result['success']:
                    results['summary']['passed'] += 1
                    status = "✅ PASS"
                else:
                    results['summary']['failed'] += 1
                    status = "❌ FAIL"
                
                if 'warning' in test_result:
                    results['summary']['warnings'] += 1
                    status += " ⚠️"
                
                endpoint = test_result.get('endpoint', 'Unknown')
                response_time = test_result.get('response_time', 0)
                
                print(f"{status} {endpoint} ({response_time:.2f}s)")
                
                if not test_result['success'] and test_result.get('error'):
                    print(f"     Error: {test_result['error']}")
                
                if 'warning' in test_result:
                    print(f"     Warning: {test_result['warning']}")
                
            except Exception as e:
                print(f"❌ FAIL Test execution error: {e}")
                results['summary']['total_tests'] += 1
                results['summary']['failed'] += 1
        
        return results

def print_summary(results: Dict[str, Any]) -> None:
    """Print validation summary"""
    summary = results['summary']
    
    print("\n" + "=" * 60)
    print("📊 API Validation Summary")
    print("=" * 60)
    
    print(f"Base URL: {results['base_url']}")
    print(f"Timestamp: {results['timestamp']}")
    print(f"Total Tests: {summary['total_tests']}")
    print(f"Passed: {summary['passed']} ✅")
    print(f"Failed: {summary['failed']} ❌")
    print(f"Warnings: {summary['warnings']} ⚠️")
    
    success_rate = (summary['passed'] / summary['total_tests'] * 100) if summary['total_tests'] > 0 else 0
    print(f"Success Rate: {success_rate:.1f}%")
    
    if summary['failed'] == 0:
        print("\n🎉 All API endpoints are working correctly!")
    else:
        print(f"\n⚠️  {summary['failed']} endpoint(s) need attention")
        
        print("\n🔧 Failed Tests:")
        for test in results['tests']:
            if not test['success']:
                endpoint = test.get('endpoint', 'Unknown')
                error = test.get('error', 'Unknown error')
                print(f"   - {endpoint}: {error}")

def main():
    # Determine which backend to test
    production_backend = "https://data-bleed-backend.up.railway.app"
    local_backend = "http://localhost:8001"
    
    backend_url = production_backend
    if len(sys.argv) > 1 and sys.argv[1] == "--local":
        backend_url = local_backend
        print(f"🏠 Testing LOCAL backend")
    else:
        print(f"🌐 Testing PRODUCTION backend")
    
    # Run validation
    validator = APIValidator(backend_url)
    results = validator.run_full_validation()
    
    # Print summary
    print_summary(results)
    
    # Save detailed results
    output_file = f"api-validation-results-{int(time.time())}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: {output_file}")
    
    # Exit with appropriate code
    if results['summary']['failed'] > 0:
        print("\n❌ Some tests failed - check the issues above")
        return 1
    else:
        print("\n✅ All tests passed successfully!")
        return 0

if __name__ == "__main__":
    sys.exit(main())