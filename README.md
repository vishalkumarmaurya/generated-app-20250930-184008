# Agri-Loan & Subsidy Tracker ALST
A minimalist, farmer-friendly dashboard to effortlessly track agricultural loans and government subsidies.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/vishalkumarmaurya/generated-app-20250930-183849)
Agri-Loan & Subsidy Tracker ALST is a modern, minimalist web application designed to empower farmers by providing a clear, intuitive, and accessible platform to track agricultural loans and government subsidies. The application focuses on visual clarity and simplicity, eliminating clutter to present vital information at a glance.
## Key Features
-   **Personalized Dashboard**: At-a-glance summary of your financial aid status, including active applications, total loan amounts, and subsidies received.
-   **Scheme Discovery**: A browsable catalog of available agricultural loans and subsidies, presented in a clean, easy-to-understand format.
-   **Application Tracking**: A detailed list of recent applications with their current status, communicated visually for quick parsing.
-   **Mobile-First Design**: Flawlessly responsive layout that works perfectly on any device, from mobile phones to desktops.
-   **Minimalist UI**: A clean, uncluttered interface that focuses on presenting vital information without distractions.
## Technology Stack
This project is a full-stack application built on the Cloudflare stack.
-   **Frontend**:
    -   [React](https://react.dev/)
    -   [Vite](https://vitejs.dev/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [shadcn/ui](https://ui.shadcn.com/)
    -   [Framer Motion](https://www.framer.com/motion/) for animations
    -   [Lucide React](https://lucide.dev/) for icons
-   **Backend**:
    -   [Cloudflare Workers](https://workers.cloudflare.com/)
    -   [Hono](https://hono.dev/)
    -   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/) for state management
-   **Shared**:
    -   [Zod](https://zod.dev/) for type validation
    -   Shared TypeScript types for end-to-end type safety.
## Project Structure
The project is organized into three main directories:
-   `src/`: Contains the React frontend application code.
-   `worker/`: Contains the Hono backend API running on a Cloudflare Worker.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and the worker.
## Getting Started
Follow these instructions to get the project up and running on your local machine for development and testing purposes.
### Prerequisites
You need to have [Bun](https://bun.sh/) installed on your machine.
### Installation
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd agri-loan-subsidy-tracker
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
### Running in Development Mode
To start the development server for both the frontend and the worker, run:
```bash
bun dev
```
This command will:
- Start the Vite development server for the React frontend on `http://localhost:3000`.
- Start a local `workerd` instance to run the Hono API.
- The frontend is configured to proxy API requests to the local worker, enabling a seamless development experience.
## Deployment
This application is designed for easy deployment to Cloudflare.
1.  **Build the project:**
    This command bundles the React application and prepares the worker script for deployment.
    ```bash
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    This command deploys your application to your Cloudflare account. It uploads the worker script and the static assets for the frontend.
    ```bash
    bun run deploy
    ```
Alternatively, you can deploy directly from your GitHub repository.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/vishalkumarmaurya/generated-app-20250930-183849)
## Available Scripts
-   `bun dev`: Starts the local development server.
-   `bun build`: Builds the application for production.
-   `bun deploy`: Deploys the application to Cloudflare.
-   `bun lint`: Lints the codebase using ESLint.
## License
This project is licensed under the MIT License.