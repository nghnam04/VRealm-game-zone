package vn.edu.hust.vrgamesapp.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.edu.hust.vrgamesapp.constant.PaymentStatus;
import vn.edu.hust.vrgamesapp.dto.FeedbackDto;
import vn.edu.hust.vrgamesapp.dto.PageResponse;
import vn.edu.hust.vrgamesapp.entity.Booking;
import vn.edu.hust.vrgamesapp.entity.Feedback;
import vn.edu.hust.vrgamesapp.constant.BookingStatus;
import vn.edu.hust.vrgamesapp.entity.User;
import vn.edu.hust.vrgamesapp.mapper.FeedbackMapper;
import vn.edu.hust.vrgamesapp.repository.BookingRepository;
import vn.edu.hust.vrgamesapp.repository.FeedbackRepository;
import vn.edu.hust.vrgamesapp.repository.UserRepository;
import vn.edu.hust.vrgamesapp.utils.PaginationUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FeedbackService {
    private FeedbackRepository feedbackRepository;
    private BookingRepository bookingRepository;
    private UserRepository userRepository;

    @Transactional
    public FeedbackDto createFeedback(FeedbackDto feedbackDto, String username) {
        Booking booking = bookingRepository.findById(feedbackDto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + feedbackDto.getBookingId()));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        if (!booking.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Only the booking owner can leave feedback");
        }
        if (booking.getStatus() != BookingStatus.ACCEPTED || booking.getPaymentStatus() != PaymentStatus.PAID) {
            throw new RuntimeException("Booking must be accepted and paid to leave feedback");
        }
        if (feedbackDto.getRating() < 1 || feedbackDto.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        if (feedbackRepository.existsByBookingId(feedbackDto.getBookingId())) {
            throw new RuntimeException("Feedback already exists for this booking");
        }
        Feedback feedback = FeedbackMapper.mapToFeedback(feedbackDto);
        feedback.setUser(user);
        feedback.setBooking(booking);
        feedback.setFeedbackDate(LocalDateTime.now());
        feedback = feedbackRepository.save(feedback);
        return FeedbackMapper.mapToFeedbackDto(feedback);
    }

    public List<FeedbackDto> getFeedbacksByUser(String username) {
        return feedbackRepository.findByUserUsername(username).stream()
                .map(FeedbackMapper::mapToFeedbackDto)
                .collect(Collectors.toList());
    }

    public FeedbackDto getFeedbackById(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
        return FeedbackMapper.mapToFeedbackDto(feedback);
    }

    public PageResponse<FeedbackDto> getAllFeedbacks(
            int pageNo, int pageSize, String sortBy, String sortDir,
            String gameName, String roomName,
            Integer minRating, Integer maxRating,
            LocalDate fromDate, LocalDate toDate
    ) {

        Pageable pageable = PaginationUtils.buildPageable(pageNo, pageSize, sortBy, sortDir);

        Specification<Feedback> spec = Specification.where(null);

        if (gameName != null && !gameName.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.join("booking")
                    .join("game")
                    .get("name")), "%" + gameName.toLowerCase() + "%"));
        }

        if (roomName != null && !roomName.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.join("booking")
                    .join("room")
                    .get("name")), "%" + roomName.toLowerCase() + "%"));
        }

        if (minRating != null) {
            spec = spec.and((root, query, cb) ->
                    cb.ge(root.get("rating"), minRating)
            );
        }

        if (maxRating != null) {
            spec = spec.and((root, query, cb) ->
                    cb.le(root.get("rating"), maxRating)
            );
        }

        if (fromDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("feedbackDate"), fromDate.atStartOfDay())
            );
        }

        if (toDate != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("feedbackDate"), toDate.atTime(23, 59, 59))
            );
        }

        Page<Feedback> page = feedbackRepository.findAll(spec, pageable);

        List<FeedbackDto> content = page.getContent().stream()
                .map(FeedbackMapper::mapToFeedbackDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                (int) page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional
    public FeedbackDto updateFeedback(Long id, FeedbackDto feedbackDto, String username) {
        Feedback existing = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        if (!existing.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Only the feedback owner can update");
        }
        if (feedbackDto.getRating() < 1 || feedbackDto.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        existing.setRating(feedbackDto.getRating());
        existing.setComment(feedbackDto.getComment());
        existing.setFeedbackDate(LocalDateTime.now());
        existing = feedbackRepository.save(existing);
        return FeedbackMapper.mapToFeedbackDto(existing);
    }

    @Transactional
    public void deleteFeedback(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));

        if (feedback.getBooking() != null) {
            feedback.getBooking().setFeedback(null);
        }
        feedbackRepository.delete(feedback);

    }
}