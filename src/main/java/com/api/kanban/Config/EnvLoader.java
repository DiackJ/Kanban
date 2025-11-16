package com.api.kanban.Config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvLoader {
    public static void loadEnv() {
        Dotenv dotenv;
        dotenv = Dotenv.configure()
                .directory("./")
                .filename(".env")
                .load();

        System.setProperty("SPRING_DATASOURCE_URL", dotenv.get("SPRING_DATASOURCE_URL"));
        System.setProperty("SPRING_DATASOURCE_USERNAME", dotenv.get("SPRING_DATASOURCE_USERNAME"));
        System.setProperty("SPRING_DATASOURCE_PASSWORD", dotenv.get("SPRING_DATASOURCE_PASSWORD"));
        System.setProperty("SPRING_JPA_HIBERNATE_DDL_AUTO", dotenv.get("SPRING_JPA_HIBERNATE_DDL_AUTO"));
        System.setProperty("SPRING_JPA_SHOW_SQL", dotenv.get("SPRING_JPA_SHOW_SQL"));
        System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
        System.setProperty("SPRING_MAIL_HOST", dotenv.get("SPRING_MAIL_HOST"));
        System.setProperty("SPRING_MAIL_HOST_TEST", dotenv.get("SPRING_MAIL_HOST_TEST"));
        System.setProperty("SPRING_MAIL_PORT", dotenv.get("SPRING_MAIL_PORT"));
    }
}