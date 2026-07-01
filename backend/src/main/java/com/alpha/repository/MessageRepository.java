package com.alpha.repository;

import com.alpha.model.Message;
import com.alpha.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientOrderBySentAtDesc(User recipient);
    long countByRecipientAndRead(User recipient, boolean read);

    @Query("SELECT m FROM Message m WHERE " +
           "(m.sender = :userA AND m.recipient = :userB) OR " +
           "(m.sender = :userB AND m.recipient = :userA) ORDER BY m.sentAt ASC")
    List<Message> findConversation(@Param("userA") User userA, @Param("userB") User userB);
}
