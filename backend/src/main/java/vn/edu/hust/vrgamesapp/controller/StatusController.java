package vn.edu.hust.vrgamesapp.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.hust.vrgamesapp.service.StatusService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/status")
@AllArgsConstructor
public class StatusController {
    private final StatusService service;

    @GetMapping
    public ResponseEntity<?> getStatus() {
        return ResponseEntity.ok(service.checkStatus());
    }

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs(
            @RequestParam(defaultValue = "30") int dayCount
    ) {
        return ResponseEntity.ok(
                service.getLogsByTimeRange(
                        LocalDateTime.now().minusDays(dayCount),
                        LocalDateTime.now()
                )
        );
    }

    @GetMapping("/logs/{component}")
    public ResponseEntity<?> getLogsByComponent(
            @PathVariable String component,
            @RequestParam(defaultValue = "30") int dayCount
    ) {
        return ResponseEntity.ok(
                service.getLogsByComponentAndTimeRange(
                        component,
                        LocalDateTime.now().minusDays(dayCount),
                        LocalDateTime.now()
                )
        );
    }

    @GetMapping("/uptime")
    public ResponseEntity<?> getUptime(
            @RequestParam(defaultValue = "30") int days
    ) {
        return ResponseEntity.ok(service.getUptimeStats(days));
    }

}
