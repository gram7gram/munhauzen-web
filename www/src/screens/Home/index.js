import React from 'react';
import random from 'random';
import i18n from "../../i18n";

import img1 from "../../assets/images/Жене.jpg";
import img2 from "../../assets/images/Космос.jpg";
import img3 from "../../assets/images/Лопата_Рішуче.jpg";

const images = [
  img1, img2, img3
]

const Home = () => <div className="container my-2 py-3">
  <div className="row">
    <div className="col-12 text-center">
      <h1 className="my-3">{i18n.t('home.title')}</h1>

      <div className="row">
        <div className="col-6 mx-auto">
          <img src={images[random.int(0, images.length - 1)]} className="img-fluid"/>
        </div>
      </div>

    </div>
  </div>
</div>

export default Home;
