import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import * as Pages from '../../router/Pages'
import i18n from '../../i18n'
import FetchAudio from '../Audio/actions/Fetch'
import Card from './components/Card'
import {CHANGE_FILTER, FETCH_ITEMS_REQUEST} from './actions'

class AudioFail extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: FETCH_ITEMS_REQUEST
    })

    document.addEventListener("keydown", this.resetIfEsc, false);

    if (this.props.audio.length === 0) {
      this.props.dispatch(FetchAudio())
    }
  }

  componentWillUnmount() {
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

    if (e.keyCode === 27) {
      this.props.dispatch({
        type: CHANGE_FILTER,
        payload: {
          search: null
        }
      })
    }
  }

  renderContent() {

    const {isLoading, items, search} = this.props.AudioFail

    let displayedItems

    if (search) {

      const query = search.toLowerCase()

      displayedItems = items.filter(item =>
        item.name.toLowerCase().indexOf(query) !== -1
        || (item.locale && item.locale.toLowerCase().indexOf(query) !== -1)
        || (item.description && item.description.toLowerCase().indexOf(query) !== -1)
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
          <h4>{i18n.t('placeholders.not_found_title')}</h4>
          <p>{i18n.t('placeholders.not_found_footer')}</p>
        </div>
      }
    }

    return <div className="table-responsive">
      <table className="table table-sm table-hover bg-light">
        <colgroup>
          <col width="15%"/>
        </colgroup>
        <thead>
        <tr>
          <th colSpan={2}>{i18n.t('placeholders.name')}</th>
          <th>{i18n.t('audio_edit.audio')}</th>
        </tr>
        </thead>
        <tbody>
        {displayedItems.map((fail, key) =>
          <Card key={key} fail={fail}/>
        )}
        </tbody>
      </table>
    </div>

  }

  render() {

    const {locale} = this.props
    const {search} = this.props.AudioFail

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{i18n.t('audio_fail.title')}</h1>

          <div className="row">
            <div className="col-auto">
              <Link to={Pages.AUDIO_FAILS_CREATE.replace(':locale', locale)}
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

AudioFail.propTypes = {
  AudioFail: PropTypes.any.isRequired,
  audio: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  AudioFail: store => store.AudioFail,
  audio: store => store.Audio.items,
  locale: store => store.App.locale
})

export default connect(selectors)(AudioFail);
