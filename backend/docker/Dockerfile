FROM php:8.4-fpm

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
    gosu \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    && docker-php-ext-install \
        pdo_mysql \
        zip \
        gd \
    && pecl install memcached xdebug \
    && docker-php-ext-enable memcached xdebug

RUN echo "upload_max_filesize = 100M" > /usr/local/etc/php/conf.d/uploads.ini && \
    echo "post_max_size = 100M" >> /usr/local/etc/php/conf.d/uploads.ini

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Copy custom Xdebug config
COPY docker/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

WORKDIR /var/www/html

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Copy composer
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
