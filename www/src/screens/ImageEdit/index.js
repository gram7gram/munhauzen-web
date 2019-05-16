import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import i18n from '../../i18n'
import FetchImage from './actions/FetchImage'
import {RESET} from "./actions";

class ImageEdit extends Component {

  componentDidMount() {
    this.props.dispatch(FetchImage())
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: RESET
    })
  }

  render() {

    return <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{i18n.t('image_edit.title')}</h1>

        </div>
      </div>
    </div>
  }
}

ImageEdit.propTypes = {
  ImageEdit: PropTypes.any.isRequired
}

const selectors = createStructuredSelector({
  ImageEdit: store => store.ImageEdit
})

export default connect(selectors)(ImageEdit);
