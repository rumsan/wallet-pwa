import React from 'react';
import AppHeader from '../layouts/AppHeader';
import Profile from './profile';

export default function Index() {
	return (
		<>
			<AppHeader currentMenu="Settings" />
			<Profile />
		</>
	);
}
