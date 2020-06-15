package com.fairy_pitt.recordary.common.repository;

import com.fairy_pitt.recordary.common.entity.ChatEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<ChatEntity, Long> {
}
