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
import {CHANGE, CHANGE_TRANSLATION, RESET, SET_TRANSLATION_TAB} from "./actions";
import FetchChapters from "../Chapter/actions/Fetch";
import FetchImages from "../Images/actions/Fetch";
import FetchInventory from "../Inventory/actions/Fetch";
import FetchScenario from "../Scenario/actions/Fetch";
import FetchAudio from "../Audio/actions/Fetch";

import Decisions from "./components/Decisions";
import Audio from "./components/Audio";
import Images from "./components/Images";

const actionOptions = [
  {value: 'CLICK', label: 'CLICK'},
  {value: 'GOTO', label: 'GOTO'},
]

class ScenarioEdit extends Component {

  componentDidMount() {

    const {id} = this.props.match.params
    const {locale} = this.props

    if (id) {
      this.props.dispatch(Fetch(id))
    }

    if (this.props.chapters.length === 0) {
      this.props.dispatch(FetchChapters())
    }

    if (this.props.images.length === 0) {
      this.props.dispatch(FetchImages())
    }

    if (this.props.audio.length === 0) {
      this.props.dispatch(FetchAudio())
    }

    if (this.props.inventory.length === 0) {
      this.props.dispatch(FetchInventory())
    }

    if (this.props.scenario.length === 0) {
      this.props.dispatch(FetchScenario())
    }

    this.setTab(locale)()
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: RESET
    })
  }

  save = () => {
    const {model} = this.props.ScenarioEdit

    this.props.dispatch(Save(model))
  }

  remove = () => {
    const {model} = this.props.ScenarioEdit

    this.props.dispatch(Remove(model, () => {
      this.props.history.push(Pages.SCENARIO)
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

  setAction = selected => {
    this.change('action', selected ? selected.value : null)
  }

  setChapter = selected => {
    this.change('chapter', selected ? selected.value : null)
  }

  changeString = name => e => this.change(name, e.target.value)

  changeLocaleString = name => e => {
    const {translationTab} = this.props.ScenarioEdit

    this.props.dispatch({
      type: CHANGE_TRANSLATION,
      locale: translationTab,
      payload: {
        [name]: e.target.value
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

    const {locales} = this.props
    const {model, translationTab, isLoading, isValid, serverErrors} = this.props.ScenarioEdit

    const currentTranslation = model.translations[translationTab] || null

    const selectedChapter = model.chapter
      ? this.props.chapters.find(item => item.name === model.chapter)
      : null

    return <div>

      <div className="container my-2 py-3 bg-yellow shadow-sm">

        <div className="row">
          <div className="col-12 col-lg-6 text-center text-lg-left">
            <h1 className="h3">{model._id ? i18n.t('scenario_edit.title') : i18n.t('scenario_edit.title_new')}</h1>
          </div>
          <div className="col-12 col-lg-6 text-center text-lg-right">

            <Link
              to={Pages.SCENARIO}
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
              <label>{i18n.t('scenario_edit.chapter')}</label>
              <Select
                onChange={this.setChapter}
                value={selectedChapter ? {
                  value: selectedChapter.name,
                  label: selectedChapter.name
                } : null}
                options={this.props.chapters.map(item => ({
                  value: item.name,
                  label: item.name
                }))}/>
              {this.getError('chapter')}
            </div>

            <div className="form-group">
              <label>{i18n.t('scenario_edit.action')}</label>
              <Select
                onChange={this.setAction}
                value={model.action ? {
                  value: model.action,
                  label: model.action
                } : null}
                options={actionOptions}/>
              {this.getError('action')}
            </div>

            <ul className="nav nav-tabs mb-2">
              {locales.map((locale, key) =>
                <li key={key} className="nav-item" onClick={this.setTab(locale)}>
                  <span className={"nav-link" + (translationTab === locale ? " active" : '')}>{locale}</span>
                </li>
              )}
            </ul>

            <div className="form-group">
              <label>{i18n.t('scenario_edit.text')}</label>
              <textarea
                className="form-control form-control-sm"
                value={currentTranslation && currentTranslation.text ? currentTranslation.text : ''}
                onChange={this.changeLocaleString('text')}/>
              {this.getError('text_' + translationTab)}
            </div>

          </div>
        </div>
      </div>

      <Decisions/>

      <Audio/>

      <Images/>
    </div>
  }
}

ScenarioEdit.propTypes = {
  ScenarioEdit: PropTypes.any.isRequired,
  inventory: PropTypes.any.isRequired,
  chapters: PropTypes.any.isRequired,
  images: PropTypes.any.isRequired,
  audio: PropTypes.any.isRequired,
  scenario: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
  locales: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  ScenarioEdit: store => store.ScenarioEdit,
  inventory: store => store.Inventory.items,
  chapters: store => store.Chapter.items,
  images: store => store.Images.items,
  audio: store => store.Audio.items,
  scenario: store => store.Scenario.items,
  locale: store => store.App.locale,
  locales: store => store.App.locales,
})

export default withRouter(
  connect(selectors)(ScenarioEdit)
)
