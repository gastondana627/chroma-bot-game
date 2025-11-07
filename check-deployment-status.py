#!/usr/bin/env python3
"""
Deployment Status Checker
Checks the current status of both Vercel and Railway deployments
"""

import requests
import json
import time
from typing import Dict, Any

class DeploymentStatusChecker:
    def __init__(self):
        self.frontend_url = "https://data-bleed-vsc-game.vercel.app"
        self.backend_url = "https://data-bleed-backend.up.railway.app"
        
    def log(self, message: str):
        """Log with timestamp"""
        timestamp = time.strftime("%H:%M:%S")
        print(f"[{timestamp}] {message}")
        
    def check_frontend_status(self) -> Dict[str, Any]:
        """Check Vercel frontend deployment status"""
        self.log("🎨 Checking Vercel frontend deployment...")
        
        try:
            # Test main page
            response = requests.get(self.frontend_url, timeout=10)
            
            status = {
                'accessible': response.status_code == 200,
                'status_code': response.status_code,
                'content_type': response.headers.get('content-type', ''),
                'server': response.headers.get('server', ''),
                'deployment_id': response.headers.get('x-vercel-id', 'unknown')
            }
            
            if status['accessible']:
                self.log("✅ Frontend is accessible")
                self.log(f"   Status: {status['status_code']}")
                self.log(f"   Server: {status['server']}")
                self.log(f"   Deployment ID: {status['deployment_id']}")
                
                # Check if it contains expected content
                content = response.text
                if 'Data_Bleed' in content:
                    status['contains_game_content'] = True
                    self.log("✅ Contains game content")
                else:
                    status['contains_game_content'] = False
                    self.log("⚠️ May not contain expected game content")
                    
            else:
                self.log(f"❌ Frontend not accessible: {status['status_code']}")
                
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Frontend check failed: {e}")
            status = {'accessible': False, 'error': str(e)}
            
        return status
        
    def check_backend_status(self) -> Dict[str, Any]:
        """Check Railway backend deployment status"""
        self.log("🔧 Checking Railway backend deployment...")
        
        try:
            # Test basic connectivity
            response = requests.get(self.backend_url, timeout=10)
            
            status = {
                'accessible': response.status_code in [200, 404],  # 404 is OK for root
                'status_code': response.status_code,
                'server': response.headers.get('server', ''),
                'content_type': response.headers.get('content-type', '')
            }
            
            if status['accessible']:
                self.log("✅ Backend server is running")
                self.log(f"   Status: {status['status_code']}")
                self.log(f"   Server: {status['server']}")
                
                # Try to determine if it's FastAPI
                if 'fastapi' in status['server'].lower() or 'uvicorn' in status['server'].lower():
                    status['is_fastapi'] = True
                    self.log("✅ Detected FastAPI/Uvicorn server")
                else:
                    status['is_fastapi'] = False
                    self.log("⚠️ Server type unclear")
                    
                # Test health endpoint specifically
                try:
                    health_response = requests.get(f"{self.backend_url}/api/health", timeout=10)
                    status['health_endpoint'] = {
                        'accessible': health_response.status_code == 200,
                        'status_code': health_response.status_code
                    }
                    
                    if health_response.status_code == 200:
                        self.log("✅ Health endpoint working")
                        health_data = health_response.json()
                        status['health_data'] = health_data
                        
                        if health_data.get('openai_configured'):
                            self.log("✅ OpenAI configured")
                        else:
                            self.log("❌ OpenAI not configured")
                            
                    else:
                        self.log(f"❌ Health endpoint failed: {health_response.status_code}")
                        
                except Exception as e:
                    self.log(f"❌ Health endpoint error: {e}")
                    status['health_endpoint'] = {'accessible': False, 'error': str(e)}
                    
            else:
                self.log(f"❌ Backend not accessible: {status['status_code']}")
                
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Backend check failed: {e}")
            status = {'accessible': False, 'error': str(e)}
            
        return status
        
    def check_integration_status(self) -> Dict[str, Any]:
        """Check frontend-backend integration"""
        self.log("🔗 Checking integration status...")
        
        integration_status = {}
        
        try:
            # Test CORS by making a request with Origin header
            response = requests.get(f"{self.backend_url}/api/health", 
                                  headers={'Origin': self.frontend_url}, 
                                  timeout=10)
            
            cors_headers = {
                'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
                'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
            }
            
            integration_status['cors'] = {
                'working': response.status_code == 200,
                'headers': cors_headers
            }
            
            if response.status_code == 200:
                self.log("✅ CORS appears to be working")
                if cors_headers['access-control-allow-origin']:
                    self.log(f"   Allowed origin: {cors_headers['access-control-allow-origin']}")
            else:
                self.log(f"❌ CORS test failed: {response.status_code}")
                
        except Exception as e:
            self.log(f"❌ Integration check failed: {e}")
            integration_status = {'error': str(e)}
            
        return integration_status
        
    def generate_deployment_report(self) -> Dict[str, Any]:
        """Generate comprehensive deployment status report"""
        self.log("📊 Generating deployment status report...")
        
        report = {
            'timestamp': time.time(),
            'frontend': {
                'url': self.frontend_url,
                'status': self.check_frontend_status()
            },
            'backend': {
                'url': self.backend_url,
                'status': self.check_backend_status()
            },
            'integration': self.check_integration_status()
        }
        
        # Determine overall health
        frontend_healthy = report['frontend']['status'].get('accessible', False)
        backend_healthy = report['backend']['status'].get('accessible', False)
        health_endpoint_working = report['backend']['status'].get('health_endpoint', {}).get('accessible', False)
        
        report['overall'] = {
            'frontend_healthy': frontend_healthy,
            'backend_healthy': backend_healthy,
            'health_endpoint_working': health_endpoint_working,
            'fully_functional': frontend_healthy and backend_healthy and health_endpoint_working
        }
        
        return report
        
    def run_status_check(self):
        """Run complete deployment status check"""
        self.log("🚀 Starting deployment status check...")
        
        report = self.generate_deployment_report()
        
        # Print summary
        self.log("\n📋 Deployment Status Summary")
        self.log("=" * 40)
        
        # Frontend status
        if report['overall']['frontend_healthy']:
            self.log("✅ Frontend (Vercel): HEALTHY")
        else:
            self.log("❌ Frontend (Vercel): ISSUES")
            
        # Backend status
        if report['overall']['backend_healthy']:
            self.log("✅ Backend (Railway): ACCESSIBLE")
        else:
            self.log("❌ Backend (Railway): NOT ACCESSIBLE")
            
        # API status
        if report['overall']['health_endpoint_working']:
            self.log("✅ API Endpoints: WORKING")
        else:
            self.log("❌ API Endpoints: NOT WORKING")
            
        # Overall status
        if report['overall']['fully_functional']:
            self.log("\n🎉 Deployment is fully functional!")
        else:
            self.log("\n⚠️ Deployment has issues:")
            
            if not report['overall']['frontend_healthy']:
                self.log("   - Frontend deployment issues")
                
            if not report['overall']['backend_healthy']:
                self.log("   - Backend deployment issues")
                
            if not report['overall']['health_endpoint_working']:
                self.log("   - API endpoints not responding")
                
        # Save report
        report_file = "deployment-status-report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
            
        self.log(f"\n📄 Full report saved to: {report_file}")
        
        # Provide next steps
        self.log("\n💡 Next Steps:")
        
        if not report['overall']['backend_healthy']:
            self.log("   1. Check Railway deployment logs")
            self.log("   2. Verify Railway service is running")
            self.log("   3. Check Railway environment variables")
            
        if not report['overall']['health_endpoint_working'] and report['overall']['backend_healthy']:
            self.log("   1. Check if latest code is deployed to Railway")
            self.log("   2. Verify main.py has correct route definitions")
            self.log("   3. Check Railway build logs for errors")
            
        if report['overall']['fully_functional']:
            self.log("   ✅ Ready for production use!")
            
        return report['overall']['fully_functional']

def main():
    """Main function"""
    checker = DeploymentStatusChecker()
    success = checker.run_status_check()
    
    import sys
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()