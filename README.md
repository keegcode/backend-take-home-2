### Swagger API is available via `http://localhost:${PORT}/api/`


## 1. Installation

```bash
$ npm install
```

## 2. Setting Up Environment Variables

```bash
 cp .env.example .env
```

## 3. Running the dockerized app

```bash
docker compose up --build
```

## 4. Applying Migrations

```bash
$ prisma migrate dev
```
### For dockerized app
```bash
$ npm run migrate:compose
```

## 5. Test

```bash
$ npm run test
```