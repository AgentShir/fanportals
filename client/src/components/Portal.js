import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Authorize } from '../lib/auth'
import { postPortals } from '../actions/app'
import TextField from 'material-ui/TextField'
import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import { getPortalInfo, updatePortal, updateComplete } from '../actions/app'


const cardStyle = {
    maxWidth: '1000px',
    margin: '50px auto',
}
const buttonStyle = {
    textAlign: 'right'
}
const errorMessageStyle = {
    fontSize: '20px'
  }
class CreatePortal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fanClubName: '',
            fanClubLocation: '',
            teamName: '',
            teamLocation: '',
            logo: '',
            description: ''
        }
    }

    componentWillMount(){
      if (localStorage.getItem('portalId') !== 'null'){
        getPortalInfo(localStorage.getItem('portalId'))
      }
    }
    componentWillReceiveProps(props) {
      if(this.props.location.pathname === '/addPortal'){
        if (props.errorMessage.length > 0) {
            this.setState({ expanded: true })
        } else {
            this.setState({ expanded: false })
            this.props.history.push('/portal/'+ props.portalId)
        }
        //if editing portal
      }else{
          this.setState({
            fanClubName: props.portalInfo.fanClubName,
            fanClubLocation: props.portalInfo.fanClubLocation,
            teamName: props.portalInfo.teamName,
            teamLocation: props.portalInfo.teamLocation,
            logo: props.portalInfo.logo,
            description: props.portalInfo.description
          })
          if(props.updateStatus === "success"){
            this.setState({ expanded: false })
            this.props.history.push('/portal/'+ localStorage.getItem('portalId'))
            updateComplete()
          }else if(props.updateStatus === "fail"){
            this.setState({ expanded: true })
          }
      }
    }

    handleExpandChange = (expanded) => {
        this.setState({ expanded: expanded });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
      if(this.props.location.pathname === '/addPortal'){
        postPortals(this.state)
        this.setState({ fanClubName: '', fanClubLocation: '', teamName: '', teamLocation: '', logo: '', description: '' })
      }else{
        updatePortal(localStorage.getItem('portalId'), this.state)
      }
    }

    render() {
        return (
            <Card style={cardStyle} expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
                <CardTitle title="Fan Club Portal" />
                <CardText expandable={true} color={'red'} style={errorMessageStyle}>
                    {this.props.errorMessage}
                </CardText>
                <form onSubmit={this.handleSubmit}>
                    <CardText>
                        <TextField
                            hintText="Fan Club Name"
                            floatingLabelText="Fan Club Name"
                            name="fanClubName"
                            autoComplete="off"
                            fullWidth={true} required={true}
                            onChange={this.handleChange}
                            value={this.state.fanClubName}
                        /><br />
                        <TextField
                            hintText="Fan Club Location"
                            floatingLabelText="Fan Club Location"
                            name="fanClubLocation"
                            autoComplete="off"
                            fullWidth={true} required={true}
                            onChange={this.handleChange}
                            value={this.state.fanClubLocation}
                        /><br />
                        <TextField
                            hintText="Team Name"
                            floatingLabelText="Team Name"
                            name="teamName"
                            autoComplete="off"
                            fullWidth={true} required={true}
                            onChange={this.handleChange}
                            value={this.state.teamName}
                        /><br />
                        <TextField
                            hintText="Team Location"
                            floatingLabelText="Team Location"
                            name="teamLocation"
                            autoComplete="off"
                            fullWidth={true} required={true}
                            onChange={this.handleChange}
                            value={this.state.teamLocation}
                        /><br />
                        <TextField
                            hintText="Team Logo URL"
                            floatingLabelText="Enter a URL for the Team Logo"
                            name="logo"
                            autoComplete="off"
                            fullWidth={true} required={false}
                            onChange={this.handleChange}
                            type='URL'
                            value={this.state.logo}
                        /><br />
                        <TextField
                            hintText="Description"
                            floatingLabelText="Description"
                            name="description"
                            autoComplete="off"
                            fullWidth={true} required={false}
                            onChange={this.handleChange}
                            value={this.state.description}
                        /><br />

                    </CardText>
                    <CardActions style={buttonStyle}>
                        <FlatButton label="Submit" type="Submit" />
                    </CardActions>
                </form>
            </Card>
        )
    }
}
function mapStateToProps(appState) {
    const { errorMessage, portalId, portalInfo, updateStatus } = appState.app
    return {
        errorMessage,
        // portalInfo:Object.assign({},portalInfo)
        portalId,
        portalInfo,
        updateStatus
    }
}
export default connect(mapStateToProps)(Authorize(CreatePortal))