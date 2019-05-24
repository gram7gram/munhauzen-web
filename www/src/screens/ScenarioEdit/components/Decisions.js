import React, {Component} from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid'
import Select from 'react-select'
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../../i18n'
import {ADD_DECISION, CHANGE_DECISION, REMOVE_DECISION} from "../actions";

const actionOptions = [
  {value: 'CLICK', label: 'CLICK'},
  {value: 'GOTO', label: 'GOTO'},
]

const toScenarioLabel = (scenario, locale) => {

  let label = scenario.name

  if (scenario.translations !== undefined) {
    const trans = scenario.translations.find(item => item.locale === locale)
    if (trans) {
      label += ' - ' + trans.text
    }
  }

  return {
    value: scenario._id,
    label
  }
}

class Decisions extends Component {


  setInventoryRequired = cid => selected => {
    this.props.dispatch({
      type: CHANGE_DECISION,
      cid,
      payload: {
        inventoryRequired: selected.map(item => item.value)
      }
    })
  }

  setInventoryAbsent = cid => selected => {
    this.props.dispatch({
      type: CHANGE_DECISION,
      cid,
      payload: {
        inventoryAbsent: selected.map(item => item.value)
      }
    })
  }

  setDecisionAction = cid => selected => {
    this.props.dispatch({
      type: CHANGE_DECISION,
      cid,
      payload: {
        action: selected ? selected.value : null
      }
    })
  }

  setScenario = cid => selected => {
    this.props.dispatch({
      type: CHANGE_DECISION,
      cid,
      payload: {
        scenario: selected ? selected.value : null
      }
    })
  }

  removeDecision = cid => () => {
    this.props.dispatch({
      type: REMOVE_DECISION,
      payload: {
        cid
      }
    })
  }

  addDecision = () => {
    this.props.dispatch({
      type: ADD_DECISION,
      payload: {
        cid: uuid(),
        scenario: null,
        action: null,
        inventoryRequired: [],
        inventoryAbsent: [],
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

    const {locale} = this.props
    const {model} = this.props.ScenarioEdit

    const inventoryOptions = this.props.inventory.map(item => ({
      value: item._id,
      label: item.name
    }))

    const scenarioOptions = this.props.scenario
      .filter(i => i._id !== model._id)
      .map(item => toScenarioLabel(item, locale))

    return <div className="container my-2 py-3 bg-yellow shadow-sm">

      <div className="row">
        <div className="col-12 col-lg-6 text-center text-lg-left">
          <h1 className="h3">{i18n.t('scenario_edit.decision_title')}</h1>
        </div>
        <div className="col-12 col-lg-6 text-center text-lg-right">
          <button
            className="btn btn-sm btn-primary"
            onClick={this.addDecision}>
            <i className="fa fa-plus"/>&nbsp;{i18n.t('placeholders.new')}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-10 mx-auto">

          {Object.values(model.decisions).map((decision, key) => {

            const selectedInventory = decision.inventoryRequired
              ? this.props.inventory.filter(item => decision.inventoryRequired.indexOf(item._id) !== -1)
              : []

            const selectedAbsentInventory = decision.inventoryAbsent
              ? this.props.inventory.filter(item => decision.inventoryAbsent.indexOf(item._id) !== -1)
              : []

            const selectedScenario = decision.scenario
              ? this.props.scenario.find(item => decision.scenario === item._id)
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
                      onClick={this.removeDecision(decision.cid)}>
                      <i className="fa fa-times"/>&nbsp;{i18n.t('placeholders.remove')}
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-1">

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>{i18n.t('scenario_edit.scenario')}</label>
                      <Select
                        onChange={this.setScenario(decision.cid)}
                        value={selectedScenario
                          ? toScenarioLabel(selectedScenario, locale)
                          : null}
                        options={scenarioOptions}/>
                      {this.getError('scenario_' + decision.cid)}
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label>{i18n.t('scenario_edit.action')}</label>
                      <Select
                        onChange={this.setDecisionAction(decision.cid)}
                        value={decision.action ? {
                          value: decision.action,
                          label: decision.action
                        } : null}
                        options={actionOptions}/>
                      {this.getError('action_' + decision.cid)}
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label>{i18n.t('scenario_edit.inventoryRequired')}</label>
                      <Select
                        isMulti={true}
                        onChange={this.setInventoryRequired(decision.cid)}
                        value={selectedInventory.map(item => ({
                          value: item._id,
                          label: item.name
                        }))}
                        options={inventoryOptions}/>
                      {this.getError('inventoryRequired_' + decision.cid)}
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label>{i18n.t('scenario_edit.inventoryAbsent')}</label>
                      <Select
                        isMulti={true}
                        onChange={this.setInventoryAbsent(decision.cid)}
                        value={selectedAbsentInventory.map(item => ({
                          value: item._id,
                          label: item.name
                        }))}
                        options={inventoryOptions}/>
                      {this.getError('inventoryAbsent_' + decision.cid)}
                    </div>

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

Decisions.propTypes = {
  ScenarioEdit: PropTypes.any.isRequired,
  inventory: PropTypes.any.isRequired,
  scenario: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  ScenarioEdit: store => store.ScenarioEdit,
  inventory: store => store.Inventory.items,
  scenario: store => store.Scenario.items,
  locale: store => store.App.locale,
})

export default connect(selectors)(Decisions)
