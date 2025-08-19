FROM php:8.2-fpm

# Install system deps
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zip git unzip curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install Node for Vite build
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Set working dir
WORKDIR /var/www

# Copy project
COPY . ./

# Install deps
RUN composer install
RUN npm install
RUN npm run build

# Permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
# Give PHP-FPM user permissions
RUN chown -R www-data:www-data storage bootstrap/cache
RUN chmod -R 775 storage bootstrap/cache

CMD ["php-fpm"]
