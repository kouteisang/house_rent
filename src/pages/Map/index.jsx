import axios from 'axios';
import React, { Component } from 'react'
import NavHeader from '../../component/NavHeader';
import styles from './index.module.css'
import './index.scss'

import pic from '../../assets/images/7bk85cak9.jpeg'

export default class Map extends Component {


    state = {
        houseList:[],
        isShow:false
    }

    componentDidMount(){
        this.initMap();
    }

    

    initMap = () => {
        const map = new window.BMapGL.Map("container");
        this.map = map;
        let {label, value} = JSON.parse(localStorage.getItem("hkzf_city"));
        const myGeo = new window.BMapGL.Geocoder();
        const scaleCtrl = new window.BMapGL.ScaleControl();
        const zoomCtrl = new window.BMapGL.ZoomControl();
        myGeo.getPoint(label, (point)=>{
            if(point){
                map.centerAndZoom(point, 11);
                map.addControl(scaleCtrl);
                map.addControl(zoomCtrl);   
                this.renderOverlays(value)
            }else{
                alert('您选择的地址没有解析到结果！');
            }
        }, label)

        map.addEventListener('movestart', ()=>{
            if(this.state.isShow == true){
                this.setState({isShow:false});
            }
        })
    }


    renderOverlays = async(value) => {
        const overlays = await axios.get("http://localhost:8080/area/map",{
            params:{
                id:value
            }
        });
        const res = overlays.data.body;
        const {nextZoom, type} = this.getZoom();
        

        res.forEach(element => {
            this.createOverlays(element, nextZoom, type)
        });
       
    }

    getZoom = () => {
        const zoom = this.map.getZoom();
        let nextZoom = 11;
        let type = "circle"
        if(zoom > 10 && zoom < 12){
            nextZoom = 13
            type = "circle";
        }else if(zoom > 12 && zoom < 14){
            nextZoom = 15
            type = "circle";
        }else if(zoom == 15){
            nextZoom = 15;
            type = "rect";
        }
        return {nextZoom, type};
    }

    getHouseList = async (value) => {
        const res = await axios.get(`http://localhost:8080/houses?cityId=${value}`);
        console.log(res.data.body.list)
        this.setState({houseList:res.data.body.list, isShow:true});
    }

    renderHouseList = () => {
        const {houseList} = this.state;
        return houseList.map((item) => {
            const {tags} = item;
            console.log(tags)
            return (
                <div className='house-items' key={item.houseCode}>
                    <img src={`http://localhost:8080${item.houseImg}`} alt="" />
                    <div className='items'>
                        <p className='title'>{item.title}</p>
                        <p className="info">{item.desc}</p>
                        <div>
                            {
                                tags.map((tag, index)=>{
                                    index = index % 3 + 1;
                                    let cn = "tag"+index;
                                    return (
                                        <span className={cn}>{tag}</span>
                                    )
                                })
                            }
                        </div>
                        <div className='price'>
                            <span>{item.price}</span>
                            <span>元/月</span>
                        </div>
                    </div>
                </div>
            )
        })
    }

    createOverlays = (element, nextZoom, type) => {
        const {coord:{latitude, longitude}} = element;
        const positionPoint = new window.BMapGL.Point(longitude,latitude);
        const opts = {
                position: positionPoint, // 指定文本标注所在的地理位置
                offset: new window.BMapGL.Size(-35, -35)
        };
        let label = new window.BMapGL.Label('', opts);
        label.setStyle({
            backgroundColor:"rgba(0,0,0,0)",
            border:"0px"
        })
        
        if(type == "circle"){
            label.setContent(`
            <div class="${styles.circle}">
                <div class="${styles.pos}">
                    <p class="${styles.labelName}">${element.label}</p>
                    <p >${element.count}套</p>
                </div>
            <div>
        `)
            label.addEventListener('click', ()=>{
                this.map.clearOverlays();
                this.map.centerAndZoom(positionPoint, nextZoom);
                this.renderOverlays(element.value)
            })
        }else if(type == "rect"){
            label.setContent(
                `
                <div class="${styles.rect}">
                    <span>${element.label}<span>
                    <span>${element.count}套<span>
                    <div class="${styles.arrow}"></div>    
                <div>
                `
            )
            label.addEventListener('click', ()=>{
                this.getHouseList(element.value);
            })
        }
        this.map.addOverlay(label)

        
    }

    render() {
        const {isShow} = this.state;
        return (
            <div className='map'>

                <NavHeader>地图找房</NavHeader>

                <div id='container'></div>

            
                {/* <div className={`${isShow ? ' house-info' :' '}`}> */}
                <div className={`house-info ${isShow ? ' show': ''}`}>
                    <div className='house-info-title'>
                        <span>房屋列表</span>
                        <span>更多房源</span>
                    </div>
                    {
                        this.renderHouseList()
                    }
                </div>
            

            </div>
        )
    }
}
