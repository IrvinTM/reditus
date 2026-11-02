# Reditus

Monorepo for the Reditus POS system.

| Path | What | Deploy |
|------|------|--------|
| [`backend/`](backend) | Spring Boot API (Java 17, Maven) | Cloud Run via `cloudbuild.yaml` |
| [`frontend/`](frontend) | Reditus — React + Vite UI | Firebase Hosting (`firebase deploy` from `frontend/`) |

## Local development

```bash
# backend
cd backend && cp src/main/resources/application.properties.example src/main/resources/application.properties
./mvnw spring-boot:run

# frontend
cd frontend && cp .env.example .env
npm install && npm run dev
```
