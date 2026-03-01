# API Standard Response

Semua endpoint menggunakan format response yang konsisten. Setiap response selalu memiliki field `success` bertipe boolean sebagai indikator utama keberhasilan request.

---

## ✅ Success Response

Digunakan ketika request berhasil diproses.

```ts
{
  success: true;
  message: string;
  data?: Record<string, unknown>;  // Payload utama (opsional)
  meta?: {
    page: number;        // Halaman saat ini (mulai dari 1)
    limit: number;       // Jumlah item per halaman
    totalPages: number;  // Total halaman
  };
}
```

> `data` dan `meta` bersifat opsional — `meta` hanya disertakan pada response yang bersifat paginated.

**Contoh:**

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      { "id": 1, "name": "Alice" },
      { "id": 2, "name": "Bob" }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## ❌ Failed Response

### Validation Error (Zod)

Digunakan ketika request body/params gagal validasi schema.

- **HTTP Status:** `400 Bad Request`

```ts
{
  success: false;
  message: string;
  error: {
    code: "VALIDATION_ERROR";
    detail: Array<{
      field: string;   // Nama field yang gagal validasi
      error: string;   // Pesan error yang deskriptif
    }>;
  };
}
```

**Contoh:**

```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "detail": [
      {
        "field": "password",
        "error": "Password must be at least 8 character(s)"
      },
      {
        "field": "email",
        "error": "Invalid email format"
      }
    ]
  }
}
```

---

### HTTP Exception

Digunakan untuk error umum seperti `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`, dll.

```ts
{
  success: false;
  message: string;
  error: string;       // Deskripsi singkat error
  statusCode: number;  // HTTP status code
}
```

**Contoh:**

```json
{
  "success": false,
  "message": "You are not authorized to access this resource",
  "error": "Unauthorized",
  "statusCode": 401
}
```

---

## 📋 Ringkasan

| Skenario          | `success` | HTTP Status         | Field Tambahan          |
| ----------------- | :-------: | ------------------- | ----------------------- |
| Request berhasil  | `true`    | `2xx`               | `data?`, `meta?`        |
| Validasi gagal    | `false`   | `400 Bad Request`   | `error.code`, `error.detail[]` |
| HTTP Exception    | `false`   | `4xx` / `5xx`       | `error`, `statusCode`   |