import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import random from 'random';
import {createStructuredSelector} from "reselect";
import i18n from "../../i18n";
import parameters from "../../parameters";

import Upload from "./actions/Upload";

import img1 from "../../assets/images/Жене.jpg";
import img2 from "../../assets/images/Космос.jpg";
import img3 from "../../assets/images/Лопата_Рішуче.jpg";

import gplay from "../../assets/images/gplay.png";
import apPStore from "../../assets/images/app-store.png";

const images = [
  img1, img2, img3
]

class Home extends PureComponent {

  upload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    this.props.dispatch(Upload(file))

    e.target.value = null
  }

  renderErrors() {

    const {uploadResult} = this.props.Home

    return <div className="p-2 bg-dark" style={{maxHeight: '500px', overflow: 'auto'}}>

      {uploadResult.map((result, key) => {

        const hasErrors = result.errors && result.errors.length > 0
        const hasWarnings = result.warnings && result.warnings.length > 0

        return <div key={key}>

          <p className={"mb-1"
          + (!hasWarnings && !hasWarnings ? " text-success" : "")
          + (hasWarnings ? " text-warning" : "")
          + (hasErrors ? " text-danger" : "")}>

            {!hasWarnings && !hasErrors ? <i className="fa fa-check"/> : null}

            {hasWarnings ? <i className="fa fa-warning"/> : null}

            {hasErrors ? <i className="fa fa-exclamation"/> : null}

            &nbsp;{result.sheet}
          </p>

          {hasErrors ? <div className="alert alert-danger p-1">
            {result.errors.map((e, key) => <div key={key}>{e.message}</div>)}
          </div> : null}

          {hasWarnings ? <div className="alert alert-warning p-1">
            {result.warnings.map((e, key) => <div key={key}>{e}</div>)}
          </div> : null}

        </div>
      })}
    </div>
  }

  render() {

    const {locale} = this.props
    const {isUploading, uploadResult} = this.props.Home

    return <div className="container-fluid my-2 py-3">
      <div className="row">
        <div className="col-8 mx-auto">
          <div className="row">
            <div className="col-12 col-lg-5 text-center">
              <h1>{i18n.t('home.title')}</h1>
              <h1>[ {locale} ]</h1>

              <div className="row my-4">
                <div className="col-12">

                  <label className={"btn btn-block btn-warning mb-2" + (isUploading ? " disabled" : "")}>
                    <i className={isUploading ? "fa fa-spin fa-circle-o-notch" : "fa fa-upload"}/>
                    &nbsp;{!isUploading ? i18n.t('placeholders.import_file') : i18n.t('placeholders.import_file_in_progress')}

                    <input type="file"
                           disabled={isUploading}
                           onChange={this.upload}
                           className="d-none"
                           accept={'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
                           min={1}
                           max={1}/>

                  </label>
                </div>
              </div>

              <div className="row">
                <div className="col-12 col-md-6">

                  <a href={parameters.gplayLink} rel="nofollow">
                    <img src={gplay} className="img-fluid"
                         alt=""/>
                  </a>

                </div>
                <div className="col-12 col-md-6">

                  <a href={parameters.appStoreLink} rel="nofollow">
                    <img src={apPStore} className="img-fluid"
                         alt=""/>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-7">

              {uploadResult && uploadResult.length > 0
                ? this.renderErrors()
                : <div className="text-center">
                  <img src={images[random.int(0, images.length - 1)]}
                       alt=""
                       className="img-fluid shadow mx-auto"/>
                </div>}

            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

Home.propTypes = {
  Home: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  Home: store => store.Home,
  locale: store => store.App.locale,
})

export default connect(selectors)(Home);
