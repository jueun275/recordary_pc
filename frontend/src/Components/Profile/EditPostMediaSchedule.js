import React, { useState, useRef, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { styled } from '@material-ui/styles';

import './PostAppend.css';
import DTP from '../UI/DTP';
import SelectGroup from '../../Containers/UI/SelectGroup';
import PublicRange from '../UI/PublicRange';
import Backdrop from '../UI/Backdrop';
import AlertDialog from '../Other/AlertDialog';
import Snackbar from '../UI/Snackbar';
import GroupMemberSearch from '../Group/GroupMemberSearch';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import PostAddIcon from '@material-ui/icons/PostAdd';
import PhotoIcon from '@material-ui/icons/Photo';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import DateRangeIcon from '@material-ui/icons/DateRange';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import * as dateFns from 'date-fns';
import { addHours, startOfDay, endOfDay, startOfSecond } from 'date-fns';
import { colorContrast } from '../Other/ColorTransfer';
import Popover from '@material-ui/core/Popover';

import axios from 'axios';
import store from '../../store';

const useStyles = makeStyles((theme) => ({
  content: {
    width: '552px',
    display: 'flex',
    justifyContent: 'center',
  },
  marginBottom: {
    marginBottom: '10px',
  },
  middleCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '250px;',
  },
  chip: {
    marginRight: '4px',
    marginBottom: '4px',
  },
}));

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const EditPostMediaSchedule = (props) => {
  console.log(props);
  const classes = useStyles();
  const [user, setUser] = useState(props.user);
  const [data, setData] = useState(props.data);
  const [change, setChange] = useState(false);
  const [updatePostAddMediaListSrc, setUpdatePostAddMediaListSrc] = useState([]);
  const [postAddMediaListSrc, setPostAddMediaListSrc] = useState(props.mediaList.length > 0 ? props.mediaList : []);
  const [postAddMediaExtensionList, setPostAddMediaExtensionList] = useState([]);
  const [mediaOpen, setMediaOpen] = useState(props.data.mediaFK !== null ? true : false);
  const [scheduleOpen, setScheduleOpen] = useState(props.data.scheduleFK !== null ? true : false);
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = useState(null);
  const [colorClick, setColorClick] = useState(false);
  const [isShowMemberSearch, setIsShowMemberSearch] = useState(false);
  const [dialog, setDialog] = useState(null);

  let fileUpload = useRef(null);

  const [post, setPost] = useState({
    userCd: user.userCd,
    postCd: data.postCd,
    groupCd: data.groupFK === null ? null : data.groupFK.groupCd,
    scheduleCd: data.scheduleFK === null ? null : data.scheduleFK.scheduleCd,
    mediaCd: data.mediaFK === null ? null : data.mediaFK.mediaCd,
    postEx: data.postEx === null ? null : data.postEx,
    postPublicState: data.postPublicState === 0 ? 0 : data.postPublicState,
  });

  const [scheduleInfo, setScheduleInfo] = useState({
    tabCd: data.scheduleFK === null ? null : data.scheduleFK.tabCd,
    userCd: data.userCd,
    scheduleCol: data.scheduleFK === null ? 'rgba(20, 81, 51, 0.9)' : data.scheduleFK.scheduleCol,
    scheduleNm: data.scheduleFK === null ? null : data.scheduleFK.scheduleNm,
    scheduleEx: data.scheduleFK === null ? null : data.scheduleFK.scheduleEx,
    scheduleStr: data.scheduleFK === null ? new Date() : data.scheduleFK.scheduleStr,
    scheduleEnd: data.scheduleFK === null ? addHours(new Date(), 1) : data.scheduleFK.scheduleEnd,
    schedulePublicState: data.scheduleFK === null ? 0 : data.scheduleFK.schedulePublicState,
    scheduleMemberList: data.scheduleFK === null ? [] : data.scheduleFK.scheduleMemberList,
    isExistSchedule: data.scheduleFK === null ? false : true,
  });
  const [subtractedSchedule, setSubtractedSchedule] = useState([]);
  const [addedSchedule, setAddedSchedule] = useState([]);
  const [tabInfo, setTabInfo] = useState([]);
  const [switchInfo, setSwitchInfo] = useState(false);
  const [clickTabState, setClickTabState] = useState(scheduleInfo.tabCd === null ? undefined : scheduleInfo.tabCd);
  const [tabPopover, setTabPopover] = useState(null);

  useEffect(() => {
    if (props.user.userCd !== undefined) {
      getTabList();
    }
  }, []);

  const getTabList = async () => {
    const data = (await axios.get(`/tab/${props.user.userCd}`)).data;
    console.log(data);
    if (data.length > 0) {
      setTabInfo(data);
    } else return;
  };

  var clickTabInfo = undefined;

  if (clickTabState !== undefined) {
    for (let i = 0; i < tabInfo.length; i++) {
      if (tabInfo[i].scheduleTabCd === clickTabState) {
        clickTabInfo = tabInfo[i];
        break;
      }
    }
  }

  const changeHandle = (e) => {
    setPost({
      ...post,
      [e.target.name]: e.target.value,
    });
  };

  const mediaOpenClick = () => {
    if (!mediaOpen) {
      setPostAddMediaListSrc([]);
      setMediaOpen(!mediaOpen);
    } else {
      setMediaOpen(!mediaOpen);
    }
  };

  const dataURLToBlob = (dataURL) => {
    const BASE64_MARKER = ';base64,';

    // base64로 인코딩 되어있지 않을 경우
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts = dataURL.split(',');
      const contentType = parts[0].split(':')[1];
      const raw = parts[1];
      return new Blob([raw], {
        type: contentType,
      });
    }

    // base64로 인코딩 된 이진데이터일 경우
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    // atob()는 Base64를 디코딩하는 메서드
    const rawLength = raw.length;
    // 부호 없는 1byte 정수 배열을 생성
    const uInt8Array = new Uint8Array(rawLength); // 길이만 지정된 배열
    let i = 0;
    while (i < rawLength) {
      uInt8Array[i] = raw.charCodeAt(i);
      i++;
    }
    return new Blob([uInt8Array], {
      type: contentType,
    });
  };

  const tagTypeChange = (value) => {
    console.log(value);
    if (value.indexOf(';base64,') === -1) {
      const parts = value.split(',');
      const contentType = parts[0].split(':')[1];
      const tagType = contentType.split('/')[0];
      return tagType;
    } else {
      // base64로 인코딩 된 이진데이터일 경우
      const parts = value.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const tagType = contentType.split('/')[0];
      return tagType;
    }
  };

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const extensionImage = ['bmp', 'gif', 'jpeg', 'jpg', 'png'];
  const extensionVideo = ['mp4', 'webm', 'ogg'];
  const extensionAudio = ['m4a', 'mp3', 'ogg', 'wav'];

  const filterTagType = (value) => {
    const len = value.length;
    const lastDot = value.lastIndexOf('.');
    const extension = value.substr(lastDot + 1, len).toLowerCase();
    let filterType = null;

    extensionImage.map((value) => {
      if (extension === value) filterType = 'image';
    });
    extensionVideo.map((value) => {
      if (extension === value) filterType = 'video';
    });
    extensionAudio.map((value) => {
      if (extension === value) filterType = 'audio';
    });
    return filterType;
  };

  // const timelineMediaType = (value) => {
  //   if (filterTagType(value) === 'image') {
  //     return (
  //       <img
  //         id='postAddMedia'
  //         alt='postAddMedia'
  //         src={value}
  //         style={{
  //           boxShadow: '0px 1px 3px rgba(161, 159, 159, 0.6)',
  //           width: '60px',
  //           height: '60px',
  //           objectFit: 'cover',
  //         }}
  //       />
  //     );
  //   } else if (filterTagType(value) === 'video') {
  //     return (
  //       <video
  //         controls
  //         title='postAddMedia'
  //         src={value}
  //         style={{ boxShadow: '0px 1px 3px rgba(161, 159, 159, 0.6)', height: '60px', objectFit: 'cover' }}
  //       >
  //         지원되지 않는 형식입니다.
  //       </video>
  //     );
  //   } else if (filterTagType(value) === 'audio') {
  //     return (
  //       <audio controls src={value} style={{ width: '60px' }}>
  //         지원되지 않는 형식입니다.
  //       </audio>
  //     );
  //   } else {
  //     return <span style={{ display: 'block', height: '100%', textAlign: 'center' }}>지원되지 않는 형식입니다.</span>;
  //   }
  // };

  const onSubmit = async () => {
    try {
      if (props.data.mediaFK !== null) {
        const deleteSuccess = (await axios.delete(`/media/${props.data.mediaFK.mediaCd}`)).data;
        console.log(deleteSuccess);
      }

      const str = switchInfo ? dateFns.startOfDay(scheduleInfo.scheduleStr) : scheduleInfo.scheduleStr;
      const end = switchInfo
        ? dateFns.startOfSecond(dateFns.endOfDay(scheduleInfo.scheduleEnd))
        : scheduleInfo.scheduleEnd;

      if (str >= end) {
        setDialog(
          <AlertDialog
            severity='error'
            content='시작일보다 종료일이 더 빠릅니다.'
            onAlertClose={() => setDialog(null)}
          />
        );
        return;
      }
      var getScheduleCd = null;
      if (scheduleInfo.isExistSchedule) {
        getScheduleCd = (
          await axios.post(`/schedule/update/${post.scheduleCd}`, {
            tabCd: clickTabState,
            userCd: user.userCd,
            scheduleNm: scheduleInfo.scheduleNm,
            scheduleEx: scheduleInfo.scheduleEx,
            scheduleStr: new Date(str).getTime(),
            scheduleEnd: new Date(end).getTime(),
            scheduleCol: scheduleInfo.scheduleCol,
            schedulePublicState: scheduleInfo.schedulePublicState,
            createMember: addedSchedule,
            deleteMember: subtractedSchedule,
          })
        ).data;
        console.log(getScheduleCd);
      }

      var getMediaCd = null;
      if (updatePostAddMediaListSrc.length > 0) {
        const formData = new FormData();

        updatePostAddMediaListSrc.map((value, index) => {
          formData.append('mediaFiles', dataURLToBlob(value));
        });
        postAddMediaExtensionList.map((value, index) => {
          formData.append('extension', value);
        });
        getMediaCd = (
          await axios.post(`/media/${post.userCd}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data; boundary=------WebKitFormBoundary7MA4YWxkTrZu0gW' },
          })
        ).data;
        console.log(getMediaCd);
      } else {
        console.log(post.mediaCd);
        getMediaCd = post.mediaCd;
        console.log(getMediaCd);
      }

      const postData = (
        await axios.put(`/post/${post.postCd}`, {
          postEx: post.postEx,
          groupCd: post.groupCd,
          scheduleCd: getScheduleCd,
          mediaCd: getMediaCd,
          postPublicState: post.postPublicState,
        })
      ).data;

      if (postData === post.postCd) {
        setAlert(
          <AlertDialog
            severity='success'
            content='게시물이 수정되었습니다.'
            onAlertClose={
              (() => setAlert(null), () => props.onCancel(), () => setTimeout(() => window.location.reload(), 1000))
            }
          />
        );
      } else {
        setAlert(<Snackbar severity='error' content='게시물을 수정하지 못했습니다.' onClose={() => setAlert(null)} />);
      }
    } catch (error) {
      console.log(error);
      setAlert(
        <Snackbar
          severity='error'
          content='서버 에러로 게시물을 수정하지 못했습니다..'
          onClose={() => setAlert(null)}
        />
      );
    }
  };

  return (
    <Dialog open style={{ backgroundColor: 'rgba(241, 242, 246,0.1)' }}>
      <div
        className='post-append-header'
        style={{
          width: '620px',
          transitionProperty: 'background-color',
          transitionDuration: '0.3s',
          transitionTimingFunction: 'ease-out',
          backgroundColor: props.data.scheduleFK === null ? 'rgba(20, 81, 51, 0.9)' : scheduleInfo.scheduleCol,
        }}
      >
        <div className='Post-Append-titleName'>
          <PostAddIcon style={{ fontSize: '40px', color: 'white', marginLeft: '10px' }} />
          <div className='PostAdd-title'>내 게시물 수정</div>
        </div>
      </div>

      <div className='Post-Media-Schedule-Append-Form '>
        <div className='Post-Append-Group' style={{ marginLeft: '12px' }}>
          <div>
            {post.groupCd === null ? (
              <SelectGroup options={['그룹없음']} currentGroup={null} />
            ) : (
              <SelectGroup
                options={props.groupList}
                onSetSelectedGroup={(selectGroupCd) => setPost({ ...post, groupCd: selectGroupCd })}
                currentGroup={data.groupFK}
              />
            )}
          </div>

          <div className='schedule-media-button '>
            {data.scheduleFK === null ? (
              <PublicRange
                onSetSelectedIndex={(index) => {
                  if (scheduleOpen) {
                    setScheduleInfo({ ...scheduleInfo, schedulePublicState: index });
                  }
                  setPost({ ...post, postPublicState: index });
                }}
                selectedIndex={data.postPublicState}
              />
            ) : data.scheduleFK.scheduleMemberList.length > 0 ? (
              <PublicRange
                options={['전체공개', '비공개']}
                onSetSelectedIndex={(index) => {
                  setScheduleInfo({ ...scheduleInfo, schedulePublicState: index === 0 ? 0 : 3 });
                  setPost({ ...post, postPublicState: index === 0 ? 0 : 3 });
                }}
                selectedIndex={scheduleInfo.schedulePublicState}
              />
            ) : (
              <PublicRange
                onSetSelectedIndex={(index) => {
                  setScheduleInfo({ ...scheduleInfo, schedulePublicState: index });
                  setPost({ ...post, postPublicState: index });
                }}
                selectedIndex={scheduleInfo.schedulePublicState}
              />
            )}
            {data.shareScheduleList.length > 0 ? null : (
              <>
                <div className='plus-button-design' onClick={() => setScheduleOpen(!scheduleOpen)}>
                  {(() => {
                    if (scheduleOpen === false) {
                      return (
                        <div className='plus-button-design-2'>
                          <DateRangeIcon style={{ fontSize: '30px' }} />
                          <span style={{ fontSize: '15px', marginLeft: '5px' }}>일정추가</span>
                        </div>
                      );
                    } else {
                      return (
                        <div className='plus-button-design-2 clicked'>
                          <DateRangeIcon style={{ fontSize: '30px' }} />
                          <span style={{ fontSize: '15px', marginLeft: '5px' }}>일정추가</span>
                        </div>
                      );
                    }
                  })()}
                </div>
                <div className='plus-button-design' onClick={mediaOpenClick}>
                  {mediaOpen === true ? (
                    <div className='plus-button-design-2 clicked'>
                      <PhotoIcon style={{ fontSize: '30px' }} />
                      <span style={{ fontSize: '15px', marginLeft: '10px' }}>미디어</span>
                    </div>
                  ) : (
                    <div className='plus-button-design-2 '>
                      <PhotoIcon style={{ fontSize: '30px' }} />
                      <span style={{ fontSize: '15px', marginLeft: '10px' }}>미디어</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {post.groupCd === null ? null : (
          <div style={{ color: 'red', fontSize: '12px', marginLeft: '20px' }}>
            * 그룹 게시물은 같은 그룹에서만 수정이 가능합니다.
          </div>
        )}

        <div className='Post-Append-text post-Append'>
          <TextField
            id='post_text'
            defaultValue={data.postEx}
            label='내용'
            multiline
            rowsMax='5'
            rows='3'
            name='postEx'
            onChange={changeHandle}
          />
        </div>
        {colorClick === true ? (
          <Dialog open onClose={() => setColorClick(false)}>
            <div>
              <ChromePicker
                color={scheduleInfo.scheduleCol}
                onChange={(color) => setScheduleInfo({ ...scheduleInfo, scheduleCol: color.hex })}
              />
            </div>
          </Dialog>
        ) : null}
        {scheduleOpen === false ? null : (
          <div onClose={() => setScheduleOpen(null)}>
            <div className='Post-Append-title post-Append'>
              <TextField
                id='post_title'
                label='제목'
                defaultValue={scheduleInfo.scheduleNm}
                onChange={(e) => setScheduleInfo({ ...scheduleInfo, scheduleNm: e.target.value })}
              />
              <div className='selectColor-form'>
                <span>일정 색상 설정</span>
                <div
                  className='selectColor'
                  onClick={() => setColorClick(true)}
                  style={{
                    backgroundColor: scheduleInfo.scheduleCol,
                  }}
                />
              </div>
            </div>
            <div className='Post-Append-title post-Append'>
              <TextField
                style={{ marginRight: '20px' }}
                id='post_title'
                label='비고'
                defaultValue={scheduleInfo.scheduleEx}
                onChange={(e) => setScheduleInfo({ ...scheduleInfo, scheduleEx: e.target.value })}
              />
              {tabInfo === undefined ? null : (
                <>
                  <span style={{ fontSize: '15px', color: 'gray', marginTop: '20px' }}>선택한 탭 :</span>
                  <div
                    className='transition-all'
                    onClick={(e) => {
                      setTabPopover(e.currentTarget);
                    }}
                    style={{
                      height: '30px',
                      width: '180px',
                      backgroundColor:
                        clickTabState === undefined
                          ? '#ffc500'
                          : clickTabInfo !== undefined
                          ? clickTabInfo.scheduleTabColor
                          : data.scheduleFK.tabCol,
                      marginLeft: '20px',
                      textAlign: 'center',
                      lineHeight: '34px',
                      textTransform: 'uppercase',
                      color: colorContrast(
                        clickTabState === undefined
                          ? '#ffc500'
                          : clickTabInfo !== undefined
                          ? clickTabInfo.scheduleTabColor
                          : data.scheduleFK.tabCol
                      ),
                      borderRadius: '5px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      marginTop: '20px',
                    }}
                  >
                    {clickTabState === undefined
                      ? 'ALL'
                      : clickTabInfo !== undefined
                      ? clickTabInfo.scheduleTabNm
                      : data.scheduleFK.tabNm}
                  </div>
                </>
              )}
            </div>
            <div className='Post-Append-Schedule'>
              <DTP
                strDate={scheduleInfo.scheduleStr}
                endDate={scheduleInfo.scheduleEnd}
                onChangeStrDate={(value) => setScheduleInfo({ ...scheduleInfo, scheduleStr: value })}
                onChangeEndDate={(value) => setScheduleInfo({ ...scheduleInfo, scheduleEnd: value })}
                switchInfo={switchInfo}
                onChangeSwitch={(value) => setSwitchInfo(value)}
              />
            </div>
            <div className='Post-Append-Tag-User post-Append'>
              <Chip
                avatar={<Avatar alt={`${user.userNm} img`} src={user.userPic} />}
                label={user.userNm}
                style={{
                  backgroundColor: 'rgba(20, 81, 51, 0.8)',
                  color: '#ffffff',
                  marginLeft: '5px',
                  marginBottom: '5px',
                }}
                clickable
              />
              {scheduleInfo.scheduleMemberList.map((value, index) => (
                <Chip
                  key={`scheduleMembers-${index}`}
                  avatar={<Avatar alt={`${value.userNm} img`} src={value.userPic} />}
                  label={value.userNm}
                  style={{
                    marginLeft: '5px',
                    marginBottom: '5px',
                  }}
                  clickable
                  onDelete={() => {
                    setDialog(
                      <AlertDialog
                        severity='info'
                        content='정말로 삭제하시겠습니까'
                        onAlertClose={() => setDialog(null)}
                        onAlertSubmit={() => {
                          const k = JSON.parse(JSON.stringify(scheduleInfo.scheduleMemberList));
                          k.splice(index, 1);
                          setScheduleInfo({
                            ...scheduleInfo,
                            scheduleMembers: k,
                          });
                          setSubtractedSchedule(subtractedSchedule.concat(value.userCd));
                          setDialog(
                            <Snackbar
                              severity='success'
                              content='삭제하였습니다'
                              duration={1000}
                              onClose={() => setDialog(null)}
                            />
                          );
                        }}
                      />
                    );
                  }}
                />
              ))}
              <Chip
                icon={<AddIcon />}
                style={{
                  marginLeft: '5px',
                  marginBottom: '5px',
                }}
                label='ADD'
                clickable
                variant='outlined'
                onClick={() => setIsShowMemberSearch(true)}
                onClick={() =>
                  setDialog(
                    <GroupMemberSearch
                      type={1}
                      onSelect={(value) => {
                        var isOverlap = false;
                        for (let i = 0; i < scheduleInfo.scheduleMemberList.length; i++) {
                          if (
                            value.userCd === scheduleInfo.scheduleMemberList[i].userCd ||
                            value.userCd === user.userCd
                          ) {
                            return;
                          }
                        }
                        setScheduleInfo({
                          ...scheduleInfo,
                          scheduleMemberList: scheduleInfo.scheduleMemberList.concat(value),
                        });
                        setAddedSchedule(addedSchedule.concat(value.userCd));
                        setDialog(
                          <Snackbar
                            severity='success'
                            content='수정되었습니다.'
                            duration={1000}
                            onAlertClose={
                              (() => setAlert(null),
                              () => props.onCancel(),
                              () => setTimeout(() => window.location.reload(), 1000))
                            }
                          />
                        );
                      }}
                      onCancel={() => setDialog(false)}
                    />
                  )
                }
              />
            </div>
          </div>
        )}
        {mediaOpen === true ? (
          <div className='Post-Append-Media post-Append'>
            <div
              className=' Post-Append-Media2'
              style={{
                padding: '0px 10px',
                width: '60px',
                height: '60px',
                display: 'flex',
                boxShadow: '0px 1px 3px rgba(161, 159, 159, 0.8)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => fileUpload.current.click()}
            >
              <AddPhotoAlternateIcon style={{ fontSize: '50px' }}></AddPhotoAlternateIcon>
            </div>
            <input
              type='file'
              accept='.bmp, .gif, .jpeg, .jpg, .png, .mp4, .webm, .ogg, .m4a, .mp3, .ogg, .wav'
              required
              multiple
              style={{ display: 'none' }}
              ref={fileUpload}
              onChange={(e) => {
                setChange(true);
                if (e.target.files.length > 5) {
                  setDialog(
                    <AlertDialog
                      severity='error'
                      content='5개 이상 업로드할 수 없습니다.'
                      onAlertClose={() => setDialog(null)}
                    />
                  );
                  return;
                }
                for (let i = 0; i < e.target.files.length; i++) {
                  if (e.target.files[i].size > 100 * 1024 * 1024) {
                    setDialog(
                      <AlertDialog
                        severity='error'
                        content='파일 용량이 너무 큽니다.'
                        onAlertClose={() => setDialog(null)}
                      />
                    );
                    return;
                  }
                  const reader = new FileReader();
                  postAddMediaExtensionList.push(e.target.files[i].name.split('.').pop().toLowerCase());
                  reader.addEventListener('load', (e) => {
                    updatePostAddMediaListSrc.push(e.target.result);
                  });
                  reader.readAsDataURL(e.target.files[i]);
                }
              }}
            />
            {updatePostAddMediaListSrc.length > 0
              ? updatePostAddMediaListSrc.map((value, index) => {
                  if (tagTypeChange(value) === 'image') {
                    return (
                      <div style={{ marginLeft: '10px' }} key={`${index}-postAddMedia`}>
                        <img
                          style={{
                            boxShadow: '0px 1px 3px rgba(161, 159, 159, 0.6)',
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                          id='postAddMedia'
                          src={value}
                        />
                      </div>
                    );
                  } else if (tagTypeChange(value) === 'video') {
                    return (
                      <div style={{ marginLeft: '10px' }} key={`${index}-postAddMedia`}>
                        <video
                          style={{
                            boxShadow: '0px 1px 3px rgba(161, 159, 159, 0.6)',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                          id='postAddMedia'
                          controls
                          src={value}
                        >
                          지원되지 않는 형식입니다.
                        </video>
                      </div>
                    );
                  } else if (tagTypeChange(value) === 'audio') {
                    return (
                      <div style={{ marginLeft: '10px' }} key={`${index}-postAddMedia`}>
                        <audio
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                          id='postAddMedia'
                          src={value}
                          controls
                        />
                      </div>
                    );
                  }
                  // <div style={{ marginLeft: '10px' }} key={`${index}-postAddMedia`}>
                  //   {timelineMediaType(postAddMediaListSrc[index])}
                  // </div>
                })
              : postAddMediaListSrc.length > 0 && updatePostAddMediaListSrc.length < 1
              ? postAddMediaListSrc.map((value, index) => {
                  if (filterTagType(value) === 'image') {
                    return (
                      <div style={{ marginLeft: '10px' }} key={`${index}-postAddMedia`}>
                        <img
                          style={{
                            boxShadow: '0px 1px 3px rgba(161, 159, 159, 0.6)',
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                          id='postAddMedia'
                          src={value}
                        />
                      </div>
                    );
                  } else if (filterTagType(value) === 'video') {
                    return (
                      <div style={{ marginLeft: '10px' }} key={`${index}-postAddMedia`}>
                        <video
                          style={{
                            boxShadow: '0px 1px 3px rgba(161, 159, 159, 0.6)',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                          id='postAddMedia'
                          controls
                          src={value}
                        >
                          지원되지 않는 형식입니다.
                        </video>
                      </div>
                    );
                  } else if (filterTagType(value) === 'audio') {
                    return (
                      <div style={{ marginLeft: '10px' }} key={`${index}-postAddMedia`}>
                        <audio
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                          id='postAddMedia'
                          src={value}
                          controls
                        />
                      </div>
                    );
                  }
                  // <div style={{ marginLeft: '10px' }} key={`${index}-postAddMedia`}>
                  //   {timelineMediaType(postAddMediaListSrc[index])}
                  // </div>
                })
              : null}
          </div>
        ) : null}
        {alert}
        <div className='Post-Append-Bottom'>
          <div className='Post-Upload-buttons'>
            <Button onClick={() => props.onCancel()}>취소</Button>
            <Button onClick={handleClickOpen}>수정</Button>
          </div>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>게시물 수정</DialogTitle>
            <DialogContent>
              <DialogContentText id='alert-dialog-description'>게시물을 수정하시겠습니까?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary' autoFocus>
                취소
              </Button>
              <Button onClick={(handleClose, () => props.onCancel(), onSubmit)} color='primary'>
                확인
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      {dialog}
      {tabInfo === undefined ? null : (
        <Popover
          open={Boolean(tabPopover)}
          anchorEl={tabPopover === null ? null : tabPopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          disableRestoreFocus
          onClose={() => setTabPopover(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'transparent' }}>
            <Button
              style={{ width: '200px' }}
              onClick={() => {
                setClickTabState(undefined);
                setTabPopover(null);
              }}
              style={{ backgroundColor: '#ffc500', color: colorContrast('#ffc500') }}
            >
              ALL
            </Button>
            {tabInfo.map((value) => {
              return (
                <Button
                  key={`tabInfo-${value.scheduleTabCd}`}
                  onClick={() => {
                    setClickTabState(value.scheduleTabCd);
                    setTabPopover(null);
                  }}
                  style={{
                    backgroundColor: value.scheduleTabColor,
                    color: colorContrast(value.scheduleTabColor),
                    width: '200px',
                  }}
                >
                  {value.scheduleTabNm}
                </Button>
              );
            })}
          </div>
        </Popover>
      )}
    </Dialog>
  );
};

export default EditPostMediaSchedule;
