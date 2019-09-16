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
import FetchInventory from '../Inventory/actions/Fetch'
import FetchScenario from '../Scenario/actions/Fetch'
import {CHANGE, RESET} from "./actions";

const typeOptions = [
  {value: 'color', label: 'color'},
  {value: 'bonus', label: 'bonus'},
  {value: 'statue', label: 'statue'},
]

class ImageEdit extends Component {

  componentDidMount() {

    const {id} = this.props.match.params
    const {Inventory, Scenario} = this.props

    if (id) {
      this.props.dispatch(Fetch(id))
    }

    if (!Inventory.isLoading && Inventory.items.length === 0) {
      this.props.dispatch(FetchInventory())
    }

    if (!Scenario.isLoading && Scenario.items.length === 0) {
      this.props.dispatch(FetchScenario())
    }
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
    const {locale} = this.props
    const {model} = this.props.ImageEdit

    this.props.dispatch(Remove(model, () => {
      this.props.history.push(Pages.IMAGES.replace(':locale', locale))
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

  setType = selected => this.change('type', selected ? selected.value : null)

  setRelatedStatue = selected => this.change('relatedStatue', selected ? selected.value : null)

  setRelatedScenario = selected => this.change('relatedScenario', selected ? selected.value : null)

  changeBool = name => e => this.change(name, e.target.checked)

  changeString = name => e => this.change(name, e.target.value)

  getError = name => {
    const {validator} = this.props.ImageEdit

    if (!validator.errors) return null
    if (!validator.errors[name]) return null

    return <div className="small text-danger">{validator.errors[name]}</div>
  }

  render() {

    const {Inventory, Scenario, locale} = this.props
    const {model, isLoading, isValid, serverErrors} = this.props.ImageEdit

    const statueOptions = Inventory.items.filter(item => item.isStatue).map(item => ({
      value: item.name,
      label: item.name
    }))

    const scenarioOptions = Scenario.items.map(item => ({
      value: item.name,
      label: item.name
    }))

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-12 col-lg-6 text-center text-lg-left">
              <h1 className="h3">{model._id ? i18n.t('image_edit.title') : i18n.t('image_edit.title_new')}</h1>
            </div>
            <div className="col-12 col-lg-6 text-center text-lg-right">

              <Link
                to={Pages.IMAGES.replace(':locale', locale)}
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
            <Select
              value={model.type ? {
                value: model.type,
                label: model.type
              } : null}
              options={typeOptions}
              onChange={this.setType}/>
            {this.getError('type')}
          </div>

          {model.type === 'bonus'
            ? <div className="form-group">
              <label>{i18n.t('image_edit.relatedScenario')}</label>
              <Select
                value={model.relatedScenario ? {
                  value: model.relatedScenario,
                  label: model.relatedScenario
                } : null}
                options={scenarioOptions}
                onChange={this.setRelatedScenario}/>
              {this.getError('relatedScenario')}
            </div> : null}

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={model.isHiddenFromGallery}
                onChange={this.changeBool('isHiddenFromGallery')}/>
              &nbsp;{i18n.t('image_edit.isHiddenFromGallery')}
            </label>
            {this.getError('isHiddenFromGallery')}
          </div>

          {!model.isHiddenFromGallery ? <div>

            {model.type === 'statue'
              ? <div className="form-group">
                <label>{i18n.t('image_edit.relatedStatue')}</label>
                <Select
                  value={model.relatedStatue ? {
                    value: model.relatedStatue,
                    label: model.relatedStatue
                  } : null}
                  options={statueOptions}
                  onChange={this.setRelatedStatue}/>
                {this.getError('relatedStatue')}
              </div> : null}

            <div className="form-group">
              <label>{i18n.t('image_edit.description')}</label>
              <textarea
                className="form-control form-control-sm"
                value={model.description || ''}
                onChange={this.changeString('description')}/>
              {this.getError('description')}
            </div>

          </div> : null}


        </div>
      </div>
    </div>
  }
}

ImageEdit.propTypes = {
  ImageEdit: PropTypes.any.isRequired,
  Scenario: PropTypes.any.isRequired,
  Inventory: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  Inventory: store => store.Inventory,
  Scenario: store => store.Scenario,
  ImageEdit: store => store.ImageEdit,
})

export default withRouter(
  connect(selectors)(ImageEdit)
)
