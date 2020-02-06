package com.fairy_pitt.recordary.common.entity;

import com.fairy_pitt.recordary.common.pk.GroupMemberPK;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name="GROUP_MEMBER_TB")
@NoArgsConstructor
@AllArgsConstructor
@IdClass(GroupMemberPK.class)
public class GroupMemberEntity implements Serializable {

    @Id
    @ManyToOne
    private GroupEntity groupCodeFK;

    @Id
    @ManyToOne
    private UserEntity userCodeFK;
}
