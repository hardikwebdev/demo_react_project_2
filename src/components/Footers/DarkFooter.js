/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

function DarkFooter() {
  return (
    <footer className="footer pt-0" style={{bottom: -25}}>
      <div className="row" style={{backgroundColor: "rgb(231, 231, 231)"}}>
        <div className="col-12 col-md-8 col-lg-9">
          <div className="row">
            <div className="col-12 pb-0">
              <p className="float-left px-1 mb-0">&copy;2021 UMW Toyota Motor Sdn.Bhd.(60576-K)</p>
              <ul className="list-unstyled float-md-left mb-0">
                <li className="linkHover float-left border-left border-dark px-1"><a target="blank" href="https://toyota.com.my/privacy" className="text-dark">Privacy</a></li>
                <li className="linkHover float-left border-left border-dark px-1"><a target="blank" href="https://toyota.com.my/sitemap" className="text-dark">Sitemap</a></li>
                <li className="linkHover float-left border-left border-dark px-1"><a target="blank" href="http://www.toyota-global.com/" className="text-dark">Toyota Global</a></li>
                <li className="linkHover float-left border-left border-dark px-1"><a target="blank" href="https://toyota.com.my/newsletter" className="text-dark">Subscribe to Newsletter</a></li>
                <li className="linkHover float-left border-left border-dark px-1"><a target="blank" href="https://toyota.com.my/toyotadriveprivacy" className="text-dark">Toyota Drive Privacy Policy</a></li>
              </ul>
            </div>
            <div className="col-12 d-block my-auto">
              <ul className="list-unstyled float-left mb-0">
                <li className="linkHover float-left px-1">TOYOTA FREEPHONE:
                          <a href="tel:18008869682" className="text-dark">1800-8-TOYOTA(869682)</a>
                </li>
                <li className="linkHover float-left border-left border-dark px-1">TOYOTA EMAIL:
                          <a href="mailto:customersupport@toyota.com.my" className="text-dark mailto-css">customersupport@toyota.com.my</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 col-lg-3 d-block my-md-auto mt-3">
          <ul className="list-unstyled float-left float-md-right mb-0">
            <li className="float-right px-2"><a target="blank" href="https://www.facebook.com/ToyotaMalaysia">
              <img src={require("assets/img/toyota/icon-yt.png")}
                className="img-fluid" alt="" /></a></li>
            <li className="float-right px-2"><a target="blank" href="https://www.instagram.com/toyotamy/">
              <img src={require("assets/img/toyota/icon-ig.png")} className="img-fluid" alt="" /></a></li>
            <li className="float-right px-2"><a target="blank" href="https://www.youtube.com/user/toyotamy">
              <img src={require("assets/img/toyota/icon-fb.png")} className="img-fluid" alt=""
              /></a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default DarkFooter;
