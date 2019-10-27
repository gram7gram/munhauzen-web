import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../i18n'
import {CHANGE} from "./actions";
import LoginAction from "./actions/Login";
import logo from "../../assets/images/menu_logo.png";
import parameters from "../../parameters";
import gplay from "../../assets/images/gplay.png";
import apPStore from "../../assets/images/app-store.png";

class Login extends Component {

  loginCheck = () => {
    const {password} = this.props.Login

    this.props.dispatch(LoginAction({
      password
    }))
  }

  checkIfEnter = e => {
    if (e.key === 'Enter') {
      this.loginCheck()
    }
  }

  change = (key, value) => {
    this.props.dispatch({
      type: CHANGE,
      payload: {
        [key]: value
      }
    })
  }

  changeString = name => e => this.change(name, e.target.value)

  render() {

    const {password, isLoading, isError} = this.props.Login

    return <div className="container my-5">

      <div className="row">
        <div className="col-10 col-sm-6 col-lg-4 mx-auto my-4">
          <img src={logo} className="img-fluid mx-auto" alt=""/>
        </div>
      </div>

      <div className="row">
        <div className="col-10 col-sm-6 col-lg-4 mx-auto py-4 bg-yellow shadow-sm">

          <div className="form-group">
            <input className="form-control form-control-lg text-center"
                   type="password"
                   placeholder="*******"
                   onKeyPress={this.checkIfEnter}
                   onChange={this.changeString('password')}
                   value={password || ''}/>

            {isError ? <div className="text-center text-danger">{i18n.t('login.error_msg')}</div> : null}
          </div>

          <button className="btn btn-success btn-lg btn-block"
                  onClick={this.loginCheck}
                  disabled={isLoading || !password}>
            <i className={"fa " + (isLoading ? "fa-spin fa-circle-o-notch" : "fa-lock")}/>
            &nbsp;{i18n.t('login.action')}
          </button>


        </div>
      </div>

      <div className="row">
        <div className="col-10 col-sm-6 col-lg-4 mx-auto my-4">
          <div className="row">
            <div className="col-6">

              <a href={parameters.gplayLink} rel="nofollow">
                <img src={gplay} className="img-fluid"
                     height="50"
                     alt=""/>
              </a>

            </div>
            <div className="col-6">

              <a href={parameters.appStoreLink} rel="nofollow">
                <img src={apPStore} className="img-fluid"
                     height="50"
                     alt=""/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

Audio.propTypes = {
  Login: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  Login: store => store.Login,
  locale: store => store.App.locale
})

export default connect(selectors)(Login);
