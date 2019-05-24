import React, {Component} from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid'
import Select from 'react-select'
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../../i18n'
import {ADD_AUDIO, CHANGE_AUDIO, REMOVE_AUDIO} from "../actions";

class Audio extends Component {

  setAudio = cid => selected => {
    this.props.dispatch({
      type: CHANGE_AUDIO,
      cid,
      payload: {
        audio: selected ? selected.value : null
      }
    })
  }

  changeInt = (cid, key) => e => {

    let value = parseInt(e.target.value)
    if (isNaN(value)) value = 0;

    this.props.dispatch({
      type: CHANGE_AUDIO,
      cid,
      payload: {
        [key]: value
      }
    })
  }

  removeAudio = cid => () => {
    this.props.dispatch({
      type: REMOVE_AUDIO,
      payload: {
        cid
      }
    })
  }

  addAudio = () => {
    this.props.dispatch({
      type: ADD_AUDIO,
      payload: {
        cid: uuid(),
        audio: null,
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

    const audioOptions = this.props.audio.map(item => ({
      value: item._id,
      label: item.name
    }))

    return <div className="container my-2 py-3 bg-yellow shadow-sm">

      <div className="row">
        <div className="col-12 col-lg-6 text-center text-lg-left">
          <h1 className="h3">{i18n.t('scenario_edit.audio')}</h1>
        </div>
        <div className="col-12 col-lg-6 text-center text-lg-right">
          <button
            className="btn btn-sm btn-primary"
            onClick={this.addAudio}>
            <i className="fa fa-plus"/>&nbsp;{i18n.t('placeholders.new')}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-10 mx-auto">

          {Object.values(model.audio).map((item, key) => {

            const selectedAudio = item.audio
              ? this.props.audio.find(i => item.audio === i._id)
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
                      onClick={this.removeAudio(item.cid)}>
                      <i className="fa fa-times"/>&nbsp;{i18n.t('placeholders.remove')}
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-1">

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>{i18n.t('scenario_edit.audio')}</label>
                      <Select
                        onChange={this.setAudio(item.cid)}
                        value={selectedAudio ? {
                          value: selectedAudio._id,
                          label: selectedAudio.name
                        } : null}
                        options={audioOptions}/>
                      {this.getError('audio_' + item.cid)}
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

Audio.propTypes = {
  ScenarioEdit: PropTypes.any.isRequired,
  audio: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  ScenarioEdit: store => store.ScenarioEdit,
  audio: store => store.Audio.items,
  locale: store => store.App.locale,
})

export default connect(selectors)(Audio)
