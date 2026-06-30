package com.alpha.controller;

import com.alpha.model.Message;
import com.alpha.model.User;
import com.alpha.repository.MessageRepository;
import com.alpha.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageController(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public record SendMessageRequest(Long recipientId, String content) {}

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody SendMessageRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User sender = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        User recipient = userRepository.findById(request.recipientId()).orElse(null);
        if (recipient == null) return ResponseEntity.badRequest().body("Recipient not found");

        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .content(request.content())
                .sentAt(LocalDateTime.now())
                .read(false)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(messageRepository.save(message));
    }

    @GetMapping("/inbox")
    public ResponseEntity<?> getInbox(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(messageRepository.findByRecipientOrderBySentAtDesc(user));
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<?> getConversation(@PathVariable Long userId, @AuthenticationPrincipal UserDetails userDetails) {
        User userA = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        User userB = userRepository.findById(userId).orElse(null);
        if (userB == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(messageRepository.findConversation(userA, userB));
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Message message = messageRepository.findById(id).orElse(null);
        if (message == null) return ResponseEntity.notFound().build();

        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        if (!message.getRecipient().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        message.setRead(true);
        message.setReadAt(LocalDateTime.now());
        return ResponseEntity.ok(messageRepository.save(message));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        long count = messageRepository.countByRecipientAndRead(user, false);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }
}
