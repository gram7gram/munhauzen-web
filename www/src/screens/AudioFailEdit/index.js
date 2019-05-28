import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import Select from 'react-select'
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../i18n'
import * as Pages from '../../router/Pages'
import Save from './actions/Save'
import Remove from './actions/Remove'
import Fetch from './actions/Fetch'
import FetchAudio from '../Audio/actions/Fetch'
import {CHANGE, RESET} from "./actions";

class AudioFailEdit extends Component {

  componentDidMount() {
    const {id} = this.props.match.params

    if (id) {
      this.props.dispatch(Fetch(id))
    }

    if (this.props.audio.length === 0) {
      this.props.dispatch(FetchAudio())
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: RESET
    })
  }

  save = () => {
    const {model} = this.props.AudioFailEdit

    this.props.dispatch(Save(model))
  }

  remove = () => {
    const {model} = this.props.AudioFailEdit

    this.props.dispatch(Remove(model, () => {
      this.props.history.push(Pages.AUDIO_FAILS)
    }))
  }

  change = (key, value) => {
    this.props.dispatch({
      type: CHANGE,
      payload: {
        [key]: value
      }
    })
  }

  changeBool = name => e => this.change(name, e.target.checked)

  changeString = name => e => this.change(name, e.target.value)

  setAudio = selected => {
    this.change('audio', selected ? selected.value : null)
  }

  getError = name => {
    const {validator} = this.props.AudioFailEdit

    if (!validator.errors) return null
    if (!validator.errors[name]) return null

    return <div className="small text-danger">{validator.errors[name]}</div>
  }

  render() {

    const {locales} = this.props
    const {model, isLoading, isValid, serverErrors} = this.props.AudioFailEdit

    const selectedAudio = model.audio ?
      this.props.audio.find(item => model.audio === item.name)
      : null

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-lg-6 text-center text-lg-left">
              <h1
                className="h3">{model._id ? i18n.t('audio_fail_edit.title') : i18n.t('audio_fail_edit.title_new')}</h1>
            </div>
            <div className="col-12 col-lg-6 text-center text-lg-right">

              <Link
                to={Pages.AUDIO_FAILS}
                className="btn btn-sm btn-outline-secondary mr-1">
                {i18n.t('placeholders.cancel')}
              </Link>

              {model._id ?
                <button
                  onClick={this.remove}
                  className="btn btn-sm btn-outline-danger mr-1"
                  disabled={!isValid || isLoading}>{i18n.t('placeholders.remove')}</button>
                : null}

              <button
                onClick={this.save}
                className="btn btn-sm btn-primary"
                disabled={!isValid || isLoading}>{i18n.t('placeholders.save')}</button>
            </div>
          </div>
        </div>

        {serverErrors.length > 0 ? <div className="col-12">
          <div className="alert alert-danger mb-2">
            {serverErrors.map((error, key) => <div key={key}>{error}</div>)}
          </div>
        </div> : null}

        <div className="col-12">

          <div className="form-group">
            <label>{i18n.t('audio_fail_edit.audio')}</label>
            <Select
              onChange={this.setAudio}
              value={selectedAudio ? {
                value: selectedAudio.name,
                label: selectedAudio.name
              } : null}
              options={this.props.audio.map(item => ({
                value: item.name,
                label: item.name
              }))}/>
          </div>

          <div className="form-group">
            <label>{i18n.t('placeholders.name')}</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={model.name || ''}
              onChange={this.changeString('name')}/>
            {this.getError('name')}
          </div>

          <div className="form-group">
            <label>{i18n.t('placeholders.file')}</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={model.file || ''}
              onChange={this.changeString('file')}/>
            {this.getError('file')}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isFailMunhauzen}
                onChange={this.changeBool('isFailMunhauzen')}/>
              &nbsp;{i18n.t('audio_fail_edit.isFailMunhauzen')}
            </label>
            {this.getError('isFailMunhauzen')}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isFailDaughter}
                onChange={this.changeBool('isFailDaughter')}/>
              &nbsp;{i18n.t('audio_fail_edit.isFailDaughter')}
            </label>
            {this.getError('isFailDaughter')}
          </div>

          <div className="form-group">
            <label>{i18n.t('audio_fail_edit.locale')}</label>
            <select
              className="form-control form-control-sm"
              value={model.locale || -1}
              onChange={this.changeString('locale')}>
              <option value={-1}>...</option>
              {locales.map((locale, key) =>
                <option key={key} value={locale}>{locale}</option>
              )}
            </select>
            {this.getError('description')}
          </div>

          <div className="form-group">
            <label>{i18n.t('placeholders.description')}</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={model.description || ''}
              onChange={this.changeString('description')}/>
            {this.getError('description')}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isFailOpenedOnStart}
                onChange={this.changeBool('isFailOpenedOnStart')}/>
              &nbsp;{i18n.t('audio_fail_edit.isFailOpenedOnStart')}
            </label>
            {this.getError('isFailOpenedOnStart')}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isFailOpenedOnComplete}
                onChange={this.changeBool('isFailOpenedOnComplete')}/>
              &nbsp;{i18n.t('audio_fail_edit.isFailOpenedOnComplete')}
            </label>
            {this.getError('isFailOpenedOnComplete')}
          </div>

        </div>
      </div>
    </div>
  }
}

AudioFailEdit.propTypes = {
  AudioFailEdit: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  audio: PropTypes.any.isRequired,
  locales: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  AudioFailEdit: store => store.AudioFailEdit,
  audio: store => store.Audio.items,
  locales: store => store.App.locales,
})

export default withRouter(
  connect(selectors)(AudioFailEdit)
)
