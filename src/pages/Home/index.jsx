import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import CityList from '../CityList';
import Index from '../Index'
import News from '../News';
import Profile from '../Profile';

import './index.scss'


const tabItems = [ 
    {
        title:'首页',
        icon: 'icon-ind',
        path: '/home'
    },
    {
        title:'找房',
        icon: 'icon-findHouse',
        path: '/home/list'
    },
    {
        title:'咨询',
        icon: 'icon-infom',
        path: '/home/news'
    },
    {
        title:'我的',
        icon: 'icon-my',
        path: '/home/profile'
    }
]


export default class Home extends Component {

    state = {
        locationPath: this.props.location.pathname
    };

    renderTabbar = () => {
        const {locationPath} = this.state;
        return tabItems.map((item)=>(
            <TabBar.Item
                title = {item.title}
                icon = {<i className={`iconfont ${item.icon}`}></i>}
                key={item.title}
                selectedIcon = {<i className={`iconfont ${item.icon}`}></i>}
                onPress = {
                    ()=>{
                        this.setState({locationPath:item.path})
                        this.props.history.push(item.path)
                    }
                }
                selected={locationPath == item.path}
            ></TabBar.Item>
        ))
    }

    render() {
        return (
            <div className='home'>

                <Switch>
                    <Route exact path='/home' component={Index}></Route>
                    <Route path='/home/list' component={CityList}></Route>
                    <Route path='/home/news' component={News}></Route>
                    <Route path='/home/profile' component={Profile}></Route>
                </Switch>

                <TabBar
                unselectedTintColor="#949494"
                tintColor="#21b97a"
                barTintColor="white"
                >
                {this.renderTabbar()}
                </TabBar>
            </div>
        )
    }
}
