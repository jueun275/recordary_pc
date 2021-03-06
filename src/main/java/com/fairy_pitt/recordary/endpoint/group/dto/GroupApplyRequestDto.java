package com.fairy_pitt.recordary.endpoint.group.dto;

import com.fairy_pitt.recordary.common.domain.GroupApplyEntity;
import com.fairy_pitt.recordary.common.domain.GroupEntity;
import com.fairy_pitt.recordary.common.domain.UserEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GroupApplyRequestDto {

    private Long groupCd;
    private Long userCd;
    private int applyState;

    @Builder
    public GroupApplyRequestDto(Long userCd, Long groupCd, int applyState)
    {
        this.groupCd = groupCd;
        this.userCd = userCd;
        this.applyState =  applyState;
    }

    public GroupApplyEntity toEntity(UserEntity user, GroupEntity group){
        return GroupApplyEntity.builder()
                .groupFK(group)
                .userFK(user)
                .applyState(applyState)
                .build();
    }
}
