# Node.js TypeScript API with MongoDB and Cloudinary

A comprehensive RESTful API built with Node.js, TypeScript, MongoDB, and Cloudinary for file uploads, featuring internationalization support for English, Dutch, French, and German.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **File Upload**: Cloudinary integration for image uploads with automatic optimization
- **Internationalization**: Support for 4 languages (English, Dutch, French, German)
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet, CORS, rate limiting, and cookie-based authentication
- **TypeScript**: Full TypeScript support with proper type definitions
- **Validation**: Comprehensive input validation and error handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products (Public GET, Admin CUD)
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID (public)
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Blogs (Public GET, Admin CUD)
- `GET /api/blogs` - Get all blogs (public)
- `GET /api/blogs/:id` - Get blog by ID (public)
- `POST /api/blogs` - Create blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)

### Featured Image (Public GET, Admin UD)
- `GET /api/featured-image` - Get featured image (public)
- `PUT /api/featured-image` - Update featured image (admin)
- `DELETE /api/featured-image` - Delete featured image (admin)

### Reviews (Public GET, Admin CUDP)
- `GET /api/reviews` - Get all reviews (public)
- `GET /api/reviews/:id` - Get review by ID (public)
- `POST /api/reviews` - Create review (admin)
- `PUT /api/reviews/:id` - Update review (admin)
- `PATCH /api/reviews/:id` - Partially update review (admin)
- `DELETE /api/reviews/:id` - Delete review (admin)

### Case Studies (Public GET, Admin CUD)
- `GET /api/case-studies` - Get all case studies (public)
- `GET /api/case-studies/:id` - Get case study by ID (public)
- `POST /api/case-studies` - Create case study (admin)
- `PUT /api/case-studies/:id` - Update case study (admin)
- `DELETE /api/case-studies/:id` - Delete case study (admin)

### Logs (Admin only)
- `POST /api/logs` - Create log (admin)
- `GET /api/logs` - Get all logs (admin)
- `GET /api/logs/:id` - Get log by ID (admin)
- `DELETE /api/logs/:id` - Delete log (admin)

### Stats (Public)
- `GET /api/stats` - Get statistics for all models

### Team Members (Public GET, Admin CUD)
- `GET /api/team` - Get all team members (public)
- `GET /api/team/:id` - Get team member by ID (public)
- `POST /api/team` - Create team member (admin)
- `PUT /api/team/:id` - Update team member (admin)
- `DELETE /api/team/:id` - Delete team member (admin)

### FAQs (Public GET, Admin CUD)
- `GET /api/faqs` - Get all FAQs (public)
- `GET /api/faqs/:id` - Get FAQ by ID (public)
- `POST /api/faqs` - Create FAQ (admin)
- `PUT /api/faqs/:id` - Update FAQ (admin)
- `DELETE /api/faqs/:id` - Delete FAQ (admin)

## Setup Instructions

1. **Environment Variables**
   Update the `.env` file with your actual values:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/nodejs-api
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   
   NODE_ENV=development
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Run the Application**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## Internationalization

The API supports 4 languages:
- **English (en)** - Default
- **Dutch (nl)**
- **French (fr)**
- **German (de)**

### Usage
- **Query Parameter**: `?lang=nl`
- **Header**: `Accept-Language: nl`
- **Cookie**: `i18next=nl`

Example:
```bash
curl -H "Accept-Language: nl" http://localhost:3000/api/products
```

## User Roles

- **user** - Default role with limited access
- **admin** - Full access to all protected routes
- **moderator** - Moderate access (can be customized)

## File Upload

All file uploads are handled through Cloudinary with automatic optimization:
- **Supported formats**: JPG, JPEG, PNG, GIF, WebP
- **File size limit**: 5MB
- **Auto-optimization**: Images are resized to max 1000x1000px

## Testing with Postman

Import the `postman-collection.json` file into Postman to test all endpoints. The collection includes:
- Pre-configured environment variables
- Automatic token extraction and storage
- Examples for all CRUD operations
- Internationalization examples
- File upload examples

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **JWT**: Secure token-based authentication
- **Cookie Security**: HttpOnly cookies for token storage
- **Input Validation**: Comprehensive validation on all inputs

## Data Models

### User
- firstName, lastName, email, password, phoneNumber, profilePicture, roles

### Product
- title, description, keypoints (array), featuredImage, details (array with content and image)

### Blog
- title, subtitle, image, content (rich text)

### Review
- firstName, lastName, stars (1-5), position, image

### Case Study
- title, subtitle, image, content (rich text)

### Team Member
- firstName, lastName, position, message, image

### FAQ
- question, answer

### Featured Image
- image (single image storage)

### Log
- data (accepts any object type)

## Error Handling

All endpoints return consistent error responses with internationalized messages:

```json
{
  "success": false,
  "message": "Translated error message",
  "error": "Technical details (development only)"
}
```

## Pagination

Most GET endpoints support pagination:
- `?page=1` - Page number (default: 1)
- `?limit=10` - Items per page (default: 10)

Response includes pagination metadata:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "current": 1,
      "pages": 5,
      "total": 50
    }
  }
}
```# publicbackend
