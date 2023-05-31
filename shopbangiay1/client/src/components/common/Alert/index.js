
import 'antd/dist/antd.less';
import { Button, Alert, Space } from 'antd';
import "./style.scss";
import { useRef } from 'react';

const AlertConfirm = (props) => {
    const ref = useRef()
    const handleClick = () => {
        ref.current.style = 'display: none'
    }
    return (
        <>
            <div ref={ref} onClick={handleClick}>
                <Alert
                    style={{ position: 'fixed', width: '100%', zIndex: '100', top: 0, left: 0 }}
                    message={props.message}
                    description={props.description}
                    type={props.type}
                    action={
                        <Space direction="vertical">
                            <Button
                                size="small" type="primary"
                                onClick={props.handleAcept}
                            >
                                Accept
                            </Button>
                            <Button
                                size="small" danger type="ghost"
                                onClick={props.handleDecline}
                            >
                                Decline
                            </Button>
                        </Space>
                    }
                />
                <div className="clearfixx"></div>
            </div>
        </>
    )
}
export default AlertConfirm;