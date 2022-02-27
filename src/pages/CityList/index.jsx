import React, { Component } from 'react'
import { NavBar} from 'antd-mobile'
import {List, AutoSizer} from 'react-virtualized';
import './index.scss'
import axios from 'axios'
import { getCurrentCity } from '../../utils'

export default class CityList extends Component {

    state = {
        cityList:{},
        cityIndex:[],
        startIndex:0,
    }

    async componentDidMount(){
        await this.getCityList();
    }

    formatCityData = (list)=>{
        let cityList = {}
        let cityIndex = []
        list.forEach(item=>{
            const firstLetter = item.short.substr(0, 1)
            if(cityList[firstLetter] == null){
                cityIndex.push(firstLetter);
                cityList[firstLetter] = [item];
            }else{
                cityList[firstLetter].push(item)
            }
        });
        cityIndex.sort();
        return {cityList, cityIndex};
    }

    getCityList = async() => {
        const res = await axios.get('http://localhost:8080/area/city',{
            params:{
                "level":1
            }
        })
        let {cityList, cityIndex} = this.formatCityData(res.data.body);
        const hotRes = await axios.get("http://localhost:8080/area/hot");
        cityList['hot'] = hotRes.data.body;
        // const curCity = await getCurrentCity()
        let curCity = null;
        await getCurrentCity().then((res)=>{
            // curCity = res;
            cityList['#'] = [res]
        })
        // cityList['current'] = curCity
        cityIndex.unshift('hot');
        cityIndex.unshift('#')
        this.setState({cityIndex, cityList});
    }

    changePosition = (index)=>{
        this.setState({startIndex:index});
    }

    renderCityIndex = ()=>{
        const {startIndex, cityIndex} = this.state;
        return cityIndex.map((item, index)=>{
            item = (item == 'hot' ? '热' : item.toUpperCase());
            return(
                <li onClick = {()=>{this.changePosition(index)}} className={startIndex == index ? "highlight" : ""}>{item}</li>
            )
        })
    }

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // 当前项是否正在滚动中
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // 注意：一定要给每一行的数据加一个style属性，作用指定每一行的位置
      }) =>{
        const {cityIndex, cityList} = this.state;
        const letter = cityIndex[index]
        return (
            <div key={key} style={style}>
                <div className='title'>{letter ==  'hot' ? '热':letter.toUpperCase()}</div>
                <div className='city-specific'>
                    {
                        cityList[letter].map((item) => {
                            return <div>{item.label}</div>
                        })
                    }
                </div>
            </div>
          );
        }

    getRowHeight = ({index}) =>{
        const {cityList, cityIndex} = this.state;
        return 34 + 50 * cityList[cityIndex[index]].length;
    }

    onRowsRendered = ({startIndex}) => {
        console.log(startIndex)
        this.setState({startIndex:startIndex})
        
    }

    render() {
        const {startIndex} = this.state;
        return (
            <div className='citylist'>
                <NavBar 
                    icon={<i className="iconfont icon-back"/>}
                    className='navbar'
                    >城市列表</NavBar>
                    
                <AutoSizer>
                    {
                    
                        ({height, width}) => (
                            <List
                            width={width}
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                            scrollToIndex = {startIndex}
                            scrollToAlignment = "start"
                            />
                        )
                    }
                </AutoSizer>  

                <ul className='city-index'>
                        {this.renderCityIndex()}
                </ul>
                
            </div>
        )
    }
}
