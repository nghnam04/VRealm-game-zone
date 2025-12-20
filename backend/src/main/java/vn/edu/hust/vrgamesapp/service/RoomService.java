package vn.edu.hust.vrgamesapp.service;

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.hust.vrgamesapp.constant.BookingStatus;
import vn.edu.hust.vrgamesapp.constant.DeviceStatus;
import vn.edu.hust.vrgamesapp.constant.GameGenre;
import vn.edu.hust.vrgamesapp.constant.RoomStatus;
import vn.edu.hust.vrgamesapp.dto.GameDto;
import vn.edu.hust.vrgamesapp.dto.PageResponse;
import vn.edu.hust.vrgamesapp.dto.RoomDto;
import vn.edu.hust.vrgamesapp.entity.Device;
import vn.edu.hust.vrgamesapp.entity.Game;
import vn.edu.hust.vrgamesapp.entity.Room;
import vn.edu.hust.vrgamesapp.mapper.GameMapper;
import vn.edu.hust.vrgamesapp.mapper.RoomMapper;
import vn.edu.hust.vrgamesapp.repository.BookingRepository;
import vn.edu.hust.vrgamesapp.repository.DeviceRepository;
import vn.edu.hust.vrgamesapp.repository.GameRepository;
import vn.edu.hust.vrgamesapp.repository.RoomRepository;
import vn.edu.hust.vrgamesapp.utils.PaginationUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoomService {
    private final RoomRepository roomRepository;
    private final GameRepository gameRepository;
    private final DeviceRepository deviceRepository;
    private final BookingRepository bookingRepository;

    @Transactional
    public RoomDto createRoom(RoomDto roomDto) {
        if (roomDto.getName() == null || roomDto.getName().trim().isEmpty()) {
            throw new RuntimeException("Room name is required");
        }

        Room room = new Room();
        room.setName(roomDto.getName());
        room.setCapacity(roomDto.getCapacity());
        room.setStatus(RoomStatus.AVAILABLE);
        room.setImageUrl(roomDto.getImageUrl());
        room.setDevices(new java.util.ArrayList<>());

        // Add games
        if (roomDto.getGames() != null) {
            List<Game> games = roomDto.getGames().stream()
                    .map(id -> gameRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Game not found with id: " + id)))
                    .collect(Collectors.toList());
            for (Game g : games) {
                if (g.getMaxPlayers() > roomDto.getCapacity()) {
                    throw new RuntimeException("Game maxPlayers exceeds room capacity");
                }
            }

            room.setGames(games);
            for (Game g : games) {
                if (g.getRooms() == null) g.setRooms(new ArrayList<>());
                g.getRooms().add(room);
            }
        }

        room = roomRepository.save(room);

        // Add devices
        if (roomDto.getDevices() != null) {
            for (Long deviceId : roomDto.getDevices()) {
                Device device = deviceRepository.findById(deviceId)
                        .orElseThrow(() -> new RuntimeException("Device not found with id: " + deviceId));
                if (device.getStatus() != DeviceStatus.AVAILABLE) {
                    throw new RuntimeException("Only AVAILABLE devices can be assigned to a new room");
                }
                if (device.getRoom() != null) {
                    throw new RuntimeException("Device already assigned to another room");
                }
                device.setRoom(room);
                deviceRepository.save(device);
                room.getDevices().add(device);
            }
        }

        return RoomMapper.mapToRoomDto(room);
    }

    public RoomDto getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
        return RoomMapper.mapToRoomDto(room);
    }

    public PageResponse<RoomDto> getAllRooms(
            int pageNo, int pageSize, String sortBy, String sortDir,
            String status, String name,
            Integer minCapacity, Integer maxCapacity
            ) {

        Pageable pageable = PaginationUtils.buildPageable(pageNo, pageSize, sortBy, sortDir);

        Specification<Room> spec = Specification.where(null);

        if (status != null && !status.isEmpty()) {
            try {
                RoomStatus s = RoomStatus.valueOf(status.toUpperCase());
                spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), s));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + status);
            }
        }

        if (name != null && !name.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        if (minCapacity != null) spec = spec.and((root, query, cb) -> cb.ge(root.get("duration"), minCapacity));
        if (maxCapacity != null) spec = spec.and((root, query, cb) -> cb.le(root.get("duration"), maxCapacity));

        Page<Room> page = roomRepository.findAll(spec, pageable);

        List<RoomDto> content = page.getContent().stream()
                .map(RoomMapper::mapToRoomDto)
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
    public RoomDto updateRoom(Long id, RoomDto roomDto) {
        Room existing = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        if (existing.getStatus() == RoomStatus.IN_USE || existing.getStatus() == RoomStatus.MAINTENANCE || existing.getStatus() == RoomStatus.BOOKED) {
            throw new RuntimeException("Cannot update room IN_USE or MAINTENANCE");
        }

        if (roomDto.getName() == null || roomDto.getName().trim().isEmpty()) {
            throw new RuntimeException("Room name is required");
        }

        if (roomDto.getStatus() == null) {
            throw new RuntimeException("Room status is required");
        }

        existing.setName(roomDto.getName());
        existing.setCapacity(roomDto.getCapacity());
        existing.setStatus(roomDto.getStatus());
        existing.setImageUrl(roomDto.getImageUrl());

        // Update games
        if (roomDto.getGames() != null) {
            // Remove old games from the room
            if (existing.getGames() != null) {
                for (Game g : existing.getGames()) {
                    if (g.getRooms() != null) g.getRooms().remove(existing);
                }
            }

            List<Game> games = roomDto.getGames().stream()
                    .map(gameId -> gameRepository.findById(gameId)
                            .orElseThrow(() -> new RuntimeException("Game not found with id: " + gameId)))
                    .collect(Collectors.toList());
            for (Game g : games) {
                if (g.getMaxPlayers() > roomDto.getCapacity()) {
                    throw new RuntimeException("Game maxPlayers exceeds room capacity");
                }
            }

            existing.setGames(games);
            for (Game g : games) {
                if (g.getRooms() == null) g.setRooms(new ArrayList<>());
                if (!g.getRooms().contains(existing)) g.getRooms().add(existing);
                gameRepository.save(g);
            }
        }

        // Update devices
        if (roomDto.getDevices() != null) {
            // Remove old devices from room
            if (existing.getDevices() != null) {
                for (Device d : existing.getDevices()) {
                    d.setRoom(null);
                    deviceRepository.save(d);
                }
            } else {
                existing.setDevices(new java.util.ArrayList<>());
            }

            // Add new devices
            for (Long deviceId : roomDto.getDevices()) {
                Device device = deviceRepository.findById(deviceId)
                        .orElseThrow(() -> new RuntimeException("Device not found with id: " + deviceId));
                if (device.getStatus() != DeviceStatus.AVAILABLE) {
                    throw new RuntimeException("Only AVAILABLE devices can be assigned");
                }
                if (device.getRoom() != null) {
                    throw new RuntimeException("Device already assigned to another room");
                }
                device.setRoom(existing);
                deviceRepository.save(device);
                existing.getDevices().add(device);
            }
        }

        return RoomMapper.mapToRoomDto(roomRepository.save(existing));
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        if (room.getStatus() == RoomStatus.IN_USE || room.getStatus() == RoomStatus.BOOKED) {
            throw new RuntimeException("Cannot delete room IN_USE");
        }

        boolean hasActiveBooking = bookingRepository.existsByRoomIdAndStatusIn(
                id, List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.CANCELLED)
        );
        if (hasActiveBooking) {
            throw new RuntimeException("Cannot delete room with active bookings");
        }

        // Remove devices from room
        if (room.getDevices() != null) {
            for (Device device : room.getDevices()) {
                device.setRoom(null);
                deviceRepository.save(device);
            }
        }

        // Remove games from room
        if (room.getGames() != null) {
            for (Game game : room.getGames()) {
                if (game.getRooms() != null) game.getRooms().remove(room);
            }
        }

        roomRepository.delete(room);
    }
}

