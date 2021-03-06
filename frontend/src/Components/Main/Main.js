import React, { useState, useEffect } from 'react';
import './mainPage.css';

import axios from 'axios';
import Timeline from '../Timeline/Timeline';
import TimelineWeekSchedule from '../Timeline/TimelineWeekSchedule';
import PostShareTimeline from '../Timeline/PostShareTimeline';
import OnlyPostExTimeline from '../Timeline/OnlyPostExTimeline';

const Main = (props) => {
  return (
    <main>
      <div id='timeline-list'>
        {props.timeline.map((value, index) => {
          if (value.mediaFK !== null) {
            return (
              <div className='timeline-Margin' key={`${value.postCd}-${index}`}>
                <Timeline
                  data={value}
                  user={props.data}
                  onPostDelete={(postCd) => {
                    props.onPostDelete(postCd);
                  }}
                />
              </div>
            );
          } else if (value.scheduleFK !== null || value.shareScheduleList.length > 0) {
            return (
              <div className='timeline-Margin' key={`${value.postCd}-${index}`}>
                <TimelineWeekSchedule
                  data={value}
                  user={props.data}
                  onPostDelete={(postCd) => {
                    props.onPostDelete(postCd);
                  }}
                />
              </div>
            );
          } else if (value.postOriginFK !== null) {
            return (
              <div className='timeline-Margin' key={`${value.postCd}-${index}`}>
                <PostShareTimeline
                  data={value}
                  user={props.data}
                  onPostDelete={(postCd) => {
                    props.onPostDelete(postCd);
                  }}
                />
              </div>
            );
          } else
            return (
              <div className='timeline-Margin' key={`${value.postCd}-${index}`}>
                <OnlyPostExTimeline
                  data={value}
                  user={props.data}
                  onPostDelete={(postCd) => {
                    props.onPostDelete(postCd);
                  }}
                />
              </div>
            );
        })}
      </div>
    </main>
  );
};

export default Main;
