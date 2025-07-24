# VaultNotes

A secure, modern note-taking and password management application built with React, TypeScript, and Supabase.

## Features

- 📝 **Secure Note Management**: Create, edit, and organize your notes with priority levels
- 🔐 **Password Vault**: Securely store and manage your passwords
- 🛡️ **User Authentication**: Secure login and signup with email verification
- 📊 **Dashboard**: Overview of your notes and security metrics
- 🎨 **Modern UI**: Beautiful, responsive design with animations
- 🚀 **Fast Performance**: Built with Vite for optimal performance

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Real-time)
- **UI Components**: Radix UI, Lucide Icons
- **Build Tool**: Vite
- **Deployment**: Docker, Nginx

## Quick Start

### Prerequisites

- Node.js 18+ 
- Docker (optional)
- Supabase account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd vaultnotes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - The app is pre-configured with the necessary database schema

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t vaultnotes .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:80 vaultnotes
   ```

3. **Or use Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Production Deployment

The application can be deployed to any platform that supports Docker:

- **Docker Hub**: Push to Docker Hub and deploy anywhere
- **AWS ECS/Fargate**: Use the provided Docker image
- **Google Cloud Run**: Deploy directly from the repository
- **Azure Container Instances**: Use the container image
- **DigitalOcean App Platform**: Deploy from GitHub

## Project info

**Lovable URL**: https://lovable.dev/projects/b1d7cf72-4ddb-402e-8e18-04dd60610964

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b1d7cf72-4ddb-402e-8e18-04dd60610964) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
