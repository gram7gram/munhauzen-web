import React, {PureComponent} from 'react';
import {Link, withRouter} from 'react-router-dom';
import * as Pages from '../router/Pages'
import i18n from "../i18n";

const nav = [
  {value: Pages.HOME, label: i18n.t('navigation.home')},
  {value: Pages.SCENARIO, label: i18n.t('navigation.scenario')},
  {value: Pages.IMAGES, label: i18n.t('navigation.images')},
  {value: Pages.AUDIO, label: i18n.t('navigation.audio')},
  {value: Pages.AUDIO_FAILS, label: i18n.t('navigation.audio_fails')},
  {value: Pages.INVENTORY, label: i18n.t('navigation.inventory')},
]

class Navigation extends PureComponent {

  render() {

    const {pathname} = this.props.location

    return <div className="container-fluid">
      <div className="row">
        <div className="col-12">

          <ul className="nav justify-content-center">
            {nav.map((item, key) =>
              <li key={key} className="nav-item">
                <Link
                  className={"nav-link" + (pathname === item.value ? " active" : "")}
                  to={item.value}>{item.label}</Link>
              </li>
            )}
          </ul>

        </div>
      </div>
    </div>
  }
}


export default withRouter(Navigation);
