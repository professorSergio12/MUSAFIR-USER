**Musafir - Tour & Travel Platform**

Musafir is a comprehensive, full-stack tour and travel application designed to provide users with an immersive experience for exploring and booking travel packages. The platform features a modern React-based frontend, a robust Node.js backend, and a dedicated worker service for handling background tasks, all containerized with Docker for seamless development and deployment.

**Key Features**
- **User Authentication**: Secure sign-up, sign-in, and logout functionality, including password reset via OTP and Google OAuth integration.
- **Package Discovery**: Browse a wide array of travel packages, including a curated list of recommended tours. Filter and search through all available options.
- **Detailed Package Views**: Access in-depth information for each package, including day-by-day itineraries, available hotels, and meal plan options.
- **Dynamic Pricing**: The total package price is calculated dynamically based on user selections for hotels, room types, and food plans.
- **Payment Integration**: Secure payment processing for bookings is handled via Razorpay.
- **User Dashboard**: A personalized dashboard for users to manage their profile, view booking history, submit travel photos to a personal gallery, and post reviews.
- **Community Gallery**: A public gallery showcasing stunning travel photos uploaded by users.
- **Reviews and Ratings**: Users can submit reviews and ratings for packages they have booked.
- **Responsive Design**: A mobile-first, responsive interface built with Tailwind CSS and Flowbite for a great user experience on any device.

**Architecture**
Musafir is built with a modern, scalable architecture, separating concerns into distinct services within a monorepo structure.

* Frontend: A responsive client application built with React and Vite. Redux Toolkit and redux-persist handle state management, while TanStack Query manages asynchronous operations and server state. The UI is styled with Tailwind CSS and Flowbite-React.

* Backend: A RESTful API powered by Node.js and Express. It uses MongoDB with Mongoose for data modeling and persistence. Authentication is managed using JWT and bcryptjs. The backend integrates with third-party services like Cloudinary for image storage and Razorpay for payment processing. Redis is used for caching API responses and managing OTPs.

* Worker Service: A separate Node.js process that handles background jobs using BullMQ. It processes queues for sending emails (e.g., welcome messages, password reset OTPs) via Nodemailer, ensuring the main API remains fast and responsive.

* Containerization: The entire application stack (frontend, backend, worker, Redis) is containerized using Docker and orchestrated with Docker Compose, allowing for consistent environments from development to production.

* CI/CD: The repository includes GitHub Actions workflows (.github/workflows) for automatically building Docker images, pushing them to Docker Hub, and deploying the application to an EC2 instance.

**Getting Started**
To run this project locally, you will need Docker and Docker Compose installed.

**1. Clone the Repository**
```
git clone https://github.com/professorSergio12/MUSAFIR-USER.git
cd MUSAFIR-USER
```

**2. Environment Configuration**
Create a .env file in the root directory of the project. This file is essential for providing credentials and configuration for all services. Add the following variables, replacing the placeholder values with your own keys:

**# MongoDB Connection**

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/musafir?retryWrites=true&w=majority
```

**# JWT Secret**
```
JWT_SECRET=your_super_secret_jwt_key
```

**# Redis Connection URL (for Docker Compose)**
```
REDIS_URL=redis://redis:6379
```

**# Cloudinary Credentials (for image uploads)**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**# Razorpay Credentials**
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**# Nodemailer Credentials (for the worker service)**
EMAIL_USER=your_gmail_address@gmail.com
MAIL_PASS=your_gmail_app_password


# --- Frontend Build-Time Variables ---

**# Firebase Credentials**
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**# Razorpay Key for Frontend**
```
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**# Backend API URL (for local development)**
```
VITE_APP_API_URL_LOCAL=http://localhost:4000/api
```

**# Backend API URL (for Vercel deployment if needed)**
```
VITE_APP_API_URL_VERCEL=https://your-vercel-deployment-url/api
```

**3. Run with Docker Compose**
Once the .env file is configured, start all services using Docker Compose:
```
docker compose up -d --build
```
This command builds the images for the frontend, backend, and worker services and starts them in detached mode.

**4. Access the Application**
```
Frontend: http://localhost:3000
Backend API: http://localhost:4000
```

**5. Seeding the Database**
The repository includes a script to populate the database with dummy data for users, packages, hotels, reviews, and more. This is useful for development and testing.

To run the seed script, execute the following command:
```
docker compose exec backend npm run seed
```
This will clear the existing collections and insert fresh sample data. Demo user credentials are email: john.doe@example.com, password: password123.

**Deployment**
This project is configured for deployment to an EC2 instance via GitHub Actions.

The **.github/workflows/deploy.yml** workflow automates the process.
On push to the **main** branch, the workflow builds Docker images for the **frontend**, **backend**, and **worker** services.

These images are pushed to Docker Hub.
The workflow then connects to the EC2 instance via SSH, pulls the latest images from Docker Hub, and restarts the services using docker-compose.prod.yml.
To use this workflow, you must configure the required secrets in your GitHub repository settings, including Docker Hub credentials and EC2 access keys.

**Project Structure**
The repository is organized as a monorepo with the following structure:
```
professorsergio12-musafir-user.git/
├── .github/              # GitHub Actions workflows for CI/CD
├── backend/              # Node.js, Express, MongoDB, Mongoose API
├── frontend/             # React (Vite), Redux, TanStack Query client
├── nginx/                # NGINX configuration for local reverse proxy
└── worker-server/        # Node.js BullMQ worker for background jobs
```
