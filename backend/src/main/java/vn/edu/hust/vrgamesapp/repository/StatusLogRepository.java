package vn.edu.hust.vrgamesapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import vn.edu.hust.vrgamesapp.entity.StatusLog;

import java.time.LocalDateTime;
import java.util.List;

public interface StatusLogRepository extends JpaRepository<StatusLog, Long> {
    List<StatusLog> findTop10ByOrderByTimestampDesc();

    List<StatusLog> findByComponentOrderByTimestampDesc(String component);

    List<StatusLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime from, LocalDateTime to);

    List<StatusLog> findByComponentAndTimestampBetweenOrderByTimestampDesc(
            String component,
            LocalDateTime from,
            LocalDateTime to
    );

    void deleteByTimestampBefore(LocalDateTime cutTime);
}
