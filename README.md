# Nova Connect

A modern web application built with Next.js 15, featuring a beautiful UI and robust authentication system.

## 🚀 Features

- ⚡️ Next.js 15 with App Router
- 🔐 NextAuth.js for authentication
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- 🌙 Dark mode support
- 🎯 TypeScript for type safety
- 📝 Form handling with React Hook Form
- ✅ Form validation with Zod
- 🎭 Radix UI components
- 📅 Date handling with date-fns
- 🔄 Real-time updates
- 🎨 Beautiful UI components with shadcn/ui

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- pnpm (recommended) or npm

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nova-connect.git
cd nova-connect
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
# Add other required environment variables
```

## 🚀 Development

To start the development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Building for Production

To create a production build:

```bash
pnpm build
# or
npm run build
```

To start the production server:

```bash
pnpm start
# or
npm start
```

## 🧪 Testing

Run the linter:

```bash
pnpm lint
# or
npm run lint
```

## 📁 Project Structure

```
nova-connect/
├── src/
│   ├── app/          # App router pages and layouts
│   ├── components/   # React components
│   ├── lib/          # Utility functions and configurations
│   └── styles/       # Global styles
├── public/           # Static assets
└── ...config files
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Authentication:** NextAuth.js
- **Form Handling:** React Hook Form + Zod
- **Date Handling:** date-fns
- **Icons:** Lucide React
- **Animation:** Motion

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for the amazing Next.js framework
- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- All the open-source contributors who made this possible
