import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import * as Pages from "../../../router/Pages";
import {Link} from "react-router-dom";
import Remove from "../actions/Remove";
import {createStructuredSelector} from "reselect";

class Card extends PureComponent {

  remove = () => {
    const {chapter} = this.props

    this.props.dispatch(Remove(chapter))
  }

  render() {

    const {locale} = this.props
    const {chapter} = this.props

    return <tr>
      <td>
        <Link
          to={Pages.CHAPTER_EDIT.replace(':locale', locale).replace(':id', chapter._id)}
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
        <div>{chapter.name}</div>
        <div className="small text-muted">{chapter.description}</div>
      </td>
      <td>{chapter.number}</td>
    </tr>
  }
}

Card.propTypes = {
  chapter: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  locale: store => store.App.locale
})

export default connect(selectors)(Card);
