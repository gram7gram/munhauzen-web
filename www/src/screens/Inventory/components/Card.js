import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import i18n from '../../../i18n'
import * as Pages from "../../../router/Pages";
import {Link} from "react-router-dom";
import Remove from "../actions/Remove";
import {createStructuredSelector} from "reselect";

class Card extends PureComponent {

  remove = () => {
    const {inventory} = this.props

    this.props.dispatch(Remove(inventory))
  }

  render() {

    const {inventory} = this.props

    return <div className="card mb-2 mr-2">
      <div className="card-header px-2 py-1">
        <Link
          to={Pages.INVENTORY_EDIT.replace(':id', inventory._id)}
          className="text-truncate">{inventory.name}</Link>
      </div>
      <div className="card-body p-2">

        {inventory.isMenu
          ? <div className="badge badge-warning mb-2">{i18n.t('inventory.isMenuBadge')}</div>
          : null}

        {inventory.isStatue
          ? <div className="badge badge-info mb-2">{i18n.t('inventory.isStatueBadge')}</div>
          : null}

        <div>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={this.remove}>{i18n.t('placeholders.remove')}</button>
        </div>
      </div>

    </div>
  }
}

Card.propTypes = {
  inventory: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  locale: store => store.App.locale,
})

export default connect(selectors)(Card);
