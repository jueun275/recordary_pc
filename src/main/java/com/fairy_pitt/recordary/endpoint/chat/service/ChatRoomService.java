package com.fairy_pitt.recordary.endpoint.chat.service;

import com.fairy_pitt.recordary.common.domain.*;
import com.fairy_pitt.recordary.common.repository.ChatRoomRepository;
import com.fairy_pitt.recordary.endpoint.chat.dto.ChatResponseDto;
import com.fairy_pitt.recordary.endpoint.chat.dto.ChatRoomDto;
import com.fairy_pitt.recordary.endpoint.chat.dto.ChatRoomResponseDto;
import com.fairy_pitt.recordary.endpoint.group.service.GroupService;
import com.fairy_pitt.recordary.endpoint.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final UserService userService;
    private final GroupService groupService;

    public Long create(ChatRoomDto chatRoomDto)
    {
        UserEntity user = userService.findEntity(chatRoomDto.getUserCd());
       if(chatRoomDto.getGroupCd() == null) {
           UserEntity target = userService.findEntity(chatRoomDto.getTargetCd());
           return chatRoomRepository.save( chatRoomDto.toEntity(user, target, null)).getRoomCd();
       }else {
          GroupEntity group = groupService.findEntity(chatRoomDto.getGroupCd());
           return chatRoomRepository.save(chatRoomDto.toEntity(user, null, group)).getRoomCd();
       }
    }

    public Long enterChat(ChatRoomDto chatRoomDto)
    {
        UserEntity user = userService.findEntity(chatRoomDto.getUserCd());
        UserEntity target = userService.findEntity(chatRoomDto.getTargetCd());

        switch (check(user, target)){
            case 0:{
              return  null;

            }
            case 1:{
              return  chatRoomRepository.findByUserFKAndTargetFK(target, user).getRoomCd();

            }
            case 2:{
               return chatRoomRepository.findByUserFKAndTargetFK(user, target).getRoomCd();
            }
        }
        return null;
    }

    public List<ChatResponseDto> enter(Long roomCd)
    {
        return new ChatRoomResponseDto(chatRoomRepository.findByRoomCd(roomCd)).getChatList();
    }

    private int check(UserEntity user, UserEntity target)
    {
        if(chatRoomRepository.existsByUserFKAndTargetFK(user,target))
        {
            return 2;
        }else if(chatRoomRepository.existsByUserFKAndTargetFK(target, user))
        {
            return 1;
        }
        else return 0;
    }


    public List<ChatRoomResponseDto> chatRoomList(Long userCd)
    {
        UserEntity user = userService.findEntity(userCd);
        List<ChatRoomEntity> chatRoomList =  chatRoomRepository.findAllByUserFKOrTargetFKOrderByModifiedDate(user, user);
        List<ChatRoomResponseDto> response = new ArrayList<>();
        for (ChatRoomEntity temp : chatRoomList) {
            ChatEntity chatEntity = temp.getChatList().get(temp.getChatList().size() - 1);
            if(user.getUserCd().equals(temp.getUserFK().getUserCd()))
            {
                ChatRoomResponseDto chatRoom = new ChatRoomResponseDto(temp, chatEntity.getContent(), temp.getTargetFK(), chatEntity.getCreatedDate());
                response.add(chatRoom);
            }else{
                ChatRoomResponseDto chatRoom = new ChatRoomResponseDto(temp,chatEntity.getContent() , temp.getUserFK(), chatEntity.getCreatedDate());
                response.add(chatRoom);
            }
        }
        return response;
    }
    public List<ChatRoomResponseDto> groupChatList(Long userCd)
    {
        UserEntity user = userService.findEntity(userCd);
        List<ChatRoomResponseDto> result = new ArrayList<>();
        List<GroupEntity> groups = user.getMasters();
        List<GroupMemberEntity> member = user.getGroups();
        for(GroupMemberEntity temp : member)
        {
            groups.add(temp.getGroupFK());
        }
        for(GroupEntity group : groups)
        {
            if(chatRoomRepository.existsByGroupFK(group))
            {
                ChatRoomEntity entity = chatRoomRepository.findByGroupFK(group);
                ChatEntity chatEntity = entity.getChatList().get(entity.getChatList().size() - 1);
                ChatRoomResponseDto  chatRoomResponseDto = new ChatRoomResponseDto(entity, group, chatEntity.getContent(), chatEntity.getCreatedDate());
                result.add( chatRoomResponseDto);
            }
        }
        return result;
    }

    public Boolean delete(Long roomCd)
    {
        ChatRoomEntity room = chatRoomRepository.findById(roomCd)
                .orElseThrow(() -> new IllegalArgumentException("해당 채팅방이 없습니다. id=" + roomCd));
          chatRoomRepository.delete(room);
          return true;
    }

    public ChatRoomEntity findEntity(Long roomCd){
        return chatRoomRepository.findByRoomCd(roomCd);
    }

    public List<ChatRoomResponseDto> chatSort(List<ChatRoomResponseDto> responseDto)
    {
        responseDto.sort(Comparator.comparing(ChatRoomResponseDto:: getLastTime).reversed());
        return  responseDto;
    }
}
