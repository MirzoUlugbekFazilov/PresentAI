# Gunicorn configuration for Railway deployment

# Timeout for worker processes (5 minutes for long image generation)
timeout = 300

# Number of worker processes
workers = 2

# Threads per worker
threads = 4

# Worker class for handling concurrent requests
worker_class = "gthread"

# Graceful timeout
graceful_timeout = 120

# Keep-alive timeout
keepalive = 5

# Log level
loglevel = "info"

# Access log format
accesslog = "-"
errorlog = "-"

# Capture output from app
capture_output = True

# Preload app for faster worker spawning
preload_app = False
