import React, { Component } from 'react'
import scan from './scan';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  scanner = async () => {
    const result = await scan();
    this.setState({
      result,
    });
  }

  render() {
    return (
      <div>
        <h1>Home screen</h1>
        <div onClick={this.scanner}> --- SCAN --- </div>
        <div>
          {
            (this.state && this.state.result)
              ? this.state.result.map((item) => (
                <div>
                  <p>
                    PrimaryId: {item.PrimaryId}
                  </p>
                  <p>
                    SecondaryId: {item.SecondaryId}
                  </p>
                  <p>
                    DateOfBirth: {item.DateOfBirth}
                  </p>
                  <p>
                    Sex: {item.Sex}
                  </p>
                  <p>
                    Nationality: {item.Nationality}
                  </p>
                  <p>
                    ImmigrantCaseNumber: {item.ImmigrantCaseNumber}
                  </p>
                  <p>
                    DateOfExpiry: {item.DateOfExpiry}
                  </p>
                  <p>
                    DocumentCode: {item.DocumentCode}
                  </p>
                  <p>
                    DocumentNumber: {item.DocumentNumber}
                  </p>
                  <p>
                    Issuer: {item.Issuer}
                  </p>
                  <p>
                    PaymentDataType: {item.PaymentDataType}
                  </p>
                  <p>
                    Opt1: {item.Opt1}
                  </p>
                  <p>
                    Opt2: {item.Opt2}
                  </p>
                  <p>
                  </p>
                    MRTDRaw: {item.MRTDRaw}
                  <p>
                  </p>
                  <img src={`data:image/png;base64, ${item.image}`} />
                </div>
              ))
              : undefined
          }
        </div>
      </div>
    )
  }
}

export default Home
