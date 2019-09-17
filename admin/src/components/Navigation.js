import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import * as Pages from '../router/Pages'
import i18n from "../i18n";
import {createStructuredSelector} from "reselect";
import {connect} from "react-redux";

const nav = [
  {value: Pages.HOME, label: i18n.t('navigation.home')},
  {value: Pages.SCENARIO, label: i18n.t('navigation.scenario')},
  {value: Pages.CHAPTERS, label: i18n.t('navigation.chapter')},
  {value: Pages.IMAGES, label: i18n.t('navigation.images')},
  {value: Pages.AUDIO, label: i18n.t('navigation.audio')},
  {value: Pages.AUDIO_FAILS, label: i18n.t('navigation.audio_fails')},
  {value: Pages.INVENTORY, label: i18n.t('navigation.inventory')},
]

class Navigation extends PureComponent {

  render() {

    const {locale, isAuthenticated} = this.props
    const {pathname} = this.props.location

    if (!isAuthenticated) return null

    let pathnameWithoutLocale = ''
    if (pathname.indexOf('/en') === 0 || pathname.indexOf('/ru') === 0 || pathname.indexOf('/ua') === 0) {
      pathnameWithoutLocale = pathname.substr(3)
    }

    return <div className="container-fluid">
      <div className="row">
        <div className="col-12">

          <ul className="nav justify-content-center py-1">
            {nav.map((item, key) => {

              const url = item.value.replace(':locale', locale)

              return <li key={key} className="nav-item">
                <Link
                  className={"nav-link" + (pathname === url ? " active" : "")}
                  to={url}>{item.label}</Link>
              </li>
            })}

            <li className="nav-item border-left border-dark">
              <a className="nav-link" href={'/en' + pathnameWithoutLocale}>en</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={'/ru' + pathnameWithoutLocale}>ru</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={'/ua' + pathnameWithoutLocale}>ua</a>
            </li>
          </ul>

        </div>
      </div>
    </div>
  }
}

Navigation.propTypes = {
  locale: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
}

const selectors = createStructuredSelector({
  locale: store => store.App.locale,
  isAuthenticated: store => store.App.isAuthenticated,
})

export default withRouter(
  connect(selectors)(Navigation)
);
