import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
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

    const {fail, audio, locale} = this.props

    const match = fail.audio
      ? audio.find(item => item.name === fail.audio)
      : null

    return <tr>
      <td>
        <Link
          to={Pages.AUDIO_FAILS_EDIT.replace(':locale', locale).replace(':id', fail._id)}
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
        <div>{fail.name}</div>
        <div className="small text-muted">{fail.description}</div>
      </td>
      <td>
        {match
          ? <Link to={Pages.AUDIO_EDIT.replace(':locale', locale).replace(':id', match._id)}>{match.name}</Link>
          : <span className="text-danger">{fail.audio}</span>}
      </td>
    </tr>
  }
}

Card.propTypes = {
  fail: PropTypes.any.isRequired,
  audio: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  audio: store => store.Audio.items,
  locale: store => store.App.locale
})

export default connect(selectors)(Card);
