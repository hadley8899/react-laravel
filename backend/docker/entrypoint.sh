#!/bin/bash
set -e

# Get host user ID from environment or use default www-data UID
USER_ID=${HOST_USER_ID:-33}
GROUP_ID=${HOST_GROUP_ID:-33}

# Create directories if they don't exist
mkdir -p /var/www/html/storage/app/public
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/testing
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache

# Update www-data user to match host user ID (if different from default)
if [ "$USER_ID" != "33" ]; then
    usermod -u $USER_ID www-data
fi

if [ "$GROUP_ID" != "33" ]; then
    groupmod -g $GROUP_ID www-data
fi

# Set proper permissions
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Run initial setup if needed (checks if vendor directory exists)
if [ ! -d "/var/www/html/vendor" ] && [ -f "/var/www/html/composer.json" ]; then
    echo "Vendor directory not found. Running composer install..."
    gosu www-data composer install
fi

# Create storage symbolic link if it doesn't exist
if [ ! -L "/var/www/html/public/storage" ]; then
    echo "Creating storage symbolic link..."
    php artisan storage:link
fi

# Execute the main container command
exec "$@"
