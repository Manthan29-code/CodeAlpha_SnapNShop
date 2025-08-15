# SnapNShop 🛍️

A modern e-commerce platform built with Django, featuring user authentication, product management, and role-based access control for customers and vendors.

## 🚀 Features

- **User Management**
  - User registration and authentication
  - Role-based access (Customer/Vendor)
  - User profiles with custom fields
  - Login/logout functionality

- **Product Management**
  - Add, edit, and delete products
  - Product categories and descriptions
  - Image URL support
  - Rating and review system
  - Inventory management with quantity tracking

- **User Roles**
  - **Customers**: Browse and purchase products
  - **Vendors**: Manage their own product listings

- **Modern UI**
  - Responsive design with CSS
  - Interactive JavaScript components
  - Clean and intuitive interface

## 🛠️ Tech Stack

- **Backend**: Django 5.2.5
- **Database**: SQLite3 (development)
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: Django's built-in authentication system
- **Styling**: Custom CSS with responsive design

## 📁 Project Structure

```
PROJECT_01/
├── main/                   # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── product/                # Product management app
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── migrations/
├── user/                   # User management app
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── templatetags/
├── template/               # HTML templates
│   ├── base.html
│   ├── navbar.html
│   ├── footer.html
│   ├── product/
│   └── user/
├── static/                 # Static files
│   ├── css/
│   └── js/
├── db.sqlite3             # SQLite database
└── manage.py              # Django management script
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- pip (Python package installer)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manthan29-code/CodeAlpha_SnapNShop.git
   cd CodeAlpha_SnapNShop
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   
   On Windows:
   ```bash
   venv\Scripts\activate
   ```
   
   On macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install django
   ```

5. **Apply database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

8. **Access the application**
   Open your browser and navigate to `http://127.0.0.1:8000/`

## 📱 Usage

### For Customers
1. Register for a new account or login
2. Browse available products
3. View product details and ratings
4. Add products to cart

### For Vendors
1. Register with vendor role
2. Login to your vendor account
3. Add new products with details
4. Manage your product inventory
5. Update product information

### Admin Features
- Access admin panel at `/admin/`
- Manage users and products
- View system statistics

## 🔧 Development

### Database Models

**User Model:**
- Custom user model extending AbstractUser
- Fields: name, username, email, role (customer/vendor)

**Product Model:**
- Fields: title, price, description, category, image_url, rate, count, quantity
- Linked to user (vendor) via ForeignKey

### Key Views
- Product listing and detail views
- User authentication (login/register)
- User profile management


## 🌟 Features in Development

- [ ] Shopping cart functionality
- [ ] Order management system
- [ ] Payment integration
- [ ] Product search and filtering
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Manthan29-code**
- GitHub: [@Manthan29-code](https://github.com/Manthan29-code)

## 🙏 Acknowledgments

- Django community for the excellent framework
- Bootstrap for responsive design inspiration
- All contributors who helped improve this project

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the author.

---

⭐ Star this repository if you found it helpful!
