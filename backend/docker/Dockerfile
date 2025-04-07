FROM php:8.2-fpm

RUN apt-get update
RUN apt-get upgrade -y

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libmemcached-dev \
    libzip-dev \
    zip \
    unzip \
    libssl-dev \
    zlib1g-dev \
    libzstd-dev \
    pkg-config \
    && docker-php-ext-install \
        pdo_mysql \
        zip \
    && pecl install memcached xdebug \
    && docker-php-ext-enable memcached xdebug

# Copy custom Xdebug config
COPY docker/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

WORKDIR /var/www/html

#RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Optionally copy composer from its official image
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

CMD ["php-fpm"]
