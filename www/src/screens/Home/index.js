import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import random from 'random';
import {createStructuredSelector} from "reselect";
import i18n from "../../i18n";

import Upload from "./actions/Upload";

import img1 from "../../assets/images/Жене.jpg";
import img2 from "../../assets/images/Космос.jpg";
import img3 from "../../assets/images/Лопата_Рішуче.jpg";

const images = [
  img1, img2, img3
]

class Home extends PureComponent {

  upload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    this.props.dispatch(Upload(file))

    e.target.files = null
  }

  render() {

    const {isUploading, isDownloading} = this.props.Home

    return <div className="container my-2 py-3">
      <div className="row">
        <div className="col-8 mx-auto">
          <div className="row">
            <div className="col-6 text-center">
              <h1 className="my-3">{i18n.t('home.title')}</h1>

              <label className={"btn btn-block btn-warning mb-2" + (isUploading ? " disabled" : "")}>
                <i className={isUploading ? "fa fa-spin fa-circle-o-notch" : "fa fa-upload"}/>
                &nbsp;{i18n.t('placeholders.import_file')}

                <input type="file"
                       disabled={isUploading}
                       onChange={this.upload}
                       className="d-none"
                       accept={'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
                       min={1}
                       max={1}/>

              </label>

              <button className="btn btn-block btn-success mb-2" disabled={isDownloading}>
                <i className={isDownloading ? "fa fa-spin fa-circle-o-notch" : "fa fa-download"}/>
                &nbsp;{i18n.t('placeholders.export_file')}
              </button>
            </div>

            <div className="col-6 text-center">
              <img src={images[random.int(0, images.length - 1)]}
                   alt=""
                   className="img-fluid shadow"/>
            </div>

          </div>
        </div>
      </div>
    </div>
  }
}

Home.propTypes = {
  Home: PropTypes.any.isRequired
}

const selectors = createStructuredSelector({
  Home: store => store.Home
})

export default connect(selectors)(Home);
