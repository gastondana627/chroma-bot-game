#!/usr/bin/env python3
"""
Production Readiness Check
Comprehensive validation of backend configuration and deployment readiness
"""

import requests
import json
import sys
import os
import subprocess
from typing import Dict, Any, List, Optional

class ProductionReadinessChecker:
    def __init__(self):
        self.production_backend = "https://data-bleed-backend.up.railway.app"
        self.production_frontend = "https://data-bleed-vsc-game.vercel.app"
        
    def check_local_configuration(self) -> Dict[str, Any]:
        """Check local configuration files and environment"""
        print("🔍 Checking local configuration...")
        
        result = {
            'env_files': {},
            'config_files': {},
            'dependencies': {},
            'issues': []
        }
        
        # Check .env files
        env_files = ['.env', 'chroma-bot/.env']
        for env_file in env_files:
            if os.path.exists(env_file):
                result['env_files'][env_file] = {'exists': True, 'vars': {}}
                try:
                    with open(env_file, 'r') as f:
                        for line in f:
                            line = line.strip()
                            if line and not line.startswith('#') and '=' in line:
                                key, value = line.split('=', 1)
                                result['env_files'][env_file]['vars'][key.strip()] = len(value.strip())
                except Exception as e:
                    result['env_files'][env_file]['error'] = str(e)
            else:
                result['env_files'][env_file] = {'exists': False}
        
        # Check configuration files
        config_files = [
            'main.py',
            'railway.json', 
            'vercel.json',
            'requirements.txt',
            'chroma-bot/assets/config/characters.json'
        ]
        
        for config_file in config_files:
            result['config_files'][config_file] = {'exists': os.path.exists(config_file)}
            if os.path.exists(config_file):
                try:
                    result['config_files'][config_file]['size'] = os.path.getsize(config_file)
                except:
                    pass
        
        # Check for OpenAI API key
        openai_key = None
        for env_file, data in result['env_files'].items():
            if data.get('exists') and 'OPENAI_API_KEY' in data.get('vars', {}):
                key_length = data['vars']['OPENAI_API_KEY']
                if key_length > 20:
                    openai_key = "configured"
                    break
        
        if not openai_key:
            result['issues'].append("OPENAI_API_KEY not found or too short in .env files")
        
        # Check main.py for CORS configuration
        if os.path.exists('main.py'):
            try:
                with open('main.py', 'r') as f:
                    content = f.read()
                    if 'data-bleed-vsc-game.vercel.app' in content:
                        result['cors_configured'] = True
                    else:
                        result['cors_configured'] = False
                        result['issues'].append("Vercel production URL not found in CORS configuration")
            except:
                result['issues'].append("Could not read main.py")
        
        return result
    
    def check_railway_deployment(self) -> Dict[str, Any]:
        """Check Railway deployment status"""
        print("🚂 Checking Railway deployment...")
        
        result = {
            'url_accessible': False,
            'application_deployed': False,
            'cli_available': False,
            'authenticated': False,
            'issues': []
        }
        
        # Check if Railway CLI is available
        try:
            subprocess.run(['railway', '--version'], 
                          capture_output=True, text=True, timeout=10)
            result['cli_available'] = True
        except:
            result['cli_available'] = False
            result['issues'].append("Railway CLI not installed")
        
        # Check if authenticated
        if result['cli_available']:
            try:
                auth_result = subprocess.run(['railway', 'whoami'], 
                                           capture_output=True, text=True, timeout=10)
                result['authenticated'] = auth_result.returncode == 0
                if not result['authenticated']:
                    result['issues'].append("Not authenticated with Railway CLI")
            except:
                result['issues'].append("Could not check Railway authentication")
        
        # Test URL accessibility
        try:
            response = requests.get(self.production_backend, timeout=10)
            result['url_accessible'] = True
            result['status_code'] = response.status_code
            
            if response.status_code == 404:
                try:
                    error_data = response.json()
                    if error_data.get('message') == 'Application not found':
                        result['application_deployed'] = False
                        result['issues'].append("Railway application not found - deployment may have failed")
                    else:
                        result['application_deployed'] = True
                except:
                    result['application_deployed'] = False
            elif response.status_code == 200:
                result['application_deployed'] = True
            else:
                result['issues'].append(f"Unexpected status code: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            result['url_accessible'] = False
            result['issues'].append(f"Cannot reach Railway URL: {str(e)}")
        
        return result
    
    def check_vercel_deployment(self) -> Dict[str, Any]:
        """Check Vercel deployment status"""
        print("⚡ Checking Vercel deployment...")
        
        result = {
            'url_accessible': False,
            'serving_content': False,
            'cli_available': False,
            'issues': []
        }
        
        # Check if Vercel CLI is available
        try:
            subprocess.run(['vercel', '--version'], 
                          capture_output=True, text=True, timeout=10)
            result['cli_available'] = True
        except:
            result['cli_available'] = False
            result['issues'].append("Vercel CLI not installed")
        
        # Test URL accessibility
        try:
            response = requests.get(self.production_frontend, timeout=10)
            result['url_accessible'] = True
            result['status_code'] = response.status_code
            
            if response.status_code == 200:
                # Check if it's serving actual content
                content = response.text.lower()
                if 'data bleed' in content or 'game' in content or 'character' in content:
                    result['serving_content'] = True
                else:
                    result['serving_content'] = False
                    result['issues'].append("Vercel serving content but may not be the game")
            elif response.status_code == 404:
                result['issues'].append("Vercel frontend returns 404 - deployment issue")
            else:
                result['issues'].append(f"Unexpected status code: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            result['url_accessible'] = False
            result['issues'].append(f"Cannot reach Vercel URL: {str(e)}")
        
        return result
    
    def generate_deployment_plan(self, local_config: Dict, railway_status: Dict, vercel_status: Dict) -> List[str]:
        """Generate step-by-step deployment plan based on current status"""
        plan = []
        
        # Local configuration issues
        if local_config['issues']:
            plan.append("🔧 Fix Local Configuration:")
            for issue in local_config['issues']:
                plan.append(f"   - {issue}")
        
        # Railway deployment issues
        if not railway_status['application_deployed']:
            plan.append("🚂 Fix Railway Deployment:")
            
            if not railway_status['cli_available']:
                plan.append("   - Install Railway CLI: npm install -g @railway/cli")
            
            if not railway_status['authenticated']:
                plan.append("   - Login to Railway: railway login")
            
            plan.append("   - Deploy to Railway: railway up")
            plan.append("   - Set environment variables: railway variables set OPENAI_API_KEY=your_key")
            plan.append("   - Check deployment status: railway status")
        
        # Vercel deployment issues
        if not vercel_status['serving_content']:
            plan.append("⚡ Fix Vercel Deployment:")
            
            if not vercel_status['cli_available']:
                plan.append("   - Install Vercel CLI: npm install -g vercel")
            
            plan.append("   - Deploy to Vercel: vercel --prod")
            plan.append("   - Check deployment status: vercel ls")
        
        # Integration steps
        if railway_status['application_deployed'] and vercel_status['serving_content']:
            plan.append("🔗 Test Integration:")
            plan.append("   - Run API validation: python3 validate-api-endpoints.py")
            plan.append("   - Test CORS: python3 test-cors-configuration.py")
            plan.append("   - Verify health endpoint: python3 verify-railway-config.py")
        
        return plan
    
    def run_full_check(self) -> Dict[str, Any]:
        """Run complete production readiness check"""
        print("🎯 Production Readiness Check")
        print("=" * 50)
        
        results = {
            'timestamp': __import__('time').strftime('%Y-%m-%d %H:%M:%S UTC', __import__('time').gmtime()),
            'local_config': self.check_local_configuration(),
            'railway_status': self.check_railway_deployment(),
            'vercel_status': self.check_vercel_deployment(),
            'overall_ready': False,
            'deployment_plan': []
        }
        
        # Determine overall readiness
        local_ok = len(results['local_config']['issues']) == 0
        railway_ok = results['railway_status']['application_deployed']
        vercel_ok = results['vercel_status']['serving_content']
        
        results['overall_ready'] = local_ok and railway_ok and vercel_ok
        
        # Generate deployment plan if not ready
        if not results['overall_ready']:
            results['deployment_plan'] = self.generate_deployment_plan(
                results['local_config'],
                results['railway_status'],
                results['vercel_status']
            )
        
        return results

def print_results(results: Dict[str, Any]) -> None:
    """Print formatted results"""
    
    print("\n📊 Production Readiness Summary")
    print("=" * 50)
    
    # Local configuration
    local = results['local_config']
    local_status = "✅" if len(local['issues']) == 0 else "❌"
    print(f"{local_status} Local Configuration")
    
    if local['issues']:
        for issue in local['issues']:
            print(f"     - {issue}")
    
    # Railway status
    railway = results['railway_status']
    railway_status = "✅" if railway['application_deployed'] else "❌"
    print(f"{railway_status} Railway Backend Deployment")
    
    if railway['issues']:
        for issue in railway['issues']:
            print(f"     - {issue}")
    
    # Vercel status
    vercel = results['vercel_status']
    vercel_status = "✅" if vercel['serving_content'] else "❌"
    print(f"{vercel_status} Vercel Frontend Deployment")
    
    if vercel['issues']:
        for issue in vercel['issues']:
            print(f"     - {issue}")
    
    # Overall status
    overall_status = "✅ READY" if results['overall_ready'] else "❌ NOT READY"
    print(f"\n🎯 Overall Status: {overall_status}")
    
    # Deployment plan
    if results['deployment_plan']:
        print(f"\n📋 Deployment Plan:")
        for step in results['deployment_plan']:
            print(step)
    
    # URLs
    print(f"\n🔗 Production URLs:")
    print(f"   Frontend: https://data-bleed-vsc-game.vercel.app")
    print(f"   Backend:  https://data-bleed-backend.up.railway.app")

def main():
    checker = ProductionReadinessChecker()
    results = checker.run_full_check()
    
    print_results(results)
    
    # Save detailed results
    output_file = f"production-readiness-{int(__import__('time').time())}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: {output_file}")
    
    if results['overall_ready']:
        print("\n🎉 Production environment is ready!")
        return 0
    else:
        print("\n⚠️  Production environment needs attention - follow the deployment plan above")
        return 1

if __name__ == "__main__":
    sys.exit(main())