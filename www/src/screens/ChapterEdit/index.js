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
import {CHANGE, RESET} from "./actions";

class ChapterEdit extends Component {

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

  getError = name => {
    const {validator} = this.props.ChapterEdit

    if (!validator.errors) return null
    if (!validator.errors[name]) return null

    return <div className="small text-danger">{validator.errors[name]}</div>
  }

  render() {

    const {model, isLoading, isValid, serverErrors} = this.props.ChapterEdit

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

        </div>
      </div>
    </div>
  }
}

ChapterEdit.propTypes = {
  ChapterEdit: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  ChapterEdit: store => store.ChapterEdit,
})

export default withRouter(
  connect(selectors)(ChapterEdit)
)
