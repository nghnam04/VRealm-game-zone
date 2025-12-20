package vn.edu.hust.vrgamesapp.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.edu.hust.vrgamesapp.dto.GameDto;
import vn.edu.hust.vrgamesapp.dto.PageResponse;
import vn.edu.hust.vrgamesapp.service.GameService;
import vn.edu.hust.vrgamesapp.utils.AppConstants;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class GameController {
    @Autowired
    private GameService gameService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GameDto> createGame(@Valid @RequestBody GameDto gameDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gameService.createGame(gameDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameDto> getGameById(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.getGameById(id));
    }

    @GetMapping
    public ResponseEntity<PageResponse<GameDto>> getAllGames(
            @RequestParam(value = "pageNo", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(value = "sortDir", defaultValue = AppConstants.DEFAULT_SORT_DIRECTION) String sortDir,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Integer minDuration,
            @RequestParam(required = false) Integer maxDuration,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Integer minPlayers,
            @RequestParam(required = false) Integer maxPlayers
    ) {
        return ResponseEntity.ok(gameService.getAllGames(
                pageNo, pageSize, sortBy, sortDir,
                genre, name, minDuration, maxDuration,
                minPrice, maxPrice, minPlayers, maxPlayers
        ));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GameDto> updateGame(@PathVariable Long id, @Valid @RequestBody GameDto gameDto) {
        return ResponseEntity.ok(gameService.updateGame(id, gameDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return ResponseEntity.ok("Game deleted successfully");
    }
}