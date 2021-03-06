package com.fairy_pitt.recordary.common.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "CHAT_ROOM_TB")
public class ChatRoomEntity extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHAT_ROOM_CD")
    private Long roomCd;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CHAT_ROOM_USER_FK")
    private UserEntity userFK;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CHAT_ROOM_TARGET_FK")
    private UserEntity targetFK;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CHAT_ROOM_GROUP_FK")
    private GroupEntity groupFK;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "roomFK", cascade = CascadeType.REMOVE)
    private List<ChatEntity> chatList = new ArrayList<>();

    @Builder
    public ChatRoomEntity(UserEntity userFK,
                          UserEntity targetFK,
                          GroupEntity groupFK)
    {
        this.userFK = userFK;
        this.targetFK = targetFK;
        this.groupFK = groupFK;
    }
}
