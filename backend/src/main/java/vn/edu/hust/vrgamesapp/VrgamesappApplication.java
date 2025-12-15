package vn.edu.hust.vrgamesapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import vn.edu.hust.vrgamesapp.service.ApplicationService;

@SpringBootApplication
@EnableScheduling
public class VrgamesappApplication {
	private static ConfigurableApplicationContext context;

	@Autowired
	private ApplicationService applicationService;

	public static void main(String[] args) {
		context = SpringApplication.run(VrgamesappApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner() {
		return args -> {
			applicationService.onStartup();
			System.out.println("VRGame Application started successfully!");
		};
	}

	public static void restart() {
		ApplicationArguments args = context.getBean(ApplicationArguments.class);

		Thread thread = new Thread(() -> {
			try {
				context.close();
			} catch (Exception e) {
			}
			context = SpringApplication.run(VrgamesappApplication.class, args.getSourceArgs());
		});

		// JVM chờ thread này hoàn thành
		thread.setDaemon(false);
		thread.start();
	}

}
