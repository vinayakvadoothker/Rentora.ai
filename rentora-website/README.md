# rentora.ai
A Repo for A Website and App - Rentora.ai


# Rentora Website

This is the repository for the Rentora website built with React.

## Getting Started

### Prerequisites

Before you start, make sure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/vinayakvadoothker/Rentora
```

2. Navigate to the project directory:

```bash
cd rentora-website
```

3. Install dependencies:

```bash
npm install
```

### Configuration

1. Create a .env file in the root of your project.

2. Add your Clerk Publishable Key to the .env file:

```env
REACT_APP_CLERK_PUBLISHABLE_KEY=your-publishable-key
```

### Usage

#### Development

To run the project in development mode:

```bash
npm start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

#### Production Build

To create a production-ready build:

```bash
npm run build
```
USE THIS TO USE WITH LOGIN CREDS (Clerk)

This command generates a build folder with optimized and minified files. You can deploy the contents of this folder to a web server.

### Folder Structure

The project structure is organized as follows:

- public: Contains the public assets and the main index.html.
- src: Contains the source code for the React app.
  - components: React components used in the app.
  - App.js: The main component that renders the entire app.
  - index.js: Entry point for React rendering.
  - Other necessary files like index.css, App.css, etc.

### Additional Information

- The website uses [Clerk](https://docs.clerk.dev/) for authentication. Make sure to configure Clerk accordingly.

## License

This project is under Vinayak Vadoothker's Purview
