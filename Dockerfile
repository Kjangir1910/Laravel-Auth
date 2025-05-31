# FROM php:8.2-apache

# # Install dependencies
# RUN apt-get update && apt-get install -y \
#     git unzip curl libzip-dev libpng-dev libonig-dev libxml2-dev zip \
#     && docker-php-ext-install pdo_mysql zip

# # Enable Apache mod_rewrite
# RUN a2enmod rewrite

# # Set working directory
# WORKDIR /var/www/html

# # Copy Laravel project files
# COPY . /var/www/html

# # Install Composer
# COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
# RUN composer install --no-dev --optimize-autoloader

# # Set file permissions
# RUN chown -R www-data:www-data /var/www/html \
#     && chmod -R 755 /var/www/html/storage

# # Laravel environment
# ENV APACHE_DOCUMENT_ROOT /var/www/html/public
# RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# # Expose port
# EXPOSE 80




FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev libpng-dev libonig-dev libxml2-dev zip libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy Laravel project files
COPY . /var/www/html

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Set file permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Laravel environment
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

# Cache config (optional but recommended)
RUN php artisan config:cache

# Expose port
EXPOSE 80

