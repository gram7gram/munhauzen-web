import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import * as Pages from "../../../router/Pages";
import {Link} from "react-router-dom";
import i18n from "../../../i18n";
import Remove from "../actions/Remove";
import {createStructuredSelector} from "reselect";

class Card extends PureComponent {

  remove = () => {
    const {inventory} = this.props

    this.props.dispatch(Remove(inventory))
  }

  render() {

    const {inventory, locale} = this.props

    let trans = null
    if (inventory.statueTranslations !== undefined && inventory.statueTranslations) {
      trans = inventory.statueTranslations.find(item => item.locale === locale);
      if (!trans) {
        trans = inventory.statueTranslations[0]
      }
    }

    return <tr>
      <td>
        <Link
          to={Pages.INVENTORY_EDIT.replace(':id', inventory._id)}
          className="btn btn-icon btn-success btn-sm mr-1">
          <i className="fa fa-pencil"/>
        </Link>

        <button
          className="btn btn-icon btn-outline-danger btn-sm"
          onClick={this.remove}>
          <i className="fa fa-times"/>
        </button>
      </td>
      <td>
        <div>{inventory.name}</div>
        {trans
          ? <div className="small text-muted">{trans.description}</div>
          : null}
      </td>
      <td>
        {inventory.isMenu
          ? <div className="badge badge-warning">{i18n.t('inventory.isMenuBadge')}</div>
          : null}
        {inventory.isStatue
          ? <div className="badge badge-info">{i18n.t('inventory.isStatueBadge')}</div>
          : null}
      </td>
    </tr>
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
