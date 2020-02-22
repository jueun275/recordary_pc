import React from 'react';
import './SearchField.css' ;
import TabSearch from 'Components/UI/TabSearch'

import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

import axios from 'axios';


class SearchFieldResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // data : props.data,
            data : {
                searchedUser : [
                    {
                        user_id : 'hgd',
                        user_nm : '홍길동',
                        user_pic: null,
                        user_ex : '안녕하세요',
                        user_click : false,
                    },
                    {
                        user_id : 'wsh',
                        user_nm : '위성호',
                        user_pic: null,
                        user_ex : '안녕하세요222',
                        user_click : false,
                    }
                ]
            },
            followerIconClick : false,
        }
    }
    // data = {
    //     searchedUser = [
    //         {
    //             user_id : 'hgd',
    //             user_nm : '홍길동',
    //             user_pic: null,
    //             user_ex : '안녕하세요',
    //             user_click : false,
    //         },
    //         {
    //             user_id : 'wsh',
    //             user_nm : '위성호',
    //             user_pic: null,
    //             user_ex : '안녕하세요222',
    //             user_click : false,
    //         }
    //     ]
    // }
    

    followerChange = (index, click) => {

        const array = this.state.data.searchedUser;
        array[index] = { ...array[index], user_click: click };

        this.setState({ searchedUser : array });

    };
    
    render() {
        console.log(this.state.data);
        const exfollowList = this.state.data.searchedUser.map((value, index) => { 
            return (
                <li key={value.user_id} >
                    <div className="follower_list">
                        <div style={{display:'flex', alignItems:'center', marginBottom:'10px'}}>
                            <img
                                alt="friend-img" 
                                style={{marginRight:'10px', borderRadius:'50%'}} 
                                src={value.user_pic} 
                            />
                            {value.user_nm}
                        </div>
                        <div>
                            {(()=>{
                                if (!value.user_click) {
                                    return (
                                        <FollowButton onClick={async(e) => {
                                            console.log(value);
                                            e.preventDefault();
                                            this.followerChange(index, !value.user_click);

                                            const Form = new FormData();
                                            Form.append('user_id', value.user_id);
                                            
                                            const { data } = await axios.get(`http://localhost:8080/${value.user_id}/follow`);
                                            // .catch();
                                            console.log(data);
                                        }}>
                                            <AddIcon style={{ fontSize: '20px;' }} />
                                        </FollowButton>)
                                } else {
                                    return (
                                        <FollowButton onClick={async(e) => {
                                            console.log(value);
                                            e.preventDefault();
                                            this.followerChange(index, !value.user_click);

                                            const Form = new FormData();
                                            Form.append('user_id', value.user_id);
                                            Form.append('user_nm', value.user_nm);
                                            Form.append('user_pic', value.user_pic);
                                            Form.append('user_click', value.user_click);
                                            
                                            const { data } = await axios.get(`http://localhost:8080/${value.user_id}/unFollow`);
                                            // .catch();
                                            console.log(data);
                                        }}>
                                            <HowToRegIcon style={{ fontSize: '20px;' }} />
                                        </FollowButton>)
                                }
                            })()}
                            
                        </div>
                    </div>
                </li>
            )}
        );

        return (
            <Dialog open style={{ backgroundColor: 'rgba(241, 242, 246,0.1)' }}  onClose={() => this.props.onCancel()} >
                <div className="searchField-result">
                    <div className="searchField-title">
                        <SearchIcon style={{ fontSize: '30px;', color: 'white', marginTop: '5px'}}  />
                    </div><hr/>
                    <div className="searchField-result-list">
                        <div className="group-follow_change">
                            <div>
                                <TabSearch style={{marginBottom: '10px'}}/>
                            </div>
                            <div className="follower_list">
                                <ul>
                                    {exfollowList}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

const FollowButton = styled(Button)({
    minWidth: '30px',
    height: '40px',
});


export default SearchFieldResult;