import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';
import './Loading.css'
import { getLoading } from '../../store/selectors/Selectors';


const Loading = () => {
    const loadingState = useSelector(getLoading)
    const antIcon = (
        <LoadingOutlined
          style={{
            fontSize: 120,
            color:'black'
          }}
          spin
        />
      );

  return (
    <div className={`loading ${loadingState?'show':''}`}>
        <Spin indicator={antIcon} spinning={loadingState}>
        </Spin>
    </div>
  )
}

export default Loading