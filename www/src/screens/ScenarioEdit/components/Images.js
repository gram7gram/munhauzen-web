import React, {Component} from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid'
import Select from 'react-select'
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../../i18n'
import {ADD_IMAGE, CHANGE_IMAGE, REMOVE_IMAGE} from "../actions";

class Images extends Component {

  setImage = cid => selected => {
    this.props.dispatch({
      type: CHANGE_IMAGE,
      cid,
      payload: {
        image: selected ? selected.value : null
      }
    })
  }

  changeInt = (cid, key) => e => {

    let value = parseInt(e.target.value)
    if (isNaN(value)) value = 0;

    this.props.dispatch({
      type: CHANGE_IMAGE,
      cid,
      payload: {
        [key]: value
      }
    })
  }

  removeImage = cid => () => {
    this.props.dispatch({
      type: REMOVE_IMAGE,
      payload: {
        cid
      }
    })
  }

  addImage = () => {
    this.props.dispatch({
      type: ADD_IMAGE,
      payload: {
        cid: uuid(),
        image: null,
        duration: 0,
      }
    })
  }

  getError = name => {
    const {validator} = this.props.ScenarioEdit

    if (!validator.errors) return null
    if (!validator.errors[name]) return null

    return <div className="small text-danger">{validator.errors[name]}</div>
  }

  render() {

    const {model} = this.props.ScenarioEdit

    const imagesOptions = this.props.images.map(item => ({
      value: item._id,
      label: item.name
    }))

    return <div className="container my-2 py-3 bg-yellow shadow-sm">

      <div className="row">
        <div className="col-12 col-lg-6 text-center text-lg-left">
          <h1 className="h3">{i18n.t('scenario_edit.images')}</h1>
        </div>
        <div className="col-12 col-lg-6 text-center text-lg-right">
          <button
            className="btn btn-sm btn-primary"
            onClick={this.addImage}>
            <i className="fa fa-plus"/>&nbsp;{i18n.t('placeholders.new')}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-10 mx-auto">

          {Object.values(model.images).map((item, key) => {

            const selectedImage = item.image
              ? this.props.images.find(i => item.image === i.name)
              : null

            return <div key={key} className="card mb-2">

              <div className="card-header px-2 py-1">
                <div className="row">
                  <div className="col-6">
                    <h4 className="mb-0">#{key + 1}</h4>
                  </div>
                  <div className="col-6 text-right">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={this.removeImage(item.cid)}>
                      <i className="fa fa-times"/>&nbsp;{i18n.t('placeholders.remove')}
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-2">

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>{i18n.t('scenario_edit.image')}</label>
                      <Select
                        onChange={this.setImage(item.cid)}
                        value={selectedImage ? {
                          value: selectedImage.name,
                          label: selectedImage.name
                        } : null}
                        options={imagesOptions}/>
                      {this.getError('image_' + item.cid)}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{i18n.t('scenario_edit.duration')}</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className="form-control form-control-sm"
                      value={item.duration || ''}
                      onChange={this.changeInt(item.cid, 'duration')}/>
                    {this.getError('duration_' + item.cid)}
                  </div>

                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    </div>
  }
}

Images.propTypes = {
  ScenarioEdit: PropTypes.any.isRequired,
  images: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  ScenarioEdit: store => store.ScenarioEdit,
  images: store => store.Images.items,
  locale: store => store.App.locale,
})

export default connect(selectors)(Images)
