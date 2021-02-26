import React from 'react';
import { Link } from 'react-router-dom';

export default function AppHeader({ handleIconClick, currentMenu, iconName }) {
	return (
		<div className="appHeader bg-primary text-light">
			<div className="left">
				<Link to="/" className="headerButton goBack">
					<ion-icon name="chevron-back-outline" />
				</Link>
			</div>
			<div className="pageTitle">{currentMenu || 'Home'}</div>
			<div className="right">
				{handleIconClick ? (
					<a href="#target" onClick={e => handleIconClick(e)} className="headerButton">
						<ion-icon name={iconName || 'home-outline'} />
					</a>
				) : (
					<Link to="/" className="headerButton">
						<ion-icon name={iconName || 'home-outline'} />
					</Link>
				)}
			</div>
		</div>
	);
}
