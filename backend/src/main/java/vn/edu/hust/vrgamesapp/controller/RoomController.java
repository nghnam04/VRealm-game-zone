package vn.edu.hust.vrgamesapp.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.hust.vrgamesapp.dto.PageResponse;
import vn.edu.hust.vrgamesapp.dto.RoomDto;
import vn.edu.hust.vrgamesapp.service.RoomService;
import vn.edu.hust.vrgamesapp.utils.AppConstants;

@RestController
@RequestMapping("/api/rooms")
@AllArgsConstructor
public class RoomController {
    private RoomService roomService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomDto> createRoom(@Valid @RequestBody RoomDto roomDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(roomDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDto> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping
    public ResponseEntity<PageResponse<RoomDto>> getAllGames(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION) String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) Integer maxCapacity
    ) {
        return ResponseEntity.ok(roomService.getAllRooms(
                pageNo, pageSize, sortBy, sortDir,
                status, name, minCapacity, maxCapacity
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomDto> updateRoom(@PathVariable Long id, @Valid @RequestBody RoomDto roomDto) {
        return ResponseEntity.ok(roomService.updateRoom(id, roomDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Room deleted successfully");
    }
}