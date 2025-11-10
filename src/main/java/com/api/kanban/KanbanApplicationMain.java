package com.api.kanban;

import com.api.kanban.Config.EnvLoader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KanbanApplicationMain {

	static {
		EnvLoader.loadEnv();
	}

	public static void main(String[] args) {

		SpringApplication.run(KanbanApplicationMain.class, args);
	}

}
