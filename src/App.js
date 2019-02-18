import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Youtube from '@material-ui/icons/PlayCircleFilledTwoTone';
import Content from './components/Content';
import Modal from '@material-ui/core/Modal'

const Header = props => (
  <AppBar position="static" color="secondary">
    <Toolbar><h1>CEP-Wizard Demonstration <span onClick={props.onClick} style={{ verticalAlign: '-webkit-baseline-middle' }} title="Youtube Demo Video" ><Youtube style={{ color: 'white', fontSize: 48, cursor: 'pointer' }} /></span></h1></Toolbar>
  </AppBar>
)

class App extends Component {
  state = {
    openVideo: false,
  }

  handleCloseModal = () => {
    this.setState({ openVideo: false })
  }

  render() {
    return (
      <React.Fragment>
        <Header onClick={() => this.setState({ openVideo: true })} />
        <br />
        <Content />
        <Modal aria-labelledby="demo-video" aria-describedby="demo-video" open={this.state.openVideo} onClose={this.handleCloseModal} >
          <div style={{ top: 100, left: 100, position: 'absolute' }}>
            <iframe title="DEMO Video" width="1280" height="720" src="https://www.youtube.com/embed/8ZymPSh7A4I" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}


export default App;
