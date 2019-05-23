import React from 'react';
import i18n from "../../i18n";

const Home = () => <div className="container my-2 py-3 bg-white shadow-sm">
  <div className="row">
    <div className="col-12">
      <h1 className="text-center">{i18n.t('home.title')}</h1>
    </div>
  </div>
</div>

export default Home;
