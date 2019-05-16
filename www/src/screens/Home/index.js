import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types'
import {createStructuredSelector} from 'reselect'
import * as Pages from '../../router/Pages'
import i18n from "../../i18n";

class Home extends PureComponent {

  render() {

    return <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">{i18n.t('home.title')}</h1>

          <Link to={Pages.IMAGES}>{i18n.t('home.images_link')}</Link>

        </div>
      </div>


    </div>
  }
}

Home.propTypes = {
  Home: PropTypes.any.isRequired
}

const selectors = createStructuredSelector({
  Home: store => store.Home
})

export default connect(selectors)(Home);
