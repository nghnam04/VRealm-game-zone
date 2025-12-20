package vn.edu.hust.vrgamesapp.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.edu.hust.vrgamesapp.dto.BookingDto;
import vn.edu.hust.vrgamesapp.dto.PageResponse;
import vn.edu.hust.vrgamesapp.service.BookingService;
import vn.edu.hust.vrgamesapp.utils.AppConstants;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@AllArgsConstructor
public class BookingController {
    private BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingDto> createBooking(@Valid @RequestBody BookingDto bookingDto, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(bookingDto, authentication.getName()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'CUSTOMER')")
    public ResponseEntity<BookingDto> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<BookingDto>> getAllBookings(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = AppConstants.DEFAULT_SORT_DIRECTION) String sortDir,
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String gameName,
            @RequestParam(required = false) String roomName,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) Integer minGameDuration,
            @RequestParam(required = false) Integer maxGameDuration,
            @RequestParam(required = false) LocalDate minStartTime,
            @RequestParam(required = false) LocalDate maxStartTime,
            @RequestParam(required = false) Integer minPlayers,
            @RequestParam(required = false) Integer maxPlayers,
            @RequestParam(required = false) Double minTotalAmount,
            @RequestParam(required = false) Double maxTotalAmount
    ) {
        return ResponseEntity.ok(
                bookingService.getAllBookings(
                        pageNo, pageSize, sortBy, sortDir,
                        userName, gameName, roomName,
                        status, paymentStatus,
                        minGameDuration, maxGameDuration,
                        minStartTime, maxStartTime,
                        minPlayers, maxPlayers,
                        minTotalAmount, maxTotalAmount
                )
        );
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<BookingDto>> getUserBookings(Authentication authentication) {
        return ResponseEntity.ok(bookingService.getUserBookings(authentication.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<BookingDto> updateBooking(@PathVariable Long id, @Valid @RequestBody BookingDto bookingDto, Authentication authentication) {
        return ResponseEntity.ok(bookingService.updateBooking(id, bookingDto, authentication.getName()));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    public ResponseEntity<BookingDto> cancelBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDto> acceptBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.acceptBooking(id));
    }

    @PatchMapping("/{id}/pay")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<BookingDto> confirmPayment(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.confirmPayment(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }
}