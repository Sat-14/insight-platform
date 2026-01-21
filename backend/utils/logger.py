"""
AMEP Centralized Logging Configuration
INFO level logging for debugging and monitoring

Location: backend/utils/logger.py
"""

import logging
import sys
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
import os
from datetime import datetime

# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

def setup_logger(name=__name__, log_file='logs/amep.log', level=logging.INFO):
    """
    Configure logger with console and file handlers

    Args:
        name: Logger name
        log_file: Path to log file
        level: Logging level (default: INFO)

    Returns:
        Logger instance
    """

    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Prevent duplicate handlers
    if logger.handlers:
        return logger

    # Create logs directory if it doesn't exist
    log_dir = os.path.dirname(log_file)
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s | %(name)s | %(levelname)s | %(funcName)s:%(lineno)d | %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # Console Handler (stdout)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File Handler with rotation (10MB max, keep 5 backup files)
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setLevel(level)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger


def get_logger(name=__name__):
    """
    Get or create logger instance

    Args:
        name: Logger name (usually __name__)

    Returns:
        Logger instance
    """
    return setup_logger(name)


# ============================================================================
# HELPER FUNCTIONS FOR STRUCTURED LOGGING
# ============================================================================

def log_request(logger, method, endpoint, user_id=None, params=None):
    """Log incoming API request"""
    msg = f"API Request: {method} {endpoint}"
    if user_id:
        msg += f" | User: {user_id}"
    if params:
        msg += f" | Params: {params}"
    logger.info(msg)


def log_response(logger, endpoint, status_code, duration_ms=None):
    """Log API response"""
    msg = f"API Response: {endpoint} | Status: {status_code}"
    if duration_ms:
        msg += f" | Duration: {duration_ms}ms"
    logger.info(msg)


def log_database_operation(logger, operation, collection, query=None, result=None):
    """Log database operation"""
    msg = f"Database {operation}: {collection}"
    if query:
        msg += f" | Query: {query}"
    if result:
        msg += f" | Result: {result}"
    logger.info(msg)


def log_authentication(logger, action, user_id=None, success=True, reason=None):
    """Log authentication event"""
    status = "SUCCESS" if success else "FAILED"
    msg = f"Auth {action}: {status}"
    if user_id:
        msg += f" | User: {user_id}"
    if reason:
        msg += f" | Reason: {reason}"
    logger.info(msg)


def log_ml_operation(logger, model_name, operation, student_id=None, duration_ms=None, result=None):
    """Log ML model operation"""
    msg = f"ML {model_name}: {operation}"
    if student_id:
        msg += f" | Student: {student_id}"
    if duration_ms:
        msg += f" | Duration: {duration_ms}ms"
    if result:
        msg += f" | Result: {result}"
    logger.info(msg)


def log_websocket_event(logger, event_name, user_id=None, room=None, data=None):
    """Log WebSocket event"""
    msg = f"WebSocket {event_name}"
    if user_id:
        msg += f" | User: {user_id}"
    if room:
        msg += f" | Room: {room}"
    if data:
        msg += f" | Data: {data}"
    logger.info(msg)


def log_task(logger, task_name, task_id=None, status=None, duration_ms=None):
    """Log Celery task"""
    msg = f"Task {task_name}"
    if task_id:
        msg += f" | ID: {task_id}"
    if status:
        msg += f" | Status: {status}"
    if duration_ms:
        msg += f" | Duration: {duration_ms}ms"
    logger.info(msg)


def log_error_with_context(logger, error, context=None, user_id=None, endpoint=None):
    """Log error with context"""
    msg = f"ERROR: {str(error)}"
    if context:
        msg += f" | Context: {context}"
    if user_id:
        msg += f" | User: {user_id}"
    if endpoint:
        msg += f" | Endpoint: {endpoint}"
    logger.error(msg, exc_info=True)


# ============================================================================
# PERFORMANCE LOGGING
# ============================================================================

class PerformanceLogger:
    """Context manager for logging operation duration"""

    def __init__(self, logger, operation_name, **kwargs):
        self.logger = logger
        self.operation_name = operation_name
        self.kwargs = kwargs
        self.start_time = None

    def __enter__(self):
        self.start_time = datetime.now()
        msg = f"Starting: {self.operation_name}"
        for key, value in self.kwargs.items():
            msg += f" | {key}: {value}"
        self.logger.info(msg)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        duration_ms = (datetime.now() - self.start_time).total_seconds() * 1000

        if exc_type:
            self.logger.error(
                f"Failed: {self.operation_name} | Duration: {duration_ms:.2f}ms | Error: {exc_val}"
            )
        else:
            msg = f"Completed: {self.operation_name} | Duration: {duration_ms:.2f}ms"
            for key, value in self.kwargs.items():
                msg += f" | {key}: {value}"
            self.logger.info(msg)

        return False  # Don't suppress exceptions


# ============================================================================
# REQUEST LOGGING MIDDLEWARE
# ============================================================================

def log_request_middleware(app):
    """
    Flask middleware for automatic request/response logging

    Usage:
        from utils.logger import log_request_middleware
        log_request_middleware(app)
    """
    from flask import request, g
    from time import time

    logger = get_logger('request_logger')

    @app.before_request
    def before_request():
        g.start_time = time()

        # Log incoming request
        msg = f"Request: {request.method} {request.path}"
        if request.args:
            msg += f" | Query: {dict(request.args)}"
        if hasattr(request, 'user_id'):
            msg += f" | User: {request.user_id}"
        logger.info(msg)

    @app.after_request
    def after_request(response):
        if hasattr(g, 'start_time'):
            duration_ms = (time() - g.start_time) * 1000

            msg = f"Response: {request.method} {request.path} | Status: {response.status_code} | Duration: {duration_ms:.2f}ms"
            logger.info(msg)

        return response

    @app.teardown_request
    def teardown_request(exception=None):
        if exception:
            logger.error(f"Request failed: {request.method} {request.path} | Error: {exception}", exc_info=True)


# ============================================================================
# EXPORT
# ============================================================================

__all__ = [
    'setup_logger',
    'get_logger',
    'log_request',
    'log_response',
    'log_database_operation',
    'log_authentication',
    'log_ml_operation',
    'log_websocket_event',
    'log_task',
    'log_error_with_context',
    'PerformanceLogger',
    'log_request_middleware'
]
