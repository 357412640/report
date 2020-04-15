import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './SvgIcon.scss'

class SvgIcon extends Component {
    render() {
        return (
            <svg
                className={`svg-class ${this.props.propClass}`}
                style={{
                    fill: this.props.color || ''
                }}
                aria-hidden="true"
                onClick={(e) => {
                    this.props.click && this.props.click(e)
                }}
            >
                <use xlinkHref={`#icon-${this.props.iconClass}`} />
            </svg>
        )
    }
}

SvgIcon.defaultProps = {
    color: '#000',
    propClass: ''
}

SvgIcon.propTypes = {
    iconClass: PropTypes.string.isRequired,
    color: PropTypes.string,
    propClass: PropTypes.string,
    click: PropTypes.func
}

export default SvgIcon
