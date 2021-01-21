import React from 'react';
import { Link } from 'react-router-dom';

export default function AppHeader({ currentMenu }) {
	return (
		<div className="appHeader bg-primary text-light">
			<div className="left">
				<Link to="/" className="headerButton goBack">
					<ion-icon name="chevron-back-outline" />
				</Link>
			</div>
			<div className="pageTitle">{currentMenu || 'Home'}</div>
			<div className="right">
				<Link to="/" className="headerButton">
					<ion-icon name="home-outline" />
				</Link>
			</div>
		</div>
	);
}
