import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../i18n'
import * as Pages from '../../router/Pages'
import Save from './actions/Save'
import Remove from './actions/Remove'
import Fetch from './actions/Fetch'
import {CHANGE, RESET} from "./actions";

class AudioEdit extends Component {

  componentDidMount() {
    const {id} = this.props.match.params

    if (id) {
      this.props.dispatch(Fetch(id))
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: RESET
    })
  }

  save = () => {
    const {model} = this.props.AudioEdit

    this.props.dispatch(Save(model))
  }

  remove = () => {
    const {locale} = this.props
    const {model} = this.props.AudioEdit

    this.props.dispatch(Remove(model, () => {
      this.props.history.push(Pages.AUDIO.replace(':locale', locale))
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

  changeString = name => e => this.change(name, e.target.value)

  changeInt = name => e => {
    let value = parseInt(e.target.value)
    if (isNaN(value)) value = 0

    this.change(name, value)
  }

  getError = name => {
    const {validator} = this.props.AudioEdit

    if (!validator.errors) return null
    if (!validator.errors[name]) return null

    return <div className="small text-danger">{validator.errors[name]}</div>
  }

  render() {

    const {locale} = this.props
    const {model, isLoading, isValid, serverErrors} = this.props.AudioEdit

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-lg-6 text-center text-lg-left">
              <h1 className="h3">{model._id ? i18n.t('audio_edit.title') : i18n.t('audio_edit.title_new')}</h1>
            </div>
            <div className="col-12 col-lg-6 text-center text-lg-right">

              <Link
                to={Pages.AUDIO.replace(':locale', locale)}
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
            <label>{i18n.t('audio_edit.duration')}</label>
            <input
              type="number"
              min={0}
              step={1}
              className="form-control form-control-sm"
              value={model.duration || ''}
              onChange={this.changeInt('duration')}/>
            {this.getError('duration')}
          </div>

        </div>
      </div>
    </div>
  }
}

AudioEdit.propTypes = {
  AudioEdit: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  AudioEdit: store => store.AudioEdit,
  locale: store => store.App.locale,
})

export default withRouter(
  connect(selectors)(AudioEdit)
)
