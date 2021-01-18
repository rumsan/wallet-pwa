import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      <div className="footer-unlocked">
        <div className="appBottomMenu">
          <a href="#home" className="item">
            <div className="col">
              <ion-icon name="briefcase-outline" />
              <strong>Vault</strong>
            </div>
          </a>
          <Link to="/transfer" className="item">
            <div className="col">
              <ion-icon name="paper-plane-outline" />
              <strong>Transfer</strong>
            </div>
          </Link>
          <a href="#home" className="item" id="btnScanner">
            <div className="col">
              <div className="action-button large">
                <ion-icon name="qr-code-outline" />
              </div>
            </div>
          </a>
          <a href="#home" className="item">
            <div className="col">
              <ion-icon name="receipt-outline" />
              <strong>History</strong>
            </div>
          </a>
          <a href="#home" className="item">
            <div className="col">
              <ion-icon name="options-outline" />
              <strong>Settings</strong>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
