import React from 'react';
import img from "../../assets/images/loading_ground.png";

const Loading = () => <div className="container">

  <div className="row">
    <div className="col-10 col-sm-6 col-lg-4 mx-auto my-4">
      <img src={img} className="img-fluid mx-auto" alt="" style={{animation: "fa-spin 4s infinite linear"}}/>
    </div>
  </div>

</div>

export default Loading;
