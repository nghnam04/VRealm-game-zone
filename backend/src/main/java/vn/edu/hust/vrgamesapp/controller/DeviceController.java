package vn.edu.hust.vrgamesapp.controller;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.hust.vrgamesapp.dto.DeviceDto;
import vn.edu.hust.vrgamesapp.dto.GameDto;
import vn.edu.hust.vrgamesapp.dto.PageResponse;
import vn.edu.hust.vrgamesapp.service.DeviceService;
import vn.edu.hust.vrgamesapp.utils.AppConstants;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@AllArgsConstructor
public class DeviceController {
    private DeviceService deviceService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeviceDto> createDevice(@Valid @RequestBody DeviceDto deviceDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deviceService.createDevice(deviceDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDto> getDeviceById(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getDeviceById(id));
    }

    @GetMapping
    public ResponseEntity<PageResponse<DeviceDto>> getAllDevices(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION) String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String roomName,
            @RequestParam(required = false) Integer minQuantity,
            @RequestParam(required = false) Integer maxQuantity
    ) {
        return ResponseEntity.ok(deviceService.getAllDevices(
                pageNo, pageSize, sortBy, sortDir,
                name, type, status, roomName,
                minQuantity, maxQuantity
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DeviceDto> updateDevice(@PathVariable Long id, @Valid @RequestBody DeviceDto deviceDto) {
        return ResponseEntity.ok(deviceService.updateDevice(id, deviceDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.ok("Device deleted successfully");
    }
}