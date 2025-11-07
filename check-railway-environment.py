#!/usr/bin/env python3
"""
Railway Environment Configuration Checker
Verifies that all required environment variables are properly configured
"""

import os
import requests
import json
import sys
from typing import Dict, List, Optional

class RailwayEnvironmentChecker:
    def __init__(self):
        self.backend_url = "https://data-bleed-backend.up.railway.app"
        self.required_env_vars = [
            "OPENAI_API_KEY",
            "PORT"
        ]
        self.optional_env_vars = [
            "RAILWAY_ENVIRONMENT",
            "RAILWAY_PROJECT_ID",
            "RAILWAY_SERVICE_ID"
        ]
        
    def log(self, message: str, level: str = "INFO"):
        """Log a message"""
        print(f"{level}: {message}")
        
    def check_local_environment(self) -> Dict[str, bool]:
        """Check local environment variables (for reference)"""
        self.log("Checking local environment variables...")
        
        local_env = {}
        for var in self.required_env_vars + self.optional_env_vars:
            value = os.getenv(var)
            local_env[var] = {
                'present': value is not None,
                'value_length': len(value) if value else 0
            }
            
            if value:
                self.log(f"✅ Local {var}: Present ({len(value)} chars)")
            else:
                self.log(f"❌ Local {var}: Not set")
                
        return local_env
        
    def check_production_environment(self) -> Dict[str, any]:
        """Check production environment through health endpoint"""
        self.log("Checking production environment configuration...")
        
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                health_data = response.json()
                
                # Analyze health data for environment indicators
                env_status = {
                    'health_endpoint_working': True,
                    'openai_configured': health_data.get('openai_configured', False),
                    'characters_loaded': len(health_data.get('characters_loaded', [])) > 0,
                    'server_running': True
                }
                
                self.log("✅ Production server is responding")
                
                if env_status['openai_configured']:
                    self.log("✅ OpenAI API key is configured in production")
                else:
                    self.log("❌ OpenAI API key is NOT configured in production")
                    
                if env_status['characters_loaded']:
                    characters = health_data.get('characters_loaded', [])
                    self.log(f"✅ Characters loaded: {', '.join(characters)}")
                else:
                    self.log("❌ No characters loaded in production")
                    
                return env_status
                
            else:
                self.log(f"❌ Health endpoint failed: HTTP {response.status_code}")
                return {
                    'health_endpoint_working': False,
                    'error': f"HTTP {response.status_code}"
                }
                
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Cannot reach production server: {e}")
            return {
                'health_endpoint_working': False,
                'error': str(e)
            }
            
    def check_railway_deployment_indicators(self) -> Dict[str, any]:
        """Check for Railway-specific deployment indicators"""
        self.log("Checking Railway deployment indicators...")
        
        indicators = {}
        
        try:
            # Check if server responds with Railway-like headers
            response = requests.head(self.backend_url, timeout=10)
            
            headers = dict(response.headers)
            indicators['server_headers'] = headers
            
            # Look for Railway-specific headers or patterns
            railway_indicators = [
                'x-railway-',
                'railway',
                'up.railway.app'
            ]
            
            found_indicators = []
            for header_name, header_value in headers.items():
                for indicator in railway_indicators:
                    if indicator.lower() in header_name.lower() or indicator.lower() in str(header_value).lower():
                        found_indicators.append(f"{header_name}: {header_value}")
                        
            indicators['railway_headers'] = found_indicators
            
            if found_indicators:
                self.log("✅ Railway deployment indicators found")
                for indicator in found_indicators:
                    self.log(f"   - {indicator}")
            else:
                self.log("⚠️ No obvious Railway indicators in headers")
                
            # Check URL pattern
            if 'up.railway.app' in self.backend_url:
                indicators['railway_url_pattern'] = True
                self.log("✅ Using Railway URL pattern")
            else:
                indicators['railway_url_pattern'] = False
                self.log("⚠️ Not using standard Railway URL pattern")
                
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Cannot check deployment indicators: {e}")
            indicators['error'] = str(e)
            
        return indicators
        
    def generate_environment_report(self) -> Dict[str, any]:
        """Generate comprehensive environment report"""
        self.log("🔍 Generating Railway environment report...")
        
        report = {
            'timestamp': __import__('time').time(),
            'backend_url': self.backend_url,
            'local_environment': self.check_local_environment(),
            'production_environment': self.check_production_environment(),
            'railway_indicators': self.check_railway_deployment_indicators()
        }
        
        # Determine overall status
        prod_env = report['production_environment']
        overall_status = (
            prod_env.get('health_endpoint_working', False) and
            prod_env.get('openai_configured', False) and
            prod_env.get('characters_loaded', False)
        )
        
        report['overall_status'] = {
            'healthy': overall_status,
            'issues': []
        }
        
        # Identify issues
        if not prod_env.get('health_endpoint_working'):
            report['overall_status']['issues'].append("Health endpoint not working")
            
        if not prod_env.get('openai_configured'):
            report['overall_status']['issues'].append("OpenAI API key not configured")
            
        if not prod_env.get('characters_loaded'):
            report['overall_status']['issues'].append("Characters not loaded")
            
        return report
        
    def run_environment_check(self):
        """Run complete environment check"""
        self.log("🚀 Starting Railway environment configuration check...")
        self.log(f"Target URL: {self.backend_url}")
        
        report = self.generate_environment_report()
        
        # Print summary
        self.log(f"\n📊 Environment Check Summary")
        self.log(f"{'='*40}")
        
        if report['overall_status']['healthy']:
            self.log("🎉 Railway environment is properly configured!")
        else:
            self.log("⚠️ Railway environment has configuration issues:")
            for issue in report['overall_status']['issues']:
                self.log(f"   - {issue}")
                
        # Save report
        report_file = "railway-environment-report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
            
        self.log(f"📄 Full report saved to: {report_file}")
        
        # Provide recommendations
        self.log(f"\n💡 Recommendations:")
        
        if not report['production_environment'].get('openai_configured'):
            self.log("   1. Set OPENAI_API_KEY in Railway dashboard")
            self.log("      - Go to your Railway project dashboard")
            self.log("      - Navigate to Variables tab")
            self.log("      - Add OPENAI_API_KEY with your API key")
            
        if not report['production_environment'].get('health_endpoint_working'):
            self.log("   2. Check Railway deployment logs")
            self.log("      - Verify the application started successfully")
            self.log("      - Check for any startup errors")
            
        if report['overall_status']['healthy']:
            self.log("   ✅ Environment is ready for production use!")
            
        return report['overall_status']['healthy']

def main():
    """Main function"""
    checker = RailwayEnvironmentChecker()
    success = checker.run_environment_check()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()