<p align="center">
  <h1 align="center">🌐 Fesnuk API</h1>
  <p align="center">A RESTful API for a social media application built with NestJS</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
</p>

---

## 📖 About

Fesnuk API is a backend service for a social media application. It supports user authentication, posting feeds with images, commenting, liking, bookmarking, and following other users.

## ✨ Features

- 🔐 **Authentication** — Register and login with JWT-based auth
- 👤 **User** — Search, view, and edit user profiles including avatar upload
- 📸 **Feed** — Create, view, and delete posts with image support
- 💬 **Comment** — Add and delete comments on posts
- ❤️ **Like** — Like posts and check like status
- 🔖 **Bookmark** — Save and unsave posts
- 👥 **Follow** — Follow/unfollow users and get user suggestions

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [NestJS](https://nestjs.com/) | Node.js framework |
| [TypeScript](https://www.typescriptlang.org/) | Language |
| [Prisma](https://www.prisma.io/) | ORM & database migrations |
| [PostgreSQL](https://www.postgresql.org/) | Database |
| [Zod](https://zod.dev/) | Schema validation |
| [JWT](https://jwt.io/) | Authentication |
| [Cloudinary](https://cloudinary.com/) | Cloud image storage |
| [Multer](https://github.com/expressjs/multer) | File upload handling |

## 🚀 Getting Started

### Prerequisites

Pastikan kamu sudah menginstall:

- [Node.js](https://nodejs.org/) v18+
- [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. Clone repository

```bash
git clone https://github.com/IhsanJati/fesnuk-api.git
cd fesnuk-api
```

2. Install dependencies

```bash
yarn install
```

3. Salin file environment

```bash
cp .env.example .env
```

4. Isi variabel environment di file `.env` (lihat bagian [Environment Variables](#-environment-variables))

5. Jalankan migrasi database

```bash
npx prisma migrate dev
```
6. Jalankan generate prisma

```bash
npx prisma generate
```

7. Jalankan aplikasi

```bash
# development
yarn start:dev

# production
yarn start:prod
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🔑 Environment Variables

Buat file `.env` di root project dan isi dengan variabel berikut:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fesnuk_db"

# JWT
JWT_SECRET="your_jwt_secret_key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

> Untuk mendapatkan Cloudinary credentials, buat akun di [cloudinary.com](https://cloudinary.com/) lalu ambil dari dashboard.

## 📁 Project Structure

```
src/
├── auth/           # Autentikasi (register, login)
├── user/           # Manajemen profil pengguna
├── feed/           # Postingan
├── comment/        # Komentar
├── like/           # Like postingan
├── bookmark/       # Simpan postingan
├── follow/         # Follow pengguna
└── common/         # Shared utilities (guard, pipe, decorator)
```

## 📚 API Documentation

Dokumentasi lengkap endpoint tersedia di [`docs/api-docs.md`](./docs/api-docs.md).

Untuk format standar response API, lihat [`docs/api-standard-response.md`](./docs/api-standard-response.md).

## 📄 License

This project is licensed under the [MIT License](./LICENSE).