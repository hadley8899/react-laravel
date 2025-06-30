FROM php:8.4-fpm

RUN apt-get update \
 && apt-get install -y \
      curl gnupg \
      libmemcached-dev \
      libzip-dev \
      zip unzip \
      libssl-dev zlib1g-dev libzstd-dev \
      pkg-config gosu \
      libpng-dev libjpeg-dev libfreetype6-dev libonig-dev \
 && docker-php-ext-install pdo_mysql zip gd \
 && pecl install memcached xdebug \
 && docker-php-ext-enable memcached xdebug

RUN echo "upload_max_filesize = 100M\npost_max_size = 100M" > /usr/local/etc/php/conf.d/uploads.ini

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && apt-get install -y nodejs \
 && npm install -g mjml \
 && npm cache clean --force

COPY docker/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
