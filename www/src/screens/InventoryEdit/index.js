import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import Select from 'react-select'
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../i18n'
import * as Pages from '../../router/Pages'
import Save from './actions/Save'
import Remove from './actions/Remove'
import Fetch from './actions/Fetch'
import FetchScenario from '../Scenario/actions/Fetch'
import FetchInventory from '../Inventory/actions/Fetch'
import {CHANGE, CHANGE_TRANSLATION, RESET, SET_TRANSLATION_TAB} from "./actions";

class InventoryEdit extends Component {

  componentDidMount() {

    const {id} = this.props.match.params
    const {locale} = this.props

    if (id) {
      this.props.dispatch(Fetch(id))
    }

    if (this.props.scenario.length === 0) {
      this.props.dispatch(FetchScenario())
    }

    if (this.props.inventory.length === 0) {
      this.props.dispatch(FetchInventory())
    }

    this.setTab(locale)()
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: RESET
    })
  }

  save = () => {
    const {model} = this.props.InventoryEdit

    this.props.dispatch(Save(model))
  }

  remove = () => {
    const {model} = this.props.InventoryEdit

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

  setInventory = selected => {
    this.change('relatedInventory', selected.map(item => item.value))
  }

  setScenario = selected => {
    this.change('relatedScenario', selected.map(item => item.value))
  }

  changeBool = name => e => this.change(name, e.target.checked)

  changeString = name => e => this.change(name, e.target.value)

  changeLocaleString = name => e => {
    const {translationTab} = this.props.InventoryEdit

    this.props.dispatch({
      type: CHANGE_TRANSLATION,
      locale: translationTab,
      payload: {
        [name]: e.target.value
      }
    })
  }

  getError = name => {
    const {validator} = this.props.InventoryEdit

    if (!validator.errors) return null
    if (!validator.errors[name]) return null

    return <div className="small text-danger">{validator.errors[name]}</div>
  }

  render() {

    const {locales} = this.props
    const {model, translationTab, isLoading, isValid, serverErrors} = this.props.InventoryEdit

    const currentTranslation = model.statueTranslations !== undefined && model.statueTranslations[translationTab]
      ? model.statueTranslations[translationTab] : null

    const selectedRelatedScenario = model.relatedScenario.length > 0 ?
      this.props.scenario.filter(item => model.relatedScenario.indexOf(item._id) !== -1)
      : []

    const selectedRelatedInventory = model.relatedInventory.length > 0 ?
      this.props.inventory.filter(item => model.relatedInventory.indexOf(item._id) !== -1)
      : []

    return <div className="container my-2 py-3 bg-white shadow-sm">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-lg-6 text-center text-lg-left">
              <h1 className="h3">{model._id ? i18n.t('inventory_edit.title') : i18n.t('inventory_edit.title_new')}</h1>
            </div>
            <div className="col-12 col-lg-6 text-center text-lg-right">

              <Link
                to={Pages.INVENTORY}
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
            <label>{i18n.t('inventory_edit.relatedScenario')}</label>
            <Select
              isMulti={true}
              onChange={this.setScenario}
              value={selectedRelatedScenario.map(item => ({
                value: item._id,
                label: item.name
              }))}
              options={this.props.scenario.map(item => ({
                value: item._id,
                label: item.name
              }))}
            />
          </div>

          <div className="form-group">
            <label>{i18n.t('inventory_edit.relatedInventory')}</label>
            <Select
              isMulti={true}
              onChange={this.setInventory}
              value={selectedRelatedInventory.map(item => ({
                value: item._id,
                label: item.name
              }))}
              options={this.props.inventory.filter(item => item._id !== model._id).map(item => ({
                value: item._id,
                label: item.name
              }))}
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isMenu}
                onChange={this.changeBool('isMenu')}/>
              &nbsp;{i18n.t('inventory_edit.isMenu')}
            </label>
            {this.getError('isMenu')}
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isStatue}
                onChange={this.changeBool('isStatue')}/>
              &nbsp;{i18n.t('inventory_edit.isStatue')}
            </label>
            {this.getError('isStatue')}
          </div>

          {model.isStatue ? <div>
            <ul className="nav nav-tabs mb-2">
              {locales.map((locale, key) =>
                <li key={key} className="nav-item" onClick={this.setTab(locale)}>
                  <span className={"nav-link" + (translationTab === locale ? " active" : '')}>{locale}</span>
                </li>
              )}
            </ul>

            <div className="form-group">
              <label>{i18n.t('inventory_edit.statueDescription')}</label>
              <textarea
                className="form-control form-control-sm"
                value={currentTranslation && currentTranslation.description ? currentTranslation.description : ''}
                onChange={this.changeLocaleString('description')}/>
              {this.getError('description_' + translationTab)}
            </div>
          </div> : null}

        </div>
      </div>
    </div>
  }
}

InventoryEdit.propTypes = {
  InventoryEdit: PropTypes.any.isRequired,
  scenario: PropTypes.any.isRequired,
  inventory: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
  locales: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  InventoryEdit: store => store.InventoryEdit,
  inventory: store => store.Inventory.items,
  scenario: store => store.Scenario.items,
  locale: store => store.App.locale,
  locales: store => store.App.locales,
})

export default withRouter(
  connect(selectors)(InventoryEdit)
)
