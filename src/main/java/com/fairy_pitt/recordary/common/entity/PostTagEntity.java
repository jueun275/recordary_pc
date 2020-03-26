package com.fairy_pitt.recordary.common.entity;

import com.fairy_pitt.recordary.common.pk.PostTagPK;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "POST_TAG_TB")
@IdClass(PostTagPK.class)
public class PostTagEntity extends BaseTimeEntity{
    @Id
    @ManyToOne
    @JoinColumn(name = "POST_FK")
    private PostEntity postFK;

    @Id
    @ManyToOne
    @JoinColumn(name = "POST_TAG_USER_FK")
    private UserEntity userFK;

    @Builder
    public PostTagEntity(PostEntity postFK, UserEntity userFK){
        this.postFK = postFK;
        this.userFK = userFK;
    }
}
