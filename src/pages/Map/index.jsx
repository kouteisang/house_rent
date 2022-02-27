import axios from 'axios';
import React, { Component } from 'react'
import NavHeader from '../../component/NavHeader';
import styles from './index.module.css'
import './index.scss'

export default class Map extends Component {


    componentDidMount(){
        this.initMap();
    }

    

    initMap = () => {
        const map = new window.BMapGL.Map("container");
        this.map = map;
        let {label, value} = JSON.parse(localStorage.getItem("hkzf_city"));
        console.log(label, value)
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

    createOverlays = (element, nextZoom, type) => {
        const {coord:{latitude, longitude}} = element;
        console.log(element)
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
                <p class="${styles.title}">${element.label}</p>
                <p class="${styles.number}">${element.count}套</p>
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
        }
        this.map.addOverlay(label)

        
    }

    render() {
        return (
            <div className='map'>

                <NavHeader>地图找房</NavHeader>

                <div id='container'></div>
            </div>
        )
    }
}
