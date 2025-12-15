package vn.edu.hust.vrgamesapp.service;

import jakarta.annotation.PreDestroy;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.hust.vrgamesapp.VrgamesappApplication;
import vn.edu.hust.vrgamesapp.entity.StatusLog;
import vn.edu.hust.vrgamesapp.repository.StatusLogRepository;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class ApplicationService {
    private final StatusLogRepository repo;

    // graceful shutdown (automatically)
    @PreDestroy
    public void onShutdown() {
        repo.save(new StatusLog(
                "server", "DOWN",
                LocalDateTime.now(),
                "Application shutting down"
        ));
    }

    public void onStartup() {
        repo.save(new StatusLog(
                "server", "UP",
                LocalDateTime.now(),
                "Application started"
        ));
    }

    public void restart() {
        repo.save(new StatusLog(
                "server", "UP", LocalDateTime.now(), "Restart triggered"
        ));

        VrgamesappApplication.restart();
    }

    // shutdown is triggered (manually)
    public void shutdown() {
        repo.save(new StatusLog(
                "server", "DOWN", LocalDateTime.now(), "Shutdown triggered"
        ));
        System.exit(0);
    }
}
