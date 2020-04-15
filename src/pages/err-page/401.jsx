import Page401 from './component'
import React, {Component} from 'react'
import src401 from "@/assets/images/err-page/error-404.svg"

class Err401 extends Component {
  render () {
    return(
      <Page401 src={src401} code='401' desc="很抱歉~~您没有权限,请联系管理员开通~"></Page401>
    )
  }
}

export default Err401