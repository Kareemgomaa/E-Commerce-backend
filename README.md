# 🛒 E-Commerce & HR Management API

A full-featured RESTful API built with Node.js, Express, and MongoDB. Includes a complete e-commerce system, real-time notifications via Socket.io, and an HR management system.

## 🌐 Live URL

```
https://e-commerce-backend-production-30fa.up.railway.app
```

---

## ✨ Features

- 🔐 **Authentication** — JWT access & refresh tokens, email verification, password reset
- 🛍️ **E-Commerce** — Categories, subcategories, products with filtering & pagination
- 🛒 **Cart & Orders** — Full cart management, COD checkout, Stripe card payments
- 🖼️ **File Uploads** — Cloudinary integration for avatars, categories, and product images
- 🔔 **Real-Time Notifications** — Socket.io admin broadcast system
- 👥 **HR System** — Staff management, attendance (check-in/out), salary calculation & deductions
- 🔒 **Security** — Helmet, CORS, rate limiting, bcrypt password hashing, Joi validation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express v5 | Server framework |
| MongoDB + Mongoose v9 | Database & ODM |
| JWT (jsonwebtoken) | Authentication & authorization |
| bcrypt | Password hashing (salt rounds: 12) |
| Joi | Input validation |
| Resend | Email delivery |
| Multer + Cloudinary | File uploads & cloud storage |
| Socket.io | Real-time notifications |
| Stripe | Card payment processing |
| mongoose-paginate-v2 | Pagination for products |
| Helmet | Security headers |
| express-rate-limit | Rate limiting on auth routes |
| cors | Cross-origin resource sharing |
| uuid | Unique file naming |

---

## 📁 Project Structure

```
E-Commerce/
├── config/
│   └── .env
├── src/
│   ├── common/
│   │   └── email/
│   │       └── sendEmail.js
│   ├── database/
│   │   ├── connection.js
│   │   └── model/
│   │       ├── user.model.js
│   │       ├── staff.model.js
│   │       ├── attendance.model.js
│   │       ├── deduction.model.js
│   │       ├── category.model.js
│   │       ├── subCategories.model.js
│   │       ├── product.model.js
│   │       ├── cart.model.js
│   │       └── order.model.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── multer.js
│   │   ├── bodyAndFileMerge.js
│   │   └── filterDeletedUser.js
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── category/
│   │   ├── subCategories/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── staff/
│   │   └── public/
│   ├── utils/
│   │   └── validation.js
│   ├── app.controller.js
│   └── main.js
├── notification.socket.js
├── package.json
└── vercel.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Resend account

### Installation

```bash
# Clone the repo
git clone https://github.com/Kareemgomaa/E-Commerce-backend.git
cd E-Commerce-backend

# Install dependencies
npm install
```

### Environment Variables

Create a `config/.env` file:

```env
# Server
PORT=3001

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/E-Commerce

# JWT
JWT_SECRET=your_secret_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
```

### Run the server

```bash
node src/main.js
```

Server runs on `http://localhost:3001`

---

## 📡 API Endpoints

### 🔐 Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/signup` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| PUT | `/api/v1/auth/verify-email/:token` | Verify email |
| POST | `/api/v1/auth/resend-verification` | Resend verification email |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password/:token` | Reset password |

### 👤 User Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/v1/users/profile` | User | Get my profile |
| PUT | `/api/v1/users/profile` | User | Update profile |
| DELETE | `/api/v1/users/profile` | User | Soft delete account |
| POST | `/api/v1/users/upload-avatar` | User | Upload avatar |

### 📂 Categories (Public)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/puclicCategories` | All active categories with subcategories |
| GET | `/api/v1/categories/:id/subcategories` | Get subcategories by category |
| GET | `/api/v1/subcategories/:id` | Get single subcategory |

### 📂 Categories (Admin)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/categories` | Create category |
| PUT | `/api/v1/categories/:id` | Update category |
| DELETE | `/api/v1/categories/:id` | Soft delete category |
| GET | `/api/v1/categories` | Get all categories |

### 📦 Products (Public)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/products` | All active products |
| GET | `/api/v1/products/filter` | Filter & paginate (`?page=1&limit=10&minPrice=100&sort=price_asc`) |
| GET | `/api/v1/products/:id` | Single product |
| GET | `/api/v1/products/category/:categoryId` | Products by category |
| GET | `/api/v1/products/subCategory/:subCategoryId` | Products by subcategory |

