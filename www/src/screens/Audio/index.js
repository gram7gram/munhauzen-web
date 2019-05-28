import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import * as Pages from '../../router/Pages'
import i18n from '../../i18n'
import Card from './components/Card'
import {CHANGE_FILTER, FETCH_ITEMS_REQUEST} from './actions'

class Audio extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: FETCH_ITEMS_REQUEST
    })

    document.addEventListener("keydown", this.resetIfEsc, false);
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

    const {isLoading, items, search} = this.props.Audio

    let displayedItems

    if (search) {

      const query = search.toLowerCase()

      displayedItems = items.filter(item =>
        item.name.toLowerCase().indexOf(query) !== -1
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
          <col width="10%"/>
        </colgroup>
        <thead>
        <tr>
          <th colSpan={2}>{i18n.t('placeholders.name')}</th>
        </tr>
        </thead>
        <tbody>
        {displayedItems.map((audio, key) =>
          <Card key={key} audio={audio}/>
        )}
        </tbody>
      </table>
    </div>
  }

  render() {

    const {search} = this.props.Audio

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{i18n.t('audio.title')}</h1>

          <div className="row">
            <div className="col-auto">
              <Link to={Pages.AUDIO_CREATE}
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

Audio.propTypes = {
  Audio: PropTypes.any.isRequired
}

const selectors = createStructuredSelector({
  Audio: store => store.Audio
})

export default connect(selectors)(Audio);
