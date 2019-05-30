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
    const {image} = this.props

    this.props.dispatch(Remove(image))
  }

  render() {

    const {image, locale} = this.props

    const trans = image.translations !== undefined && image.translations
      ? image.translations.find(item => item.locale === locale)
      : null

    return <tr>
      <td className="text-center">
        {!image.isReserved ? <Link
          to={Pages.IMAGE_EDIT.replace(':id', image._id)}
          className="btn btn-icon btn-success btn-sm mr-1">
          <i className="fa fa-pencil"/>
        </Link> : null}

        {!image.isReserved ? <button
          className="btn btn-icon btn-outline-danger btn-sm"
          onClick={this.remove}>
          <i className="fa fa-times"/>
        </button> : null}

        {image.isReserved
          ? <small className="text-secondary">{i18n.t('images.isReserved')}</small>
          : null}
      </td>
      <td>
        <div>{image.name}</div>
        {trans
          ? <div className="small text-muted">{trans.text}</div>
          : null}
      </td>
    </tr>
  }
}

Card.propTypes = {
  image: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  locale: store => store.App.locale,
})

export default connect(selectors)(Card);
