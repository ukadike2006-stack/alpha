# ── Stage 1: Build ────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml first to cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S alpha && adduser -S alpha -G alpha

# Copy the built JAR
COPY --from=build /app/target/alpha-platform-*.jar app.jar

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R alpha:alpha /app
USER alpha

# Railway injects PORT env var
EXPOSE ${PORT:-8080}

# JVM flags for container environments (reduces memory footprint)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
