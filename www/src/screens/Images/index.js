import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import * as Pages from '../../router/Pages'
import i18n from '../../i18n'
import ImageCard from './components/ImageCard'
import {CHANGE_FILTER, FETCH_IMAGES_REQUEST} from './actions'

class Images extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: FETCH_IMAGES_REQUEST
    })

    document.addEventListener("keydown", this.resetIfEsc, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.resetIfEsc, false);
  }

  changeFilterString = key => e => {
    this.props.dispatch({
      type: CHANGE_FILTER,
      payload: {
        [key]: e.target.value
      }
    })
  }

  resetIfEsc = e => {

    switch (e.keyCode) {
      case 27:
        this.props.dispatch({
          type: CHANGE_FILTER,
          payload: {
            search: null
          }
        })

    }
  }

  renderContent() {

    const {isLoading, items, search} = this.props.Images

    let displayedItems

    if (search) {

      const query = search.toLowerCase()

      displayedItems = items.filter(item =>
        item.name.toLowerCase().indexOf(query) !== -1
        || !!item.translations.find(trans => trans.description.toLowerCase().indexOf(query) !== -1)
      )
    } else {
      displayedItems = items
    }


    if (displayedItems.length === 0) {
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
      {displayedItems.map((image, key) =>
        <div key={key} className="col-12 col-sm-6 col-md-4 col-xl-3">
          <ImageCard image={image}/>
        </div>
      )}
    </div>

  }

  render() {

    const {search} = this.props.Images

    return <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{i18n.t('images.title')}</h1>

          <div className="row">
            <div className="col-auto">
              <Link to={Pages.IMAGE_CREATE}
                    className="btn btn-sm btn-success">{i18n.t('placeholders.new')}</Link>
            </div>
            <div className="col-auto">
              <div className="input-group input-group-sm mb-2">

                <input type="text"
                       className="form-control"
                       value={search || ''}
                       placeholder={i18n.t('placeholders.search')}
                       onChange={this.changeFilterString('search')}/>

              </div>
            </div>
          </div>

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
