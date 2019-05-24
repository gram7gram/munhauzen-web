import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import * as Pages from '../../router/Pages'
import i18n from '../../i18n'
import FetchChapters from '../Chapter/actions/Fetch'
import FetchImages from '../Images/actions/Fetch'
import FetchAudio from '../Audio/actions/Fetch'
import Card from './components/Card'
import {CHANGE_FILTER, FETCH_ITEMS_REQUEST} from './actions'

class Scenario extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: FETCH_ITEMS_REQUEST
    })

    document.addEventListener("keydown", this.resetIfEsc, false);

    if (this.props.chapters.length === 0) {
      this.props.dispatch(FetchChapters())
    }

    if (this.props.images.length === 0) {
      this.props.dispatch(FetchImages())
    }

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

    const {images, audio, chapters} = this.props
    const {isLoading, items, search} = this.props.Scenario

    let displayedItems

    if (search) {

      const query = search.toLowerCase()

      const strings = {}

      items.forEach(item => {

        let searches = []

        if (item.name) searches.push(item.name)

        if (item.translations !== undefined) {
          searches = searches.concat(item.translations.map(i => i.text))
        }

        if (item.chapter) {
          const match = chapters.find(i => i._id === item.chapter)
          if (match) {

            searches.push(match.name)

            if (match.translations !== undefined) {
              searches = searches.concat(match.translations.map(i => i.description))
            }
          }
        }

        if (item.images) {

          item.images.forEach(i => {

            const match = images.find(j => j._id === i.image)

            if (match) {
              searches.push(match.name)
            }
          })
        }

        if (item.audio) {

          item.audio.forEach(i => {

            const match = audio.find(j => j._id === i.audio)
            if (match) {
              searches.push(match.name)
            }
          })
        }

        if (item.decisions) {

          item.decisions.forEach(i => {

            const match = items.find(j => j._id === i.scenario)
            if (match) {
              searches.push(match.name)

              if (match.translations !== undefined) {
                searches = searches.concat(match.translations.map(i => i.text))
              }
            }
          })
        }

        strings[item._id] = searches
      })

      const matches = Object.keys(strings).filter(id => {
        return !!strings[id].find(s => s.toLowerCase().indexOf(query) !== -1)
      })

      displayedItems = items.filter(i => matches.indexOf(i._id) !== -1)

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
        <thead>
        <tr>
          <th colSpan={2}>{i18n.t('placeholders.name')}</th>
          <th>{i18n.t('scenario_edit.chapter')}</th>
          <th>{i18n.t('scenario_edit.images')}</th>
          <th>{i18n.t('scenario_edit.audio')}</th>
          <th>{i18n.t('scenario_edit.decisions')}</th>
        </tr>
        </thead>
        <tbody>
        {displayedItems.map((scenario, key) =>
          <Card key={key} scenario={scenario}/>
        )}
        </tbody>
      </table>

    </div>

  }

  render() {

    const {search} = this.props.Scenario

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{i18n.t('scenario.title')}</h1>

          <div className="row">
            <div className="col-auto">
              <Link to={Pages.SCENARIO_CREATE}
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

Scenario.propTypes = {
  Scenario: PropTypes.any.isRequired,
  chapters: PropTypes.any.isRequired,
  images: PropTypes.any.isRequired,
  audio: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  Scenario: store => store.Scenario,
  chapters: store => store.Chapter.items,
  images: store => store.Images.items,
  audio: store => store.Audio.items,
})

export default connect(selectors)(Scenario);
