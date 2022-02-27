import React, { Component } from 'react'
import { Carousel } from 'antd-mobile';
import { WingBlank, WhiteSpace } from 'antd-mobile';
import axios from 'axios';

// 导入图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'


import './index.scss'

const navs = [
    {
        id:1,
        img:Nav1,
        title:'整租',
        path:'/home/list'
    },
    {
        id:2,
        img:Nav2,
        title:'合租',
        path:'/home/list'
    },
    {
        id:3,
        img:Nav3,
        title:'地图找房',
        path:'/home/map'
    },
    {
        id:4,
        img:Nav4,
        title:'去出租',
        path:'/home/list'
    },
]



export default class Index extends Component {

    state = {
        swipper:[],
        data: ['1', '2', '3'],
        isSwipperLoader:false,
        group:[],
        newsinfo:[]
    }

    getSwipper = async()=>{
        const res = await axios.get('http://localhost:8080/home/swiper');
        this.setState({
            swipper:res.data.body, 
            isSwipperLoader:true
        });
    }

    getNewsData = async()=>{
        const res = await axios.get("http://localhost:8080/home/news",{
            params:{
                area:"AREA%7C88cff55c-aaa4-e2e0"
            }
        })
        this.setState({newsinfo:res.data.body})
    }

    componentDidMount() {
        // get swipper data
        this.getSwipper();
        //get group data
        this.getGroupData();
        //get news dara
        this.getNewsData();
    }

    renderSwipper = ()=>{
        const {swipper} = this.state;
        console.log(swipper)
        return swipper.map(item => (
                <a
                key={item.id}
                style={{ display: 'inline-block', width: '100%', height: 212 }}
                >
                <img
                    src={`http://localhost:8080${item.imgSrc}`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
                </a>
            ))
    }

    renderMiddleBar = ()=>{
        return navs.map(val => (
            <div key = {val.id} className="item" onClick={()=>{this.props.history.push(val.path)}}>
                <img src={val.img} alt="" />
                <span>{val.title}</span>
            </div>
        ))
    }

    renderNewsInfo = ()=>{
        const {newsinfo} = this.state;
        return newsinfo.map(item => {
            return (
                <div key = {item.id} className='new-item'>
                    <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                    <div className='news-info'>
                        <span className='news-title'>{item.title}</span>
                        <div className='when'>
                            <span className='source'>{item.date}</span>
                            <span className='time'>{item.from}</span>
                        </div>
                    </div>
                </div>
            )
        })
    }

    getGroupData = async() => {
        const res = await axios.get('http://localhost:8080/home/groups', {
            params:{
                area:"area=AREA%7C88cff55c-aaa4-e2e0"
            }
        })
        console.log(res)
        this.setState({group:res.data.body})
    }

    renderGroupData = () => {
        const {group} = this.state;
        return group.map(item => {
            return (
                <div className='card'>
                    <div className='info'>
                        <span>{item.title}</span>
                        <span>{item.desc}</span>
                    </div>
                    <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
                </div>
            )
        })
    }

    render() {
        const {isSwipperLoader} = this.state;
        return (
            <div>
                {/* carousel part */}
                <div className='carousel'>
                    {
                        isSwipperLoader ? 
                        <Carousel
                            autoplay={false}
                            infinite
                            >
                            {this.renderSwipper()}
                        </Carousel> :""
                    }
                     {/* search part */}
                     <div className='search-wrapper'>
                        <div className='search-info'>
                            <div className='search-city' onClick={()=>{this.props.history.push('/citylist')}}>
                                <span>济南</span>
                                <i className='iconfont icon-arrow'></i>
                            </div>
                            <span className='delimiter'>|</span>
                            <div className='search-content'>
                                <i className='iconfont icon-seach'></i>
                                <span>请输入小区或地址</span>
                            </div>
                        </div>
                        <i className='iconfont icon-map' onClick = {()=>{this.props.history.push('/map')}}></i>
                    </div>
                </div>
                {/* middle nav */}
                <div className='middleBar'>
                    {
                        this.renderMiddleBar()
                    }
                </div>
                {/* 租房小组 */}    
                <WingBlank>
                    <div className='group'>
                        <span className='title'>租房小组</span>
                        <span className='more'>更多</span>
                    </div>
                    <div className='cards'>
                        {this.renderGroupData()}
                    </div>
                </WingBlank>
                {/* 最新咨询 */}
                <div className='bottom'>
                    <div className='leastedNews'>最新资讯</div>
                    {this.renderNewsInfo()}
                </div>
            </div>
        )
    }
}
