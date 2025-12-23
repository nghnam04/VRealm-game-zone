package vn.edu.hust.vrgamesapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import vn.edu.hust.vrgamesapp.entity.StatusLog;
import vn.edu.hust.vrgamesapp.repository.StatusLogRepository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatusService {
    private final DataSource dataSource;
    private final StatusLogRepository statusLogRepository;
    private RedisConnectionFactory redisConnectionFactory;

    private Map<String, String> lastStatus = new HashMap<>();

    @Autowired
    public StatusService(DataSource dataSource, StatusLogRepository statusLogRepository, RedisConnectionFactory redisConnectionFactory) {
        this.dataSource = dataSource;
        this.statusLogRepository = statusLogRepository;
        this.redisConnectionFactory = redisConnectionFactory;
    }

    // 5 mins
    @Scheduled(fixedRate = 300000)
    public Map<String, String> checkStatus() {

        String dbStatus = getDatabaseStatus();
        String redisStatus = getRedisStatus();
        String serverStatus = "UP";

        Map<String, String> currentStatus = Map.of(
                "database", dbStatus,
                "server", serverStatus,
                "redis", redisStatus
        );

        logStatusChanges(currentStatus);

        return currentStatus;
    }

    private String getDatabaseStatus() {
        try (Connection con = dataSource.getConnection()) {
            return (con != null && con.isValid(5)) ? "OK" : "UNAVAILABLE";
        } catch (SQLException e) {
            return "ERROR";
        }
    }

    private String getRedisStatus() {
        try {
            RedisConnection connection = redisConnectionFactory.getConnection();
            connection.ping();
            connection.close();
            return "OK";
        } catch (Exception e) {
            return "ERROR";
        }
    }


    private void logStatusChanges(Map<String, String> currentStatus) {
        for (var entry : currentStatus.entrySet()) {

            String component = entry.getKey();
            String newStatus = entry.getValue();

            // write log for first time or status changing
            if (!lastStatus.containsKey(component) || !lastStatus.get(component).equals(newStatus)) {

                String message = lastStatus.containsKey(component)
                        ? "Status changed from " + lastStatus.get(component) + " to " + newStatus
                        : "Initial status check";

                StatusLog log = new StatusLog(component, newStatus, LocalDateTime.now(), message);
                statusLogRepository.save(log);

                lastStatus.put(component, newStatus);
            }
        }
    }

    public List<StatusLog> getRecentLogs() {
        return statusLogRepository.findTop10ByOrderByTimestampDesc();
    }

    public List<StatusLog> getLogsByComponent(String component) {
        return statusLogRepository.findByComponentOrderByTimestampDesc(component);
    }

    public List<StatusLog> getLogsByTimeRange(LocalDateTime from, LocalDateTime to) {
        return statusLogRepository.findByTimestampBetweenOrderByTimestampDesc(from, to);
    }

    public List<StatusLog> getLogsByComponentAndTimeRange(
            String component, LocalDateTime from, LocalDateTime to
    ) {
        return statusLogRepository.findByComponentAndTimestampBetweenOrderByTimestampDesc(
                component, from, to
        );
    }

    public Map<String, Object> getUptimeStats(int days) {
        LocalDateTime from = LocalDateTime.now().minusDays(days);
        LocalDateTime to = LocalDateTime.now();

        List<StatusLog> logs = statusLogRepository.findByTimestampBetweenOrderByTimestampDesc(from, to);

        long okCount = logs.stream().filter(l -> l.getStatus().equals("OK") || l.getStatus().equals("UP")).count();
        long failCount = logs.stream().filter(l -> !l.getStatus().equals("OK") && !l.getStatus().equals("UP")).count();

        double uptimePercent = logs.size() == 0 ? 100 : (okCount * 100.0 / logs.size());
        double downtimePercent = 100.0 - uptimePercent;

        return Map.of(
                "totalLogs", logs.size(),
                "ok", okCount,
                "fail", failCount,
                "uptime", uptimePercent,
                "downtime", downtimePercent
        );
    }

    // Logs are deleted at 0:00 per day
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupOldLogs() {
        LocalDateTime cutoff =
                LocalDate.now().minusDays(30).atStartOfDay();
        statusLogRepository.deleteByTimestampBefore(cutoff);
    }

}
