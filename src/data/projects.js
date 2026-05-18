export const projects = {
  prj1: {
    title: 'finance-tracker-api',
    content:
      'A secure FastAPI backend for personal finance tracking. Features JWT auth, PostgreSQL integration, real-time balances, and advanced transaction filtering.',
    stack: [
      'Python 3.9+',
      'PostgreSQL',
      'FastAPI',
      'SQLAlchemy',
      'Pydantic',
      'Vercel',
      'JWT (jose & argon2)',
      'SlowAPI',
      'Uvicorn',
    ],
    repoUrl: 'https://github.com/shytyk-develop/finance-tracker-api',
  },
  prj2: {
    title: 'python-auth-api',
    content:
      'A robust FastAPI Auth system: JWT, role-based admin features, rate limiting, and async migrations. Secure, scalable, and easy to setup.',
    stack: [
      'Python 3.9+',
      'PostgreSQL',
      'FastAPI',
      'Vercel',
      'SQLAlchemy',
      'Alembic',
      'JWT (jose & argon2)',
      'SlowAPI',
      'Bcrypt',
      'aiosmtplib',
    ],
    repoUrl: 'https://github.com/shytyk-develop/python-auth-api',
  },
  prj3: {
    title: 'genstega-tg-bot',
    content:
      'GenStega hides secret text inside images without altering their look. Securely encrypt data in one click to bypass filters and keep your communication invisible to everyone but the recipient.',
    stack: ['Python 3.9+', 'Aiogram', 'Cryptography', 'SHA256', 'Pillow (PIL)', 'Vercel', 'FastAPI'],
    repoUrl: 'https://github.com/shytyk-develop/genstega-tg-bot',
  },
  prj4: {
    title: 'src17-tg-bot',
    content:
      'A Telegram bot for real-time monitoring of stocks, cryptocurrencies, and currencies. Search for any ticker and manage your personal watchlist.',
    stack: [
      'Python 3.9+',
      'Aiogram',
      'FastAPI',
      'Uvicorn',
      'yfinance API',
      'pandas',
      'SQLAlchemy',
      'PostgreSQL',
      'Vercel Serverless',
    ],
    repoUrl: 'https://github.com/shytyk-develop/src17-tg-bot',
  },
  prj5: {
    title: 'video-2-webm',
    content:
      'A simple and fast FFmpeg-based CLI utility for converting any video format into high-quality WebM files with minimal file size.',
    stack: ['Subprocess Management', 'Python', 'FFmpeg', 'CLI', 'Batch Processing'],
    repoUrl: 'https://github.com/shytyk-develop/video2webm',
  },
  prj6: {
    title: 'safely-chat',
    content:
      'SafeLy Chat: Modern privacy-focused messenger. Built with FastAPI and Next.js. Features private messaging, secure API authentication, and soft-delete functionality.',
    stack: [
      'Python',
      'TypeScript',
      'FastAPI',
      'SQLAlchemy',
      'PostgreSQL',
      'JWT',
      'Next.js',
      'Uvicorn',
      'Pydantic',
      'Tailwind CSS',
      'Vercel',
    ],
    repoUrl: 'https://github.com/shytyk-develop/safely-chat',
  },
};

export const projectList = [
  { id: 'prj1', hex: '0x51A', crc: 'a7b2-f9e1', name: 'finance-tracker-api' },
  { id: 'prj2', hex: '0x52B', crc: 'd4e5-c3b2', name: 'python-auth-api' },
  { id: 'prj3', hex: '0x53C', crc: 'd4e5-c3b2', name: 'genstega-tg-bot' },
  { id: 'prj4', hex: '0x54D', crc: 'd4e5-c3b2', name: 'src17-tg-bot' },
  { id: 'prj5', hex: '0x55E', crc: 'd4e5-c3b2', name: 'video-2-webm' },
  { id: 'prj6', hex: '0x56F', crc: 'd4e5-c3b2', name: 'safely-chat' },
];
