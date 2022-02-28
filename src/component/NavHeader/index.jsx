import React, { Component } from 'react'
import { NavBar, Toast} from 'antd-mobile'
import { withRouter } from 'react-router-dom';
import './index.scss'

function NavHeader({history,children}) {

        return (
            <div>
                <NavBar 
                    icon={<i className="iconfont icon-back"/>}
                    className='navbar'
                    onClick = {()=>{history.go(-1)}}
                    >{children}</NavBar>
            </div>
        )
    
}

//withRouter(NavHeader) 的返回值仍然是一个组件
export default withRouter(NavHeader)