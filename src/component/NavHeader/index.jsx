import React, { Component } from 'react'
import { NavBar, Toast} from 'antd-mobile'
import './index.scss'

export default class NavHeader extends Component {
    render() {
        const {children} = this.props
        return (
            <div>
                <NavBar 
                    icon={<i className="iconfont icon-back"/>}
                    className='navbar'
                    onClick = {()=>{this.props.history.go(-1)}}
                    >{children}</NavBar>
            </div>
        )
    }
}
