import React, { useState, useEffect } from 'react';

import Popover from '@material-ui/core/Popover';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import DeleteIcon from '@material-ui/icons/Delete';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { format, differenceInCalendarDays, startOfSecond, endOfDay, isAfter } from 'date-fns';

import { ChromePicker } from 'react-color';
import axios from 'axios';
import { TextField } from '@material-ui/core';

import AlertDialog from '../Other/AlertDialog';
import Snackbar from '../UI/Snackbar';

const colorList = [
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#f6e58d',
  '#4834d4',
  '#30336b',
];

const ToDo = ({ open, userCd }) => {
  useEffect(() => {
    const data = (async () => {
      const { data } = await axios.get(`/toDo/${userCd}`);
      console.log(data);
      setToDoList(data.map((value) => ({ ...value, toDoEndDate: new Date(value.toDoEndDate) })));
    })();
    const today = new Date().getHours();
    console.log(today);
    if (today >= 21) {
      setBgImage('https://cdn.pixabay.com/photo/2016/11/21/03/56/landscape-1844231_1280.png');
    } else if (today >= 18) {
      setBgImage('https://cdn.pixabay.com/photo/2016/11/21/03/56/landscape-1844231_1280.png');
    } else if (today >= 8) {
      setBgImage('https://github.com/CodeExplainedRepo/To-Do-List/blob/master/img/bg.jpg?raw=true');
    } else {
      setBgImage('https://cdn.pixabay.com/photo/2016/11/21/03/56/landscape-1844231_1280.png');
    }

    // const { data } = axios.get(`/toDo/15`);
  }, []);
  const [toDoList, setToDoList] = useState([]);
  const [bgImage, setBgImage] = useState(null);
  const [inputText, setInputText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isClickDate, setIsClickDate] = useState(false);
  const [color, setColor] = useState(colorList[Math.floor(Math.random() * colorList.length)]);
  const [colorRef, setColorRef] = useState(null);
  const [alert, setAlert] = useState(null);

  var koreanWeek = undefined;
  var currentDate = new Date();

  const submitToDo = async () => {
    console.log({
      userCd: userCd,
      toDoContent: inputText,
      toDoCol: color,
      toDoEndDate: selectedDate.getTime(),
      toDoCompleteState: false,
    });
    const { data } = await axios.post('/toDo/', {
      userCd: userCd,
      toDoContent: inputText,
      toDoEndDate: startOfSecond(endOfDay(selectedDate)).getTime(),
      toDoCol: color,
      toDoSate: false,
    });

    var currectedIndex = toDoList.length;

    toDoList.some((value, index) => {
      if (isAfter(value.toDoEndDate, selectedDate)) {
        currectedIndex = index;
        return true;
      }
    });

    const copyList = toDoList.slice();
    copyList.splice(currectedIndex, 0, {
      toDoCd: data,
      toDoContent: inputText,
      toDoCol: color,
      toDoEndDate: selectedDate,
      toDoSate: false,
    });
    setToDoList(copyList);
  };

  const deleteToDo = async (value, index) => {
    setAlert(<Snackbar severity='info' content={`수정중.....`} duration={999999} />);
    try {
      await axios.delete(`/toDo/${value.toDoCd}`);
      const copyList = toDoList.slice();
      copyList.splice(index, 1);
      setToDoList(copyList);
      setAlert(<Snackbar severity='success' content={`'${value.toDoContent}' 삭제`} onClose={() => setAlert(null)} />);
    } catch (error) {
      setAlert(<Snackbar severity='error' content={error} onClose={() => setAlert(null)} />);
    }
  };

  switch (format(selectedDate, 'i')) {
    case '0':
      koreanWeek = '일요일';
      break;
    case '1':
      koreanWeek = '월요일';
      break;
    case '2':
      koreanWeek = '화요일';
      break;
    case '3':
      koreanWeek = '수요일';
      break;
    case '4':
      koreanWeek = '목요일';
      break;
    case '5':
      koreanWeek = '금요일';
      break;
    case '6':
      koreanWeek = '토요일';
      break;
    default:
      koreanWeek = '에러';
  }

  return (
    <div
      className='todo-animation'
      style={{
        position: 'absolute',
        top: '50px',
        right: 0,
        height: '550px',
        width: '300px',
        boxShadow: '0px 0px 1px #0001',
        borderTopLeftRadius: '4%',
        borderTopRightRadius: '4%',
        display: 'flex',
        zIndex: '999',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1.15,
          paddingLeft: '10px',
          borderRadius: '15px 15px 0 0',
          backgroundColor: 'white',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: '6px', right: '6px', color: 'white' }}>
          <PlaylistAddCheckIcon />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          Wednesday, Mar 13
        </div>
      </div>
      <div style={{ flex: 3, backgroundColor: 'white' }}>
        {toDoList.map((value, index) => {
          const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(value.toDoContent);
          var fontSize = undefined;
          if (isKorean) {
            const textLength = value.toDoContent.length;
            if (textLength > 16) fontSize = 10;
            else if (textLength > 13) fontSize = 12;
            else if (textLength > 10) fontSize = 14;
            else if (textLength > 8) fontSize = 16;
          } else {
            const textLength = value.toDoContent.length;
            if (textLength > 20) fontSize = 12;
            else if (textLength > 16) fontSize = 15;
            else if (textLength > 13) fontSize = 18;
            else if (textLength > 10) fontSize = 21;
            else if (textLength > 8) fontSize = 24;
          }

          const diffDay = differenceInCalendarDays(value.toDoEndDate, currentDate);
          return (
            <div
              key={`todo-${index}`}
              style={{
                height: '46px',
                borderBottom: '1px solid #eee',
                paddingLeft: '6px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
              }}
              onMouseEnter={() => {
                const dom = document.getElementById(`todo-delete-${index}`);
                dom.style.opacity = '100%';
              }}
              onMouseLeave={() => {
                const dom = document.getElementById(`todo-delete-${index}`);
                dom.style.opacity = '0';
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  className='transition-all'
                  style={{
                    cursor: 'pointer',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: value.toDoCompleteState ? '#eee' : '#eee3',
                    border: value.toDoCompleteState ? `2px solid #ddd` : `2px solid ${value.toDoCol}`,
                  }}
                  onClick={async () => {
                    try {
                      setAlert(<Snackbar severity='info' content={`수정중.....`} duration={999999} />);
                      console.log('toDoCd', value.toDoCd);
                      await axios.post(`/toDo/update/${value.toDoCd}`);
                      var array = toDoList.slice();
                      array[index] = { ...toDoList[index], toDoCompleteState: !value.toDoCompleteState };
                      setToDoList(array);
                      setAlert(
                        <Snackbar
                          severity='success'
                          content={`수정 완료`}
                          duration={800}
                          onClose={() => setAlert(null)}
                        />
                      );
                    } catch (error) {
                      setAlert(<Snackbar severity='error' content={error} onClose={() => setAlert(null)} />);
                    }
                  }}
                />
              </div>
              <div
                className='transition-all'
                style={{
                  flex: 1,
                  fontWeight: 'bold',
                  fontSize: `${fontSize}px`,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  textDecoration: value.toDoCompleteState ? 'line-through' : 'none',
                  color: value.toDoCompleteState ? '#bbb' : 'black',
                }}
              >
                {value.toDoContent}
              </div>
              <div
                className='transition-all'
                id={`todo-delete-${index}`}
                style={{ opacity: 0, width: '32px', cursor: 'pointer' }}
                onClick={() => {
                  deleteToDo(value, index);
                }}
              >
                <DeleteIcon fontSize='small' />
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: '53px', color: 'green', fontSize: '10px' }}>
                {diffDay === 0 ? 'D-DAY' : diffDay > 0 ? `${diffDay}일 후` : `${-diffDay}일 전`}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          height: '50px',
          width: '100%',
          borderTop: '1px solid #eee',
          display: 'flex',
        }}
      >
        <div
          style={{
            width: '100px',
            padding: '4px 0px',
            paddingLeft: '4px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: '11px',
              lineHeight: '200%',
              fontWeight: 'bold',
              overflow: 'hidden',
            }}
            onClick={() => setIsClickDate(true)}
          >
            {`${format(selectedDate, 'yyyy/MM/dd')}
${koreanWeek}까지`}
          </div>
          <div style={{ display: 'none' }}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                open={isClickDate}
                onClose={() => setIsClickDate(false)}
                format='MM/dd/yyyy'
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <div style={{ width: '40px', padding: '4px 6px', borderRight: '1px solid #eee' }}>
          <div
            onClick={(e) => {
              setColorRef(e.currentTarget);
            }}
            style={{
              height: '100%',
              backgroundColor: color,

              borderRadius: '5%',
              // boxShadow: '0px 0px 1px rgba(0,0,0,1)',
            }}
          />
        </div>
        <input
          placeholder='Add a To-do'
          style={{ paddingLeft: '6px', border: 'none', width: '100%', fontSize: '18px', fontWeight: 'bold' }}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitToDo();
              e.currentTarget.value = '';
              setInputText('');
            }
          }}
        />
      </div>
      <Popover
        open={Boolean(colorRef)}
        anchorEl={colorRef}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        onClose={() => setColorRef(null)}
      >
        <ChromePicker onChangeComplete={(color) => setColor(color.hex)} color={color} />
      </Popover>
      {alert}
    </div>
  );
};

export default ToDo;