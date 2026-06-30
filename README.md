# ALPHA Platform — Digital Entrepreneurship Ecosystem

ALPHA Platform is a Java Spring Boot REST API backend designed to connect African early-stage founders with funding opportunities, investors, and mentors.

## Tech Stack

- **Java:** 21
- **Spring Boot:** 3.2.5
- **Security:** Spring Security + JWT
- **Database:** H2 (In-memory) for development
- **ORM:** Spring Data JPA / Hibernate
- **Build Tool:** Maven

## Getting Started

### Prerequisites

- Java 21
- Maven 3.8+

### Running the Application

You can start the application using the Maven wrapper:

```bash
mvn spring-boot:run
```

The application will be available at `http://localhost:8080`.

### API Documentation & Tools

- **Health Check:** `http://localhost:8080/api/health`
- **H2 Console:** `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:alphadb`, Username: `sa`, Password: `[empty]`)
- **Public Opportunities:** `http://localhost:8080/api/opportunities/public`

## Test Credentials (Auto-seeded)

| Role | Email | Password |
|---|---|---|
| ADMIN | `admin@alpha.com` | `Admin@1234` |
| INVESTOR | `investor@alpha.com` | `Invest@1234` |
| MENTOR | `mentor@alpha.com` | `Mentor@1234` |
| FOUNDER | `founder@alpha.com` | `Found@1234` |

## Project Structure

```
src/main/java/com/alpha/
├── AlphaPlatformApplication.java
├── config/             # Security and Data seeding configuration
├── controller/         # REST API Controllers
├── dto/                # Data Transfer Objects / Records
├── model/              # JPA Entities and Enums
├── repository/         # Spring Data JPA Repositories
├── service/            # Business Logic Services
└── util/               # Utility classes (JWT, etc.)
```
