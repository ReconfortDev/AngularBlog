# Angular Standalone Blog App

This project is an Angular standalone blog application with Firebase integration for authentication and Firestore for storing posts. The app allows users to register, log in, create, edit, and delete blog posts, as well as view profiles.

## Features

- **Authentication:** Users can sign up, log in, and log out using email/password or Google sign-in.
- **Post Management:** Users can create, edit, and delete blog posts.
- **User Profile:** Each user has a profile page.
- **Route Guards:**
  - Authenticated users are restricted from accessing the login and register pages.
  - Unauthenticated users are restricted from accessing protected pages like profile, create post, and edit post.

## Tech Stack

 Live link: https://amali-blog.web.app

## Tech Stack

- **Angular** (Standalone Components)
- **Firebase** (Authentication and Firestore)
- **RxJS** (Reactive programming)
- **TailwindCSS** (Styling)
- **Angular Router and Firebase Route** (Routing with Guards)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:ReconfortDev/AngularBlog.git
   cd AngularBlog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the app:

   ```bash
   ng serve
   ```

4. Access the app in your browser at `http://localhost:4200`.

## Usage

- **Home Page:** View all blog posts.
- **Authentication:** Sign up or log in to create posts.
- **Create Post:** After logging in, create new posts.
- **Edit Post:** Edit your existing posts.
- **Profile:** View your profile details.
- **Logout:** Log out of your account.

## Guards

- **AuthGuard:** Protects routes like `create post`, `edit post`, and `profile` for logged-in users only.
- **NoAuthGuard:** Prevents logged-in users from accessing login and register pages.
