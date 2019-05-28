import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types'
import * as Pages from "../../../router/Pages";
import {Link} from "react-router-dom";
import Remove from "../actions/Remove";
import {createStructuredSelector} from "reselect";

class Card extends PureComponent {

  remove = () => {
    const {scenario} = this.props

    this.props.dispatch(Remove(scenario))
  }

  render() {

    const {scenario, locale, chapters, images, audio, scenarioItems} = this.props

    const trans = scenario.translations !== undefined && scenario.translations
      ? scenario.translations.find(item => item.locale === locale)
      : null

    const chapter = scenario.chapter
      ? chapters.find(item => item.name === scenario.chapter)
      : null

    return <tr>
      <td>
        <Link
          to={Pages.SCENARIO_EDIT.replace(':id', scenario._id)}
          className="btn btn-icon btn-success btn-sm mr-1">
          <i className="fa fa-pencil"/>
        </Link>

        <button
          className="btn btn-icon btn-outline-danger btn-sm"
          onClick={this.remove}>
          <i className="fa fa-times"/>
        </button>
      </td>
      <td>
        <div>{scenario.name}</div>
        {trans
          ? <div className="small text-muted">{trans.text}</div>
          : null}
      </td>
      <td>
        {chapter
          ? <Link to={Pages.CHAPTER_EDIT.replace(':id', chapter._id)}>{chapter.name}</Link>
          : <span className="text-danger">{scenario.chapter}</span>}
      </td>
      <td>
        {scenario.images.map((scenarioImage, key) => {

          const match = scenarioImage.image
            ? images.find(item => item.name === scenarioImage.image)
            : null

          return <div key={key}>
            #{key + 1}
            &nbsp;

            {match
              ? <Link to={Pages.IMAGE_EDIT.replace(':id', match._id)}>{match.name}</Link>
              : <span className="text-danger">{scenarioImage.image}</span>}
          </div>
        })}
      </td>
      <td>
        {scenario.audio.map((scenarioAudio, key) => {

          const match = scenarioAudio.audio
            ? audio.find(item => item.name === scenarioAudio.audio)
            : null

          return <div key={key}>
            #{key + 1}
            &nbsp;

            {match
              ? <Link to={Pages.AUDIO_EDIT.replace(':id', match._id)}>{match.name}</Link>
              : <span className="text-danger">{scenarioAudio.audio}</span>}
          </div>
        })}
      </td>
      <td>
        {scenario.decisions.map((decision, key) => {

          const match = decision.scenario
            ? scenarioItems.find(item => item.name === decision.scenario)
            : null

          let name = '...'
          if (match) {

            name = match.name

            if (match.translations !== undefined) {
              const trans = match.translations.find(trans => trans.locale === locale)
              if (trans) {
                name += ' ' + trans.text
              }
            }
          }

          return <div key={key}>

            #{key + 1}
            &nbsp;

            {decision.action}

            &nbsp;-&nbsp;

            {match
              ? <Link to={Pages.SCENARIO_EDIT.replace(':id', decision.scenario)}>{name}</Link>
              : <span className="text-danger">{decision.scenario}</span>}
          </div>
        })}
      </td>
    </tr>
  }
}

Card.propTypes = {
  scenario: PropTypes.any.isRequired,
  chapters: PropTypes.any.isRequired,
  images: PropTypes.any.isRequired,
  audio: PropTypes.any.isRequired,
  scenarioItems: PropTypes.any.isRequired,
  locale: PropTypes.any.isRequired,
}

const selectors = createStructuredSelector({
  locale: store => store.App.locale,
  chapters: store => store.Chapter.items,
  images: store => store.Images.items,
  audio: store => store.Audio.items,
  scenarioItems: store => store.Scenario.items,
})

export default connect(selectors)(Card);
