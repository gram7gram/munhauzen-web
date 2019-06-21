import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import * as Pages from '../../router/Pages'
import i18n from '../../i18n'
import Card from './components/Card'
import {CHANGE_FILTER, FETCH_ITEMS_REQUEST} from './actions'

class Chapter extends Component {

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

  changeFilterBool = key => e => {
    this.props.dispatch({
      type: CHANGE_FILTER,
      payload: {
        [key]: e.target.checked
      }
    })
  }

  resetIfEsc = e => {

    if (e.keyCode === 27) {
      this.props.dispatch({
        type: CHANGE_FILTER,
        payload: {
          search: ''
        }
      })
    }
  }

  renderContent() {

    const {isLoading, items, search} = this.props.Chapter

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
          <col width="10%"/>
        </colgroup>
        <thead>
        <tr>
          <th colSpan={2}>{i18n.t('placeholders.order')}</th>
          <th>{i18n.t('placeholders.name')}</th>
        </tr>
        </thead>
        <tbody>
        {displayedItems.map((chapter, key) =>
          <Card key={key} chapter={chapter}/>
        )}
        </tbody>
      </table>
    </div>
  }

  render() {

    const {search} = this.props.Chapter

    return <div className="container my-2 py-3 bg-yellow shadow-sm">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{i18n.t('chapter.title')}</h1>

          <div className="row mb-2">
            <div className="col-auto">
              <Link to={Pages.CHAPTER_CREATE}
                    className="btn btn-sm btn-success mr-1">
                {i18n.t('placeholders.new')}
              </Link>

            </div>
            <div className="col-auto">
              <div className="form-inline">
                <div className="form-group">

                  <input type="text"
                         className="form-control form-control-sm"
                         value={search || ''}
                         placeholder={i18n.t('placeholders.search')}
                         onChange={this.changeFilterString('search')}/>

                </div>
              </div>
            </div>
          </div>

          {this.renderContent()}
        </div>
      </div>
    </div>
  }
}

Chapter.propTypes = {
  Chapter: PropTypes.any.isRequired
}

const selectors = createStructuredSelector({
  Chapter: store => store.Chapter
})

export default connect(selectors)(Chapter);
