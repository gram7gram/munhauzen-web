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
import {CHANGE, CHANGE_TRANSLATION, RESET, SET_TRANSLATION_TAB} from "./actions";

class ChapterEdit extends Component {

  componentDidMount() {

    const {id} = this.props.match.params

    if (id) {
      this.props.dispatch(Fetch(id))
    }

    this.setTab(this.props.locale)()
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: RESET
    })
  }

  setTab = payload => () => {
    this.props.dispatch({
      type: SET_TRANSLATION_TAB,
      payload
    })
  }

  save = () => {
    const {model} = this.props.ChapterEdit

    this.props.dispatch(Save(model))
  }

  remove = () => {
    const {model} = this.props.ChapterEdit

    this.props.dispatch(Remove(model, () => {
      this.props.history.push(Pages.CHAPTERS)
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

  changeLocaleString = name => e => {
    const {translationTab} = this.props.ChapterEdit

    this.props.dispatch({
      type: CHANGE_TRANSLATION,
      locale: translationTab,
      payload: {
        [name]: e.target.value
      }
    })
  }

  getError = name => {
    const {validator} = this.props.ChapterEdit

    if (!validator.errors) return null
    if (!validator.errors[name]) return null

    return <div className="small text-danger">{validator.errors[name]}</div>
  }

  render() {

    const {locales} = this.props
    const {model, translationTab, isLoading, isValid, serverErrors} = this.props.ChapterEdit

    const currentTranslation = model.translations !== undefined && model.translations[translationTab]
      ? model.translations[translationTab] : null

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-lg-6 text-center text-lg-left">
              <h1 className="h3">{model._id ? i18n.t('chapter_edit.title') : i18n.t('chapter_edit.title_new')}</h1>
            </div>
            <div className="col-12 col-lg-6 text-center text-lg-right">

              <Link
                to={Pages.CHAPTERS}
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
            <label>{i18n.t('chapter_edit.icon')}</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={model.icon || ''}
              onChange={this.changeString('icon')}/>
            {this.getError('icon')}
          </div>

          <ul className="nav nav-tabs mb-2">
            {locales.map((locale, key) =>
              <li key={key} className="nav-item" onClick={this.setTab(locale)}>
                <span className={"nav-link" + (translationTab === locale ? " active" : '')}>{locale}</span>
              </li>
            )}
          </ul>

          <div className="form-group">
            <label>{i18n.t('chapter_edit.description')}</label>
            <textarea
              className="form-control form-control-sm"
              value={currentTranslation && currentTranslation.description ? currentTranslation.description : ''}
              onChange={this.changeLocaleString('description')}/>
            {this.getError('description_' + translationTab)}
          </div>

        </div>
      </div>
    </div>
  }
}

ChapterEdit.propTypes = {
  ChapterEdit: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
  locales: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  ChapterEdit: store => store.ChapterEdit,
  locale: store => store.App.locale,
  locales: store => store.App.locales,
})

export default withRouter(
  connect(selectors)(ChapterEdit)
)
