import React, { Component } from 'react'
import './home.scss'


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };
    }

    render() {
        return (
            <div className='home-page'>
                <p className='welcom'>欢迎使用自研BI系统</p>
            </div>
        )
    }

}

export default Home;
