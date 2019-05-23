import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import * as Pages from '../../router/Pages'
import i18n from '../../i18n'
import Card from './components/Card'
import {CHANGE_FILTER, FETCH_ITEMS_REQUEST} from './actions'

class Inventory extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: FETCH_ITEMS_REQUEST
    })

    document.addEventListener("keydown", this.resetIfEsc, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.resetIfEsc, false);
  }

  changeFilterString = key => e => {
    this.props.dispatch({
      type: CHANGE_FILTER,
      payload: {
        [key]: e.target.value
      }
    })
  }

  changeFilterBool = key => e => {
    this.props.dispatch({
      type: CHANGE_FILTER,
      payload: {
        [key]: e.target.checked
      }
    })
  }

  resetIfEsc = e => {

    switch (e.keyCode) {
      case 27:
        this.props.dispatch({
          type: CHANGE_FILTER,
          payload: {
            search: ''
          }
        })

    }
  }

  renderContent() {

    const {isLoading, items, search, isMenu, isStatue} = this.props.Inventory

    let displayedItems

    if (search || isMenu || isStatue) {

      const query = (search || '').toLowerCase()

      displayedItems = items.filter(item =>
        (query && item.name.toLowerCase().indexOf(query) !== -1)
        || (isMenu && item.isMenu)
        || (isStatue && item.isStatue)
      )
    } else {
      displayedItems = items
    }

    if (displayedItems.length === 0) {
      if (isLoading) {
        return <div className="text-center">
          <h4>{i18n.t('placeholders.loading')}</h4>
        </div>
      } else {
        return <div className="text-center">
          <h4>{i18n.t('placeholders.not_found_title')}</h4>
          <p>{i18n.t('placeholders.not_found_footer')}</p>
        </div>
      }
    }

    return <div className="row no-gutters">
      {displayedItems.map((inventory, key) =>
        <div key={key} className="col-12 col-sm-6 col-md-4 col-xl-3">
          <Card inventory={inventory}/>
        </div>
      )}
    </div>

  }

  render() {

    const {search, isMenu, isStatue} = this.props.Inventory

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{i18n.t('inventory.title')}</h1>

          <div className="row mb-2">
            <div className="col-auto">
              <Link to={Pages.INVENTORY_CREATE}
                    className="btn btn-sm btn-success mr-1">
                {i18n.t('placeholders.new')}
              </Link>

              <button
                className="btn btn-sm btn-warning mr-1">
                {i18n.t('placeholders.import_file')}
              </button>

              <button
                className="btn btn-sm btn-primary">
                {i18n.t('placeholders.export_file')}
              </button>

            </div>
            <div className="col-auto">
              <div className="form-inline">
                <div className="form-group mr-2">

                  <input type="text"
                         className="form-control form-control-sm"
                         value={search || ''}
                         placeholder={i18n.t('placeholders.search')}
                         onChange={this.changeFilterString('search')}/>

                </div>
                <div className="form-group mx-2">

                  <label>
                    <input type="checkbox"
                         checked={isMenu}
                         onChange={this.changeFilterBool('isMenu')}/>
                    &nbsp;{i18n.t('inventory.isMenuFilter')}
                  </label>

                </div>
                <div className="form-group mx-2">

                  <label>
                    <input type="checkbox"
                         checked={isStatue}
                         onChange={this.changeFilterBool('isStatue')}/>
                    &nbsp;{i18n.t('inventory.isStatueFilter')}
                  </label>

                </div>
              </div>
            </div>
          </div>

          {this.renderContent()}
        </div>
      </div>
    </div>
  }
}

Inventory.propTypes = {
  Inventory: PropTypes.any.isRequired
}

const selectors = createStructuredSelector({
  Inventory: store => store.Inventory
})

export default connect(selectors)(Inventory);
