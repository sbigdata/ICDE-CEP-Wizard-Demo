import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Folder from '@material-ui/icons/FolderOutlined';
import Casino from '@material-ui/icons/CasinoOutlined';
import InsertDriveFile from '@material-ui/icons/InsertDriveFileOutlined';
import OpenInNew from '@material-ui/icons/OpenInNewOutlined';
import Typography from '@material-ui/core/Typography';
import Highlight from 'react-highlight'

const IconWithText = ({ children, level }) => <div style={{ display: 'flex', paddingLeft: 24 * level }}>{children}</div>

export default class StormOutput extends Component {
	render() {
		return (
			<Grid container spacing={24}>
				<Grid item xs={7}>
					<Typography variant='subtitle1'>RA Topology Source Code</Typography>
					<Highlight className='java'>
						{this.props.topologyData.greedy.topologyCode}
					</Highlight>
				</Grid>
				<Grid item xs={5}>
					<Typography variant='subtitle1'>Topology Specification</Typography>
					<Highlight className='javascript'>
						{JSON.stringify(this.props.topologyData.greedy.topology)}
					</Highlight>
					<Typography variant='subtitle2'>Project Structure</Typography>
					<IconWithText level={0}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>src</Typography></IconWithText>
					<IconWithText level={1}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>main</Typography></IconWithText>
					<IconWithText level={2}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>java</Typography></IconWithText>
					<IconWithText level={3}><Casino style={{ marginRight: 8 }} /> <Typography variant='body1'>com.yooju.storm.stormdrools</Typography></IconWithText>
					<IconWithText level={4}><InsertDriveFile style={{ marginRight: 8 }} /> <Typography variant='body1'>RATopology.java</Typography></IconWithText>
					<IconWithText level={2}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>resources</Typography></IconWithText>
					<IconWithText level={3}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>rulesets0</Typography></IconWithText>
					<IconWithText level={3}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>rulesets1</Typography></IconWithText>
					<IconWithText level={3}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>rulesets2</Typography></IconWithText>
					{
						this.props.topologyData.greedy.project === 'syn' ?
							<React.Fragment>
								<IconWithText level={3}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>rulesets3</Typography></IconWithText>
								<IconWithText level={3}><Folder style={{ marginRight: 8 }} /> <Typography variant='body1'>rulesets4</Typography></IconWithText>
							</React.Fragment> : null
					}
					<IconWithText level={3}><InsertDriveFile style={{ marginRight: 8 }} /> <Typography variant='body1'>EngineDist.json</Typography></IconWithText>
					<IconWithText level={3}><InsertDriveFile style={{ marginRight: 8 }} /> <Typography variant='body1'>StreamDist.json</Typography></IconWithText>
					<IconWithText level={3}><InsertDriveFile style={{ marginRight: 8 }} /> <Typography variant='body1'>Topology.json</Typography></IconWithText>
				</Grid>

				<Grid item xs={6}>
					<Typography variant='h6'>Storm UI - Baseline <a href="http://dmserver3.kaist.ac.kr:8080"><OpenInNew /></a></Typography>
					{
						this.props.topologyData.roundRobin.stormUIimage.map((image, index) => (
							<img width='100%' key={index} src={`http://dmserver3.kaist.ac.kr/${image}`} alt='STORM UI' />
						))
					}
					<br />
					<Typography variant='h6'>Rule Output</Typography>
					<Highlight className='http'>
						{this.props.topologyData.roundRobin.worker.replace(/.*drools_used\d*\n*/g, '')}
					</Highlight>
				</Grid>
				<Grid item xs={6}>
					<Typography variant='h6'>Storm UI - Proposed Algorithm<a href="http://dmserver3.kaist.ac.kr:8080"><OpenInNew /></a></Typography>
					{
						this.props.topologyData.greedy.stormUIimage.map((image, index) => (
							<img width='100%' key={index} src={`http://dmserver3.kaist.ac.kr/${image}`} alt='STORM UI' />
						))
					}
					<br />
					<Typography variant='h6'>Rule Output</Typography>
					<Highlight className='http'>
						{this.props.topologyData.greedy.worker.replace(/.*drools_used\d*\n*/g, '')}
					</Highlight>
				</Grid>
			</Grid>
		)
	}
}
