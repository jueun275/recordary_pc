package com.fairy_pitt.recordary.endpoint.group;

import com.fairy_pitt.recordary.common.domain.GroupEntity;
import com.fairy_pitt.recordary.common.domain.GroupMemberEntity;
import com.fairy_pitt.recordary.common.domain.UserEntity;
import com.fairy_pitt.recordary.common.repository.GroupMemberRepository;
import com.fairy_pitt.recordary.common.repository.GroupRepository;
import com.fairy_pitt.recordary.common.repository.PostRepository;
import com.fairy_pitt.recordary.common.repository.UserRepository;
import com.fairy_pitt.recordary.endpoint.group.dto.GroupMemberDto;
import com.fairy_pitt.recordary.endpoint.group.dto.GroupRequestDto;

import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class GroupControllerTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private PostRepository postRepository;

    @After
    public void tearDown() throws Exception{
        postRepository.deleteAll();
        groupMemberRepository.deleteAll();
        groupRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    public void Group_생성된다() throws  Exception{

        //given
        UserEntity saveUser = userRepository.save(UserEntity.builder()
                .userId("test")
                .userPw("test")
                .userNm("테스트 유저")
                .build());

        String groupName ="test";
        Boolean groupState = true;
        String groupPic = "asd";
        String  groupEx = "test";

        GroupRequestDto requestDto = GroupRequestDto.createGroupBuilder()
                .userCd(saveUser.getUserCd())
                .groupNm(groupName)
                .groupState(true)
                .groupPic(groupPic)
                .groupEx(groupEx)
                .build();

        String url = "http://localhost:" + port + "group/create";

        //when
        ResponseEntity<Boolean> responseEntity = restTemplate.postForEntity(url, requestDto, Boolean.class);

        //then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
       // assertThat(responseEntity.getBody()).isGreaterThan(0L);

        List<GroupEntity> all = groupRepository.findAll();
        assertThat(all.get(0).getGroupEx()).isEqualTo(groupEx);
        assertThat(all.get(0).getGroupNm()).isEqualTo(groupName);
    }


    @Test
    public void Group_정보수정() throws  Exception{
        //given
        UserEntity saveUser = userRepository.save(UserEntity.builder()
                .userId("test")
                .userPw("test")
                .userNm("테스트 유저")
                .build());

        String groupName ="test";
        Boolean groupState = true;
        String groupPic = "asd";
        String  groupEx = "test";

        GroupEntity groupEntity = groupRepository.save(  GroupEntity.builder()
                .gMstUserFK(saveUser)
                .groupNm(groupName)
                .groupState(true)
                .groupPic(groupPic)
                .groupEx(groupEx)
                .build());

        Long groupId = groupEntity.getGroupCd();
        String groupPic2 = "asd";
        String  groupEx2 = "test";

        GroupRequestDto groupUpdateRequestDto = GroupRequestDto.updateGroupBuilder()
                .groupEx(groupEx2)
                .groupNm(groupName)
                .groupPic(groupPic2)
                .groupState(true)
                .build();

        String url = "http://localhost:" + port + "group/update/" + groupId;

        //when
        ResponseEntity<Long> responseEntity = restTemplate.postForEntity(url, groupUpdateRequestDto, Long.class);

        //then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody()).isGreaterThan(0L);

        List<GroupEntity> all = groupRepository.findAll();
        assertThat(all.get(0).getGroupEx()).isEqualTo(groupEx2);
        assertThat(all.get(0).getGroupNm()).isEqualTo(groupName);
    }

    @Test
    public void Group_방장위임() throws  Exception{
        //given

        String groupName ="test";
        Boolean groupState = true;
        String groupPic = "asd";
        String  groupEx = "test";

        UserEntity masterUser = userRepository.save(UserEntity.builder()
                .userId("test2")
                .userPw("test")
                .userNm("테스트 유저")
                .build());

        UserEntity changeUser = userRepository.save(UserEntity.builder()
                .userId("test222222222")
                .userPw("test2222")
                .userNm("테스트 유저222222")
                .build());

        GroupEntity groupEntity = groupRepository.save(  GroupEntity.builder()
                .gMstUserFK(masterUser)
                .groupNm(groupName)
                .groupState(true)
                .groupPic(groupPic)
                .groupEx(groupEx)
                .build());


        groupMemberRepository.save(GroupMemberEntity.builder()
                .groupFK(groupEntity)
                .userFK(changeUser)
                .build());

        Long groupCd = groupEntity.getGroupCd();
        Long userCd  = changeUser.getUserCd();

        GroupMemberDto requestDto = new GroupMemberDto(groupCd,userCd);

        String url = "http://localhost:" + port + "group/changeMaster" ;

        //when
        ResponseEntity<Long> responseEntity = restTemplate.postForEntity(url,requestDto,Long.class);

        //then
       // assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
       // assertThat(responseEntity.getBody()).isGreaterThan(0L);

        List<GroupEntity> all = groupRepository.findAll();
        assertThat(all.get(0).getGMstUserFK().getUserCd()).isEqualTo(changeUser.getUserCd());
        assertThat(all.get(0).getGroupNm()).isEqualTo(groupName);
        }


    @Test
    public void Group_검색() throws  Exception{

        //given
        UserEntity saveUser = userRepository.save(UserEntity.builder()
                .userId("test")
                .userPw("test")
                .userNm("테스트 유저")
                .build());

        String groupName ="test";
        Boolean groupState = true;
        String groupPic = "asd";
        String  groupEx = "test";

        GroupEntity groupEntity = groupRepository.save(GroupEntity.builder()
                .gMstUserFK(saveUser)
                .groupNm(groupName)
                .groupState(true)
                .groupPic(groupPic)
                .groupEx(groupEx)
                .build());

        GroupEntity groupEntity2 = groupRepository.save(GroupEntity.builder()
                .gMstUserFK(saveUser)
                .groupNm(groupName)
                .groupState(true)
                .groupPic(groupPic)
                .groupEx(groupEx)
                .build());


        String url = "http://localhost:" + port + "group/readAll";

        //when
        ResponseEntity<List> responseEntity = restTemplate.getForEntity(url,List.class);


        //then
        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(responseEntity.getBody().size()).isEqualTo(2);
    }

    @Test
    public void Gorup_가져오기() throws Exception{

        //given
        UserEntity saveUser = userRepository.save(UserEntity.builder()
                .userId("test")
                .userPw("test")
                .userNm("테스트 유저")
                .build());

        String groupName ="test";
        Boolean groupState = true;
        String groupPic = "asd";
        String  groupEx = "test";

        GroupEntity groupEntity = groupRepository.save(GroupEntity.builder()
                .gMstUserFK(saveUser)
                .groupNm(groupName)
                .groupState(true)
                .groupPic(groupPic)
                .groupEx(groupEx)
                .build());


        GroupMemberEntity groupMemberEntity = groupMemberRepository.save(GroupMemberEntity.builder()
                .groupFK(groupEntity)
                .userFK(saveUser)
                .build());


//        GroupMemberRequestDto requestDto = GroupMemberRequestDto.builder()
//                .userCd(user)
//                .groupCd(group)
//                .build();

        Long userCd  = saveUser.getUserCd();
        String url = "http://localhost:" + port + "group/group/" + userCd;

        //when
        ResponseEntity<List> responseEntity = restTemplate.getForEntity(url,List.class);


        //then
        //System.out.print(responseEntity);
        List<GroupEntity> all = groupRepository.findAll();
        assertThat(all.get(0).getGMstUserFK().getUserCd()).isEqualTo(saveUser.getUserCd());
//        assertThat(all.get(0).getGroupName()).isEqualTo(groupName);
//        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
//        assertThat(responseEntity.getBody().size()).isEqualTo(2);
    }

//    @Test
//    public void group_페이지() throws Exception{
//        UserEntity saveUser = userRepository.save(UserEntity.builder()
//                .userId("test")
//                .userPw("test")
//                .userNm("테스트 유저")
//                .build());
//
//        String groupName ="test";
//        Boolean groupState = true;
//        String groupPic = "asd";
//        String  groupEx = "test";
//
//        GroupEntity groupEntity = groupRepository.save(GroupEntity.builder()
//                .gMstUserFK(saveUser)
//                .groupNm(groupName)
//                .groupState(true)
//                .groupPic(groupPic)
//                .groupEx(groupEx)
//                .build());
//
//
//        GroupMemberEntity groupMemberEntity = groupMemberRepository.save(GroupMemberEntity.builder()
//                .groupFK(groupEntity)
//                .userFK(saveUser)
//                .build());
//
//        postRepository.save(PostEntity.builder()
//                .userFK(saveUser)
//                .groupFK(groupEntity)
//                .postEx("테스트 게시글3")
//                .postPublicState(1)
//                .postStrYMD("20200310")
//                .postEndYMD("20200311")
//                .build());
//
//        postRepository.save(PostEntity.builder()
//                .userFK(saveUser)
//                .postEx("테스트 게시글4")
//                .postPublicState(1)
//                .postStrYMD("20200310")
//                .postEndYMD("20200311")
//                .build());
//
//        Long groupCd  = groupEntity.getGroupCd();
//        String url = "http://localhost:" + port + "group/" + groupCd;
//
//        //when
//        ResponseEntity<GroupPageResponseDto> responseEntity = restTemplate.getForEntity(url,GroupPageResponseDto.class);
//
//        //than
//        assertThat(responseEntity.getStatusCode()).isEqualTo(HttpStatus.OK);
//        GroupPageResponseDto result =  responseEntity.getBody();
//        //assertThat(result.getPostList().size()).isEqualTo(2);
//
//    }

}
