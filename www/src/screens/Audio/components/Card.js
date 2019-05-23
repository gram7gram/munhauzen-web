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
    const {audio} = this.props

    this.props.dispatch(Remove(audio))
  }

  render() {

    const {audio, locale} = this.props

    const trans = audio.translations.find(item => item.locale === locale)

    return <div className="card mb-2 mr-2">
      <div className="card-header p-2">
        <Link
          to={Pages.AUDIO_EDIT.replace(':id', audio._id)}
          className="h5 m-0 text-truncate">{audio.name}</Link>
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
  audio: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  locale: store => store.App.locale,
})

export default connect(selectors)(Card);
