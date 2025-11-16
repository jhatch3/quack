"""
Vercel serverless function wrapper for FastAPI backend.
This file allows the FastAPI app to run on Vercel's serverless platform.
"""
import sys
import os
import json

# Get the absolute path to the backend directory
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
backend_path = os.path.join(project_root, 'backend')

# Add backend directory to Python path
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

# Change working directory to backend for relative imports
os.chdir(backend_path)

try:
    from mangum import Mangum
    from app.main import app
    
    # Wrap FastAPI app with Mangum for AWS Lambda/Vercel compatibility
    mangum_handler = Mangum(app, lifespan="off")
    
    # Vercel Python functions use AWS Lambda event format
    def handler(event, context):
        """
        Vercel serverless function handler.
        Vercel converts HTTP requests to AWS Lambda event format.
        """
        try:
            # Call Mangum handler with Lambda event
            response = mangum_handler(event, context)
            return response
        except Exception as e:
            import traceback
            error_msg = f"Error in handler: {str(e)}\n{traceback.format_exc()}"
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({"error": error_msg}),
            }
            
except Exception as e:
    # For debugging - this will show up in Vercel logs
    import traceback
    error_msg = f"Error loading FastAPI app: {str(e)}\n{traceback.format_exc()}"
    print(f"CRITICAL ERROR: {error_msg}")  # This will appear in Vercel logs
    
    def handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": error_msg}),
        }

