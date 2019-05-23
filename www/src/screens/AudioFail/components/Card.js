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
    const {fail} = this.props

    this.props.dispatch(Remove(fail))
  }

  render() {

    const {fail, locale} = this.props

    const trans = fail.translations.find(item => item.locale === locale)

    return <div className="card mb-2 mr-2">
      <div className="card-header px-2 py-1">
        <Link
          to={Pages.AUDIO_FAILS_EDIT.replace(':id', fail._id)}
          className="text-truncate">{fail.name}</Link>
      </div>
      <div className="card-body p-2">

        {trans
          ? <p className="text-muted mb-1">{trans.description}</p>
          : null}

        <button
          className="btn btn-sm btn-outline-danger"
          onClick={this.remove}>{i18n.t('placeholders.remove')}</button>
      </div>

    </div>
  }
}

Card.propTypes = {
  fail: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  locale: store => store.App.locale,
})

export default connect(selectors)(Card);
