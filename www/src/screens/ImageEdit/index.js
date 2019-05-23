import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../i18n'
import * as Pages from '../../router/Pages'
import Save from './actions/Save'
import Remove from './actions/Remove'
import Fetch from './actions/Fetch'
import {CHANGE, CHANGE_TRANSLATION, RESET, SET_TRANSLATION_TAB} from "./actions";

const typeOptions = [
  {value: 'color', label: i18n.t('image_types.color')},
  {value: 'bonus', label: i18n.t('image_types.bonus')},
  {value: 'statue', label: i18n.t('image_types.statue')},
]

class ImageEdit extends Component {

  componentDidMount() {

    const {id} = this.props.match.params
    const {locale} = this.props

    if (id) {
      this.props.dispatch(Fetch(id))
    }

    this.setTab(locale)()
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: RESET
    })
  }

  save = () => {
    const {model} = this.props.ImageEdit

    this.props.dispatch(Save(model))
  }

  remove = () => {
    const {model} = this.props.ImageEdit

    this.props.dispatch(Remove(model, () => {
      this.props.history.push(Pages.IMAGES)
    }))
  }

  setTab = payload => () => {
    this.props.dispatch({
      type: SET_TRANSLATION_TAB,
      payload
    })
  }

  change = (key, value) => {
    this.props.dispatch({
      type: CHANGE,
      payload: {
        [key]: value
      }
    })
  }

  changeSelect = name => e => this.change(name, e.target.value)

  changeBool = name => e => this.change(name, e.target.checked)

  changeString = name => e => this.change(name, e.target.value)

  changeLocaleString = name => e => {
    const {translationTab} = this.props.ImageEdit

    this.props.dispatch({
      type: CHANGE_TRANSLATION,
      locale: translationTab,
      payload: {
        [name]: e.target.value
      }
    })
  }

  getError = name => {
    const {validator} = this.props.ImageEdit

    if (!validator.errors) return null
    if (!validator.errors[name]) return null

    return <div className="small text-danger">{validator.errors[name]}</div>
  }

  render() {

    const {locales} = this.props
    const {model, translationTab, isLoading, isValid, serverErrors} = this.props.ImageEdit

    const currentTranslation = model.translations[translationTab] || null

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-lg-6 text-center text-lg-left">
              <h1 className="h3">{model._id ? i18n.t('image_edit.title') : i18n.t('image_edit.title_new')}</h1>
            </div>
            <div className="col-12 col-lg-6 text-center text-lg-right">

              <Link
                to={Pages.IMAGES}
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
            <label>{i18n.t('image_edit.name')}</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={model.name || ''}
              onChange={this.changeString('name')}/>
            {this.getError('name')}
          </div>

          <div className="form-group">
            <label>{i18n.t('image_edit.file')}</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={model.file || ''}
              onChange={this.changeString('file')}/>
            {this.getError('file')}
          </div>

          <div className="form-group">
            <label>{i18n.t('image_edit.type')}</label>
            <select
              className="form-control form-control-sm"
              value={model.type || -1}
              onChange={this.changeSelect('type')}>
              <option value={-1}>...</option>
              {typeOptions.map((type, key) =>
                <option key={key} value={type.value}>{type.label}</option>
              )}
            </select>
            {this.getError('type')}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isAnimation}
                onChange={this.changeBool('isAnimation')}/>
              &nbsp;{i18n.t('image_edit.isAnimation')}
            </label>
            {this.getError('isAnimation')}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isForbidden}
                onChange={this.changeBool('isForbidden')}/>
              &nbsp;{i18n.t('image_edit.isForbidden')}
            </label>
            {this.getError('isForbidden')}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isBonus}
                onChange={this.changeBool('isBonus')}/>
              &nbsp;{i18n.t('image_edit.isBonus')}
            </label>
            {this.getError('isBonus')}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isSuperBonus}
                onChange={this.changeBool('isSuperBonus')}/>
              &nbsp;{i18n.t('image_edit.isSuperBonus')}
            </label>
            {this.getError('isSuperBonus')}
          </div>

          <ul className="nav nav-tabs mb-2">
            {locales.map((locale, key) =>
              <li key={key} className="nav-item" onClick={this.setTab(locale)}>
                <span className={"nav-link" + (translationTab === locale ? " active" : '')}>{locale}</span>
              </li>
            )}
          </ul>

          <div className="form-group">
            <label>{i18n.t('image_edit.description')}</label>
            <textarea
              className="form-control form-control-sm"
              value={currentTranslation && currentTranslation.description ? currentTranslation.description : ''}
              onChange={this.changeLocaleString('description')}/>
            {this.getError('description_' + translationTab)}
          </div>

          <div className="form-group">
            <label>{i18n.t('image_edit.statueTitle')}</label>
            <textarea
              className="form-control form-control-sm"
              value={currentTranslation && currentTranslation.statueTitle ? currentTranslation.statueTitle : ''}
              onChange={this.changeLocaleString('statueTitle')}/>
            {this.getError('statueTitle_' + translationTab)}
          </div>


        </div>
      </div>
    </div>
  }
}

ImageEdit.propTypes = {
  ImageEdit: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
  locales: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  ImageEdit: store => store.ImageEdit,
  locale: store => store.App.locale,
  locales: store => store.App.locales,
})

export default withRouter(
  connect(selectors)(ImageEdit)
)
