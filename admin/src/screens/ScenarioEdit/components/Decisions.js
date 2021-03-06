import React, {Component} from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid'
import Select from 'react-select'
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../../i18n'
import {ADD_DECISION, CHANGE_DECISION, REMOVE_DECISION} from "../actions";

const toScenarioLabel = (scenario) => {

  let label = scenario.name + ' - ' + scenario.text

  return {
    value: scenario.name,
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

  setOrder = (cid, order) => () => {
    this.props.dispatch({
      type: CHANGE_DECISION,
      cid,
      payload: {
        order
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

  getDecision = () => {
    const {model} = this.props.ScenarioEdit

    return Object.values(model.decisions).sort((a, b) => {
      if (a.order > b.order) return 1
      if (a.order < b.order) return -1
      return 0
    })
  }

  addDecision = () => {

    const decisions = this.getDecision();

    const latest = decisions[decisions.length - 1]

    this.props.dispatch({
      type: ADD_DECISION,
      payload: {
        cid: uuid(),
        order: latest.order + 1,
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

    const {model} = this.props.ScenarioEdit

    const inventoryOptions = this.props.inventory.map(item => ({
      value: item.name,
      label: item.name
    }))

    const scenarioOptions = this.props.scenario
    .filter(i => i._id !== model._id)
    .map(item => toScenarioLabel(item))

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

          {this.getDecision().map((decision, key) => {

            const selectedInventory = decision.inventoryRequired
              ? this.props.inventory.filter(item => decision.inventoryRequired.indexOf(item.name) !== -1)
              : []

            const selectedAbsentInventory = decision.inventoryAbsent
              ? this.props.inventory.filter(item => decision.inventoryAbsent.indexOf(item.name) !== -1)
              : []

            const selectedScenario = decision.scenario
              ? this.props.scenario.find(item => decision.scenario === item.name)
              : null

            return <div key={key} className="card mb-2">

              <div className="card-header px-2 py-1">
                <div className="row">
                  <div className="col-6">
                    <h4 className="mb-0">#{decision.order > 0 ? Math.max(1, decision.order) : '-'}
                    &nbsp;{selectedScenario ? selectedScenario.name : ''}</h4>
                  </div>
                  <div className="col-6 text-right">
                    <button
                      className="btn btn-sm btn-outline-secondary mr-1"
                      onClick={this.setOrder(decision.cid, decision.order - 1)}>
                      <i className="fa fa-arrow-up"/>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary mr-1"
                      onClick={this.setOrder(decision.cid, decision.order + 1)}>
                      <i className="fa fa-arrow-down"/>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={this.removeDecision(decision.cid)}>
                      <i className="fa fa-times"/>&nbsp;{i18n.t('placeholders.remove')}
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body p-2">

                <div className="row">
                  <div className="col-6">
                    <div className="form-group">
                      <label>{i18n.t('scenario_edit.scenario')}</label>
                      <Select
                        onChange={this.setScenario(decision.cid)}
                        value={selectedScenario
                          ? toScenarioLabel(selectedScenario)
                          : null}
                        options={scenarioOptions}/>
                      {this.getError('scenario_' + decision.cid)}
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group">
                      <label>{i18n.t('scenario_edit.inventoryRequired')}</label>
                      <Select
                        isMulti={true}
                        onChange={this.setInventoryRequired(decision.cid)}
                        value={selectedInventory.map(item => ({
                          value: item.name,
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
                          value: item.name,
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
}

const selectors = createStructuredSelector({
  ScenarioEdit: store => store.ScenarioEdit,
  inventory: store => store.Inventory.items,
  scenario: store => store.Scenario.items,
})

export default connect(selectors)(Decisions)
