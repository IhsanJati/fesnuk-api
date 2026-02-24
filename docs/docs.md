# Standar Response

### Success

```ts
{
  success: true,
  message: '',
  data: {},
  meta: {},
}
```

### Failed (Zod error)

```ts
{
  success: false,
  message: '',
  error: {
    code: "VALIDATION_ERROR",
    detail: [
      {
        field: "Password",
        error: "Password must be at least 8 character(s)"
      }
    ]
  }
}
```

### Failed (HttpExeption)
```ts
{
  success: false,
  message: '',
  error: '',
  statusCode,
}
```