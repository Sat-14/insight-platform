"""
AMEP Main Flask Application
Entry point for the backend server

Location: backend/app.py
"""

from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime
import os

# Import configuration
from config import Config

# Import API route blueprints
from api.mastery_routes import mastery_bp
from api.engagement_routes import engagement_bp
from api.pbl_routes import pbl_bp
from api.analytics_routes import analytics_bp

# Import database
from models.database import init_db

# ============================================================================
# APP INITIALIZATION
# ============================================================================

def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Initialize SocketIO
    socketio = SocketIO(
        app, 
        cors_allowed_origins=app.config['CORS_ORIGINS'],
        async_mode='eventlet'
    )
    
    # Initialize database
    init_db(app)
    
    # Register blueprints
    register_blueprints(app)
    
    # Register WebSocket events
    register_socketio_events(socketio)
    
    # Register error handlers
    register_error_handlers(app)
    
    return app, socketio

def register_blueprints(app):
    """Register all API route blueprints"""
    app.register_blueprint(mastery_bp, url_prefix='/api/mastery')
    app.register_blueprint(engagement_bp, url_prefix='/api/engagement')
    app.register_blueprint(pbl_bp, url_prefix='/api/pbl')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    print("✓ All blueprints registered")

# ============================================================================
# WEBSOCKET EVENTS FOR REAL-TIME UPDATES
# ============================================================================

def register_socketio_events(socketio):
    """Register all SocketIO event handlers"""
    
    @socketio.on('connect')
    def handle_connect():
        """Handle client connection"""
        print('✓ Client connected')
        emit('connected', {
            'message': 'Connected to AMEP server',
            'timestamp': datetime.now().isoformat()
        })
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle client disconnection"""
        print('✗ Client disconnected')
    
    @socketio.on('join_class')
    def handle_join_class(data):
        """Student/teacher joins a class room"""
        class_id = data.get('class_id')
        user_id = data.get('user_id')
        user_role = data.get('role', 'student')
        
        # Join the room
        from flask_socketio import join_room
        join_room(class_id)
        
        print(f'✓ User {user_id} ({user_role}) joined class: {class_id}')
        
        # Notify others in the class
        emit('user_joined', {
            'user_id': user_id,
            'role': user_role,
            'timestamp': datetime.now().isoformat()
        }, room=class_id, skip_sid=True)
    
    @socketio.on('leave_class')
    def handle_leave_class(data):
        """User leaves a class room"""
        class_id = data.get('class_id')
        user_id = data.get('user_id')
        
        from flask_socketio import leave_room
        leave_room(class_id)
        
        print(f'✗ User {user_id} left class: {class_id}')
    
    @socketio.on('poll_response_submitted')
    def handle_poll_response(data):
        """Broadcast poll response update to all clients"""
        poll_id = data.get('poll_id')
        class_id = data.get('class_id')
        
        # Broadcast to all users in the class
        emit('poll_updated', {
            'poll_id': poll_id,
            'total_responses': data.get('total_responses', 0),
            'timestamp': datetime.now().isoformat()
        }, room=class_id, broadcast=True)
        
        print(f'✓ Poll {poll_id} updated')
    
    @socketio.on('engagement_alert')
    def handle_engagement_alert(data):
        """Send real-time engagement alert to teachers"""
        class_id = data.get('class_id')
        student_id = data.get('student_id')
        alert_type = data.get('alert_type')
        
        # Only send to teachers in this class
        emit('engagement_alert_received', {
            'student_id': student_id,
            'alert_type': alert_type,
            'severity': data.get('severity'),
            'message': data.get('message'),
            'timestamp': datetime.now().isoformat()
        }, room=f'teachers_{class_id}')
        
        print(f'⚠️  Engagement alert for student {student_id}')
    
    print("✓ All SocketIO events registered")

# ============================================================================
# HEALTH CHECK & ROOT ROUTES
# ============================================================================

def register_error_handlers(app):
    """Register error handlers and health check"""
    
    @app.route('/')
    def index():
        """Root endpoint"""
        return jsonify({
            'name': 'AMEP API',
            'version': '1.0.0',
            'status': 'running',
            'documentation': '/api/docs'
        })
    
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """API health check endpoint"""
        return jsonify({
            'status': 'healthy',
            'version': '1.0.0',
            'timestamp': datetime.now().isoformat(),
            'database': 'connected',  # Could check actual DB connection
            'redis': 'connected'      # Could check actual Redis connection
        }), 200
    
    @app.errorhandler(404)
    def not_found(error):
        """Handle 404 errors"""
        return jsonify({
            'error': 'Endpoint not found',
            'status': 404,
            'path': error.description if hasattr(error, 'description') else None
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        """Handle 500 errors"""
        return jsonify({
            'error': 'Internal server error',
            'status': 500,
            'message': str(error) if app.config['DEBUG'] else 'An error occurred'
        }), 500
    
    @app.errorhandler(400)
    def bad_request(error):
        """Handle 400 errors"""
        return jsonify({
            'error': 'Bad request',
            'status': 400,
            'message': str(error)
        }), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        """Handle 401 errors"""
        return jsonify({
            'error': 'Unauthorized',
            'status': 401,
            'message': 'Authentication required'
        }), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        """Handle 403 errors"""
        return jsonify({
            'error': 'Forbidden',
            'status': 403,
            'message': 'Insufficient permissions'
        }), 403
    
    print("✓ Error handlers registered")

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == '__main__':
    app, socketio = create_app()
    
    print("\n" + "="*60)
    print("🚀 AMEP Backend Server Starting...")
    print("="*60)
    print(f"Environment: {app.config['ENV']}")
    print(f"Debug Mode: {app.config['DEBUG']}")
    print(f"Database: {app.config['MONGODB_URI'][:30]}...")
    print(f"Port: {app.config['PORT']}")
    print("="*60 + "\n")
    
    # Run with SocketIO
    socketio.run(
        app,
        debug=app.config['DEBUG'],
        host=app.config['HOST'],
        port=app.config['PORT']
    )