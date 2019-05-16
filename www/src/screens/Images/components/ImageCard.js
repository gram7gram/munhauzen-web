import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import i18n from '../../../i18n'

class ImageCard extends PureComponent {

  render() {

    const {image} = this.props

    return <div className="card">
      <div className="card-header">
          <h1 className="card-title">{image.id}</h1>
      </div>
      <div className="card-body">

      </div>
      <div className="card-footer">
        <button className="btn-xs btn-outline-danger">{i18n.t('placeholders.remove')}</button>
      </div>

    </div>
  }
}

ImageCard.propTypes = {
  image: PropTypes.any.isRequired
}

export default connect()(ImageCard);
