package com.alpha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class AlphaPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(AlphaPlatformApplication.class, args);
        System.out.println("\n" + "=".repeat(60));
        System.out.println("ALPHA Platform — Digital Entrepreneurship Ecosystem");
        System.out.println("API Base URL: http://localhost:8080/api");
        System.out.println("Health URL: http://localhost:8080/api/health");
        System.out.println("H2 Console: http://localhost:8080/h2-console");
        System.out.println("=".repeat(60) + "\n");
    }
}
