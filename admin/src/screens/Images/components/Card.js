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

    return <tr>
      <td className="text-center">
        {!image.isReserved ? <Link
          to={Pages.IMAGE_EDIT.replace(':locale', locale).replace(':id', image._id)}
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
        <div className="small text-muted">{image.description}</div>
      </td>
      <td>
        {image.type === 'statue'
          ? <div className="badge badge-success">{i18n.t('images.type_statue')}</div>
          : null}
        {image.type === 'bonus'
          ? <div className="badge badge-warning">{i18n.t('images.type_bonus')}</div>
          : null}
        {image.type === 'color'
          ? <div className="badge badge-primary">{i18n.t('images.type_color')}</div>
          : null}
      </td>
      <td>
        <i className={"fa " + (image.isHiddenFromGallery
          ? "fa-times text-danger"
          : "fa-check text-success")}/>
      </td>
    </tr>
  }
}

Card.propTypes = {
  image: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  locale: store => store.App.locale
})

export default connect(selectors)(Card);
