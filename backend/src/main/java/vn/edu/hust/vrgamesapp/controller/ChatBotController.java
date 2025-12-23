package vn.edu.hust.vrgamesapp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.edu.hust.vrgamesapp.service.ChatBotService;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatBotController {

    private final ChatBotService chatService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> askAi(@RequestBody Map<String, String> payload, Authentication authentication) {
        String userMessage = payload.get("message");
        String response = chatService.processMessage(userMessage, authentication);
        return ResponseEntity.ok(Map.of("response", response));
    }
}