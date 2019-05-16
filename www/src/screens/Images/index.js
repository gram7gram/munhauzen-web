import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../i18n'
import ImageCard from './components/ImageCard'
import {FETCH_IMAGES_REQUEST} from './actions'

class Images extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: FETCH_IMAGES_REQUEST
    })
  }

  renderContent() {

    const {isLoading, items} = this.props.Images

    if (items.length === 0) {
      if (isLoading) {
        return <div className="text-center">
          <h4>{i18n.t('placeholders.loading')}</h4>
        </div>
      } else {
        return <div className="text-center">
          <h4>{i18n.t('images.not_found_title')}</h4>
          <p>{i18n.t('images.not_found_footer')}</p>
        </div>
      }
    }

    return <div className="row">
      {items.map((image, key) =>
        <div key={key} className="col-12 col-sm-6 col-md-4 col-xl-3">
          <ImageCard image={image}/>
        </div>
      )}
    </div>

  }

  render() {

    return <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{i18n.t('images.title')}</h1>

          {this.renderContent()}
        </div>
      </div>
    </div>
  }
}

Images.propTypes = {
  Images: PropTypes.any.isRequired
}

const selectors = createStructuredSelector({
  Images: store => store.Images
})

export default connect(selectors)(Images);
