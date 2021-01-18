import React from "react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <>
      <div className="appHeader bg-primary text-light">
        <div className="left">
          <Link to="/" className="headerButton goBack">
            <ion-icon name="chevron-back-outline" />
          </Link>
        </div>
        <div className="pageTitle">Transfer</div>
        <div className="right">
          <Link to="/" className="headerButton">
            <ion-icon name="home-outline" />
          </Link>
        </div>
      </div>

      <div id="cmpMain">
        <div className="section mt-2 mb-5">
          <div className="card mt-5" id="cmpTransfer">
            <div className="card-body">
              <form>
                <div className="form-group boxed" style={{ padding: 0 }}>
                  <div className="input-wrapper">
                    <label className="label" htmlFor="sendToAddr">
                      Destination Address:
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="sendToAddr"
                        name="sendToAddr"
                        placeholder="Enter receiver's address"
                      />
                      <i className="clear-input">
                        <ion-icon
                          name="close-circle"
                          role="img"
                          className="md hydrated"
                          aria-label="close circle"
                        />
                      </i>
                      <div className="ml-1">
                        <button
                          type="button"
                          className="btn btn-icon btn-primary mr-1 mb-1 btn-scan-address"
                        >
                          <ion-icon name="qr-code-outline" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group boxed" style={{ padding: 0 }}>
                  <div className="input-wrapper">
                    <label className="label" htmlFor="sendAmount">
                      Amount to Send:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="sendAmount"
                      name="sendAmount"
                      placeholder="Enter amount to send"
                      defaultValue
                    />
                    <i className="clear-input">
                      <ion-icon
                        name="close-circle"
                        role="img"
                        className="md hydrated"
                        aria-label="close circle"
                      />
                    </i>
                  </div>
                </div>
                <div className="mt-3">
                  <small>
                    Important: Please double check the address and amount before
                    sending. Transactions cannot be reversed.
                  </small>
                </div>
              </form>
            </div>
            <div className="card-footer text-right">
              <button type="button" id="btnSend" className="btn btn-success">
                <ion-icon name="send-outline" /> Send Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
