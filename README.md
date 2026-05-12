# FlowBuilder 🚀

FlowBuilder is an open-source visual automation platform that allows you to automate your workflows without writing a single line of code. Connect your apps, process data, and scale your operations with an intuitive drag-and-drop interface.

![Version](https://img.shields.io/badge/version-0.1.0-orange)
![License](https://img.shields.io/badge/license-UNLICENSED-red)
![Open Source](https://img.shields.io/badge/open--source-welcome-emerald)

## ✨ Features

- **Visual Workflow Builder**: Intuitive drag-and-drop interface powered by React Flow.
- **Dynamic Nodes**: 
  - **HTTP**: Connect to any external API with custom headers and bodies.
  - **Binary Logic**: Branch your workflows based on complex conditions.
  - **Delay**: Pause execution for specific intervals.
  - **Log**: Monitor and debug your data in real-time.
- **Robust Auth System**: Secure authentication with JWT, refresh tokens, and email verification.
- **Real-time Monitoring**: Detailed execution logs for every workflow run.
- **Modern Aesthetic**: High-contrast, performance-optimized design inspired by the best in class.

---

## 🛠 Tech Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Auth**: JWT (Access + Refresh tokens)
- **Mailing**: Nodemailer + Mailgen (Mailtrap for dev)
- **Validation**: Class-validator + Zod

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/) & [TanStack Query](https://tanstack.com/query)
- **Workflow Engine**: [@xyflow/react](https://reactflow.dev/)
- **Styling**: Tailwind CSS + Shadcn UI
- **API Client**: Axios with interceptors

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL
- `pnpm` (recommended for frontend) or `npm`

### 1. Clone the Repository
```bash
git clone https://github.com/swami1302/workflow_automation.git
cd workflow_automation
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env # Create your .env and fill in the DATABASE_URL and JWT secrets

# Run migrations
npx prisma migrate dev

# Start in development mode
npm run start:dev
```

### 3. Frontend Setup
```bash
cd ../frontend
pnpm install # or npm install

# Configure environment variables
# Create a .env.local with NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Start development server
pnpm dev # or npm run dev
```

---

## 🤝 Contributing

We love contributions! Whether you're fixing a bug, adding a new node type, or improving the documentation, here's how you can help:

1. **Fork** the repository.
2. **Create a branch** for your feature (`git checkout -b feature/amazing-feature`).
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`).
4. **Push** to the branch (`git push origin feature/amazing-feature`).
5. **Open a Pull Request**.

Please ensure your code follows the existing style and includes tests where applicable.

---

## 📄 License

This project is currently UNLICENSED. See the [backend/LICENSE](backend/LICENSE) for more details (if applicable).

---

Built with ❤️ by the FlowBuilder Community.
