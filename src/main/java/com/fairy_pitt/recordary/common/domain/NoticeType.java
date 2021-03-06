package com.fairy_pitt.recordary.common.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum NoticeType {

    // activeCd = 팔로우한 사용자 코드 / targetCd = 팔로우된 사용자 코드
    @JsonProperty("FOLLOW_NEW")
    FOLLOW_NEW, // 사용자를 누군가 팔로우 했을 경우


    // activeCd = 신청한 사용자 코드 / targetCd = 신청된 그룹 코드
    @JsonProperty("GROUP_APPLY_COME")
    GROUP_APPLY_COME, // 사용자가 mst인 그룹에 누군가 신청했을 경우

    // activeCd = 초대한 그룹 코드 / targetCd = 초대된 사용자 코드
    @JsonProperty("GROUP_APPLY_INVITE")
    GROUP_APPLY_INVITE, // 사용자가 그룹에 초대되었을 경우

    // activeCd = 거절한 그룹 코드 / targetCd = 거절된 사용자 코드
    @JsonProperty("GROUP_APPLY_COME_NOT")
    GROUP_APPLY_COME_NOT, // GROUP_APPLY_COME 거절될 경우

    // activeCd = 거절한 사용자 코드 / targetCd = 거절된 그룹 코드
    @JsonProperty("GROUP_APPLY_INVITE_NOT")
    GROUP_APPLY_INVITE_NOT, // GROUP_APPLY_INVITE 거절될 경우


    // activeCd = 그룹 코드 / targetCd = 멤버가 된 사용자 코드
    @JsonProperty("GROUP_MEMBER_ALLOW")
    GROUP_MEMBER_ALLOW, // 사용자가 그룹 멤버가 되었을 경우 (GROUP_APPLY_COME 허락될 경우와 같다)

    // activeCd = 멤버가 된 사용자 코드 / targetCd = 그룹 코드
    @JsonProperty("GROUP_MEMBER_NEW")
    GROUP_MEMBER_NEW, // 사용자가 mst인 그룹의 멤버가 추가될 경우 (GROUP_APPLY_INVITE 허락될 경우와 같다)

    // activeCd = 탈퇴한 사용자 코드 / targetCd = 그룹 코드
    @JsonProperty("GROUP_MEMBER_AWAY")
    GROUP_MEMBER_AWAY, // 사용자가 mst인 그룹의 멤버가 탈퇴할 경우

    // activeCd = 그룹 코드 / targetCd = 탈퇴당한 사용자 코드
    @JsonProperty("GROUP_MEMBER_OUT")
    GROUP_MEMBER_OUT, // 그룹의 멤버가 mst에 의해 탈퇴 당할 경우


    // activeCd = 좋아요한 사용자 코드 / targetCd = 좋아요된 게시물 코드
    @JsonProperty("POST_LIKE_NEW")
    POST_LIKE_NEW, // 사용자의 게시물에 누군가 좋아요 할 경우


    // activeCd = 스케줄 코드 / targetCd = 신청된 사용자 코드
    @JsonProperty("SCHEDULE_MEMBER_INVITE")
    SCHEDULE_MEMBER_INVITE, // 사용자가 일정 멤버로 초대될 경우

    // activeCd = 거절한 사용자 코드 / targetCd = 스케줄 코드
    @JsonProperty("SCHEDULE_MEMBER_INVITE_NOT")
    SCHEDULE_MEMBER_INVITE_NOT, // SCHEDULE_MEMBER_INVITE 거절될 경우

    // activeCd = 멤버가 된 사용자 코드 / targetCd = 스케줄 코드
    @JsonProperty("SCHEDULE_MEMBER_ALLOW")
    SCHEDULE_MEMBER_ALLOW, // 사용자의 일정에 멤버가 추가될 시 (SCHEDULE_MEMBER_INVITE 허락될 경우와 같다)


    // activeCd = 댓글 코드 / targetCd = 게시물 코드
    @JsonProperty("COMMENT_NEW")
    COMMENT_NEW, // 사용자의 게시물에 누군가 댓글을 등록할 경우

    // activeCd = 대댓글 코드 / targetCd = 댓글 코드
    @JsonProperty("COMMENT_SUB_NEW")
    COMMENT_SUB_NEW, // 사용자의 댓글에 누군가 대댓글을 등록할 경우
}
