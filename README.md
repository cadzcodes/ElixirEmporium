# ✨ Elixir Emporium

![Elixir Emporium Banner](public/images/Mockup.png)

<div align="center">
  
  **A complete E-Commerce Suite built with React + Laravel + MySQL**
  
  🛍️ Customer Store • 🏪 Admin CMS • 🔌 API Backend
  
  ![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
  
  [![Build Status](https://img.shields.io/github/workflow/status/cadzcodes/ElixirEmporium/CI?style=for-the-badge)](https://github.com/cadzcodes/ElixirEmporium/actions)
  [![Contributors](https://img.shields.io/github/contributors/cadzcodes/ElixirEmporium?style=for-the-badge)](https://github.com/cadzcodes/ElixirEmporium/graphs/contributors)
  
</div>

---

## 📖 Overview

**Elixir Emporium** is a modern, full-stack e-commerce platform designed for scalability, security, and exceptional user experience. Built with industry-standard technologies, it provides everything needed to run a professional online store.

### Why Elixir Emporium?

-   🏗️ **Modular Architecture** - Clean separation between frontend, backend, and admin systems
-   ⚡ **High Performance** - Optimized API calls and efficient database queries
-   🔒 **Enterprise Security** - CSRF protection, input validation, and secure authentication
-   📱 **Mobile First** - Responsive design that works perfectly on all devices
-   🚀 **Production Ready** - Docker support and deployment configurations included

---

## 🌟 Features

### 🛒 Customer Storefront

-   **Product Catalog** - Browse products with advanced filtering and search
-   **Shopping Cart** - Persistent cart with quantity management
-   **Secure Checkout** - Multiple payment methods and order confirmation
-   **User Accounts** - Registration, login, and order history
-   **Order Tracking** - Real-time status updates

### 🏪 Admin Dashboard

-   **Product Management** - Add, edit, and organize your inventory
-   **Order Management** - Process orders and track fulfillment
-   **Customer Management** - View customer details and order history
-   **Analytics Dashboard** - Sales reports and performance metrics
-   **Content Management** - Manage site content and settings

### 🔧 Technical Features

-   **RESTful API** - Clean, documented API endpoints
-   **Real-time Updates** - Live notifications and status updates
-   **Image Management** - Optimized image upload and processing
-   **Search Engine** - Fast, accurate product search
-   **Inventory Tracking** - Automatic stock level management

---

## ⚙️ Installation

### Prerequisites

Ensure you have the following installed:

-   **PHP** >= 8.1
-   **Composer** >= 2.0
-   **Node.js** >= 16.0
-   **MySQL** >= 8.0
-   **Git**

### 🚀 Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/cadzcodes/ElixirEmporium.git
cd ElixirEmporium
```

2. **Backend Setup (Laravel)**

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Setup environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env file
# DB_DATABASE=elixir_emporium
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run database migrations and seeders
php artisan migrate --seed

# Start the Laravel development server
php artisan serve
```

3. **Frontend Setup (React)**

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm run dev
```

4. **Access the application**

-   **Frontend Store**: http://localhost:3000
-   **Backend API**: http://localhost:8000
-   **Admin Dashboard**: http://localhost:8000/admin

### 🐳 Docker Installation (Alternative)

```bash
# Clone the repository
git clone https://github.com/cadzcodes/ElixirEmporium.git
cd ElixirEmporium

# Build and start containers
docker-compose up -d

# Run database migrations
docker-compose exec backend php artisan migrate --seed
```

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center">

**Frontend**

-   ⚛️ React 18
-   🎨 Tailwind CSS
-   ✨ GSAP Animations
-   📦 Axios
-   🛣️ React Router

</td>
<td align="center">

**Backend**

-   🐘 Laravel 12
-   🗄️ MySQL 8.0
-   🔐 Laravel Sanctum
-   📧 Laravel Mail
-   ⚡ Redis (Caching)

</td>
<td align="center">

**DevOps**

-   🐳 Docker
-   🔄 GitHub Actions
-   🌐 Nginx
-   🚀 PM2
-   📊 Laravel Telescope

</td>
</tr>
</table>

---

## 📂 Project Structure

```
ElixirEmporium/
├── 📁 backend/                 # Laravel API & Admin CMS
│   ├── 📁 app/
│   │   ├── 📁 Http/Controllers/
│   │   ├── 📁 Models/
│   │   └── 📁 Services/
│   ├── 📁 database/
│   │   ├── 📁 migrations/
│   │   └── 📁 seeders/
│   ├── 📁 routes/
│   │   ├── 📄 api.php
│   │   └── 📄 web.php
│   └── 📄 composer.json
│
├── 📁 frontend/               # React Storefront
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   ├── 📁 pages/
│   │   ├── 📁 hooks/
│   │   └── 📁 utils/
│   ├── 📁 public/
│   └── 📄 package.json
│
├── 📁 assets/                 # Documentation & Images
├── 📁 docker/                 # Docker configuration
├── 📄 docker-compose.yml
├── 📄 README.md
└── 📄 LICENSE
```

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```env
APP_NAME="Elixir Emporium"
APP_ENV=local
APP_KEY=your_app_key_here
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=elixir_emporium
DB_USERNAME=your_username
DB_PASSWORD=your_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_APP_NAME="Elixir Emporium"
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

---

## 🚀 Deployment

### Production Deployment

1. **Prepare the server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install nginx mysql-server php8.1-fpm composer nodejs npm git -y
```

2. **Deploy the application**

```bash
# Clone repository
git clone https://github.com/cadzcodes/ElixirEmporium.git /var/www/elixir-emporium
cd /var/www/elixir-emporium

# Backend deployment
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend deployment
cd ../frontend
npm ci --only=production
npm run build
```

3. **Configure web server**

```bash
# Copy Nginx configuration
sudo cp docker/nginx/default.conf /etc/nginx/sites-available/elixir-emporium
sudo ln -s /etc/nginx/sites-available/elixir-emporium /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml up -d

# Run optimizations
docker-compose exec backend php artisan optimize
```

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login       # User login
POST /api/auth/register    # User registration
POST /api/auth/logout      # User logout
GET  /api/auth/user        # Get authenticated user
```

### Product Endpoints

```http
GET    /api/products           # List all products
GET    /api/products/{id}      # Get single product
POST   /api/products           # Create product (Admin)
PUT    /api/products/{id}      # Update product (Admin)
DELETE /api/products/{id}      # Delete product (Admin)
```

### Order Endpoints

```http
GET  /api/orders              # List user orders
POST /api/orders              # Create new order
GET  /api/orders/{id}         # Get order details
PUT  /api/orders/{id}/status  # Update order status (Admin)
```

For complete API documentation, visit `/api/documentation` after installation.

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 🤝 Contributing

We love contributions! Here's how you can help make Elixir Emporium even better:

### Getting Started

1. **Fork the repository** 🍴

```bash
# Click the Fork button on GitHub, then:
git clone https://github.com/YOUR_USERNAME/ElixirEmporium.git
cd ElixirEmporium
```

2. **Create a feature branch** 🌿

```bash
git checkout -b feature/amazing-new-feature
```

3. **Make your changes** ✨

    - Follow our coding standards
    - Add tests for new functionality
    - Update documentation as needed

4. **Test your changes** 🧪

```bash
# Backend tests
cd backend && php artisan test

# Frontend tests
cd frontend && npm test
```

5. **Commit and push** 📤

```bash
git add .
git commit -m "✨ Add amazing new feature"
git push origin feature/amazing-new-feature
```

6. **Create a Pull Request** 🚀
    - Go to your fork on GitHub
    - Click "New Pull Request"
    - Provide a clear description of your changes

### Contribution Guidelines

-   📝 **Code Style**: Follow PSR-12 for PHP, Airbnb style for JavaScript
-   🧪 **Testing**: All new features must include tests
-   📖 **Documentation**: Update relevant documentation
-   💬 **Commit Messages**: Use conventional commit format
-   🐛 **Bug Reports**: Use the issue template

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Elixir Emporium

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

---

## 🙏 Acknowledgments

-   **Laravel Team** - For the amazing framework
-   **React Team** - For the powerful frontend library
-   **Tailwind CSS** - For the utility-first CSS framework
-   **Contributors** - Thank you to all our amazing contributors!

---

## 📞 Support & Contact

<div align="center">

**Need Help?**

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/cadzcodes/ElixirEmporium/issues)
[![Discord](https://img.shields.io/badge/Discord-Chat-blue?style=for-the-badge&logo=discord)](https://discord.gg/your-server)
[![Documentation](https://img.shields.io/badge/Docs-Read-green?style=for-the-badge&logo=gitbook)](https://docs.elixiremporium.com)

**Found this helpful? Give us a ⭐**

</div>

---

<div align="center">
  <p>Made with ❤️ by the Elixir Emporium Team</p>
  <p>
    <a href="#top">Back to Top ⬆️</a>
  </p>
</div>
