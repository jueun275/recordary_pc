package com.fairy_pitt.recordary.common.post;

import com.fairy_pitt.recordary.common.domain.PostEntity;
import com.fairy_pitt.recordary.common.domain.PostTagEntity;
import com.fairy_pitt.recordary.common.domain.UserEntity;
import com.fairy_pitt.recordary.common.repository.PostRepository;
import com.fairy_pitt.recordary.common.repository.PostTagRepository;
import com.fairy_pitt.recordary.common.repository.UserRepository;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PostTagRepositoryTest {

    @Autowired
    PostTagRepository postTagRepository;
    @Autowired
    PostRepository postRepository;
    @Autowired
    UserRepository userRepository;

    @After
    public void cleanup(){
        postTagRepository.deleteAll();
        postRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void 게시글태그_불러오기(){
        //given
        UserEntity user1 = userRepository.save(UserEntity.builder()
                .userId("testUser1")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());
        UserEntity user2 = userRepository.save(UserEntity.builder()
                .userId("testUser2")
                .userPw("testPassword")
                .userNm("테스트 유저2")
                .build());
        UserEntity user3 = userRepository.save(UserEntity.builder()
                .userId("testUser3")
                .userPw("testPassword")
                .userNm("테스트 유저3")
                .build());

        PostEntity postEntity = postRepository.save(PostEntity.builder()
                .userFK(user1)
                .postEx("테스트 게시글")
                .postPublicState(1)
                .postScheduleShareState(false)
                .build());

        postTagRepository.save(PostTagEntity.builder()
                .postFK(postEntity)
                .userFK(user2)
                .build());

        //when
        List<PostTagEntity> postTagEntityList = postTagRepository.findAll();

        //then
        PostTagEntity postTagEntity = postTagEntityList.get(0);
        assertThat(postTagEntity.getPostFK().getPostCd()).isEqualTo(postEntity.getPostCd());
        assertThat(postTagEntity.getUserFK().getUserCd()).isEqualTo(user2.getUserCd());
    }

    @Test
    public void BaseTime_등록() {
        //given
        LocalDateTime now = LocalDateTime.of(2020, 3, 11, 0, 0, 0);

        UserEntity user1 = userRepository.save(UserEntity.builder()
                .userId("testUser1")
                .userPw("testPassword")
                .userNm("테스트 유저1")
                .build());

        UserEntity user2 = userRepository.save(UserEntity.builder()
                .userId("testUser2")
                .userPw("testPassword")
                .userNm("테스트 유저2")
                .build());

        PostEntity postEntity = postRepository.save(PostEntity.builder()
                .userFK(user1)
                .postEx("테스트 게시글")
                .postPublicState(1)
                .postScheduleShareState(false)
                .build());

        postTagRepository.save(PostTagEntity.builder()
                .postFK(postEntity)
                .userFK(user2)
                .build());
        //when
        List<PostTagEntity> postTagEntityList = postTagRepository.findAll();

        //then
        PostTagEntity postTagEntity = postTagEntityList.get(0);

        System.out.println(">>>>>>>>> createDate=" + postTagEntity.getCreatedDate() + ", modifiedDate=" + postTagEntity.getModifiedDate());

        assertThat(postTagEntity.getCreatedDate()).isAfter(now);
        assertThat(postTagEntity.getModifiedDate()).isAfter(now);
    }
}
