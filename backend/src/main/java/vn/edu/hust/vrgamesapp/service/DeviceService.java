package vn.edu.hust.vrgamesapp.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.hust.vrgamesapp.constant.BookingStatus;
import vn.edu.hust.vrgamesapp.constant.DeviceStatus;
import vn.edu.hust.vrgamesapp.constant.DeviceType;
import vn.edu.hust.vrgamesapp.constant.GameGenre;
import vn.edu.hust.vrgamesapp.dto.DeviceDto;
import vn.edu.hust.vrgamesapp.dto.GameDto;
import vn.edu.hust.vrgamesapp.dto.PageResponse;
import vn.edu.hust.vrgamesapp.entity.Device;
import vn.edu.hust.vrgamesapp.entity.Game;
import vn.edu.hust.vrgamesapp.entity.Room;
import vn.edu.hust.vrgamesapp.mapper.DeviceMapper;
import vn.edu.hust.vrgamesapp.mapper.GameMapper;
import vn.edu.hust.vrgamesapp.repository.BookingRepository;
import vn.edu.hust.vrgamesapp.repository.DeviceRepository;
import vn.edu.hust.vrgamesapp.repository.RoomRepository;
import vn.edu.hust.vrgamesapp.utils.PaginationUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public DeviceDto createDevice(DeviceDto dto) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new RuntimeException("Device name is required");
        }

        Room room = null;
        if (dto.getRoomId() != null) {
            room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found with id: " + dto.getRoomId()));
            if (deviceRepository.existsByRoomIdAndNameAndType(room.getId(), dto.getName(), dto.getType())) {
                throw new RuntimeException("Device has existed in this room");
            }
        }

        Device device = DeviceMapper.mapToDevice(dto);
        device.setStatus(DeviceStatus.AVAILABLE);
        device.setRoom(room);
        device.setImageUrl(dto.getImageUrl());

        device = deviceRepository.save(device);
        return DeviceMapper.mapToDeviceDto(device);
    }

    public DeviceDto getDeviceById(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found with id: " + id));
        return DeviceMapper.mapToDeviceDto(device);
    }

    public PageResponse<DeviceDto> getAllDevices(
            int pageNo, int pageSize, String sortBy, String sortDir,
            String name, String type, String status, String roomName,
            Integer minQuantity, Integer maxQuantity
    ) {

        Pageable pageable = PaginationUtils.buildPageable(pageNo, pageSize, sortBy, sortDir);

        Specification<Device> spec = Specification.where(null);

        if (type != null && !type.isEmpty()) {
            try {
                DeviceType t = DeviceType.valueOf(type.toUpperCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), t));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid type: " + type);
            }
        }

        if (status != null && !status.isEmpty()) {
            try {
                DeviceStatus s = DeviceStatus.valueOf(status.toUpperCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), s));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + status);
            }
        }

        if (name != null && !name.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        if (roomName != null && !roomName.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root
                    .join("room")
                    .get("name")), "%" + roomName.toLowerCase() + "%"));
        }

        if (minQuantity != null) spec = spec.and((root, query, cb) -> cb.ge(root.get("quantity"), minQuantity));
        if (maxQuantity != null) spec = spec.and((root, query, cb) -> cb.le(root.get("quantity"), maxQuantity));

        Page<Device> page = deviceRepository.findAll(spec, pageable);

        List<DeviceDto> content = page.getContent().stream()
                .map(DeviceMapper::mapToDeviceDto)
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
    public DeviceDto updateDevice(Long id, DeviceDto dto) {
        Device existing = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found with id: " + id));

        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new RuntimeException("Device name is required");
        }

        if (existing.getStatus() == DeviceStatus.IN_USE || existing.getStatus() == DeviceStatus.MAINTENANCE) {
            throw new RuntimeException("IN_USE or MAINTENANCE Device cannot be updated");
        }

        // If move to other rooms, check if rooms exist or not
        Room newRoom = null;
        if (dto.getRoomId() != null) {
            newRoom = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found with id: " + dto.getRoomId()));
        }
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        existing.setQuantity(dto.getQuantity());
        existing.setRoom(newRoom);
        existing.setImageUrl(dto.getImageUrl());

        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }

        existing = deviceRepository.save(existing);
        return DeviceMapper.mapToDeviceDto(existing);
    }

    @Transactional
    public void deleteDevice(Long id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Device not found with id: " + id));

        if (device.getStatus() == DeviceStatus.IN_USE) {
            throw new RuntimeException("IN_USE Device cannot be deleted");
        }

        // Cannot delete device in a room which is in booking process
        if (device.getRoom() != null) {
            boolean hasActive = bookingRepository.existsByRoomIdAndStatusIn(
                    device.getRoom().getId(),
                    List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.CANCELLED)
            );
            if (hasActive) {
                throw new RuntimeException("Cannot delete device when room containing device has active booking");
            }
        }

        deviceRepository.delete(device);
    }
}
