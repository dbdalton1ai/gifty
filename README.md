# Gifty

Gifty is a modern web application for managing gift ideas and tracking gifts for your loved ones. Built with Next.js, Firebase, and TypeScript, it provides a seamless and user-friendly experience for organizing your gift-giving.

## Features

- **User Authentication**: Secure user authentication system powered by Firebase Auth
- **Gift Management**:
  - Add new gift ideas with titles, descriptions, price estimates, and optional URLs
  - Mark gifts as purchased
  - Archive/unarchive gifts to keep your list organized
  - View gift history and status
  - Toggle between active and archived gifts
- **Responsive Design**: Modern, mobile-friendly interface with dark mode

## Technology Stack

- **Frontend**:
  - Next.js 13+ with App Router
  - React with TypeScript
  - Tailwind CSS for styling
  - Client and Server Components architecture

- **Backend**:
  - Firebase Authentication
  - Firebase Firestore for data storage
  - Server-side and client-side data fetching

## Project Structure

```
src/
├── app/                 # Next.js 13 App Router pages
├── components/         
│   ├── forms/          # Form components (GiftForm, LoginForm)
│   └── ui/             # Reusable UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── lib/               
│   └── firebase/      # Firebase configuration and setup
├── services/          # Business logic and API services
└── types/             # TypeScript type definitions
```

## Core Components

### Forms
- **GiftForm**: Handles creation of new gift ideas with validation
- **LoginForm**: Manages user authentication flow

### UI Components
- **GiftList**: Displays and manages gift items with filtering
- **Button**: Reusable button component with variants
- **NavBar**: Application navigation and user controls

### Services
- **giftService**: Handles all gift-related operations (CRUD)
- **textParsingService**: Utility service for text processing

## Authentication and Security

The application implements a secure authentication flow using Firebase Authentication:
- Protected routes require user authentication
- Automatic redirection to login for unauthenticated users
- Secure data access with user-specific content

## Data Model

### Gift Idea
```typescript
interface GiftIdea {
  id: string;
  title: string;
  description: string;
  priceEstimate?: number;
  url?: string;
  isPurchased: boolean;
  isArchived: boolean;
  recipientId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## State Management

The application uses React's Context API for global state management:
- **AuthContext**: Manages user authentication state
- Local state for component-specific data
- Real-time updates for gift status changes

## Testing

The project includes unit tests for components and services:
- Jest for unit testing
- React Testing Library for component tests
- Test coverage for critical business logic

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deployment
This application is deployed using Vercel, which provides an optimal deployment platform for Next.js applications. Here's how the deployment was set up:

### Deployment Process
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Deploy using Vercel CLI:
   ```bash
   vercel
   ```
3. Follow the authentication process through GitHub or your preferred provider
4. The project will be automatically built and deployed

### Environment Variables
The following environment variables need to be configured in your Vercel project settings:

```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_HUGGINGFACE_API_KEY
```

To set up environment variables:
1. Go to your project settings in the Vercel dashboard
2. Navigate to the "Environment Variables" section
3. Add each variable from your local `.env.local` file
4. Deploy or redeploy your application

### Automatic Deployments
- The project is configured for automatic deployments on every push to the main branch
- Preview deployments are created for pull requests
- Production deployments are triggered on merges to main

### Domain Configuration
After deployment, your application will be available at:
- Production: `https://[project-name].vercel.app`
- Preview: `https://[branch-name].[project-name].vercel.app`

You can configure a custom domain through the Vercel dashboard if desired.
