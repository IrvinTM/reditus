# Build
FROM maven:3.8.3-openjdk-17 AS build

WORKDIR /app

RUN git clone https://github.com/IrvinTM/pos.git .

RUN mvn clean package -DskipTests

#Run
FROM eclipse-temurin:17-jdk

WORKDIR /app

EXPOSE 8080

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]
