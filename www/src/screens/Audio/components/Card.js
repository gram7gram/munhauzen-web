import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
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

    const {audio} = this.props

    return <tr>
      <td>
        <Link
          to={Pages.AUDIO_EDIT.replace(':id', audio._id)}
          className="btn btn-icon btn-success btn-sm mr-1">
          <i className="fa fa-pencil"/>
        </Link>

        <button
          className="btn btn-icon btn-outline-danger btn-sm"
          onClick={this.remove}>
          <i className="fa fa-times"/>
        </button>
      </td>
      <td>{audio.name}</td>
      <td className="text-right">{audio.duration}</td>
    </tr>
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
