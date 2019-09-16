import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import * as Pages from "../../../router/Pages";
import {Link} from "react-router-dom";
import Remove from "../actions/Remove";
import {createStructuredSelector} from "reselect";
import i18n from "../../../i18n";

class Card extends PureComponent {

  remove = () => {
    const {scenario} = this.props

    this.props.dispatch(Remove(scenario))
  }

  render() {

    const {locale} = this.props
    const {scenario, chapters, images, audio, scenarios} = this.props

    const chapter = scenario.chapter
      ? chapters.find(item => item.name === scenario.chapter)
      : null

    return <tr>
      <td className="text-nowrap">
        {!scenario.isReserved ? <Link
          to={Pages.SCENARIO_EDIT.replace(':locale', locale).replace(':id', scenario._id)}
          className="btn btn-icon btn-success btn-sm mr-1">
          <i className="fa fa-pencil"/>
        </Link> : null}

        {!scenario.isReserved ? <button
          className="btn btn-icon btn-outline-danger btn-sm"
          onClick={this.remove}>
          <i className="fa fa-times"/>
        </button> : null}

        {scenario.isReserved
          ? <small className="text-secondary">{i18n.t('images.isReserved')}</small>
          : null}
      </td>
      <td>
        <div>
          {scenario.name}&nbsp;

          {scenario.isBegin
            ? <span className="badge badge-success">{i18n.t('scenario_edit.isBegin')}</span>
            : null}
        </div>
        <div className="small text-muted">{scenario.text}</div>
      </td>
      <td>
        {chapter
          ? <Link to={Pages.CHAPTER_EDIT.replace(':locale', locale).replace(':id', chapter._id)}>{chapter.name}</Link>
          : <span className="text-danger">{scenario.chapter}</span>}
      </td>
      <td>{scenario.interaction || ''}</td>
      <td>
        {scenario.images
          ? scenario.images.map((scenarioImage, key) => {

            const match = scenarioImage.image
              ? images.find(item => item.name === scenarioImage.image)
              : null

            let content
            if (match) {
              if (match.isReserved) {
                content = <span>{match.name}</span>
              } else {
                content = <Link to={Pages.IMAGE_EDIT.replace(':locale', locale).replace(':id', match._id)}>{match.name}</Link>
              }
            } else {
              content = <span className="text-danger">{scenarioImage.image}</span>
            }

            return <div key={key}>
              {key + 1}.&nbsp;

              {content}
            </div>
          })
          : null}
      </td>
      <td>
        {scenario.audio
          ? scenario.audio.map((scenarioAudio, key) => {

            const match = scenarioAudio.audio
              ? audio.find(item => item.name === scenarioAudio.audio)
              : null

            let content
            if (match) {
              content = <Link to={Pages.AUDIO_EDIT.replace(':locale', locale).replace(':id', match._id)}>{match.name}</Link>
            } else if (scenarioAudio.audio !== 'Last') {
              content = <span className="text-danger">{scenarioAudio.audio}</span>
            } else {
              content = <span>{scenarioAudio.audio}</span>
            }

            return <div key={key}>
              {key + 1}.&nbsp;

              {content}
            </div>
          })
          : null}
      </td>
      <td>{scenario.action || ''}</td>
      <td>
        {scenario.decisions
          ? scenario.decisions.sort((a, b) => {
            if (a.order > b.order) return 1
            if (a.order < b.order) return -1
            return 0
          }).map((decision, key) => {

            const match = decision.scenario
              ? scenarios.find(item => item.name === decision.scenario)
              : null

            let name = '...'
            if (match) {
              name = match.name + ' ' + match.text
            }

            return <div key={key}>
              {key + 1}.&nbsp;

              {match
                ? <Link to={Pages.SCENARIO_EDIT.replace(':locale', locale).replace(':id', decision.scenario)}>{name}</Link>
                : <span className="text-danger">{decision.scenario}</span>}
            </div>
          })
          : null}
      </td>
    </tr>
  }
}

Card.propTypes = {
  scenario: PropTypes.any.isRequired,
  chapters: PropTypes.any.isRequired,
  images: PropTypes.any.isRequired,
  audio: PropTypes.any.isRequired,
  scenarios: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  chapters: store => store.Chapter.items,
  images: store => store.Images.items,
  audio: store => store.Audio.items,
  scenarios: store => store.Scenario.items,
  locale: store => store.App.locale,
})

export default connect(selectors)(Card);
