import React from 'react';
import ReactDOM from 'react-dom';

//导入样式文件
import 'react-virtualized/styles.css'
import 'antd-mobile/dist/antd-mobile.css'
//导入字体图标库的样式文件
import './assets/fonts/iconfont.css'

import './index.css';
import App from './App';



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

