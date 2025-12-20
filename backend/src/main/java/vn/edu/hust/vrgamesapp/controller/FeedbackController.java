package vn.edu.hust.vrgamesapp.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.edu.hust.vrgamesapp.dto.FeedbackDto;
import vn.edu.hust.vrgamesapp.dto.PageResponse;
import vn.edu.hust.vrgamesapp.service.FeedbackService;
import vn.edu.hust.vrgamesapp.utils.AppConstants;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@AllArgsConstructor
public class FeedbackController {
    private FeedbackService feedbackService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<FeedbackDto> createFeedback(@Valid @RequestBody FeedbackDto feedbackDto, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.createFeedback(feedbackDto, authentication.getName()));
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<FeedbackDto>> getMyFeedbacks(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(feedbackService.getFeedbacksByUser(username));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public ResponseEntity<FeedbackDto> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getFeedbackById(id));
    }

    @GetMapping
    public ResponseEntity<PageResponse<FeedbackDto>> getAllFeedbacks(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION) String sortDir,
            @RequestParam(required = false) String gameName,
            @RequestParam(required = false) String roomName,
            @RequestParam(required = false) Integer minRating,
            @RequestParam(required = false) Integer maxRating,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate
            ) {
        return ResponseEntity.ok(feedbackService.getAllFeedbacks(
                pageNo, pageSize, sortBy, sortDir,
                gameName, roomName,
                minRating, maxRating, fromDate, toDate
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<FeedbackDto> updateFeedback(@PathVariable Long id, @Valid @RequestBody FeedbackDto feedbackDto, Authentication authentication) {
        return ResponseEntity.ok(feedbackService.updateFeedback(id, feedbackDto, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok("Feedback deleted successfully");
    }
}