package vn.edu.hust.vrgamesapp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "status_logs")
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class StatusLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(nullable = false)
    private String component;

    @NonNull
    @Column(nullable = false)
    private String status;

    @NonNull
    @Column(nullable = false)
    private LocalDateTime timestamp;

    @NonNull
    private String message;
}
