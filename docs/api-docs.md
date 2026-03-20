# API Documentation

---

## Daftar Isi

- [Auth](#auth)
- [User](#user)
- [Feed](#feed)
- [Comment](#comment)
- [Like](#like)
- [Bookmark](#bookmark)
- [Follow](#follow)

---

## Auth

### Register

```
POST /api/auth/register
```

Mendaftarkan pengguna baru.

**Request Body**

| Field      | Type     | Validasi           |
| ---------- | -------- | ------------------ |
| `fullname` | `string` | Minimal 6 karakter |
| `username` | `string` | Minimal 6 karakter |
| `email`    | `string` | Format email valid |
| `password` | `string` | Minimal 8 karakter |

```json
{
  "fullname": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**

`201 Created`

```json
{
  "success": true,
  "message": "User register successfully",
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

### Login

```
POST /api/auth/login
```

Login dan mendapatkan access token.

**Request Body**

| Field      | Type     | Validasi           |
| ---------- | -------- | ------------------ |
| `email`    | `string` | Format email valid |
| `password` | `string` | Minimal 8 karakter |

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Sign In Successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "fullname" : "John Doe",
      "email": "john@example.com",
      "image": "https://cdn.example.com/avatars/s2gbx2w6jsd",
      "bio": null
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## User

### Search User

Mencari pengguna berdasarkan username.

🔒 `Authorization: Bearer <token>`

```
GET /api/user/search?username={username}
```

**Query Parameters**

| Parameter  | Type     | Validasi             |
| ---------- | -------- | -------------------- |
| `username` | `string` | Wajib, 1–50 karakter |

**Response**

Example: `GET /api/user/search?username=john`

`200 OK`

```json
{
  "success": true,
  "message": "User found",
  "data": [
    {
      "id": 1,
      "fullname": "John Doe",
      "username": "johndoe",
      "image": null
    }
    {
      "id": 2,
      "fullname": "Mikel John",
      "username": "john_22",
      "image": null
    }
  ]
}
```

---

### Get User by Username

Mengambil profil pengguna berdasarkan username.

🔒 `Authorization: Bearer <token>`

```
GET /api/user/:username
```

**Path Parameters**

| Parameter  | Type     | Validasi             |
| ---------- | -------- | -------------------- |
| `username` | `string` | Wajib, 1–30 karakter |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "email": "johndoe@gmail.com",
    "username": "johndoe",
    "bio": null,
    "image": null,
    "followingCount": 0,
    "followerCount": 0,
    "postCount": 0,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "posts": [], // Berisi postingan user
    "bookmarks": [] // Berisi postingan yang disimpan user
  }
}
```

---

### Edit User Profile

Mengupdate profil pengguna yang sedang login.

🔒 `Authorization: Bearer <token>`

```
PUT /api/user/edit-user
```

**Request Body**

| Field      | Type     | Validasi            |
| ---------- | -------- | ------------------- |
| `fullname` | `string` | Minimal 6 karakter  |
| `username` | `string` | Minimal 6 karakter  |
| `bio`      | `string` | Minimal 10 karakter |

```json
{
  "fullname": "John Doe",
  "username": "johndoe",
  "bio": "I love coding and coffee."
}
```

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Update user successfully",
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "I love coding and coffee.",
    "image": "https://cdn.example.com/avatars/s2gbx2w6jsd",
    "imageId": "avatars/s2gbx2w6jsd",
    "followingCount": 0,
    "followerCount": 0,
    "postCount": 0,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### Update Avatar

Mengupdate foto profil pengguna. Request menggunakan `multipart/form-data`.

🔒 `Authorization: Bearer <token>`

```
PATCH /api/user/edit-avatar
```

**Form Data**

| Field   | Type   | Keterangan                                            |
| ------- | ------ | ----------------------------------------------------- |
| `image` | `file` | Wajib. Format: `png`, `jpeg`, `jpg`, `webp`. Maks 2MB |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Update avatar successfully",
  "data": {
    "id": 1,
    "fullname": "John Doe",
    "username": "johndoe",
    "image": "https://cdn.example.com/avatars/asfinonaeg",
    "imageId": "avatars/asfinonaeg"
  }
}
```

---

## Feed

### Create Feed

Membuat postingan baru. Request menggunakan `multipart/form-data`.

🔒 `Authorization: Bearer <token>`

```
POST /api/feed
```

**Form Data**

| Field     | Type     | Validasi               |
| --------- | -------- | ---------------------- |
| `image`   | `file`   | Wajib                  |
| `caption` | `string` | Wajib, 1–2200 karakter |

**Response**

`201 Created`

```json
{
  "success": true,
  "message": "Feed created successfully",
  "data": {
    "id": 10,
    "userId": 1,
    "image": "https://cdn.example.com/feeds/adbfakjb",
    "imageId": "feed/adbfakjb",
    "caption": "I love nest js!",
    "commentCount": 0,
    "likeCount": 0,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### Get All Feed

Mengambil daftar feed dengan pagination.

🔒 `Authorization: Bearer <token>`

```
GET /api/feed?page={page}&limit={limit}
```

**Query Parameters**

| Parameter | Type     | Validasi                        |
| --------- | -------- | ------------------------------- |
| `page`    | `number` | Wajib, integer positif          |
| `limit`   | `number` | Wajib, integer positif, maks 50 |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Get feeds successfully",
  "data": [
    {
      "id": 10,
      "userId": 1,
      "image": "https://cdn.example.com/feeds/adbfakjb",
      "imageId": "feeds/adbfakjb",
      "caption": "I love nest js",
      "commentCount": 0,
      "likeCount": 0,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "user": {
        "id": 1,
        "username": "Johndoe",
        "fullname": "John Doe",
        "image": "https://cdn.example.com/avatars/asfinonaeg"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 1,
    "totalPages": 5
  }
}
```

---

### Get Feed Detail

Mengambil detail satu postingan berdasarkan ID.

🔒 `Authorization: Bearer <token>`

```
GET /api/feed/:id
```

**Path Parameters**

| Parameter | Type     | Keterangan   |
| --------- | -------- | ------------ |
| `id`      | `number` | Id postingan |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Post detail",
  "data": {
    "id": 10,
    "userId": 1,
    "image": "https://cdn.example.com/feeds/adbfakjb",
    "imageId": "feeds/adbfakjb",
    "caption": "I love nest js",
    "commentCount": 0,
    "likeCount": 0,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "user": {
      "id": 1,
      "fullname": "John Doe",
      "username": "ihsanji",
      "image": "https://cdn.example.com/avatars/asfinonaeg"
    },
    "comments": [
      {
        "id": 2,
        "content": "Nice post!",
        "createdAt": "2026-01-01T00:00:00.000Z",
        "user" : {
          // User yang comment
        }
      }
    ]
  }
}
```

---

### Delete Feed

Menghapus postingan milik pengguna yang sedang login.

🔒 `Authorization: Bearer <token>`

```
DELETE /api/feed/:id
```

**Path Parameters**

| Parameter | Type     | Keterangan   |
| --------- | -------- | ------------ |
| `id`      | `number` | Id postingan |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Delete post successfully"
}
```

---

## Comment

### Create Comment

Menambahkan komentar pada sebuah postingan.

🔒 `Authorization: Bearer <token>`

```
POST /api/comment
```

**Request Body**

| Field     | Type     | Validasi               |
| --------- | -------- | ---------------------- |
| `postId`  | `number` | Wajib, integer positif |
| `content` | `string` | Wajib, 1–1000 karakter |

```json
{
  "postId": 10,
  "content": "Nice post!"
}
```

**Response**

`201 Created`

```json
{
  "success": true,
  "message": "Create comment successfully",
  "data": {
    "id": 5,
    "userId": 1,
    "postId": 10,
    "content": "Nice post!",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### Delete Comment

Menghapus komentar milik pengguna yang sedang login.

🔒 `Authorization: Bearer <token>`

```
DELETE /api/comment/:id
```

**Path Parameters**

| Parameter | Type     | Keterangan  |
| --------- | -------- | ----------- |
| `id`      | `number` | ID komentar |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Delete comment successfully"
}
```

---

## Like

### Toggle Like Feed

Memberikan like atau unlike pada sebuah postingan.

🔒 `Authorization: Bearer <token>`

```
POST /api/like/:id
```

**Path Parameters**

| Parameter | Type     | Keterangan   |
| --------- | -------- | ------------ |
| `id`      | `number` | Id postingan |

**Response**

`201 Created` Like posingan

```json
{
  "success": true,
  "message": "Like post successfully",
  "data": {
    "userId": 1,
    "postId": 10,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

`201 Created` Unlike postingan

```json
{
  "success": true,
  "message": "Unlike post successfully"
}
```

---

### Check User Like

Mengecek apakah pengguna yang sedang login sudah menyukai postingan tertentu.

🔒 `Authorization: Bearer <token>`

```
GET /api/like/:id
```

**Path Parameters**

| Parameter | Type     | Keterangan   |
| --------- | -------- | ------------ |
| `id`      | `number` | Id postingan |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Like status fetched",
  "data": {
    "isLiked": true
  }
}
```

---

## Bookmark

Mengecek apakah postingan sudah disimpan oleh pengguna yang sedang login.

### Check Bookmark Status

🔒 `Authorization: Bearer <token>`

```
GET /api/bookmark/:id
```

**Path Parameters**

| Parameter | Type     | Keterangan   |
| --------- | -------- | ------------ |
| `id`      | `number` | Id postingan |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Bookmark status fetched",
  "data": {
    "isSaved": true
  }
}
```

---

### Toggle Bookmark

Menyimpan atau membatalkan simpanan postingan (toggle). Jika belum disimpan maka akan disimpan, jika sudah disimpan maka akan dihapus.

🔒 `Authorization: Bearer <token>`

```
POST /api/bookmark/:id
```

**Path Parameters**

| Parameter | Type     | Keterangan   |
| --------- | -------- | ------------ |
| `id`      | `number` | Id postingan |

**Response**

`200 OK` Berhasil disimpan

```json
{
  "success": true,
  "message": "Save feed successfully"
}
```

`200 OK` Berhasil dihapus dari simpanan

```json
{
  "success": true,
  "message": "Unsave feed successfully"
}
```

---

## Follow

### Follow User

Mengikuti pengguna lain.

🔒 `Authorization: Bearer <token>`

```
POST /api/follow
```

**Request Body**

| Field          | Type     | Validasi               |
| -------------- | -------- | ---------------------- |
| `followUserId` | `number` | Wajib, integer positif |

```json
{
  "followUserId": 2
}
```

**Response**

`201 Created`

```json
{
  "success": true,
  "message": "Follow user successfully",
  "data": {
    "followerId": 2,
    "followingId": 1,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### Get User Suggestions

Mengambil daftar pengguna yang disarankan untuk diikuti (belum di-follow).

🔒 `Authorization: Bearer <token>`

```
GET /api/follow/user
```

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "User suggestions fetched",
  "data": [
    {
      "id": 3,
      "fullname": "Jane Smith",
      "username": "janesmith",
      "image": null
    },
    {
      "id": 4,
      "fullname": "Jane Doe",
      "username": "janedoe",
      "image": null
    }
  ]
}
```

---

### Check Follow Status

Mengecek apakah pengguna yang sedang login sudah mengikuti pengguna tertentu.

🔒 `Authorization: Bearer <token>`

```
GET /api/follow/:id
```

**Path Parameters**

| Parameter | Type     | Keterangan             |
| --------- | -------- | ---------------------- |
| `id`      | `number` | Id pengguna yang dicek |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Follow status fetched",
  "data": {
    "isFollowing": true
  }
}
```

---

### Unfollow User

Berhenti mengikuti pengguna tertentu.

🔒 `Authorization: Bearer <token>`

```
DELETE /api/follow/:id
```

**Path Parameters**

| Parameter | Type     | Keterangan                   |
| --------- | -------- | ---------------------------- |
| `id`      | `number` | Id pengguna yang di-unfollow |

**Response**

`200 OK`

```json
{
  "success": true,
  "message": "Unfollow user successfully"
}
```