### 📦 Products (Admin)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/admin/products` | Add product (multipart/form-data) |
| PUT | `/api/v1/admin/products/:id` | Update product |
| DELETE | `/api/v1/admin/products/:id` | Soft delete product |
| PATCH | `/api/v1/admin/products/:id/stock` | Update stock quantity |

### 🛒 Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/cart` | User | Add item to cart |
| GET | `/api/v1/cart` | User | View cart |
| PUT | `/api/v1/cart/:productId` | User | Update quantity |
| DELETE | `/api/v1/cart/:productId` | User | Remove item |
| DELETE | `/api/v1/cart` | User | Clear cart |

### 📋 Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/orders/checkout` | User | Checkout (COD or card) |
| GET | `/api/v1/orders` | User | My orders |
| GET | `/api/v1/orders/:id` | User | Order details |
| GET | `/api/v1/admin/orders` | Admin | All orders |
| PATCH | `/api/v1/admin/orders/:id/status` | Admin | Update order status |

### 👥 HR — Staff (Admin)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/admin/staff` | Add staff member |
| GET | `/api/v1/admin/staff` | Get all staff |
| GET | `/api/v1/admin/staff/:id` | Get staff details |
| PUT | `/api/v1/admin/staff/:id` | Update staff |
| DELETE | `/api/v1/admin/staff/:id` | Soft delete staff |

### ⏰ HR — Attendance

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/staff/checkin` | Staff/Admin | Check in for the day |
| POST | `/api/v1/staff/checkout` | Staff/Admin | Check out for the day |

### 💰 HR — Salary & Deductions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/admin/staff/:id/deductions` | Add deduction |
| GET | `/api/v1/admin/staff/:id/deductions` | Get staff deductions |
| PUT | `/api/v1/admin/staff/:id/deductions/:deductionId` | Update deduction |
| DELETE | `/api/v1/admin/staff/:id/deductions/:deductionId` | Delete deduction |
| GET | `/api/v1/admin/staff/:id/salary/:month` | Calculate monthly salary |
| POST | `/api/v1/admin/staff/:id/salary/:month/pay` | Mark salary as paid |
| PUT | `/api/v1/admin/staff/:id/salary/:month/adjust` | Adjust salary |

---

## 🔔 Socket.io Events

Connect to: `https://e-commerce-backend-production-30fa.up.railway.app`

| Event | Direction | Description |
|---|---|---|
| `authenticate` | Client → Server | Send JWT token to authenticate |
| `authenticated` | Server → Client | Auth success confirmation |
| `admin:send-offer` | Client → Server | Admin broadcasts offer (admin only) |
| `user:receive-offer` | Server → Client | Users receive the offer |
| `error` | Server → Client | Error messages |

```javascript
import { io } from 'socket.io-client';

const socket = io('https://e-commerce-backend-production-30fa.up.railway.app');

socket.on('connect', () => {
  socket.emit('authenticate', 'your_jwt_token');
});

socket.on('user:receive-offer', (offer) => {
  console.log('New offer:', offer);
});
```

---

## 💳 Checkout Example

```json
// COD
{
  "shippingAddress": {
    "street": "123 Tahrir St",
    "city": "Cairo",
    "country": "Egypt"
  },
  "paymentMethod": "cod"
}

// Card (Stripe) — returns redirect URL
{
  "shippingAddress": { ... },
  "paymentMethod": "card"
}
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 12)
- JWT tokens expire in **24h** (access) / **7 days** (refresh)
- Rate limiting on auth endpoints (100 req / 15 min)
- Helmet.js security headers
- Input validation with Joi on all routes
- Soft delete pattern — data never permanently deleted
- MongoDB transactions for critical operations (staff creation, checkout, deductions)

---

## 📸 Image Upload

Images are stored on **Cloudinary** in organized folders:

- `avatars/` — User profile pictures
- `categories/` — Category images
- `subcategories/` — Subcategory images
- `products/<product-name>/` — Product images (each product has its own folder)

**Allowed formats:** jpg, jpeg, png, webp — Max size: 5MB

---

## 🧮 Salary Calculation

```
Base Salary    = Daily Salary × Working Days
Deductions     = (Late Days × Daily Salary × 0.1) + (Absent Days × Daily Salary) + Manual Deductions
Final Salary   = Base Salary - Deductions + Adjustments
```

---

## 👨‍💻 Author

**Kareem Gomaa**
GitHub: [@Kareemgomaa](https://github.com/Kareemgomaa)
